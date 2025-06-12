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

interface SearchBarProps {
  /** Placeholder text for the input. Default: "Keresés receptre, vagy hozzávalóra..." */
  placeholder?: string;
  /** Text for the submit button. Default: "Keresés" */
  buttonText?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Keresés receptre, vagy hozzávalóra...",
  buttonText = "Keresés",
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramQuery = searchParams.get("query") || "";

  const [query, setQuery] = useState<string>(paramQuery);
  const [suggestions, setSuggestions] = useState<RecipeSuggestion[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fuse, setFuse] = useState<Fuse<RecipeSuggestion> | null>(null);

  // For keyboard navigation in suggestions
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

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
            `?fields[0]=id&fields[1]=title&fields[2]=slug&pagination[limit]=1000&populate=false`
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
            title: item.attributes?.title || item.title,
            slug: item.attributes?.slug || item.slug,
          })
        );

        const fuseInstance = new Fuse(allItems, {
          keys: ["title"],
          threshold: 0.3,
          includeMatches: true,
        });
        setFuse(fuseInstance);
      } catch (err) {
        console.error("Error setting up Fuse:", err);
      }
    };

    loadAllForFuse();
  }, [strapiUrl, collectionName]);

  // (B) SYNC LOCAL `query` STATE TO URL `?query=` PARAM.
  useEffect(() => {
    setQuery(paramQuery);
  }, [paramQuery]);
  

  // (C) FETCH SUGGESTIONS
  const fetchSuggestions = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      setActiveIndex(-1);
      return;
    }

    // (C1) Fuse.js client-side fuzzy search
    if (fuse && searchTerm.trim().length >= 1) {
      const fuseResults = fuse.search(searchTerm.trim(), {
        limit: SUGGESTION_LIMIT,
      });
      const items = fuseResults.map((result) => result.item);
      setSuggestions(items);
      setIsLoading(false);
      if (items.length > 0) {
        setIsDropdownOpen(true);
        setActiveIndex(0);
      } else {
        setIsDropdownOpen(false);
        setActiveIndex(-1);
      }
      return;
    }

    // (C2) Fall back to Strapi lookup
    if (!strapiUrl) {
      console.error("NEXT_PUBLIC_STRAPI_URL is not defined.");
      setSuggestions([]);
      setIsLoading(false);
      setActiveIndex(-1);
      return;
    }
    setIsLoading(true);

    try {
      const endpoint =
        `${strapiUrl}/api/${collectionName}` +
        `?filters[title][$containsi]=${encodeURIComponent(searchTerm)}` +
        `&pagination[limit]=${SUGGESTION_LIMIT}` +
        `&fields[0]=title&fields[1]=slug&fields[2]=id&populate=false`;

      const res = await fetch(endpoint);

      if (!res.ok) {
        console.error("Strapi fetch error:", res.status, res.statusText);
        setSuggestions([]);
        setIsDropdownOpen(false);
        setActiveIndex(-1);
      } else {
        const json = await res.json();
        const items: RecipeSuggestion[] = (json.data || []).map(
          (item: any) => ({
            id: item.id,
            title: item.attributes?.title || item.title,
            slug: item.attributes?.slug || item.slug,
          })
        );
        setSuggestions(items);
        if (items.length > 0) {
          setIsDropdownOpen(true);
          setActiveIndex(0);
        } else {
          setIsDropdownOpen(false);
          setActiveIndex(-1);
        }
      }
    } catch (err) {
      console.error("Error fetching suggestions from Strapi:", err);
      setSuggestions([]);
      setIsDropdownOpen(false);
      setActiveIndex(-1);
    } finally {
      setIsLoading(false);
    }
  };

  // (D) DEBOUNCE EFFECT
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (!query.trim()) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      setActiveIndex(-1);
      return;
    }

    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(query.trim());
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query, fuse]);

  // (E) CLOSE DROPDOWN IF USER CLICKS OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        inputRef.current &&
        !inputRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsDropdownOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // (F) ON FORM SUBMIT (Enter key when no suggestion selected)
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    setIsDropdownOpen(false);
    setActiveIndex(-1);
    router.push(`/search?query=${encodeURIComponent(query.trim())}`);
  };

  // (G) WHEN A SUGGESTION IS CLICKED
  const handleSuggestionClick = (suggestion: RecipeSuggestion) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    const newQuery = suggestion.title;
    setQuery(newQuery);
    setIsDropdownOpen(false);
    setActiveIndex(-1);
    router.push(`/search?query=${encodeURIComponent(newQuery)}`);
  };

  // (H) Keyboard navigation in the input
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen || suggestions.length === 0) {
      if (e.key === "ArrowDown" && suggestions.length > 0) {
        // Open dropdown if closed and suggestions exist
        setIsDropdownOpen(true);
        setActiveIndex(0);
        e.preventDefault();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev + 1;
        return next >= suggestions.length ? 0 : next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev - 1;
        return next < 0 ? suggestions.length - 1 : next;
      });
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        e.preventDefault();
        handleSuggestionClick(suggestions[activeIndex]);
      }
      // Otherwise, allow form submit
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
      setActiveIndex(-1);
    }
  };

  // Compute aria-activedescendant id if open
  const activeId =
    isDropdownOpen && activeIndex >= 0 && activeIndex < suggestions.length
      ? `search-suggestion-${suggestions[activeIndex].id}`
      : undefined;

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 relative">
      <form onSubmit={handleSubmit} role="search">
        <div className="relative">
          <label htmlFor="search-input" className="sr-only">
            {placeholder}
          </label>
          <input
            id="search-input"
            ref={inputRef}
            type="search"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            onFocus={() => {
              if (query.trim() && suggestions.length > 0) {
                setIsDropdownOpen(true);
                setActiveIndex(0);
              }
            }}
            onKeyDown={handleKeyDown}
            aria-expanded={isDropdownOpen}
            aria-controls="search-suggestions"
            aria-activedescendant={activeId}
            className="
             w-full pl-6 pr-32 py-3 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full 
             focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-300
            "
          />
          <button
            type="submit"
            aria-label={buttonText}
            className="
              absolute right-1.5 top-1/2 -translate-y-1/2 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-300
            "
          >
            {buttonText}
          </button>
        </div>
      </form>

      {isDropdownOpen && suggestions.length > 0 && (
        <ul
          id="search-suggestions"
          ref={dropdownRef}
          className="suggestions-dropdown absolute z-50 w-full bg-white dark:bg-gray-800 border border-pink-200 dark:border-gray-700 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto"
          role="listbox"
        >
          {suggestions.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <li
                key={item.id}
                id={`search-suggestion-${item.id}`}
                role="option"
                aria-selected={isActive}
                className={isActive ? "bg-pink-50 dark:bg-gray-700" : ""}
              >
                <button
                  type="button"
                  onClick={() => handleSuggestionClick(item)}
                  className={`
                    w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 
                    hover:bg-pink-50 dark:hover:bg-gray-700 transition-colors
                    focus:outline-none
                    ${isActive ? "font-semibold" : ""}
                  `}
                >
                  {item.title}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {isLoading && (
        <div
          className="absolute top-full left-0 mt-2 flex w-full items-center justify-center"
          role="status"
          aria-live="polite"
        >
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
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
