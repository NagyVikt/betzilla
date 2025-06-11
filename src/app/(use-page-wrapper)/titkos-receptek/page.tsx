import React, { Suspense } from 'react';
import Link from 'next/link';
import { Search, Lock, Salad, Soup, Cake, ChefHat } from 'lucide-react';

// --- TYPE DEFINITIONS ---
// Added 'isLocked' to the Recipe interface to handle premium content.
interface Recipe {
  id: number;
  title: string;
  slug: string;
  imageUrl: string;
  isLocked: boolean;
  category: string;
}

interface SearchPageProps {
  searchParams?: {
    query?: string;
    category?: string;
  };
}

// --- MOCK DATA ---
// Mock data is used instead of fetching from an API for demonstration purposes.
const MOCK_RECIPES: Recipe[] = [
  { id: 1, title: 'Mennyei Almás Pite', slug: 'mennyei-almas-pite', imageUrl: 'https://placehold.co/600x400/f4a261/ffffff?text=Alm\u00e1s+Pite', isLocked: false, category: 'sutemeny' },
  { id: 2, title: 'Titkos Nagymama Húslevese', slug: 'titkos-nagymama-huslevese', imageUrl: 'https://placehold.co/600x400/e76f51/ffffff?text=H\u00fasleves', isLocked: true, category: 'leves' },
  { id: 3, title: 'Csokis Álomsüti', slug: 'csokis-alomsuti', imageUrl: 'https://placehold.co/600x400/2a9d8f/ffffff?text=Csokis+S\u00fcti', isLocked: false, category: 'sutemeny' },
  { id: 4, title: 'Prémium Wellington Bélszín', slug: 'premium-wellington-belszin', imageUrl: 'https://placehold.co/600x400/264653/ffffff?text=Wellington', isLocked: true, category: 'foetel' },
  { id: 5, title: 'Epres-Túrós Torta', slug: 'epres-turos-torta', imageUrl: 'https://placehold.co/600x400/e9c46a/ffffff?text=Epres+Torta', isLocked: false, category: 'torta' },
  { id: 6, title: 'Exkluzív Feketeerdő Torta', slug: 'exkluziv-feketeerdo-torta', imageUrl: 'https://placehold.co/600x400/d62828/ffffff?text=Feketeerd\u0151', isLocked: true, category: 'torta' },
  { id: 7, title: 'Könnyed Nyári Saláta', slug: 'konnyed-nyari-salata', imageUrl: 'https://placehold.co/600x400/8ab17d/ffffff?text=Sal\u00e1ta', isLocked: false, category: 'foetel' },
  { id: 8, title: 'Zártkörű Klub Gulyásleves', slug: 'zartkoru-klub-gulyasleves', imageUrl: 'https://placehold.co/600x400/e63946/ffffff?text=Guly\u00e1s', isLocked: true, category: 'leves' },
];


// --- DUMMY COMPONENTS (for standalone functionality) ---
// These are simplified versions of the components you would have in your project.

function SearchBar({ initialQuery }: { initialQuery?: string }) {
  return (
    <form action="/#" method="GET" className="relative">
      <input
        type="text"
        name="query"
        defaultValue={initialQuery}
        placeholder="Keress receptek között..."
        className="w-full p-4 pl-12 text-lg border-2 border-gray-200 rounded-full focus:ring-pink-500 focus:border-pink-500 transition dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
    </form>
  );
}

function FilterControls({ categories }: { categories: { name: string; slug: string }[] }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Kategóriák</h3>
      <div className="space-y-2">
        {categories.map(cat => (
          <Link
            key={cat.slug}
            href={`#?category=${cat.slug}`}
            className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {cat.slug === 'torta' && <Cake className="w-5 h-5 mr-3 text-pink-500" />}
            {cat.slug === 'sutemeny' && <ChefHat className="w-5 h-5 mr-3 text-yellow-500" />}
            {cat.slug === 'leves' && <Soup className="w-5 h-5 mr-3 text-red-500" />}
            {cat.slug === 'foetel' && <Salad className="w-5 h-5 mr-3 text-green-500" />}
            <span className="font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}


// --- UI & SKELETON COMPONENTS ---

function RecipeCardSkeleton() {
  return (
    <div className="group block rounded-xl overflow-hidden shadow-md">
      <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div className="p-4 bg-white dark:bg-gray-800">
        <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mb-2"></div>
        <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </div>
    </div>
  );
}

function RecipeGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => <RecipeCardSkeleton key={i} />)}
    </div>
  );
}

function SearchPlaceholder() {
  // This SVG is inspired by your screenshot, representing a chef's hat and magnifying glass.
  return (
    <div className="flex flex-col items-center justify-center text-center h-full lg:pt-16">
       <svg className="w-48 h-48 text-gray-300 dark:text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        <path d="M11 8a3 3 0 0 0-3 3v0a3 3 0 0 0 6 0v0a3 3 0 0 0-3-3z"></path>
        <path d="M11.5 2a1.5 1.5 0 0 1-3 0V1a1.5 1.5 0 0 1 3 0v1z"></path>
      </svg>
      <h2 className="mt-6 text-2xl font-semibold text-gray-800 dark:text-white">
        Fedezd fel a titkos recepteket!
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Írj be egy kulcsszót a keresőbe, vagy válassz kategóriát.
      </p>
    </div>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="text-center col-span-full mt-8 flex flex-col items-center justify-center py-10">
      <svg className="w-24 h-24 text-gray-400 dark:text-gray-500 mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM15.59 7L12 10.59L8.41 7L7 8.41L10.59 12L7 15.59L8.41 17L12 13.41L15.59 17L17 15.59L13.41 12L17 8.41L15.59 7Z" fill="currentColor"/>
      </svg>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Ezt a receptet még a nagyi sem találja!
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md">
        Nincs a keresésnek megfelelő recept: “<span className="font-semibold text-gray-700 dark:text-gray-300">{query}</span>”.
      </p>
    </div>
  );
}

// --- DATA DISPLAY COMPONENT ---

async function RecipeResults({ searchParams }: SearchPageProps) {
  const query = searchParams?.query?.toLowerCase() || "";
  const category = searchParams?.category;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filter mock data based on search query and category
  const filteredRecipes = MOCK_RECIPES.filter(recipe => {
    const matchesQuery = recipe.title.toLowerCase().includes(query);
    const matchesCategory = category ? recipe.category === category : true;
    return matchesQuery && matchesCategory;
  });

  if (filteredRecipes.length === 0) {
    return <NoResults query={searchParams?.query || ''} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredRecipes.map((rec) => (
        <RecipeCard key={rec.id} recipe={rec} />
      ))}
    </div>
  );
}

// --- RECIPE CARD COMPONENT ---
// Extracted card logic into its own component for clarity.
function RecipeCard({ recipe }: { recipe: Recipe }) {
    const href = recipe.isLocked ? '/premium-tagsag' : `/receptek/${recipe.slug}`;
    
    return (
        <Link
            href={href}
            className="group block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-white dark:bg-gray-800"
        >
            <div className="relative w-full h-56">
                <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                {recipe.isLocked && (
                    <div className="absolute top-3 right-3 bg-pink-600 text-white p-2 rounded-full shadow-md">
                        <Lock className="w-5 h-5" />
                    </div>
                )}
                
                <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-xl font-bold text-white leading-tight">
                        {recipe.title}
                    </h3>
                </div>
            </div>
        </Link>
    );
}

// --- MAIN PAGE COMPONENT ---
// Changed name to reflect the "Secret Recipes" page theme.
export default function TitkosReceptekPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.query || "";
  const category = searchParams?.category;
  
  const categories = [
    { name: "Torta", slug: "torta" },
    { name: "Sütemény", slug: "sutemeny" },
    { name: "Leves", slug: "leves" },
    { name: "Főétel", slug: "foetel" },
  ];
  
  const hasActiveSearch = !!query || !!category;

  return (
    <main className="container mx-auto max-w-7xl py-8 px-4 font-sans bg-gray-50 dark:bg-gray-900">
      <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2">Titkos Receptek</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">Fedezd fel exkluzív, prémium receptjeinket!</p>
      </div>

      <div className="mb-12">
        <SearchBar initialQuery={query} />
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        <aside className="lg:col-span-1 mb-8 lg:mb-0">
          <FilterControls categories={categories} />
        </aside>

        <section className="lg:col-span-3">
          {hasActiveSearch ? (
            <>
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Keresési eredmények
              </h2>
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

// To use this component, ensure you have lucide-react installed:
// npm install lucide-react
// Also, configure Tailwind CSS in your project (tailwind.config.js).
