# WingFantasy

Lightweight, Red Bull only fantasy loop for Football and F1. Users make quick picks before events, then "prove" them after kickoff or chequered flag. Built with React, TypeScript, and Vite.

## Why it fits Red Bull

- Focus on RB properties only: Red Bull Racing, VCARB, RB Leipzig, Salzburg, NYRB, Bragantino.
- Predict and Prove loop that drives repeat visits.
- Scales later without throwing away the MVP.

## Features

- Tabs: Home, Events, Live, Search.
- Event detail with three quick markets per sport.
- "A" button to simulate official results for demos.
- Reveal results to compute points and persist locally.
- Pick lock 15 minutes before start time.
- Fantasy squad builder with salary cap mechanics.
- Weekly slate simulation with player/driver stats.
- Leaderboards (weekly, monthly, global season).
- Red Bull themed glassmorphic UI with Tailwind CSS.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling with custom Red Bull theme
- **LocalStorage** - State persistence

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── TabBar.tsx   # Bottom navigation
├── App.tsx          # Main app logic and state
├── AppRouter.tsx    # Route configuration
├── index.tsx        # App entry point
└── index.css        # Global styles

public/              # Static assets
├── rb.png          # Red Bull logo
└── F1.png          # F1 logo
```

## Development

The app runs entirely in the browser with no backend. All data is mocked and persisted to localStorage.

### Key Features

- **Event Predictions**: Make picks on Football matches and F1 races
- **Fantasy Squad**: Build teams within salary cap constraints
- **Simulate Results**: Demo mode with seeded RNG for consistent results
- **Points Calculation**: Automatic scoring based on player/driver performance
- **Leaderboards**: Filter by sport, timeframe, and country

## Deployment

Build and deploy to any static hosting service:

```bash
npm run build
# Deploy the dist/ folder to Vercel, Netlify, etc.
```
