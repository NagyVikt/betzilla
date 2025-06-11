// components/Search/FilterControls.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// --- TYPE DEFINITIONS ---
interface FilterControlsProps {
  categories: { name: string; slug: string }[];
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

// --- HELPER COMPONENTS ---

/** A visual container for a section within the filter controls. */
const FilterSection = ({ title, children }: FilterSectionProps) => (
  <div className="py-6 border-b border-gray-200/80 dark:border-gray-700/60">
    <h4 className="text-sm font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 mb-4">
      {title}
    </h4>
    {children}
  </div>
);

/** An interactive star component for the rating filter. */
const Star = ({ filled, onClick }: { filled: boolean; onClick: () => void }) => (
  <svg
    onClick={onClick}
    className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
      filled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
    }`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);


// --- MAIN FILTER COMPONENT ---
export default function FilterControls({ categories }: FilterControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [isFree, setIsFree] = useState(false);

  useEffect(() => {
    const categoriesFromUrl = searchParams.get('category')?.split(',').filter(Boolean) || [];
    setSelectedCategories(categoriesFromUrl);
    setSelectedRating(parseInt(searchParams.get('rating') || '0', 10));
    setIsFree(searchParams.get('isFree') === 'true');
  }, [searchParams]);

  const updateParams = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    router.push(`?${newParams.toString()}`, { scroll: false });
  };
  
  const handleCategoryToggle = (slug: string) => {
    const updatedCategories = selectedCategories.includes(slug)
      ? selectedCategories.filter(c => c !== slug)
      : [...selectedCategories, slug];
    updateParams('category', updatedCategories.length > 0 ? updatedCategories.join(',') : null);
  };
  
  const handleRatingChange = (newRating: number) => {
    const newSelectedRating = selectedRating === newRating ? 0 : newRating;
    updateParams('rating', newSelectedRating > 0 ? newSelectedRating.toString() : null);
  };

  const handleIsFreeToggle = () => {
    updateParams('isFree', !isFree ? 'true' : null);
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-200/80 dark:border-gray-700/60 w-full">
      <div className="flex justify-between items-center mb-2">
         <h3 className="text-xl font-bold text-gray-900 dark:text-white">Szűrők</h3>
         <button 
           onClick={() => router.push('?query=' + (searchParams.get('query') || ''))}
           className="text-sm font-medium text-pink-600 hover:text-pink-800 dark:hover:text-pink-400 transition"
          >
            Törlés
          </button>
      </div>
      
      {/* Categories Section */}
      <FilterSection title="Kategóriák">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const isSelected = selectedCategories.includes(c.slug);
            return (
              <button
                key={c.slug}
                onClick={() => handleCategoryToggle(c.slug)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span>{c.name}</span>
                {isSelected && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Rating Section */}
      <FilterSection title="Minimális Értékelés">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              filled={star <= selectedRating}
              onClick={() => handleRatingChange(star)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Other Options Section */}
{/* Other Options Section */}
<FilterSection title="Egyéb Opciók">
  <label htmlFor="isFree-toggle" className="flex items-center justify-between cursor-pointer">
    <span className="font-semibold text-gray-700 dark:text-gray-300">Csak ingyenes</span>
    <div className="relative">
      <input 
        id="isFree-toggle" 
        type="checkbox" 
        className="sr-only peer"
        checked={isFree}
        onChange={handleIsFreeToggle}
      />

      {/* OFF‐state track gets a light bg + border */}
      <div
        className="
          w-11 h-6
          bg-gray-200        /* light‐mode off */
          dark:bg-gray-700   /* dark‐mode off */
          border border-gray-300 dark:border-gray-600
          rounded-full
          transition-colors
          peer-focus:outline-none
          peer-focus:ring-2 peer-focus:ring-pink-500
          peer-checked:bg-pink-600
        "
      />

      {/* Thumb */}
      <div
        className="
          absolute left-1 top-1
          h-4 w-4
          bg-white
          border border-gray-300 dark:border-gray-600
          rounded-full
          transition-transform
          peer-checked:translate-x-5
          peer-checked:border-white
        "
      />
    </div>
  </label>
</FilterSection>

    </div>
  );
}
