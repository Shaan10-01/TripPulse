# TripPulse — Adaptive AI Travel Copilot

> Dynamic travel planning with live AI-powered replanning.

![Status](https://img.shields.io/badge/status-deployed-success)
![Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-blue)
![Cloud Run](https://img.shields.io/badge/deploy-Cloud%20Run-orange)
![TypeScript](https://img.shields.io/badge/lang-TypeScript-blue)

🔗 **Live App**: [https://trippulse-688223445998.us-central1.run.app](https://trippulse-688223445998.us-central1.run.app)

---

## Challenge Vertical

**Travel & Tourism** — Building an intelligent, adaptive travel planning assistant that goes beyond static itinerary generation.

## Problem Statement

Traditional trip planning tools generate static itineraries that break the moment real-world disruptions occur — bad weather, closed attractions, budget changes, or traveler fatigue. Travelers are left scrambling to manually adjust plans with no intelligent assistance.

## Solution Overview

**TripPulse** is an Adaptive AI Travel Copilot that:

1. **Generates personalized itineraries** using Google Gemini with structured JSON output
2. **Handles user constraints** (accessibility, dietary, budget, crowd avoidance, weather)
3. **Reacts to real-time disruptions** via a simulation engine (rain, budget cuts, closures, fatigue)
4. **Dynamically replans only affected sections** while preserving the overall trip structure
5. **Tracks budget impact** of every change in real-time
6. **Links activities to Google Maps** for location context

## Architecture

```
┌─────────────────────────────┐
│     React Frontend (Vite)    │
│  TypeScript + Tailwind CSS   │
│  Trip Setup → Itinerary View │
│  Disruption Panel → Budget   │
└──────────────┬──────────────┘
               │ REST API
┌──────────────▼──────────────┐
│     Express.js Backend       │
│  TypeScript + Structured     │
│  Logging + Error Handling    │
│  /api/generate               │
│  /api/replan                 │
│  /api/health                 │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│     Google Cloud Services    │
│  Gemini 2.5 Flash (AI)       │
│  Google Maps (Locations)     │
│  Cloud Run (Deployment)      │
└─────────────────────────────┘
```

## Google Cloud Services Used

| Service | Purpose |
|---------|---------|
| **Gemini 2.5 Flash** | Core AI engine — itinerary generation and disruption-aware replanning with structured JSON output |
| **Google Maps** | Location links for every activity, enabling users to view and navigate to planned destinations |
| **Cloud Run** | Production deployment — containerized, auto-scaling, publicly accessible |
| **Cloud Build** | Automated Docker container builds from source |
| **Artifact Registry** | Container image storage for Cloud Run deployments |

## Adaptive Replanning Logic

The core differentiator is the **multi-stage prompting strategy**:

### Stage 1: Base Itinerary Generation
- User provides destination, budget, duration, travel style, and constraints
- Gemini generates a complete day-by-day itinerary as structured JSON
- Each activity includes time, location, cost, and type classification

### Stage 2: Disruption-Aware Replanning
When a disruption occurs (e.g., Heavy Rain):
- The **existing itinerary** is sent to Gemini alongside the disruption context
- Gemini is instructed to **modify ONLY affected activities** — not the entire plan
- Replaced activities are marked with `replaced: true`, `original`, and `replacementReason`
- Budget is automatically recalculated
- The UI highlights changed vs unchanged activities with visual diffs

This creates **believable adaptive intelligence** — the AI preserves what works and surgically replaces what doesn't.

### Supported Disruptions
| Disruption | Effect |
|-----------|--------|
| 🌧️ Heavy Rain | Replaces outdoor activities with indoor alternatives |
| 💸 Budget Cut | Finds cheaper alternatives, reduces costs |
| 🚗 Traffic Delay | Reroutes travel, adjusts timing |
| 😴 User Exhausted | Switches to low-energy, restful activities |
| 🚫 Attraction Closed | Finds nearby alternative attractions |
| 🎉 Local Event Found | Incorporates local festivals/events |

## Key Features

- **🧠 Structured AI Output** — Gemini returns validated JSON, not markdown blobs
- **⚡ Surgical Replanning** — Only affected sections are regenerated
- **💰 Live Budget Tracking** — Cost recalculated after every disruption
- **📍 Google Maps Integration** — Every activity links to its location on Maps
- **♿ Accessible** — ARIA labels, keyboard navigation, semantic HTML, role attributes
- **📱 Responsive** — Mobile-first layout
- **🔄 Retry Logic** — Gemini calls retry with JSON sanitization for stability
- **📊 Structured Logging** — Timestamped server logs for observability
- **✅ Tested** — Unit tests with Vitest

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, TypeScript, Tailwind CSS v4 |
| Backend | Node.js, Express, TypeScript |
| AI | Google Gemini 2.5 Flash (structured JSON mode) |
| Deployment | Docker, Cloud Run, Cloud Build |
| Testing | Vitest |

## Setup Instructions

### Prerequisites
- Node.js 18+
- Google Gemini API key

### Local Development

```bash
# Clone the repository
git clone https://github.com/Shaan10-01/TripPulse.git
cd TripPulse

# Server setup
cd server
cp .env.example .env
# Edit .env → add your GEMINI_API_KEY
npm install
npm run dev

# Client setup (new terminal)
cd client
npm install
npm run dev
```

The client runs at `http://localhost:5173` and proxies API requests to the server on port `3001`.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `GEMINI_MODEL` | No | Model name (default: `gemini-2.5-flash`) |
| `PORT` | No | Server port (default: `3001`) |

### Running Tests

```bash
cd server
npm test
```

## Deployment (Cloud Run)

```bash
gcloud run deploy trippulse \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "GEMINI_API_KEY=your_key,GEMINI_MODEL=gemini-2.5-flash,NODE_ENV=production" \
  --project your-project-id
```

## Project Structure

```
TripPulse/
├── client/                         # React frontend
│   └── src/
│       ├── components/
│       │   ├── Header.tsx          # App branding
│       │   ├── TripSetupForm.tsx   # Trip configuration form
│       │   ├── ItineraryView.tsx   # Timeline with Maps links
│       │   ├── DisruptionPanel.tsx  # 6 disruption scenarios
│       │   ├── BudgetPanel.tsx     # Live budget tracker
│       │   └── LoadingOverlay.tsx  # AI loading state
│       ├── types.ts                # Shared TypeScript types
│       ├── api.ts                  # API client
│       └── App.tsx                 # Phase-based flow controller
├── server/                         # Express backend
│   └── src/
│       ├── routes/
│       │   ├── generate.ts         # Itinerary generation (Prompt 1)
│       │   └── replan.ts           # Disruption replanning (Prompt 2)
│       ├── services/gemini.ts      # Gemini SDK with retry + sanitization
│       ├── utils/
│       │   ├── logger.ts           # Structured logging
│       │   └── id.ts               # UUID generator
│       ├── types.ts                # Server types + constraint builder
│       └── __tests__/              # Unit tests
├── Dockerfile                      # Multi-stage production build
├── .dockerignore
└── README.md
```

## Accessibility

- Semantic HTML (`<header>`, `<main>`, `<section>`, `<article>`)
- ARIA labels on all interactive elements
- `role="radiogroup"` for travel style selection
- `role="switch"` for constraint toggles
- `role="status"` and `aria-live="polite"` on loading states
- `aria-required` on required inputs
- Keyboard-accessible controls
- Color contrast compliant (dark theme)

## Future Improvements

- Google Places API for nearby restaurant/attraction recommendations
- Embedded Google Maps for visual route mapping
- Multi-language itinerary support
- Collaborative trip planning
- Export itinerary as PDF
- Voice input for trip preferences
