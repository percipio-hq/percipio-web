// Run: npx tsx scripts/seedFirestore.ts
// Requires .env.local with Firebase credentials.

// dotenv must run before any Firebase import — ES module imports are hoisted,
// so we use dynamic import to guarantee env vars are set first.
import { config } from "dotenv";
config({ path: ".env.local" });

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

const db = getFirestore(initializeApp({
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}));

function minutesAgo(n: number) {
  return Timestamp.fromDate(new Date(Date.now() - n * 60_000));
}

async function seed() {
  // sensor_readings
  const sensorData = [
    { created_at: minutesAgo(20), temperature: 22.1, humidity: 45.0, pressure: 1013.2 },
    { created_at: minutesAgo(15), temperature: 22.4, humidity: 46.2, pressure: 1013.0 },
    { created_at: minutesAgo(10), temperature: 22.7, humidity: 47.1, pressure: 1012.8 },
    { created_at: minutesAgo(5),  temperature: 23.0, humidity: 46.8, pressure: 1012.5 },
    { created_at: minutesAgo(0),  temperature: 23.1, humidity: 46.5, pressure: 1012.4 },
  ];

  for (const doc of sensorData) {
    await addDoc(collection(db, "sensor_readings"), doc);
  }
  console.log(`✓ sensor_readings — ${sensorData.length} docs`);

  // radar_targets — x/y in millimeters, as the real LD2450 outputs
  // hook divides by 1000 → metres before passing to RadarView
  // Room: 6.0×4.0m. Sensor at bottom centre (0,0). Y+ = forward, X+ = right.
  const radarData = [
    {
      created_at: minutesAgo(5),
      target_count: 1,
      targets: [
        { x:  500, y: 1500, speed:   0 },   // 0.5m right, 1.5m forward — stationary
      ],
    },
    {
      created_at: minutesAgo(0),
      target_count: 3,
      targets: [
        { x:  500, y: 1500, speed:   0 },   // 0.5m right, 1.5m forward — stationary (desk)
        { x: -1200, y: 2800, speed: 120 },   // 1.2m left,  2.8m forward — walking (120 mm/s)
        { x:  1800, y: 3200, speed:   0 },   // 1.8m right, 3.2m forward — stationary (back desk)
      ],
    },
  ];

  for (const doc of radarData) {
    await addDoc(collection(db, "radar_targets"), doc);
  }
  console.log(`✓ radar_targets   — ${radarData.length} docs`);

  // rfid_events
  const rfidData = [
    {
      created_at: minutesAgo(30),
      card_uid: "A1B2C3D4",
      card_name: "John",
      authorized: true,
    },
    {
      created_at: minutesAgo(12),
      card_uid: "DEADBEEF",
      card_name: "Unknown",
      authorized: false,
    },
  ];

  for (const doc of rfidData) {
    await addDoc(collection(db, "rfid_events"), doc);
  }
  console.log(`✓ rfid_events     — ${rfidData.length} docs`);

  console.log("\nSeed complete. Collections visible in Firebase Console.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
