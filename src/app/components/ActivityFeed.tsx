import React from "react";

interface ActivityItem {
  id: number;
  type: "reto" | "logro" | "puntos";
  description: string;
  date: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const iconMap = {
  reto: "💡",
  logro: "🏅",
  puntos: "⭐",
};

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-blue-300">Actividad Reciente</h3>
      <ul className="space-y-3">
        {activities.length === 0 && (
          <li className="text-gray-400 text-sm text-center">Sin actividad reciente aún.</li>
        )}
        {activities.map((item) => (
          <li key={item.id} className="flex items-center gap-3 animate-fade-in">
            <span className="text-2xl">
              {iconMap[item.type]}
            </span>
            <div>
              <span className="text-sm text-gray-200">{item.description}</span>
              <div className="text-xs text-gray-400">{item.date}</div>
            </div>
          </li>
        ))}
      </ul>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(.4,2,.6,1);
        }
      `}</style>
    </div>
  );
}