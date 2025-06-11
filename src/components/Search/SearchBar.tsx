// components/Search/SearchBar.tsx
"use client";

import React, {
  useState,
  useEffect,
  useRef,
  FormEvent,
  KeyboardEvent,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Fuse from "fuse.js";

interface RecipeSuggestion {
  id: number;
  title: string;
  slug: string;
}

const SearchBar: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramQuery = searchParams.get("query") || "";

  const [query, setQuery] = useState<string>(paramQuery);
  const [suggestions, setSuggestions] = useState<RecipeSuggestion[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fuse, setFuse] = useState<Fuse<RecipeSuggestion> | null>(null);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "";
  const collectionName = "recepteks";
  const SUGGESTION_LIMIT = 5;

  // (A) ON MOUNT: LOAD ALL RECIPES FOR FUSE.JS
  useEffect(() => {
    const loadAllForFuse = async () => {
      if (!strapiUrl) return;

      try {
        const res = await fetch(
          `${strapiUrl}/api/${collectionName}` +
            `?fields[0]=id&fields[1]=title&fields[2]=slug&pagination[limit]=1000&populate=false` // Added populate=false if not needed for suggestions
        );
        if (!res.ok) {
          console.error(
            "Error loading all recipes for Fuse:",
            res.status,
            res.statusText
          );
          return;
        }
        const json = await res.json();
        const allItems: RecipeSuggestion[] = (json.data || []).map(
          (item: any) => ({
            id: item.id,
            // Ensure `item.attributes` is accessed if that's Strapi v4 structure
            title: item.attributes?.title || item.title, 
            slug: item.attributes?.slug || item.slug,
          })
        );

        const fuseInstance = new Fuse(allItems, {
          keys: ["title"],
          threshold: 0.3,
        });
        setFuse(fuseInstance);
      } catch (err) {
        console.error("Error setting up Fuse:", err);
      }
    };

    loadAllForFuse();
  }, [strapiUrl, collectionName]); // Added collectionName as it's used in the fetch URL

  // (B) SYNC LOCAL `query` STATE TO URL `?query=` PARAM.
  useEffect(() => {
    if (paramQuery !== query) {
      setQuery(paramQuery);
    }
  }, [paramQuery]); // Removed `query` from dependencies as it caused issues in previous thought process.
                  // This effect should ONLY run when `paramQuery` (from URL) changes.

  // (C) FETCH SUGGESTIONS
  const fetchSuggestions = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setIsDropdownOpen(false); // Close dropdown if search term is cleared
      return;
    }

    // (C1) Fuse.js client-side fuzzy search
    if (fuse && searchTerm.trim().length >= 1) { // Lowered threshold for Fuse to trigger sooner
      const fuseResults = fuse.search(searchTerm.trim(), {
        limit: SUGGESTION_LIMIT,
      });
      const items = fuseResults.map((result) => result.item);
      setSuggestions(items);
      setIsLoading(false); // Ensure loading is false if Fuse is used
      if (items.length > 0) setIsDropdownOpen(true); // Open dropdown if Fuse has results
      return;
    }

    // (C2) Fall back to Strapi $containsi lookup
    if (!strapiUrl) {
      console.error("NEXT_PUBLIC_STRAPI_URL is not defined.");
      setSuggestions([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    try {
      const endpoint =
        `${strapiUrl}/api/${collectionName}` +
        `?filters[title][$containsi]=${encodeURIComponent(searchTerm)}` +
        `&pagination[limit]=${SUGGESTION_LIMIT}` +
        `&fields[0]=title&fields[1]=slug&fields[2]=id&populate=false`; // Added populate=false

      const res = await fetch(endpoint);

      if (!res.ok) {
        console.error("Strapi fetch error:", res.status, res.statusText);
        setSuggestions([]);
      } else {
        const json = await res.json();
        const items: RecipeSuggestion[] = (json.data || []).map(
          (item: any) => ({
            id: item.id,
            // Ensure `item.attributes` is accessed if that's Strapi v4 structure
            title: item.attributes?.title || item.title,
            slug: item.attributes?.slug || item.slug,
          })
        );
        setSuggestions(items);
        if (items.length > 0) setIsDropdownOpen(true); // Open dropdown if Strapi has results
        else setIsDropdownOpen(false); // Close if no results
      }
    } catch (err) {
      console.error("Error fetching suggestions from Strapi:", err);
      setSuggestions([]);
    }
    setIsLoading(false);
  };

  // (D) DEBOUNCE EFFECT
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (!query.trim()) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    // Only set loading if we are actually going to fetch (not handled by Fuse immediately)
    // if (!fuse || query.trim().length < 1) { // Adjusted condition based on C1
    //   setIsLoading(true); // This might be too aggressive, fetchSuggestions handles its own loading
    // }


    debounceTimeout.current = setTimeout(() => {
      // setIsLoading(true); // fetchSuggestions will handle its own isLoading states
      fetchSuggestions(query.trim());
      // setIsDropdownOpen(true); // fetchSuggestions will open dropdown if results are found
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query, fuse]); // `fetchSuggestions` is stable, so not needed here if it's memoized, but it's not.
                     // `strapiUrl` and `collectionName` are implicitly part of `fetchSuggestions` logic.

  // (E) CLOSE DROPDOWN IF USER CLICKS OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        // Also check if the click is outside the dropdown itself
        !(e.target as HTMLElement).closest(".suggestions-dropdown")
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // (F) ON FORM SUBMIT (e.g. Enter key)
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    if (debounceTimeout.current) { // Clear debounce if form is submitted
        clearTimeout(debounceTimeout.current);
    }
    setIsDropdownOpen(false);
    router.push(`/search?query=${encodeURIComponent(query.trim())}`);
  };

  // (G) WHEN A SUGGESTION IS CLICKED
  const handleSuggestionClick = (suggestion: RecipeSuggestion) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current); // Clear pending fetch from typing
    }
    
    const newQuery = suggestion.title;
    setQuery(newQuery); // Update input field optimistically
    setIsDropdownOpen(false); // Close dropdown

    // Navigate to perform the search
    // This is the critical part. If this navigation doesn't properly update
    // the URL, or if useSearchParams() is stale in the next render,
    // the useEffect syncing paramQuery to query might revert the input field.
    router.push(`/search?query=${encodeURIComponent(newQuery)}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 relative">
      <form onSubmit={handleSubmit} role="search">
        <div className="relative">
          <input
            ref={inputRef}
            type="search" // Changed to type="search" for better semantics
            placeholder="Keresés receptre, vagy hozzávalóra..."
            value={query}
            onChange={(e) => {
                setQuery(e.target.value);
                // if (e.target.value.trim() && suggestions.length > 0) {
                //    setIsDropdownOpen(true); // Keep open if typing and results exist
                // } else if (!e.target.value.trim()) {
                //    setIsDropdownOpen(false); // Close if input cleared
                // }
            }}
            onFocus={() => {
              if (query.trim() && suggestions.length > 0) { // Only open on focus if there's text and suggestions
                setIsDropdownOpen(true);
              }
            }}
            className="
             w-full pl-6 pr-32 py-3 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-300
            "
          />
          <button
            type="submit"
            aria-label="Keresés" // Added aria-label for accessibility
            className="
              absolute right-1.5 top-1/2 -translate-y-1/2 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-300
            "
          >
            Keresés
          </button>
        </div>
      </form>

      {isDropdownOpen && suggestions.length > 0 && (
        <ul 
            className="suggestions-dropdown absolute z-50 w-full bg-white dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto"
            role="listbox"
        >
          {suggestions.map((item) => (
            <li key={item.id} role="option" aria-selected={false /* Basic, can be enhanced */}>
              <button
                type="button" // Explicitly set type to button
                onClick={() => handleSuggestionClick(item)}
                className="
                  w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 
                  hover:bg-pink-50 dark:hover:bg-gray-700 transition-colors
                  focus:outline-none focus:bg-pink-100 dark:focus:bg-gray-700
                "
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      )}

      {isLoading && (
        <div className="absolute top-full left-0 mt-2 flex w-full items-center justify-center" role="status" aria-live="polite">
          <svg
            className="animate-spin h-5 w-5 text-pink-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
           <span className="sr-only">Loading...</span> {/* For screen readers */}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
