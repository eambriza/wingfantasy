# WingFantasy

Lightweight, Red Bull only fantasy loop for Football and F1. Users make quick picks before events, then "prove" them after kickoff or chequered flag. Built with Expo Router for mobile first demos.

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

## Quick start (Expo Go)

```bash
# 1) install deps
npx expo install @react-native-async-storage/async-storage react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context

# 2) ensure reanimated plugin
# babel.config.js must contain:
# module.exports = { presets: ["babel-preset-expo"], plugins: ["react-native-reanimated/plugin"] };

# 3) run
npm start
# scan the QR with the Expo Go app on iOS or Android
```

## Build a shareable mobile binary

```bash
# login and initialize
npx expo login
npx expo whoami
npx expo prebuild --clean

# cloud builds
npx eas build --platform ios
npx eas build --platform android
```

## Web preview

```bash
npm run web
# or export a static build for Vercel
npx expo export --platform web
```
