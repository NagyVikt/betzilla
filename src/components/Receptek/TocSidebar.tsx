// File: components/Receptek/TocSidebar.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type TocItem = {
  href: string;
  label: string;
  dataField: any;
  isStart?: boolean;
};

type Props = {
  items: TocItem[];
  /** Total time in minutes (or null). */
  totalTime: number | null;
  /** The slug of this recipe, used for saving. */
  slug: string;
};

const HEADER_HEIGHT = 64; // px; match your header’s height exactly

const TocSidebar: React.FC<Props> = ({ items, totalTime, slug }) => {
  const router = useRouter();

  // Check if “Leírás” (start target) exists
  const hasLeiras = items.some((it) => it.href === "#section-leiras");

  // Smooth scroll to #section-leiras
  const scrollToLeiras = () => {
    const el = document.querySelector<HTMLElement>("#section-leiras");
    if (el) {
      window.scrollTo({
        top: el.offsetTop - HEADER_HEIGHT,
        behavior: "smooth",
      });
    }
  };

  // Handle “Mentés” button click
  const handleSaveClick = async () => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      router.push("/belepes");
      return;
    }

    // Replace with your real “save” API logic
    try {
      const res = await fetch(`/api/save-recipe?slug=${encodeURIComponent(slug)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Hiba a mentés közben");
      alert("A recept elmentve!");
    } catch (err) {
      console.error(err);
      alert("Nem sikerült elmenteni a receptet. Kérlek, próbáld újra.");
    }
  };

  return (
    <AnimatePresence>
      {/* Only show on mobile (hidden on lg+) */}
      <motion.div
        className="
          fixed bottom-0 left-0 right-0 
          mx-auto w-full max-w-md 
          lg:hidden                /* hide on lg+ */
          z-50                     /* sit above everything else */
          pointer-events-none      /* only inner children accept clicks */
        "
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="pointer-events-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm dark:border-gray-100">
          <div className="grid grid-cols-12 items-center px-4 py-2 gap-x-2">
            {/* Column 1: Total Time */}
            <div className="col-span-3 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-pink-500 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l2 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs font-medium text-gray-800 dark:text-gray-100">
                {totalTime != null ? `${totalTime} perc` : "Idő: N/A"}
              </span>
            </div>

            {/* Column 2: “Kezdjünk bele” (only if “Leírás” exists) */}
            {hasLeiras ? (
              <button
                onClick={scrollToLeiras}
                className="
                  col-span-6
                  bg-pink-500 
                  hover:bg-pink-600 
                  text-white 
                  font-semibold 
                  py-2 
                  rounded-md 
                  shadow-md 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-pink-400
                  transition-colors 
                  duration-200
                "
              >
                Kezdjünk bele
              </button>
            ) : (
              <div className="col-span-6" />
            )}

            {/* Column 3: “Mentés” */}
            <button
              onClick={handleSaveClick}
              className="
                col-span-3
                bg-gray-100 
                hover:bg-gray-200 
                text-gray-800 
                dark:bg-gray-800 
                dark:text-gray-200 
                dark:hover:bg-gray-700 
                font-semibold 
                py-2 
                rounded-md 
                shadow-md 
                focus:outline-none 
                focus:ring-2 
                focus:ring-pink-400
                transition-colors 
                duration-200
              "
            >
              Recept mentése
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TocSidebar;
