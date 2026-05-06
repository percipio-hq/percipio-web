import { Timestamp } from "firebase/firestore";

export interface SensorReading {
  id?: string;
  created_at: Timestamp;
  temperature: number; // °C
  humidity: number;    // %
  pressure: number;    // hPa
}

export interface RadarTarget {
  x: number;     // metres, right of centre
  y: number;     // metres, forward from sensor
  speed: number; // m/s
}

export interface RadarTargets {
  id?: string;
  created_at: Timestamp;
  target_count: number;
  targets: RadarTarget[];
}

export interface RfidEvent {
  id?: string;
  created_at: Timestamp;
  card_uid: string;
  card_name: string;
  authorized: boolean;
}
