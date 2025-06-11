// components/PopularSearches.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";

interface SearchItem {
  label: string;
  imageSrc: string;
  href: string;
}

const popularSearches: SearchItem[] = [
  {
    label: "csirkemáj",
    imageSrc: "/images/popular/csirkemaj.jpg",
    href: "/search?query=csirkemáj",
  },
  {
    label: "csirkemell",
    imageSrc: "/images/popular/csirkemell.jpg",
    href: "/search?query=csirkemell",
  },
  {
    label: "csirke felsőcomb",
    imageSrc: "/images/popular/csirke-felsocom.jpg",
    href: "/search?query=csirke+felsőcomb",
  },
  {
    label: "csirke alsócomb",
    imageSrc: "/images/popular/csirke-alsocomb.jpg",
    href: "/search?query=csirke+alsócomb",
  },
  {
    label: "grillcsirke",
    imageSrc: "/images/popular/grillcsirke.jpg",
    href: "/search?query=grillcsirke",
  },
  {
    label: "töltött csirkemell",
    imageSrc: "/images/popular/toltott-csirkemell.jpg",
    href: "/search?query=töltött+csirkemell",
  },
  {
    label: "csirkeszárny",
    imageSrc: "/images/popular/csirkeszarny.jpg",
    href: "/search?query=csirkeszárny",
  },
  {
    label: "epres tiramisu",
    imageSrc: "/images/popular/epres-tiramisu.jpg",
    href: "/search?query=epres+tiramisu",
  },
];

const PopularSearches: React.FC = () => {
  return (
    <section className="w-full mx-auto mt-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        A mai nap népszerű keresései
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        {popularSearches.map((item) => (
          <Link key={item.label} href={item.href}>
            <div className="relative h-40 rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition">
              <Image
                src={item.imageSrc}
                alt={item.label}
                fill
                className="object-cover object-center"
              />
              {/* Dark overlay behind text */}
              <div className="absolute inset-0 bg-black/25"></div>
              <span className="absolute bottom-3 left-3 text-white font-medium text-lg capitalize">
                {item.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PopularSearches;
