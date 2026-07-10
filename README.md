# EscapeHer - AI-Assisted Women's Emergency Escape & Response System

<p align="center">
  <strong>Protecting women through real-time AI-powered emergency response, intelligent monitoring, and instant communication.</strong>
</p>

---

## The Problem

Every year, millions of women face harassment, stalking, domestic violence, and other safety threats. In critical moments:

- **Response time is everything** — traditional emergency systems are slow and impersonal
- **Evidence is lost** — victims often can't document incidents during or after a crisis
- **Isolation compounds danger** — many victims are alone when threats escalate
- **Existing apps are passive** — they notify but don't actively monitor or intelligently respond
- **Escalation goes unnoticed** — when a victim can't call for help, nobody knows they need it

## The Solution

**EscapeHer** is an AI-powered safety platform that acts as a real-time emergency companion. It doesn't just send an SOS — it continuously monitors the user's safety status, intelligently escalates when danger is detected, captures evidence, and provides AI-driven analysis to help both the user and responders understand the situation.

### Key Capabilities

| Feature | Description |
|---------|-------------|
| **One-Tap SOS** | Instantly activate an emergency session with location sharing |
| **Heartbeat Monitoring** | Periodic check-ins that auto-escalate if missed |
| **Live Location Tracking** | Real-time GPS ping sharing with trusted contacts |
| **AI Analysis** | NVIDIA-powered incident summaries, evidence analysis, and safety insights |
| **Evidence Capture** | Audio recording and upload during emergencies |
| **Contact Notification** | Automatic SMS/push alerts to trusted contacts on escalation |
| **Incident Timeline** | Complete chronological log of all events during an emergency |
| **Safe Route Display** | Visual route mapping to safe destinations |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| Next.js 16 | React framework with App Router |
| React 19 | UI library |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| shadcn/ui | Component library |
| Framer Motion | Animations |
| Leaflet + React-Leaflet | Interactive maps |
| Socket.IO Client | Real-time communication |
| React Hook Form + Zod | Form validation |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|-----------|---------|
| Express.js | REST API framework |
| MongoDB + Mongoose | Database and ODM |
| Socket.IO | Real-time server |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password hashing |
| Helmet | Security headers |
| express-rate-limit | API rate limiting |
| express-validator | Request validation |
| multer | File upload handling |
| NVIDIA API (Llama 3.1 70B) | AI analysis engine |

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **MongoDB** running locally (port 27017) or a MongoDB Atlas connection string
- **NVIDIA API Key** (free tier available at [build.nvidia.com](https://build.nvidia.com))

### 1. Clone the Repository

```bash
git clone https://github.com/kamalsolanki143/Compasscrew-v2v.git
cd Compasscrew-v2v
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5050
NODE_ENV=development
LOG_LEVEL=info

MONGODB_URI=mongodb://localhost:27017/escapeher

JWT_SECRET=your-secret-key-change-in-production

NVIDIA_API_KEY=your-nvidia-api-key
NVIDIA_MODEL=meta/llama-3.1-70b-instruct

CLIENT_URL=http://localhost:3000
```

Start the backend:

```bash
npm run dev
```

The API will be available at `http://localhost:5050`. Verify with:

```bash
curl http://localhost:5050/api/health
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env.local` file in the `client/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5050
NEXT_PUBLIC_SOCKET_URL=http://localhost:5050
```

Start the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### 4. Verify Everything Works

1. Open `http://localhost:3000` in your browser
2. Sign up for a new account
3. You should be redirected to the dashboard
4. Add a trusted contact from the dashboard
5. Navigate to Emergency and press the SOS button
6. Check the AI analysis endpoints after the session is active

---

## API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create a new account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Get current user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get profile |
| PATCH | `/api/users/profile` | Update profile |
| GET | `/api/users/dashboard` | Get dashboard stats |

### Emergency
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/emergency/start` | Start emergency session |
| POST | `/api/emergency/:id/stop` | Stop session |
| PATCH | `/api/emergency/:id/status` | Update status |
| GET | `/api/emergency/:id` | Get session details |
| GET | `/api/emergency` | Session history |

### Heartbeat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/heartbeat/:sessionId/check-in` | Check in (safe) |
| POST | `/api/heartbeat/:sessionId/missed` | Record missed beat |
| GET | `/api/heartbeat/:sessionId/status` | Get heartbeat status |

### Contacts
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contacts` | Add trusted contact |
| GET | `/api/contacts` | List contacts |
| PUT | `/api/contacts/:id` | Update contact |
| DELETE | `/api/contacts/:id` | Delete contact |

### Incidents
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/incidents/history` | All incidents |
| GET | `/api/incidents/:id` | Single incident |
| GET | `/api/incidents/session/:sessionId/timeline` | Session timeline |

### Maps
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/maps/:sessionId/location` | Save location ping |
| GET | `/api/maps/:sessionId/history` | Location history |
| GET | `/api/maps/:sessionId/last-location` | Latest location |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reports/:sessionId/audio` | Upload audio evidence |
| POST | `/api/reports/:sessionId/create` | Generate report |
| GET | `/api/reports/:sessionId` | Get report |

### AI Analysis (NVIDIA)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/:sessionId/evidence-summary` | Analyze evidence |
| POST | `/api/ai/:sessionId/incident-summary` | Session summary |
| POST | `/api/ai/:sessionId/safety-insights` | Safety insights & score |

---

## Project Structure

```
Compasscrew-v2v/
├── client/                          # Frontend (Next.js)
│   ├── src/
│   │   ├── app/                     # Pages (App Router)
│   │   │   ├── page.tsx             # Landing page
│   │   │   ├── login/page.tsx       # Login
│   │   │   ├── signup/page.tsx      # Signup
│   │   │   ├── dashboard/page.tsx   # Dashboard
│   │   │   ├── emergency/page.tsx   # Emergency control
│   │   │   ├── danger-mode/page.tsx # One-tap danger mode
│   │   │   ├── history/page.tsx     # Incident history
│   │   │   ├── profile/page.tsx     # User profile
│   │   │   ├── settings/page.tsx    # App settings
│   │   │   └── layout.tsx           # Root layout + providers
│   │   ├── components/              # UI components
│   │   │   ├── landing/             # Hero, Features, CTA, Footer
│   │   │   ├── dashboard/           # Stats, QuickActions
│   │   │   ├── emergency/           # DangerButton, HeartbeatStatus
│   │   │   ├── contacts/            # ContactList, ContactCard
│   │   │   ├── timeline/            # IncidentTimeline
│   │   │   ├── charts/              # EmergencyChart, ResponseChart
│   │   │   ├── maps/                # LiveMap, SafeRoute
│   │   │   ├── modals/              # Emergency, Contact, Confirm
│   │   │   ├── forms/               # Login, Signup, Profile, Contact
│   │   │   ├── layout/              # DashboardLayout, Sidebar, Navbar
│   │   │   └── common/              # Logo, PageHeader, Loader
│   │   ├── context/                 # AuthContext, ThemeContext, EmergencyContext
│   │   ├── hooks/                   # useAuth, useSocket, useLocation
│   │   ├── services/                # API service layer
│   │   ├── types/                   # TypeScript interfaces
│   │   ├── lib/                     # API client, Socket.IO, utils
│   │   └── config/                  # Routes, theme, site config
│   └── package.json
│
├── server/                          # Backend (Express.js)
│   ├── src/
│   │   ├── app.js                   # Express app configuration
│   │   ├── server.js                # Server entry point
│   │   ├── models/                  # Mongoose models (7)
│   │   │   ├── User.js
│   │   │   ├── EmergencySession.js
│   │   │   ├── Heartbeat.js
│   │   │   ├── TrustedContact.js
│   │   │   ├── Incident.js
│   │   │   ├── Evidence.js
│   │   │   └── LocationPing.js
│   │   ├── controllers/             # Route handlers (9)
│   │   ├── services/                # Business logic
│   │   ├── routes/                  # API routes (9)
│   │   ├── middleware/              # Auth, error handler, rate limiter
│   │   ├── validators/              # Request validation
│   │   ├── sockets/                 # Socket.IO event handlers
│   │   └── utils/                   # Helpers, logger, response formatter
│   ├── .env
│   └── package.json
│
├── ARCHITECTURE.md
├── LICENSE
└── README.md
```

---

## How It Works

### Emergency Flow

1. **User triggers SOS** — presses the danger button or uses voice/auto-detect
2. **Session created** — system starts tracking heartbeats, location, and incidents
3. **Heartbeat monitoring** — user must check in every N seconds (default: 300s)
4. **Auto-escalation** — if 3 heartbeats are missed, the session escalates:
   - Trusted contacts are notified via SMS/push
   - Escalation level increments
   - Emergency services can be alerted
5. **De-escalation** — if the user checks in during an escalated session, it returns to active
6. **Resolution** — user or system stops the session
7. **AI Analysis** — post-session AI generates:
   - Evidence summary with risk assessment
   - Incident timeline with key events
   - Safety insights with a 0-100 safety score

### AI Integration

EscapeHer uses **NVIDIA's Llama 3.1 70B Instruct** model via the NVIDIA API for:

- **Evidence Analysis** — Summarizes captured evidence, identifies risk factors
- **Incident Summaries** — Generates comprehensive session narratives
- **Safety Insights** — Calculates safety scores and provides actionable recommendations

All AI responses are structured JSON, parsed and displayed in the dashboard.

---

## Environment Variables

### Server (`server/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5050` | Server port |
| `NODE_ENV` | No | `development` | Environment |
| `MONGODB_URI` | Yes | — | MongoDB connection string |
| `JWT_SECRET` | Yes | — | JWT signing secret |
| `NVIDIA_API_KEY` | No | — | NVIDIA API key for AI features |
| `NVIDIA_MODEL` | No | `meta/llama-3.1-70b-instruct` | AI model |
| `CLIENT_URL` | No | `http://localhost:3000` | Frontend URL for CORS |

### Client (`client/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | No | Backend URL (default: `http://localhost:5050`) |
| `NEXT_PUBLIC_SOCKET_URL` | No | Socket.IO URL |

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [NVIDIA AI](https://build.nvidia.com) for the LLM API
- [Leaflet](https://leafletjs.com) for map rendering
- [shadcn/ui](https://ui.shadcn.com) for component primitives
- [Socket.IO](https://socket.io) for real-time communication
- [Next.js](https://nextjs.org) for the frontend framework
