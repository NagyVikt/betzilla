// components/BannerCarousel.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Slide {
  id: number;
  src: string;
  alt: string;
}

interface BannerCarouselProps {
  slides: Slide[];
  /**
   * Whether to auto-play through slides.
   * Defaults to true.
   */
  autoPlay?: boolean;
  /**
   * Interval in milliseconds between auto-play transitions.
   * Defaults to 5000 (5 seconds).
   */
  autoPlayInterval?: number;
  /**
   * Optional className for the outer container
   */
  className?: string;
  /**
   * Optional height classes for the slide container.
   * E.g. "h-56 sm:h-72 md:h-96". Defaults to "h-56 sm:h-72 md:h-96".
   */
  heightClasses?: string;
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({
  slides,
  autoPlay = true,
  autoPlayInterval = 5000,
  className = "",
  heightClasses = "h-56 sm:h-72 md:h-96",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideCount = slides.length;
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Advance to next slide (with wrap-around)
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slideCount);
  };
  // Go to previous slide (with wrap-around)
  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
  };

  // Autoplay effect
  useEffect(() => {
    if (autoPlay && slideCount > 1) {
      // Clear any existing timer
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
      autoPlayRef.current = setTimeout(() => {
        goToNext();
      }, autoPlayInterval);

      // Cleanup on unmount or when dependencies change
      return () => {
        if (autoPlayRef.current) {
          clearTimeout(autoPlayRef.current);
        }
      };
    }
    return;
  }, [currentIndex, autoPlay, autoPlayInterval, slideCount]);

  // If no slides, render nothing or a placeholder
  if (!slides || slides.length === 0) {
    return null;
  }

  const slide = slides[currentIndex];

  return (
    <div className={`w-full mx-auto mt-8 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="relative overflow-hidden rounded-3xl shadow-lg">
        {/* Slide Image */}
        <div className={`relative w-full ${heightClasses}`}>
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover object-center"
            priority={currentIndex === 0} 
          />
          {/* Gradient overlay at bottom for text contrast */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
          {/* Slide caption/text */}
          <div className="absolute bottom-4 left-6 text-white font-semibold text-lg sm:text-xl md:text-2xl pointer-events-none">
            {slide.alt}
          </div>
        </div>

        {/* Prev/Next Buttons */}
        {slideCount > 1 && (
          <>
            <button
              onClick={() => {
                goToPrev();
              }}
              aria-label="Előző slide"
              className="
                absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full
                focus:outline-none focus:ring-2 focus:ring-white
                transition
              "
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => {
                goToNext();
              }}
              aria-label="Következő slide"
              className="
                absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full
                focus:outline-none focus:ring-2 focus:ring-white
                transition
              "
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Indicators (dots) */}
        {slideCount > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`
                  w-2 h-2 rounded-full 
                  ${idx === currentIndex ? "bg-white" : "bg-white/50 hover:bg-white"}
                  transition
                `}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerCarousel;
