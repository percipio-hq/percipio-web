"use client";

interface Target {
  x: number;
  y: number;
  speed: number;
}

interface Props {
  targets: Target[];
}

const SCALE = 80; // px per meter
const SIZE = 400;
const CENTER = SIZE / 2;

export default function RadarView({ targets }: Props) {
  return (
    <div className="rounded-lg bg-gray-900 p-4">
      <h2 className="mb-2 text-sm font-semibold text-gray-300">Room Map</h2>
      <svg width={SIZE} height={SIZE} className="border border-gray-700 rounded">
        {/* grid lines */}
        {[-2, -1, 0, 1, 2].map((n) => (
          <line key={`v${n}`} x1={CENTER + n * SCALE} y1={0} x2={CENTER + n * SCALE} y2={SIZE} stroke="#374151" strokeWidth={1} />
        ))}
        {[-2, -1, 0, 1, 2].map((n) => (
          <line key={`h${n}`} x1={0} y1={CENTER + n * SCALE} x2={SIZE} y2={CENTER + n * SCALE} stroke="#374151" strokeWidth={1} />
        ))}
        {/* radar origin */}
        <circle cx={CENTER} cy={SIZE - 20} r={4} fill="#6366f1" />
        {/* targets */}
        {targets.map((t, i) => (
          <circle
            key={i}
            cx={CENTER + t.x * SCALE}
            cy={SIZE - 20 - t.y * SCALE}
            r={8}
            fill={t.speed > 0.05 ? "#f97316" : "#22c55e"}
            opacity={0.85}
          />
        ))}
      </svg>
    </div>
  );
}
