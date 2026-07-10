const EmergencySession = require('../models/EmergencySession');
const Incident = require('../models/Incident');
const Evidence = require('../models/Evidence');
const LocationPing = require('../models/LocationPing');
const Heartbeat = require('../models/Heartbeat');
const { successResponse, errorResponse } = require('../utils/response');
const { asyncHandler } = require('../utils/helpers');

const NVIDIA_KEY = process.env.NVIDIA_API_KEY || '';
const NVIDIA_MODEL = process.env.NVIDIA_MODEL || 'meta/llama-3.1-70b-instruct';

function generateMockAnalysis(type, sessionId, data) {
  const base = {
    sessionId,
    generatedAt: new Date().toISOString(),
    model: 'mock-ai',
  };

  switch (type) {
    case 'evidence-summary':
      return {
        ...base,
        type: 'evidence_summary',
        summary: 'Audio evidence captured during the emergency session. No concerning verbal cues detected in the recording.',
        keyFindings: ['Recording duration indicates active user engagement', 'No explicit distress keywords identified'],
        recommendations: ['Review audio for contextual understanding', 'Cross-reference with incident timeline'],
      };
    case 'incident-summary':
      return {
        ...base,
        type: 'incident_summary',
        summary: `Emergency session ${sessionId} had ${data.incidentCount} incidents recorded. Session status: ${data.status}.`,
        timeline: `Session started via ${data.triggerType} and lasted approximately ${data.duration || 'unknown'} minutes.`,
        riskLevel: data.escalationLevel > 0 ? 'elevated' : 'low',
        recommendations: data.escalationLevel > 0
          ? ['Follow up with user for debriefing', 'Review escalation triggers', 'Update emergency contacts']
          : ['Session resolved without escalation', 'Standard post-incident review recommended'],
      };
    case 'safety-insights':
      return {
        ...base,
        type: 'safety_insights',
        insights: [
          'User maintained regular heartbeat check-ins during the session',
          'Location data shows expected movement patterns',
          'Trusted contacts were notified according to preferences',
        ],
        safetyScore: 72,
        suggestions: [
          'Consider reducing heartbeat interval for higher-risk areas',
          'Add at least one more trusted contact for redundancy',
          'Enable automatic evidence collection during future sessions',
        ],
      };
    default:
      return { ...base, message: 'Analysis completed' };
  }
}

function parseJsonResponse(text) {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  return null;
}

async function callNvidia(systemPrompt, userPrompt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${NVIDIA_KEY}`,
    },
    body: JSON.stringify({
      model: NVIDIA_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 2048,
    }),
    signal: controller.signal,
  });

  clearTimeout(timeout);

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`NVIDIA API error ${response.status}: ${errBody}`);
  }

  const json = await response.json();
  return json.choices[0].message.content;
}

async function callNvidiaWithRetry(systemPrompt, userPrompt, retries = 1) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await callNvidia(systemPrompt, userPrompt);
    } catch (err) {
      if (i === retries) throw err;
    }
  }
}

const generateEvidenceSummary = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await EmergencySession.findOne({ _id: sessionId, user: req.user._id });
  if (!session) {
    return errorResponse(res, 'Emergency session not found', 404);
  }

  const evidence = await Evidence.find({ session: sessionId }).lean();
  const incidents = await Incident.find({ session: sessionId }).sort({ timestamp: 1 }).lean();

  const sessionData = {
    status: session.status,
    triggerType: session.triggerType,
    startedAt: session.startedAt,
    endedAt: session.endedAt,
    escalationLevel: session.escalationLevel,
  };

  if (NVIDIA_KEY) {
    try {
      const systemPrompt = `You are an AI safety analyst for a women's emergency response system called EscapeHer. 
Analyze the evidence and incidents from an emergency session and return a JSON object with exactly this structure:
{
  "summary": "A concise 2-3 sentence summary of the evidence analysis",
  "keyFindings": ["finding1", "finding2", "finding3"],
  "riskAssessment": "low|medium|high|critical",
  "recommendations": ["recommendation1", "recommendation2"],
  "emotionalTone": "A brief assessment of the user's emotional state based on available data"
}
Return ONLY the JSON object, no other text.`;

      const userPrompt = `Emergency Session Data:
${JSON.stringify(sessionData, null, 2)}

Evidence Items (${evidence.length} total):
${evidence.length > 0 ? JSON.stringify(evidence.slice(0, 10), null, 2) : 'No evidence uploaded yet'}

Incidents (${incidents.length} total):
${incidents.length > 0 ? JSON.stringify(incidents.map(i => ({ type: i.type, severity: i.severity, message: i.message, timestamp: i.timestamp })), null, 2) : 'No incidents recorded'}`;

      const result = await callNvidiaWithRetry(systemPrompt, userPrompt);
      const parsed = parseJsonResponse(result);

      if (parsed) {
        return successResponse(res, {
          sessionId,
          type: 'evidence_summary',
          ...parsed,
          model: NVIDIA_MODEL,
          generatedAt: new Date().toISOString(),
          source: 'nvidia',
        }, 'Evidence summary generated');
      }

      return successResponse(res, {
        sessionId,
        type: 'evidence_summary',
        summary: result,
        source: 'nvidia-raw',
        generatedAt: new Date().toISOString(),
      }, 'Evidence summary generated');
    } catch (err) {
      const mock = generateMockAnalysis('evidence-summary', sessionId, { evidence, incidents });
      return successResponse(res, { ...mock, source: 'mock-fallback', error: err.message }, 'Evidence summary generated (mock fallback)');
    }
  }

  const mock = generateMockAnalysis('evidence-summary', sessionId, { evidence, incidents });
  return successResponse(res, { ...mock, source: 'mock' }, 'Evidence summary generated');
});

const generateIncidentSummary = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await EmergencySession.findOne({ _id: sessionId, user: req.user._id });
  if (!session) {
    return errorResponse(res, 'Emergency session not found', 404);
  }

  const incidents = await Incident.find({ session: sessionId }).sort({ timestamp: 1 }).lean();
  const heartbeats = await Heartbeat.find({ session: sessionId }).lean();
  const locationPings = await LocationPing.find({ session: sessionId }).lean();

  const duration = session.endedAt
    ? Math.round((new Date(session.endedAt) - new Date(session.startedAt)) / 60000)
    : Math.round((Date.now() - new Date(session.startedAt)) / 60000);

  const sessionData = {
    status: session.status,
    triggerType: session.triggerType,
    startedAt: session.startedAt,
    endedAt: session.endedAt,
    durationMinutes: duration,
    escalationLevel: session.escalationLevel,
    missedHeartbeatCount: session.missedHeartbeatCount,
  };

  if (NVIDIA_KEY) {
    try {
      const systemPrompt = `You are an AI safety analyst for a women's emergency response system called EscapeHer.
Generate a comprehensive incident summary for an emergency session and return a JSON object with exactly this structure:
{
  "summary": "A 3-4 sentence executive summary of the entire session",
  "timeline": "A chronological narrative of key events during the session",
  "riskLevel": "low|medium|high|critical",
  "escalationAnalysis": "Analysis of the escalation pattern and what triggered it",
  "keyEvents": ["event1", "event2", "event3"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "overallAssessment": "A brief overall assessment of the situation and response effectiveness"
}
Return ONLY the JSON object, no other text.`;

      const userPrompt = `Session Overview:
${JSON.stringify(sessionData, null, 2)}

Incidents (${incidents.length} total):
${incidents.length > 0 ? JSON.stringify(incidents.map(i => ({ type: i.type, severity: i.severity, message: i.message, timestamp: i.timestamp })), null, 2) : 'No incidents recorded'}

Heartbeats: ${heartbeats.length} total (${heartbeats.filter(h => h.kind === 'checkin').length} check-ins, ${heartbeats.filter(h => h.kind === 'missed').length} missed)

Location Updates: ${locationPings.length} total${locationPings.length > 0 ? `\nFirst location: ${locationPings[0].latitude}, ${locationPings[0].longitude}\nLast location: ${locationPings[locationPings.length - 1].latitude}, ${locationPings[locationPings.length - 1].longitude}` : ''}`;

      const result = await callNvidiaWithRetry(systemPrompt, userPrompt);
      const parsed = parseJsonResponse(result);

      if (parsed) {
        return successResponse(res, {
          sessionId,
          type: 'incident_summary',
          ...parsed,
          model: NVIDIA_MODEL,
          generatedAt: new Date().toISOString(),
          source: 'nvidia',
        }, 'Incident summary generated');
      }

      return successResponse(res, {
        sessionId,
        type: 'incident_summary',
        summary: result,
        source: 'nvidia-raw',
        generatedAt: new Date().toISOString(),
      }, 'Incident summary generated');
    } catch (err) {
      const data = {
        status: session.status,
        triggerType: session.triggerType,
        duration,
        escalationLevel: session.escalationLevel,
        incidentCount: incidents.length,
      };
      const mock = generateMockAnalysis('incident-summary', sessionId, data);
      return successResponse(res, { ...mock, source: 'mock-fallback', error: err.message }, 'Incident summary generated (mock fallback)');
    }
  }

  const data = {
    status: session.status,
    triggerType: session.triggerType,
    duration,
    escalationLevel: session.escalationLevel,
    incidentCount: incidents.length,
  };
  const mock = generateMockAnalysis('incident-summary', sessionId, data);
  return successResponse(res, { ...mock, source: 'mock' }, 'Incident summary generated');
});

const generateSafetyInsights = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await EmergencySession.findOne({ _id: sessionId, user: req.user._id });
  if (!session) {
    return errorResponse(res, 'Emergency session not found', 404);
  }

  const heartbeats = await Heartbeat.find({ session: sessionId }).lean();
  const locationPings = await LocationPing.find({ session: sessionId }).lean();
  const incidents = await Incident.find({ session: sessionId }).lean();

  const heartbeatStats = {
    total: heartbeats.length,
    checkins: heartbeats.filter(h => h.kind === 'checkin').length,
    missed: heartbeats.filter(h => h.kind === 'missed').length,
    avgInterval: heartbeats.length > 1
      ? Math.round((new Date(heartbeats[heartbeats.length - 1].receivedAt) - new Date(heartbeats[0].receivedAt)) / (heartbeats.length - 1) / 1000)
      : null,
  };

  const locationStats = {
    totalPings: locationPings.length,
    uniqueLocations: new Set(locationPings.map(p => `${p.latitude.toFixed(3)},${p.longitude.toFixed(3)}`)).size,
    hasSpeedData: locationPings.some(p => p.speed != null),
  };

  const sessionData = {
    status: session.status,
    triggerType: session.triggerType,
    escalationLevel: session.escalationLevel,
    durationMinutes: session.endedAt
      ? Math.round((new Date(session.endedAt) - new Date(session.startedAt)) / 60000)
      : Math.round((Date.now() - new Date(session.startedAt)) / 60000),
  };

  if (NVIDIA_KEY) {
    try {
      const systemPrompt = `You are an AI safety analyst for a women's emergency response system called EscapeHer.
Analyze the safety data from an emergency session and provide actionable insights. Return a JSON object with exactly this structure:
{
  "insights": ["insight1", "insight2", "insight3", "insight4"],
  "safetyScore": 75,
  "safetyScoreRationale": "Brief explanation of the safety score",
  "patternAnalysis": "Analysis of behavioral patterns during the session",
  "riskFactors": ["riskFactor1", "riskFactor2"],
  "protectiveFactors": ["protectiveFactor1", "protectiveFactor2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "futureRecommendations": ["futureRec1", "futureRec2"]
}
The safetyScore should be 0-100 where 100 is perfectly safe. Base it on: heartbeat compliance, escalation events, location data availability, and response patterns.
Return ONLY the JSON object, no other text.`;

      const userPrompt = `Session Overview:
${JSON.stringify(sessionData, null, 2)}

Heartbeat Statistics:
${JSON.stringify(heartbeatStats, null, 2)}

Location Statistics:
${JSON.stringify(locationStats, null, 2)}

Incidents (${incidents.length} total):
${incidents.length > 0 ? JSON.stringify(incidents.map(i => ({ type: i.type, severity: i.severity })), null, 2) : 'No incidents'}`;

      const result = await callNvidiaWithRetry(systemPrompt, userPrompt);
      const parsed = parseJsonResponse(result);

      if (parsed) {
        const safetyScore = Math.max(0, Math.min(100, parseInt(parsed.safetyScore) || 50));
        return successResponse(res, {
          sessionId,
          type: 'safety_insights',
          ...parsed,
          safetyScore,
          model: NVIDIA_MODEL,
          generatedAt: new Date().toISOString(),
          source: 'nvidia',
        }, 'Safety insights generated');
      }

      return successResponse(res, {
        sessionId,
        type: 'safety_insights',
        insights: result,
        source: 'nvidia-raw',
        generatedAt: new Date().toISOString(),
      }, 'Safety insights generated');
    } catch (err) {
      const mock = generateMockAnalysis('safety-insights', sessionId, { heartbeats, locationPings });
      return successResponse(res, { ...mock, source: 'mock-fallback', error: err.message }, 'Safety insights generated (mock fallback)');
    }
  }

  const mock = generateMockAnalysis('safety-insights', sessionId, { heartbeats, locationPings });
  return successResponse(res, { ...mock, source: 'mock' }, 'Safety insights generated');
});

module.exports = { generateEvidenceSummary, generateIncidentSummary, generateSafetyInsights };
