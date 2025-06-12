// components/Search/RecipeCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Lock, Star } from "lucide-react";

export interface Recipe {
  id: number;
  title: string | null;
  slug: string | null;
  rating: number;       // assume integer 0–5
  isFree: boolean;
  imageUrl: string | null;
}

interface RecipeCardProps {
  recipe: Recipe;
}

const DEFAULT_IMAGE = "/images/default-recipe.jpg"; // ensure exists in public/

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const {
    id,
    title,
    slug,
    rating,
    isFree,
    imageUrl,
  } = recipe;

  const hasValidLink = Boolean(slug);
  const href = slug ? `/receptek/${slug}` : undefined;

  // Accessible label for rating
  const ratingLabel = `Értékelés: ${rating} az 5-ből`;

  // Accessible label for free/locked
  const accessLabel = isFree ? "Ingyenes recept" : "Zárolt recept";

  return (
    <article className="group">
      {hasValidLink ? (
        <Link
          href={href!}
          className="
            block rounded-lg overflow-hidden shadow-md 
            hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-400 
            transition
          "
        >
          {/* Image container */}
          <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800">
            <Image
              src={imageUrl || DEFAULT_IMAGE}
              alt={title || "Recept képe"}
              fill
              className="object-cover object-center"
              // Optionally add placeholder blur if you have blurDataURL
              // placeholder={imageBlurData ? 'blur' : undefined}
              // blurDataURL={imageBlurData}
            />
            {/* Free/Locked badge */}
            <div className="absolute top-2 right-2">
              <span className="sr-only">{accessLabel}</span>
              {isFree ? (
                <span aria-hidden="true" className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                  INGYENES
                </span>
              ) : (
                <span aria-hidden="true" className="p-1 bg-red-500 text-white rounded-full">
                  <Lock size={12} />
                </span>
              )}
            </div>
          </div>

          {/* Card body */}
          <div className="p-4 bg-white dark:bg-gray-900">
            {/* Title */}
            <h3
              className="text-lg font-semibold truncate group-hover:text-pink-600 transition"
              title={title || undefined}
            >
              {title || "Nincs cím"}
            </h3>
            {/* Rating */}
            <div
              className="flex items-center mt-1"
              aria-label={ratingLabel}
            >
              {[...Array(5)].map((_, i) => {
                const filled = i < rating;
                return (
                  <Star
                    key={i}
                    size={16}
                    fill={filled ? "currentColor" : "none"}
                    className={filled ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}
                    aria-hidden="true"
                  />
                );
              })}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                ({rating}.0)
              </span>
            </div>
          </div>
        </Link>
      ) : (
        // If no valid link, render a non-clickable card (could style differently or not render at all)
        <div
          className="
            block rounded-lg overflow-hidden shadow-md 
            bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-70
          "
          aria-disabled="true"
        >
          <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700">
            <Image
              src={imageUrl || DEFAULT_IMAGE}
              alt={title || "Recept képe"}
              fill
              className="object-cover object-center"
            />
            <div className="absolute top-2 right-2">
              <span className="sr-only">{accessLabel}</span>
              {isFree ? (
                <span aria-hidden="true" className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                  INGYENES
                </span>
              ) : (
                <span aria-hidden="true" className="p-1 bg-red-500 text-white rounded-full">
                  <Lock size={12} />
                </span>
              )}
            </div>
          </div>
          <div className="p-4">
            <h3
              className="text-lg font-semibold truncate"
              title={title || undefined}
            >
              {title || "Nincs cím"}
            </h3>
            <div
              className="flex items-center mt-1"
              aria-label={ratingLabel}
            >
              {[...Array(5)].map((_, i) => {
                const filled = i < rating;
                return (
                  <Star
                    key={i}
                    size={16}
                    fill={filled ? "currentColor" : "none"}
                    className={filled ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}
                    aria-hidden="true"
                  />
                );
              })}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                ({rating}.0)
              </span>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default RecipeCard;
