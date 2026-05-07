// Simulates live LD2450 output — pushes a new radar_targets doc every 2 s.
// x/y in millimetres (hook divides by 1000 → metres). Room: 6.0×4.0 m.
// Run: npx tsx scripts/seedRadar.ts
// Stop: Ctrl+C

import { config } from "dotenv"
config({ path: ".env.local" })

import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore"

const db = getFirestore(initializeApp({
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}))

// T1 orbits a desk in the middle-right area
// T2 walks a slow path across the back of the room
// T3 sits still near front-left

let tick = 0

function frame() {
  const t = tick * 0.15  // time parameter

  return {
    created_at: Timestamp.now(),
    target_count: 3,
    targets: [
      {
        // T1 — small orbit around (600, 1400): seated person fidgeting
        x: Math.round(600  + Math.cos(t)       * 80),
        y: Math.round(1400 + Math.sin(t * 0.7) * 60),
        speed: Math.round(Math.abs(Math.sin(t)) * 80),
      },
      {
        // T2 — slow walk: -2400 → +2400 along y=3000
        x: Math.round(-2400 + ((tick * 30) % 4800)),
        y: 3000,
        speed: 300,
      },
      {
        // T3 — stationary, front-left
        x: -900,
        y: 1100,
        speed: 0,
      },
    ],
  }
}

console.log("Radar seeder running — Ctrl+C to stop\n")

const INTERVAL_MS = 2000

async function push() {
  const doc = frame()
  tick++
  await addDoc(collection(db, "radar_targets"), doc)
  const t1 = doc.targets[0]
  const t2 = doc.targets[1]
  console.log(
    `[${new Date().toLocaleTimeString()}] tick=${tick}  ` +
    `T1(${(t1.x/1000).toFixed(2)}, ${(t1.y/1000).toFixed(2)})  ` +
    `T2(${(t2.x/1000).toFixed(2)}, ${(t2.y/1000).toFixed(2)})  ` +
    `T3(-0.90, 1.10)`
  )
}

push()
setInterval(push, INTERVAL_MS)
