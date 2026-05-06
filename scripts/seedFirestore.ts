// Run: npx tsx scripts/seedFirestore.ts
// Requires .env.local with Firebase credentials.

import { config } from "dotenv";
config({ path: ".env.local" });

import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../src/lib/firebase";

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

  // radar_targets
  const radarData = [
    {
      created_at: minutesAgo(10),
      target_count: 1,
      targets: [{ x: 0.5, y: 1.2, speed: 0.0 }],
    },
    {
      created_at: minutesAgo(0),
      target_count: 2,
      targets: [
        { x: 1.2, y: 0.8, speed: 0.3 },
        { x: -0.5, y: 1.5, speed: 0.0 },
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
