// components/Search/CategoriesSection.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface SubCategoryItem {
  label: string;
  href: string;
}

export interface Category {
  title: string;
  imageSrc: string;
  subItems: SubCategoryItem[];
}

interface CategoriesSectionProps {
  /**
   * Optional array of categories to render.
   * If provided, the component will use these and skip fetching.
   * If not provided, the component will attempt to fetch from NEXT_PUBLIC_API_URL.
   */
  categories?: Category[];
}

const SkeletonCategories: React.FC = () => {
  const placeholderCount = 4;
  return (
    <section className="w-full mx-auto mt-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Kategóriák
      </h2>
      <div className="space-y-10">
        {Array.from({ length: placeholderCount }).map((_, idx) => (
          <div key={idx} className="mb-10">
            <h3 className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4 animate-pulse"></h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden shadow-md animate-pulse" />
              <div className="sm:col-span-1 md:col-span-2 lg:col-span-3 flex flex-wrap gap-4 items-center">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories: propCategories }) => {
  const [categories, setCategories] = useState<Category[]>(propCategories || []);
  const [loading, setLoading] = useState<boolean>(!propCategories);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If props provide categories, use them directly
    if (propCategories) {
      setCategories(propCategories);
      setLoading(false);
      return;
    }
    // Otherwise, fetch from API
    const fetchCategories = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error("NEXT_PUBLIC_API_URL is not defined");
        }
        const res = await fetch(`${apiUrl}/api/categories`);
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        const json = await res.json();
        // Adapt this mapping according to your API response shape
        // Example for Strapi v4: json.data is array, each item has attributes.title, attributes.imageUrl, attributes.subItems
        const data: Category[] = (json.data || []).map((item: any) => ({
          title: item.attributes?.title || "",
          imageSrc: item.attributes?.imageUrl || "/images/default-category.jpg",
          subItems: (item.attributes?.subItems || []).map((sub: any) => ({
            label: sub.label,
            href: sub.href,
          })),
        }));
        setCategories(data);
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [propCategories]);

  if (loading) {
    return <SkeletonCategories />;
  }

  return (
    <section className="w-full mx-auto mt-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Kategóriák
      </h2>
      {error ? (
        <p className="text-red-600 dark:text-red-400">Hiba történt: {error}</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">Nincsenek elérhető kategóriák.</p>
      ) : (
        categories.map((cat) => (
          <div key={cat.title} className="mb-10">
            <h3 className="text-xl font-medium text-orange-600 mb-4">
              {cat.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Category Image */}
              <div className="relative h-48 rounded-xl overflow-hidden shadow-md">
                <Image
                  src={cat.imageSrc}
                  alt={cat.title || "Kategória képe"}
                  fill
                  className="object-cover object-center"
                />
              </div>
              {/* Sub‐category Links */}
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
        ))
      )}
    </section>
  );
};

export default CategoriesSection;
