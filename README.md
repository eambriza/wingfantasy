# WingFantasy

Lightweight, Red Bull only fantasy loop for Football and F1. Users make quick picks before events, then "prove" them after kickoff or chequered flag. Built with React, TypeScript, and Vite.

## Why it fits Red Bull

- Focus on RB properties only: Red Bull Racing, VCARB, RB Leipzig, Salzburg, NYRB, Bragantino.
- Predict and Prove loop that drives repeat visits.
- Scales later without throwing away the MVP.

## Features

### Core Functionality
- **5 Main Tabs**: Home, Events, Fantasy, Boards, Search
- **Event Predictions**: Make picks on 3 quick markets per sport (match result, first scorer, total goals for Football; race winner, fastest lap, safety car for F1)
- **Pick Locking**: Picks automatically lock 15 minutes before event start time
- **Simulate Button**: Generate random results for demo purposes on event detail pages
- **Reveal Results**: Calculate and display points earned from your predictions

### Fantasy Squad Builder
- Build Football squad (FWD, MID, DEF, FLEX positions) with 40-point salary cap
- Build F1 squad (2 drivers + 1 team) with 40-point salary cap
- Captain selection with 1.5x points multiplier
- Auto-Fill Squad feature for quick demo setup
- Weekly slate system tracking upcoming matches and races

### Leaderboards (Boards Tab)
- **Filter by Sport**: Football or Formula 1
- **Filter by Timeframe**: Weekly or Monthly
- **Filter by Scope**: Country-specific or Global
- **Country Selection**: US, AT, DE, BR, ZA with flag indicators
- **Settings Panel**: Toggle Demo Mode and Reset Demo Data
- Top 20 rankings displayed with medals for top 3
- User's rank highlighted in red if outside top 20

### Developer Tools
- **Show Dev Panel**: Available on localhost or with `?dev=true` query parameter
  - Simulate Week: Generate stats for all matches/races in current week
  - Calculate Fantasy Points: Compute squad points and update leaderboards
  - Toggle Demo Mode: Switch between demo and live data
  - Reset Demo Data: Clear all stored data
  - RNG Seed Display: Shows current random seed for reproducible simulations
  - Simulation Status: Displays simulated match/race counts

### UI/UX
- Red Bull themed glassmorphic design with Tailwind CSS
- Smooth transitions and animations
- Mobile-first responsive layout
- LocalStorage persistence for all user data

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
