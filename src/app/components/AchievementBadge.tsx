import React from "react";

interface AchievementBadgeProps {
  unlocked: boolean;
  label: string;
  icon: string;
  color?: string;
}

export default function AchievementBadge({ unlocked, label, icon, color = "#22d3ee" }: AchievementBadgeProps) {
  return (
    <div className={`flex flex-col items-center transition-transform duration-300 ${unlocked ? "scale-110" : "opacity-50 grayscale"}`}>
      <div
        className={`rounded-full shadow-lg border-4 ${unlocked ? "animate-bounce border-yellow-400" : "border-gray-700"}`}
        style={{ background: unlocked ? color : "#22223b", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}
      >
        <span>{icon}</span>
      </div>
      <span className="mt-2 text-xs text-center" style={{ color: unlocked ? color : "#888" }}>{label}</span>
    </div>
  );
}