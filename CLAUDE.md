# Percipio Web

Next.js 14 dashboard for the Percipio room awareness system.

## Stack
- Next.js 14 (App Router)
- TypeScript
- Firebase Firestore (real-time `onSnapshot` listeners)
- Recharts (sensor history charts)
- Tailwind CSS

## Setup
```
npm install
cp .env.local.example .env.local
# fill in Firebase credentials
npm run dev
```

## Firestore collections
```
sensor_readings  — created_at, temperature, humidity, pressure
radar_targets    — created_at, target_count, targets[{x,y,speed}]
rfid_events      — created_at, card_uid, card_name, authorized
```
All collections use real-time `onSnapshot()` — no polling needed.

## Components
```
components/
  RadarView.tsx   — live room map, dots = LD2450 targets
  EnvChart.tsx    — temperature / humidity / pressure over time
  RfidLog.tsx     — RFID entry table (who, when, authorized?)
  StatusBar.tsx   — people count, WiFi status, DB status
lib/
  firebase.ts     — Firestore client init
```

## Testing without hardware
Run locally with mock data — hardcode documents in `lib/mockData.ts` and
pass them to components. No ESP32 or Firebase connection needed for UI work.
