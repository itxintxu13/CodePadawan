import React from "react";

interface ProgressChartProps {
  value?: number;
  max?: number;
  label: string;
  color?: string;
}

const DEFAULT_MAX = 100;

export default function ProgressChart({ value, max, label, color = "#6366f1" }: ProgressChartProps) {
  const radius = 48;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const safeValue = value || 0;
const safeMax = max && max !== 0 ? max : DEFAULT_MAX;
const progress = Math.min(safeValue / safeMax, 1);
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#22223b"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 1s cubic-bezier(.4,2,.6,1)" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="1.6em"
          fill="#fff"
          fontWeight="bold"
        >
          {Math.round(progress * 100)}%
        </text>
      </svg>
      <span className="mt-2 text-sm text-gray-300">{label}</span>
    </div>
  );
}