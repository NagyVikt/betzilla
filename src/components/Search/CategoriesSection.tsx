// components/CategoriesSection.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";

interface SubCategoryItem {
  label: string;
  href: string;
}

interface Category {
  title: string;
  imageSrc: string;
  subItems: SubCategoryItem[];
}

const categories: Category[] = [
  {
    title: "KENYÉR",
    imageSrc: "/images/categories/kenyer.jpg",
    subItems: [
      { label: "kovászos kenyér", href: "/category/kovaszos-kenyer" },
      { label: "házi kenyér", href: "/category/hazi-kenyer" },
      { label: "krumplis kenyér", href: "/category/krumplis-kenyer" },
      { label: "glutén­mentes kenyér", href: "/category/glutenmentes-kenyer" },
    ],
  },
  {
    title: "FÁNK",
    imageSrc: "/images/categories/fank.jpg",
    subItems: [
      { label: "csöröge fánk", href: "/category/csoroge-fank" },
      { label: "képviselő fánk", href: "/category/képviselő-fank" },
      { label: "rózsafánk", href: "/category/rozsafank" },
      { label: "túrófánk", href: "/category/turofank" },
      { label: "szalagos fánk", href: "/category/szalagos-fank" },
    ],
  },
  {
    title: "POGÁCSA",
    imageSrc: "/images/categories/pogacsa.jpg",
    subItems: [
      { label: "krumplis pogácsa", href: "/category/krumplis-pogacsa" },
      { label: "sajtos pogácsa", href: "/category/sajtos-pogacsa" },
      { label: "hajtogatott pogácsa", href: "/category/hajtogatott-pogacsa" },
      { label: "tepertős pogácsa", href: "/category/tepertos-pogacsa" },
      { label: "túrós pogácsa", href: "/category/turos-pogacsa" },
    ],
  },
  {
    title: "KALÁCS",
    imageSrc: "/images/categories/kalacs.jpg",
    subItems: [
      { label: "borsos kalács", href: "/category/borsós-kalacs" },
      { label: "diós kalács", href: "/category/dios-kalacs" },
      { label: "mézes kalács", href: "/category/mézes-kalacs" },
    ],
  },
  {
    title: "CSIGA",
    imageSrc: "/images/categories/csiga.jpg",
    subItems: [
      { label: "fahéjas csiga", href: "/category/fahéjas-csiga" },
      { label: "kakaós csiga", href: "/category/kakaós-csiga" },
      { label: "bokros csiga", href: "/category/bokros-csiga" },
    ],
  },
  {
    title: "KUGLÓF",
    imageSrc: "/images/categories/kuglof.jpg",
    subItems: [
      { label: "csokis kuglóf", href: "/category/csokis-kuglof" },
      { label: "diós kuglóf", href: "/category/dios-kuglof" },
      { label: "gyümölcsös kuglóf", href: "/category/gyumolcsos-kuglof" },
    ],
  },
];

const CategoriesSection: React.FC = () => {
  return (
    <section className="w-full mx-auto mt-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Kategóriák
      </h2>

      {categories.map((cat) => (
        <div key={cat.title} className="mb-10">
          <h3 className="text-xl font-medium text-orange-600 mb-4">
            {cat.title}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Left: Category Image */}
            <div className="relative h-48 rounded-xl overflow-hidden shadow-md">
              <Image
                src={cat.imageSrc}
                alt={cat.title}
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Right: Sub‐category Links */}
            <div className="sm:col-span-1 md:col-span-2 lg:col-span-3 flex flex-wrap gap-4 items-center justify-start">
              {cat.subItems.map((sub) => (
                <Link
                  key={sub.label}
                  href={sub.href}
                  className="text-orange-600 hover:underline font-medium text-base"
                >
                  {sub.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default CategoriesSection;
