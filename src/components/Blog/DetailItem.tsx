// File: src/components/Blog/DetailItem.tsx

import React from "react";

/**
 * DetailItem renders a small card with:
 * - an icon (lucide)
 * - a label (e.g. “Előkészítési idő”)
 * - a value (e.g. “20”)
 * - an optional unit (e.g. “perc”)
 */
export const DetailItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
  unit?: string;
  className?: string;
}> = ({ icon, label, value, unit, className }) => (
  <div
    className={`
      flex flex-col items-center text-center
      p-2 bg-white dark:bg-gray-800
      border border-gray-300 dark:border-gray-600
      rounded-lg shadow-sm hover:shadow-md
      transition-shadow duration-200 ease-in-out
      ${className ?? ""}
    `}
  >
    <div className="text-pink-500 dark:text-pink-400 mb-1">{icon}</div>
    <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
      {label}
    </span>
    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 mt-0.5">
      {value} {unit}
    </span>
  </div>
);
