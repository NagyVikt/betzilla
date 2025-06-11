"use client";

import React from "react";

interface NutritionChartProps {
  protein: number; // grams
  carbs: number;   // grams
  fat: number;     // grams
  size?: number;   // diameter in pixels (optional, default = 120)
}

/**
 * NutritionChart renders a simple SVG donut chart:
 * - Calculates total = protein + carbs + fat.
 * - Draws three arcs (protein=green, carbs=blue, fat=orange) around a circle.
 * - If total === 0, show "N/A" in a light gray circle.
 */
export const NutritionChart: React.FC<NutritionChartProps> = ({
  protein,
  carbs,
  fat,
  size = 120,
}) => {
  const total = protein + carbs + fat;

  // Return early if no data
  if (total === 0) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size / 2) - 4}
          fill="#F3F4F6" /* gray-100 */
          stroke="#E5E7EB" /* gray-200 */
          strokeWidth={2}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-gray-500 text-sm font-medium"
        >
          N/A
        </text>
      </svg>
    );
  }

  // Convert grams to percentages (0–100)
  const pPerc = (protein / total) * 100;
  const cPerc = (carbs / total) * 100;
  const fPerc = (fat / total) * 100;

  // Helper to convert percentage to circle stroke-dasharray lengths
  // We draw each arc in sequence: protein → carbs → fat
  const circumference = 2 * Math.PI * ((size / 2) - 8); // radius = (size/2 - 8) px
  const pctToLength = (pct: number) => (pct / 100) * circumference;

  const proteinLength = pctToLength(pPerc);
  const carbsLength = pctToLength(cPerc);
  const fatLength = pctToLength(fPerc);

  // The offsets tell where each arc starts on the circle’s circumference.
  const offsetProtein = 0;
  const offsetCarbs = proteinLength;
  const offsetFat = proteinLength + carbsLength;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={(size / 2) - 8}
        fill="none"
        stroke="#E5E7EB" /* gray-200 */
        strokeWidth={16}
      />

      {/* Protein arc (green) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={(size / 2) - 8}
        fill="none"
        stroke="#10B981" /* emerald-500 */
        strokeWidth={16}
        strokeDasharray={`${proteinLength} ${circumference - proteinLength}`}
        strokeDashoffset={-offsetProtein + circumference * 0.25}
        /* Rotate -90° so 0% starts at top, plus 25% for visual centering */
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />

      {/* Carbs arc (blue) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={(size / 2) - 8}
        fill="none"
        stroke="#3B82F6" /* blue-500 */
        strokeWidth={16}
        strokeDasharray={`${carbsLength} ${circumference - carbsLength}`}
        strokeDashoffset={-offsetCarbs + circumference * 0.25}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />

      {/* Fat arc (orange) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={(size / 2) - 8}
        fill="none"
        stroke="#F59E0B" /* amber-500 */
        strokeWidth={16}
        strokeDasharray={`${fatLength} ${circumference - fatLength}`}
        strokeDashoffset={-offsetFat + circumference * 0.25}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />

      {/* Center text: show total grams */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-gray-700 text-sm font-medium"
      >
        {total} g
      </text>
    </svg>
  );
};
