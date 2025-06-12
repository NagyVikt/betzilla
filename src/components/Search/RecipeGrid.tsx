// components/Search/RecipeGrid.tsx
"use client";

import React from "react";
import RecipeCard, { Recipe } from "./RecipeCard";

interface RecipeGridProps {
  recipes: Recipe[];
}

export default function RecipeGrid({ recipes }: RecipeGridProps) {
  if (!recipes) {
    // If parent passes undefined while loading, you could return a skeleton here.
    return null;
  }

  if (recipes.length === 0) {
    return <p className="text-center dark:text-gray-300">Nincs a szűrőknek megfelelő találat.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((rec) => (
        <RecipeCard key={rec.id} recipe={rec} />
      ))}
    </div>
  );
}
