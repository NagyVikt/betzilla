// components/Search/RecipeGridSkeleton.tsx
"use client";

import React from "react";

const RecipeCardSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2"></div>
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
    <div className="flex space-x-1">
      {/* simulate stars */}
      {Array.from({ length: 5 }).map((_, idx) => (
        <div key={idx} className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      ))}
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10 ml-2"></div>
    </div>
  </div>
);

interface RecipeGridSkeletonProps {
  count?: number;
}

export const RecipeGridSkeleton: React.FC<RecipeGridSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <RecipeCardSkeleton key={idx} />
      ))}
    </div>
  );
};
