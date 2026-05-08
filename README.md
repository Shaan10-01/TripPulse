# TripPulse — Adaptive AI Travel Copilot

> Dynamic travel planning with live AI-powered replanning.

![Status](https://img.shields.io/badge/status-active-success)
![Gemini](https://img.shields.io/badge/AI-Gemini%202.5-blue)
![Cloud Run](https://img.shields.io/badge/deploy-Cloud%20Run-orange)

## Problem Statement

Traditional trip planning tools generate static itineraries that break the moment real-world disruptions occur — bad weather, closed attractions, budget changes, or traveler fatigue. Travelers are left scrambling to manually adjust plans.

## Solution Overview

**TripPulse** is an Adaptive AI Travel Copilot that:

1. **Generates personalized itineraries** using Google Gemini with structured JSON output
2. **Handles user constraints** (accessibility, dietary, budget, crowd avoidance)
3. **Reacts to real-time disruptions** via a simulation engine (rain, budget cuts, closures)
4. **Dynamically replans** affected sections while preserving the overall trip structure
5. **Tracks budget impact** of every change in real-time

## Architecture

```
┌─────────────────┐
│   React Client   │ (Vite + TypeScript + Tailwind)
│   Trip Setup     │
│   Itinerary View │
│   Disruption UI  │
└───────┬─────────┘
        │ REST API
┌───────▼─────────┐
│  Express Server  │ (Node.js + TypeScript)
│  /api/generate   │
│  /api/replan     │
└───────┬─────────┘
        │
┌───────▼─────────┐
│  Gemini Service  │ (Structured JSON prompting)
│  Google Maps API │ (Place visualization)
│  Places API      │ (Nearby recommendations)
└─────────────────┘
```

## Google Cloud Services Used

| Service | Usage |
|---------|-------|
| **Gemini 2.5 Flash** | Core AI engine for itinerary generation & disruption replanning |
| **Google Maps API** | Place visualization and route mapping |
| **Places API** | Nearby restaurant/attraction recommendations |
| **Cloud Run** | Production deployment target |

## Setup Instructions

### Prerequisites
- Node.js 18+
- Google Gemini API key

### Local Development

```bash
# Clone
git clone https://github.com/Shaan10-01/TripPulse.git
cd TripPulse

# Server setup
cd server
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
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
| `GEMINI_MODEL` | No | Model name (default: gemini-2.5-flash-preview-05-20) |
| `PORT` | No | Server port (default: 3001) |

## Deployment (Cloud Run)

```bash
# Build and deploy
gcloud run deploy trippulse \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key
```

## Key Features

- **🧠 AI Itinerary Generation** — Structured JSON output, not markdown blobs
- **⚡ Disruption Engine** — 6 real-time disruption scenarios with intelligent replanning
- **💰 Budget Tracker** — Live cost recalculation on every plan change
- **♿ Accessible** — ARIA labels, keyboard navigation, semantic HTML
- **📱 Responsive** — Mobile-first design

## Future Improvements

- Google Maps embed for visual route mapping
- Voice input for trip preferences
- Multi-language itinerary support
- Collaborative trip planning
- Export itinerary as PDF
