// File: src/components/Blog/DifficultyScale.tsx

import React from "react";

/**
 * DifficultyScale shows 1–3 colored dots or “N/A” for no data.
 * - Green for easy
 * - Yellow for medium
 * - Red for hard
 */
export const DifficultyScale: React.FC<{ level: 1 | 2 | 3 | 0 }> = ({ level }) => {
  const dots = [1, 2, 3].map((n) => {
    let bgColor = "bg-gray-300";
    if (level > 0 && n <= level) {
      if (level === 1) bgColor = "bg-green-500";
      else if (level === 2) bgColor = "bg-yellow-500";
      else if (level === 3) bgColor = "bg-red-500";
    }
    return (
      <span
        key={n}
        className={`${bgColor} w-2.5 h-2.5 rounded-full inline-block mx-0.5`}
      />
    );
  });

  if (level === 0) {
    return <span className="text-gray-500 dark:text-gray-400 text-xs">N/A</span>;
  }
  return <div className="flex">{dots}</div>;
};

export const parseDifficulty = (diff: string): 1 | 2 | 3 | 0 => {
  const d = diff.toLowerCase().trim();
  if (d.includes("könnyű") || d.includes("easy")) return 1;
  if (d.includes("közepes") || d.includes("medium")) return 2;
  if (d.includes("nehéz") || d.includes("hard")) return 3;
  return 0;
};
