"use client";

import React, { useState, useEffect, useRef } from "react";
import throttle from "lodash/throttle";
import clsx from "clsx";

// Interface for defining a section's properties
interface Section {
  id: string;
  top: number;
  label: string;
}

// Props interface now includes slug
interface ScrollProgressHeaderProps {
  slug: string;
}

/**
 * A sticky header component that displays a reading progress bar and a table of contents.
 * It tracks scroll progress, highlights the current section, and allows smooth scrolling to any section.
 * This version dynamically accounts for the main site header's height.
 */
export default function ScrollProgressHeader({ slug }: ScrollProgressHeaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentSectionLabel, setCurrentSectionLabel] = useState("");
  const [currentSectionId, setCurrentSectionId] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mainHeaderHeight, setMainHeaderHeight] = useState(0);

  // Use a ref to store sections to avoid re-renders and have the latest data in scroll listeners
  const sectionsRef = useRef<Section[]>([]);
  const componentHeaderRef = useRef<HTMLDivElement>(null);

  // --- HOOKS ---

  // Effect 1: Detect main site header height
  useEffect(() => {
    const calculateHeaderHeight = () => {
      // Find the main site header, often marked with role="banner" or just the <header> tag
      const mainHeaderEl = document.querySelector<HTMLElement>(
        'header[role="banner"], body > header'
      );
      setMainHeaderHeight(mainHeaderEl?.clientHeight || 0);
    };

    calculateHeaderHeight();
    window.addEventListener("resize", calculateHeaderHeight);
    return () => window.removeEventListener("resize", calculateHeaderHeight);
  }, []);

  // Effect 2: Collect all target sections from the DOM
  // Include `slug` in dependencies so that when slug changes, we re-collect sections
  useEffect(() => {
    const collectSections = () => {
      const collectedSections = Array.from(
        document.querySelectorAll<HTMLElement>("section[id]")
      ).map((section) => ({
        id: section.id,
        top: section.getBoundingClientRect().top + window.scrollY,
        label:
          section.querySelector("h2")?.textContent?.trim() ||
          section.getAttribute("aria-label") ||
          section.id,
      }));

      collectedSections.sort((a, b) => a.top - b.top);
      sectionsRef.current = collectedSections;
      setSections(collectedSections);
      updateCurrentSection(window.scrollY);
    };

    // Run after a short delay to ensure other page elements have rendered
    const timeoutId = setTimeout(collectSections, 100);
    const debouncedCollect = throttle(collectSections, 200);
    window.addEventListener("resize", debouncedCollect);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", debouncedCollect);
      debouncedCollect.cancel();
    };
  }, [slug, mainHeaderHeight]); // also re-run if mainHeaderHeight changes

  // Effect 3: Combined scroll handler for progress and current section
  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollTop = window.scrollY;
      const { scrollHeight, clientHeight } = document.documentElement;
      const totalScrollableHeight = scrollHeight - clientHeight;
      setProgress(
        totalScrollableHeight > 0
          ? (scrollTop / totalScrollableHeight) * 100
          : 0
      );
      updateCurrentSection(scrollTop);
    }, 100);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      handleScroll.cancel();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mainHeaderHeight]); // Re-bind if header height changes

  // Effect 4: Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        componentHeaderRef.current &&
        !componentHeaderRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- HELPERS ---

  /** Gets the total height of all sticky headers. */
  const getTotalStickyOffset = () => {
    const thisHeaderHeight = componentHeaderRef.current?.clientHeight || 0;
    return mainHeaderHeight + thisHeaderHeight;
  };

  /** Determines the current section based on scroll position. */
  const updateCurrentSection = (scrollTop: number) => {
    const scrollOffset = scrollTop + getTotalStickyOffset() + 20; // Add margin for better timing

    const activeSection = sectionsRef.current.find((section, index) => {
      const nextSection = sectionsRef.current[index + 1];
      return (
        scrollOffset >= section.top &&
        (!nextSection || scrollOffset < nextSection.top)
      );
    });

    if (activeSection) {
      setCurrentSectionId(activeSection.id);
      setCurrentSectionLabel(activeSection.label);
    } else if (sectionsRef.current.length > 0) {
      // If scrolled above first section, reset label or pick first
      setCurrentSectionLabel(sectionsRef.current[0].label);
      setCurrentSectionId("");
    }
  };

  /** Smoothly scrolls the page to a given section ID, accounting for all headers. */
  const handleGoToSection = (id: string) => {
    setIsExpanded(false);
    const sectionElement = document.getElementById(id);
    if (sectionElement) {
      const elementPosition = sectionElement.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition +
        window.scrollY -
        getTotalStickyOffset() -
        16; // Extra margin

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // --- RENDER ---
  const tocTitle = "Tartalomjegyzék";

  return (
    <div
      ref={componentHeaderRef}
      className="sticky w-full z-40" // z-40 to be below a main z-50 header
      style={{ top: `${mainHeaderHeight}px` }} // Dynamically set top position
    >
      <div className="relative w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm">
        <div
          onClick={() => setIsExpanded((e) => !e)}
          className="header-content flex items-center justify-between px-4 sm:px-6 py-3 cursor-pointer select-none group border-b border-gray-200 dark:border-gray-700/60"
        >
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
            {isExpanded ? tocTitle : currentSectionLabel || tocTitle}
          </span>
          <svg
            className={clsx(
              "w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ease-in-out",
              isExpanded && "rotate-180"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        <div className="w-full h-1">
          <div
            className="h-1 bg-gradient-to-r from-pink-400 to-rose-500 transition-[width] duration-150 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div
          className={clsx(
            "absolute top-full right-4 mt-2 w-72 origin-top-right transition-all duration-200 ease-out",
            isExpanded
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          )}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <ol className="divide-y divide-gray-200 dark:divide-gray-700">
              {sections.map((section, idx) => (
                <li key={section.id}>
                  <button
                    onClick={() => handleGoToSection(section.id)}
                    className={clsx(
                      "w-full flex items-center gap-4 px-4 py-3 text-left transition-colors duration-150",
                      section.id === currentSectionId
                        ? "bg-pink-50 dark:bg-pink-900/40"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    )}
                  >
                    <span
                      className={clsx(
                        "text-xs font-bold w-5 text-center",
                        section.id === currentSectionId
                          ? "text-pink-600 dark:text-pink-400"
                          : "text-gray-400 dark:text-gray-500"
                      )}
                    >
                      {idx + 1}
                    </span>
                    <span
                      className={clsx(
                        "flex-1 text-sm font-medium",
                        section.id === currentSectionId
                          ? "text-pink-700 dark:text-pink-300"
                          : "text-gray-800 dark:text-gray-200"
                      )}
                    >
                      {section.label}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
