# Architecture

## System Overview

```mermaid
graph TB
    subgraph Client["Frontend — Next.js 16 + React 19"]
        UI["React UI<br/>Tailwind CSS + shadcn/ui"]
        Pages["Pages<br/>Landing · Dashboard · Emergency<br/>History · Profile · Settings"]
        State["State Management<br/>AuthContext · ThemeContext<br/>EmergencyContext"]
        SocketClient["Socket.IO Client"]
        Maps["Leaflet Maps<br/>LiveMap · SafeRoute"]
        AI_NVIDIA["NVIDIA AI Client"]
    end

    subgraph Server["Backend — Express.js + MongoDB"]
        API["REST API<br/>31 Endpoints"]
        Auth["JWT Auth<br/>Middleware"]
        SocketServer["Socket.IO Server"]
        Services["Services Layer<br/>Emergency · Heartbeat · Incident<br/>Contact · Report · Maps · AI"]
        Models["MongoDB Models<br/>User · EmergencySession · Heartbeat<br/>TrustedContact · Incident · Evidence<br/>LocationPing"]
        RateLimit["Rate Limiter<br/>100 req/15min"]
    end

    subgraph External["External Services"]
        NVIDIA["NVIDIA API<br/>Llama 3.1 70B"]
        MongoDB[("MongoDB<br/>Database")]
        Notify["Notification Service<br/>SMS · Push"]
    end

    UI --> Pages
    Pages --> State
    Pages --> API
    Pages --> SocketClient
    Pages --> Maps
    Pages --> AI_NVIDIA

    API --> Auth
    API --> RateLimit
    API --> Services
    Auth --> Services
    Services --> Models
    Services --> SocketServer
    SocketClient <--> SocketServer

    Services --> NVIDIA
    Services --> MongoDB
    Services --> Notify

    MongoDB --- Models
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as MongoDB

    U->>F: Enter credentials
    F->>B: POST /api/auth/signup
    B->>DB: Create user (bcrypt hash)
    B-->>F: JWT token (7-day expiry)

    U->>F: Login
    F->>B: POST /api/auth/login
    B->>DB: Verify credentials
    B-->>F: JWT token
    F->>F: Store token in localStorage

    loop Every authenticated request
        F->>B: Authorization: Bearer <token>
        B->>B: Verify JWT + check isActive
        B-->>F: Response
    end
```

## Emergency Session Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Active: User triggers SOS

    Active --> Escalated: 3 missed heartbeats
    Active --> Resolved: User stops session
    Active --> Cancelled: User cancels

    Escalated --> Active: User checks in (de-escalation)
    Escalated --> Escalated: +3 missed heartbeats (level++)
    Escalated --> Resolved: User stops session

    Resolved --> [*]
    Cancelled --> [*]

    note right of Active
        Heartbeat monitoring active
        Location pings recording
        Incidents being logged
    end note

    note right of Escalated
        Trusted contacts notified
        Escalation level incremented
        AI monitoring heightened
    end note
```

## Heartbeat & Escalation Flow

```mermaid
flowchart TD
    Start([Session Started]) --> HB{Heartbeat<br/>Timer}
    HB -->|Check-in received| Safe[Session Active<br/>Missed count = 0]
    HB -->|Timer expires| Miss[Record Missed<br/>Heartbeat]

    Miss --> Count{Missed ≥ 3?}
    Count -->|No| HB
    Count -->|Yes| Esc[Escalation<br/>Level++]

    Esc --> Notify[Notify Trusted<br/>Contacts]
    Esc --> Log[Log ESCALATION<br/>Triggered Incident]
    Esc --> Reset[Reset Missed<br/>Count = 0]
    Reset --> HB

    Safe --> HB

    DeEsc{User Checks In<br/>during Escalated}
    DeEsc -->|Yes| Active[Status → Active<br/>Log DEESCALATION]
    Active --> HB

    style Esc fill:#dc2626,color:#fff
    style Safe fill:#16a34a,color:#fff
    style Active fill:#16a34a,color:#fff
```

## AI Analysis Pipeline

```mermaid
flowchart LR
    subgraph Input["Session Data"]
        E[Evidence]
        I[Incidents]
        H[Heartbeats]
        L[Location Pings]
        S[Session Metadata]
    end

    subgraph Prompt["Structured Prompt"]
        Sys[System Prompt<br/>Role: Safety Analyst]
        Usr[User Prompt<br/>Session Data]
    end

    subgraph NVIDIA["NVIDIA API"]
        LLM[Llama 3.1 70B<br/>Instruct]
    end

    subgraph Output["Structured Response"]
        JSON[JSON Parser]
        ES[Evidence Summary<br/>Risk · Findings · Recommendations]
        IS[Incident Summary<br/>Timeline · Key Events · Assessment]
        SI[Safety Insights<br/>Score · Patterns · Suggestions]
    end

    Input --> Prompt
    Prompt --> LLM
    LLM --> JSON
    JSON --> ES
    JSON --> IS
    JSON --> SI

    style LLM fill:#76b900,color:#000
```

## Data Model

```mermaid
erDiagram
    USER ||--o{ EMERGENCY_SESSION : creates
    USER ||--o{ TRUSTED_CONTACT : has
    USER ||--o{ INCIDENT : generates

    EMERGENCY_SESSION ||--o{ HEARTBEAT : contains
    EMERGENCY_SESSION ||--o{ INCIDENT : logs
    EMERGENCY_SESSION ||--o{ EVIDENCE : stores
    EMERGENCY_SESSION ||--o{ LOCATION_PING : tracks

    USER {
        string _id PK
        string name
        string email UK
        string phone
        string passwordHash
        string role
        boolean isActive
        object emergencyPreferences
    }

    EMERGENCY_SESSION {
        string _id PK
        string user FK
        string triggerType
        string status
        int missedHeartbeatCount
        int escalationLevel
        int heartbeatIntervalSeconds
        datetime startedAt
        datetime endedAt
    }

    HEARTBEAT {
        string _id PK
        string user FK
        string session FK
        string kind
        int sequence
        string status
        datetime receivedAt
    }

    TRUSTED_CONTACT {
        string _id PK
        string user FK
        string name
        string phone
        string relation
        int priority
        array notifyBy
        boolean isPrimary
    }

    INCIDENT {
        string _id PK
        string user FK
        string session FK
        string type
        string message
        string severity
        object metadata
        datetime timestamp
    }

    EVIDENCE {
        string _id PK
        string user FK
        string session FK
        string type
        string fileUrl
        object metadata
    }

    LOCATION_PING {
        string _id PK
        string session FK
        float latitude
        float longitude
        float accuracy
        float speed
        float heading
        datetime recordedAt
    }
```

## Real-Time Communication

```mermaid
sequenceDiagram
    participant F as Frontend
    participant S as Socket.IO Server
    participant C as Trusted Contact

    F->>S: join(sessionId)
    S-->>F: connected

    loop During Emergency
        F->>S: location:ping
        S-->>F: location:updated

        F->>S: heartbeat:checkin
        S-->>F: heartbeat:received
    end

    Note over S: Missed heartbeats ≥ 3

    S-->>F: emergency:escalated
    S->>C: notify:escalation
    C-->>S: acknowledged

    Note over F: User checks in
    F->>S: heartbeat:checkin
    S-->>F: emergency:deescalated
```

## API Architecture

```mermaid
graph LR
    subgraph Middleware["Middleware Pipeline"]
        M1[Helmet<br/>Security Headers]
        M2[CORS<br/>Cross-Origin]
        M3[JSON Parser<br/>10MB Limit]
        M4[Logger<br/>Request Log]
        M5[Rate Limiter<br/>100/15min]
    end

    subgraph Routes["API Routes (31 endpoints)"]
        R1["/api/auth/*<br/>3 routes"]
        R2["/api/users/*<br/>3 routes"]
        R3["/api/emergency/*<br/>5 routes"]
        R4["/api/heartbeat/*<br/>3 routes"]
        R5["/api/incidents/*<br/>3 routes"]
        R6["/api/contacts/*<br/>4 routes"]
        R7["/api/reports/*<br/>3 routes"]
        R8["/api/maps/*<br/>3 routes"]
        R9["/api/ai/*<br/>3 routes"]
    end

    subgraph Error["Error Handler"]
        EH[Centralized Error Handler<br/>No Stack Trace Leakage]
    end

    M1 --> M2 --> M3 --> M4 --> M5 --> Routes
    Routes --> EH
```

## Deployment Architecture

```mermaid
graph TB
    subgraph Production["Production Deployment"]
        FE["Frontend<br/>Vercel / Netlify<br/>Port 3000"]
        BE["Backend<br/>Railway / Render<br/>Port 5050"]
        DB[("MongoDB Atlas<br/>Cloud Database")]
        AI["NVIDIA API<br/>Cloud AI"]
        CDN["Static Assets<br/>CDN"]
    end

    User([User Browser]) --> CDN
    CDN --> FE
    FE --> BE
    BE --> DB
    BE --> AI
    FE -->|Socket.IO| BE

    style FE fill:#0070f3,color:#fff
    style BE fill:#16a34a,color:#fff
    style DB fill:#47a248,color:#fff
    style AI fill:#76b900,color:#000
```
