// File: src/components/Elements/StarRating.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  slug: string;
  initialRating?: number; // New prop
}

/**
 * StarRating displays a 1–5 star rating control.
 * - Uses the passed‐in `initialRating` as the starting state.
 * - On hover, previews the hovered star index.
 * - On click, sends a PUT to /api/rate-recipe/[slug]?rating=<n>.
 * - Once set, the stars remain filled up to the chosen rating.
 */
export const StarRating: React.FC<StarRatingProps> = ({
  slug,
  initialRating = 0,
}) => {
  // Holds the currently saved rating (1–5). Default from props.
  const [savedRating, setSavedRating] = useState<number>(initialRating);
  // Holds the index (1–5) that is currently hovered (for preview). 0 = no hover.
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  // Whether we’re currently sending a request to server
  const [loading, setLoading] = useState(false);

  // If the parent ever changes the initialRating, update here:
  useEffect(() => {
    setSavedRating(initialRating);
  }, [initialRating]);

  // When user clicks on a star (1–5), send PUT to /api/rate-recipe/[slug]?rating=<n>
  const handleClick = async (ratingValue: number) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/rate-recipe/${slug}?rating=${ratingValue}`, {
        method: "PUT",
      });
      if (!res.ok) {
        console.error("Failed to save rating", await res.text());
      } else {
        // If success, update savedRating state
        setSavedRating(ratingValue);
      }
    } catch (err) {
      console.error("Error in rating PUT", err);
    } finally {
      setLoading(false);
    }
  };

  // For rendering: star index i is “filled” if i <= (hoveredRating || savedRating)
  const getStarColor = (i: number) => {
    if (loading) return "#D1D5DB"; // gray when loading
    const activeLevel = hoveredRating > 0 ? hoveredRating : savedRating;
    return i <= activeLevel ? "#FBBF24" : "#D1D5DB"; // amber-400 / gray-300
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={20}
          className="cursor-pointer transition-colors"
          strokeWidth={1.5}
          color={getStarColor(i)}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => handleClick(i)}
        />
      ))}
      {loading && (
        <span className="text-gray-500 text-xs ml-2">Mentés…</span>
      )}
    </div>
  );
};
