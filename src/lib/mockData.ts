export const mockSensorReadings = [
  { created_at: new Date("2026-05-05T10:00:00"), temperature: 22.1, humidity: 45, pressure: 1013 },
  { created_at: new Date("2026-05-05T10:05:00"), temperature: 22.3, humidity: 46, pressure: 1013 },
  { created_at: new Date("2026-05-05T10:10:00"), temperature: 22.0, humidity: 44, pressure: 1012 },
];

export const mockRadarTargets = [
  { created_at: new Date(), target_count: 2, targets: [{ x: 1.2, y: 0.8, speed: 0.1 }, { x: -0.5, y: 1.5, speed: 0 }] },
];

export const mockRfidEvents = [
  { created_at: new Date("2026-05-05T09:30:00"), card_uid: "A1B2C3D4", card_name: "Jacek", authorized: true },
  { created_at: new Date("2026-05-05T09:45:00"), card_uid: "DEADBEEF", card_name: "Unknown", authorized: false },
];
