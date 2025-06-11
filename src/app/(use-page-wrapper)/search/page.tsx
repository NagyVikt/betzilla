import React, { Suspense } from "react";
import Link from "next/link";
import SearchBar from "@/components/Search/SearchBar";
import RecipeCardImage from "@/components/RecipeCardImage";
import FilterControls from "@/components/Search/FilterControls";

// --- TYPE DEFINITIONS ---
interface Recipe {
  id: number;
  title: string | null;
  slug: string | null;
  imageUrl: string | null;
}

interface SearchPageProps {
  searchParams?: {
    query?: string;
    category?: string;
    rating?: string;
    isFree?: string;
  };
}

// --- SKELETON LOADER COMPONENTS ---

/** A single placeholder card with a pulsing animation. */
function RecipeCardSkeleton() {
  return (
    <div className="group block rounded-lg overflow-hidden shadow-md">
      <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div className="p-4 bg-white dark:bg-gray-800">
        <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </div>
    </div>
  );
}

/** A grid of skeleton cards to show while results are loading. */
function RecipeGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** A placeholder to show when no search query is active. */
function SearchPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full lg:pt-16">
       <svg
        className="w-48 h-48 text-gray-300 dark:text-gray-500"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M30 110H170V160C170 168.284 163.284 175 155 175H45C36.7157 175 30 168.284 30 160V110Z" stroke="currentColor" strokeWidth="8" strokeLinejoin="round"/>
        <path d="M35 110V90C35 54.17 64.17 25 100 25C135.83 25 165 54.17 165 90V110" stroke="currentColor" strokeWidth="8" strokeLinejoin="round"/>
        <path d="M80 60V75" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        <path d="M100 55V75" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        <path d="M120 60V75" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      </svg>
      <h2 className="mt-6 text-2xl font-semibold text-gray-800 dark:text-white">
        Fedezd fel receptjeinket!
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Írj be egy kulcsszót a fenti keresőmezőbe, vagy használd a szűrőket.
      </p>
    </div>
  );
}

/** A placeholder to show when a search yields no results. */
function NoResults({ query }: { query: string }) {
  return (
    <div className="text-center col-span-full mt-8 flex flex-col items-center justify-center py-10">
      <svg 
        className="w-24 h-24 text-gray-400 dark:text-gray-500 mb-4" 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="8" y1="15" x2="16" y2="15"></line>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
      </svg>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Sajnos nincs találat
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md">
        Nincs a keresésnek megfelelő recept: “<span className="font-semibold text-gray-700 dark:text-gray-300">{query}</span>”.
        Legyél te az első, aki feltölt egyet!
      </p>
      <Link
        href="/recept-feltoltes" // Assumed route for recipe uploads
        className="mt-6 inline-block bg-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-700 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        Új recept feltöltése
      </Link>
    </div>
  );
}


// --- DATA FETCHING & DISPLAY COMPONENT ---
// This component is wrapped in Suspense, so the skeleton will show while it fetches data.

async function RecipeResults({ searchParams }: SearchPageProps) {
  const query = searchParams?.query || "";
  const slugFromQuery = generateSlug(query);
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  // --- Build Strapi query ---
  const params = new URLSearchParams();
  if (query) {
    params.set("filters[$or][0][title][$containsi]", query);
    params.set("filters[$or][1][slug][$eq]", slugFromQuery);
  }
  params.set("fields[0]", "title");
  params.set("fields[1]", "slug");
  params.set("fields[2]", "id");
  params.set("populate", "banner");
  params.set("pagination[limit]", "20");

  const fetchUrl = `${strapiUrl}/api/recepteks?${params.toString()}`;
  console.log("Fetching from Strapi URL:", fetchUrl);

  // --- Fetch and process data ---
  try {
    const res = await fetch(fetchUrl, { cache: 'no-store' }); // Use no-store to ensure freshness on search
    if (!res.ok) {
        throw new Error(`Strapi API Error: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    const dataArray = Array.isArray(json.data) ? json.data : [];

    const recipes: Recipe[] = dataArray.map((item: any) => {
        const bannerData = item.banner;
        let rawUrl: string | null = null;
        if (bannerData && typeof bannerData.url === 'string') {
            rawUrl = bannerData.url;
        } else if (bannerData?.data?.attributes?.url) {
            rawUrl = bannerData.data.attributes.url;
        } else if (Array.isArray(bannerData?.data) && bannerData.data[0]?.attributes?.url) {
            rawUrl = bannerData.data[0].attributes.url;
        }
        const imageUrl = rawUrl ? (rawUrl.startsWith("http") ? rawUrl : `${strapiUrl}${rawUrl}`) : null;
        
        return {
            id: item.id,
            title: item.title || null,
            slug: item.slug || null,
            imageUrl,
        };
    });

    // --- Render results ---
    if (recipes.length === 0) {
      return <NoResults query={query} />;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((rec) => (
          <Link
            key={rec.id}
            href={rec.slug ? `/receptek/${rec.slug}` : '#'}
            className={`group block rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out ${!rec.slug ? 'pointer-events-none' : ''}`}
          >
            <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700">
              <RecipeCardImage
                imageUrl={rec.imageUrl}
                title={rec.title}
                strapiUrl={strapiUrl}
              />
            </div>
            <div className="p-4 bg-white dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-pink-600 transition-colors">
                {rec.title || "Nincs cím"}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Fetch error:", error);
    return <p className="text-center text-red-500 col-span-full mt-8">Hiba történt a receptek lekérése közben.</p>;
  }
}

// --- HELPER FUNCTION ---
function generateSlug(text: string): string {
    if (!text) return "";
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-");
}

// --- MAIN PAGE COMPONENT ---
export default async function SearchResultsPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.query || "";
  const categories = [
    { name: "Torta", slug: "torta" },
    { name: "Sütemény", slug: "sutemeny" },
    { name: "Leves", slug: "leves" },
    { name: "Főétel", slug: "foetel" },
  ];
  
  return (
    <main className="container mx-auto max-w-7xl py-8 px-4">
      <div className="mb-8">
        <SearchBar initialQuery={query} />
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 mb-8 lg:mb-0">
          <FilterControls categories={categories} />
        </aside>

        {/* Search Results or Placeholder */}
        <section className="lg:col-span-3">
          {query ? (
            <>
              <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Keresési eredmények: “{query}”
              </h1>
              <Suspense key={JSON.stringify(searchParams)} fallback={<RecipeGridSkeleton />}>
                <RecipeResults searchParams={searchParams} />
              </Suspense>
            </>
          ) : (
            <SearchPlaceholder />
          )}
        </section>
      </div>
    </main>
  );
}
