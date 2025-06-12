// File: app/receptek/[slug]/page.tsx

import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { slug as slugify } from "github-slugger";
import BlogDetails from "@/components/Blog/BlogDetails";
import Tag from "@/components/Elements/Tag";
import RenderRichBlocks from "@/components/RenderRichBlocks";
import { getAllBlogSlugs, getBlogBySlug } from "@/lib/api";
import type { Blog } from "@/types/blog";
import ScrollProgressHeader from "@/components/Receptek/ScrollProgressHeader";
import TocSidebar from "@/components/Receptek/TocSidebar";
import { StarRating } from "@/components/Elements/StarRating";
import { NutritionChart } from "@/components/Elements/NutritionChart";
import {
  BookText,
  ListChecks,
  CookingPot,
  BarChart3,
  Image as ImageIconLucide,
  Info,
  ChevronRight,
  PlusCircle,
} from "lucide-react";

// Define the Ingredient type for the sidebar panel
interface Ingredient {
  category: string;
  name: string;
  quantity: string;
  unit: string;
  store?: string;
  onSale?: boolean;
}
// Define the PreparationStep type for visual steps
interface PreparationStep {
  stepNumber: number;
  title: string;
  description: string;
  images: string[];
}

// 1) generateStaticParams
export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((s: any) => ({
    slug: typeof s === "string" ? s : (s.slug as string),
  }));
}

// 2) generateMetadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return { title: "Recept nem található" };
  }

  const publishedAt = blog.publishedAt
    ? new Date(blog.publishedAt).toISOString()
    : undefined;
  const modifiedAt = blog.updatedAt
    ? new Date(blog.updatedAt).toISOString()
    : publishedAt;

  // Determine image URL safely (check possible shapes)
  let imageUrl = "";
  if (blog.banner) {
    // banner might be { src: string } or { data: { attributes: { url: string } } } or { url: string }
    const b = blog.banner as any;
    if (typeof b.src === "string") {
      imageUrl = b.src;
    } else if (b.data?.attributes?.url && typeof b.data.attributes.url === "string") {
      imageUrl = b.data.attributes.url;
    } else if (typeof b.url === "string") {
      imageUrl = b.url;
    }
  }
  if (!imageUrl && blog.image) {
    const im = blog.image as any;
    if (typeof im.src === "string") {
      imageUrl = im.src;
    } else if (im.data?.attributes?.url && typeof im.data.attributes.url === "string") {
      imageUrl = im.data.attributes.url;
    } else if (typeof im.url === "string") {
      imageUrl = im.url;
    }
  }

  return {
    title: blog.title,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: `https://your-domain.com/receptek/${blog.slug}`,
      siteName: "Receptek Oldala",
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      images: imageUrl ? [{ url: imageUrl }] : [],
      authors: blog.Author ? [blog.Author] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

// Helper: Extract plain text from rich text blocks for JSON-LD
const extractTextFromRichText = (blocks: any[] | undefined): string[] => {
  if (!blocks) return [];
  return blocks.flatMap((block: any) =>
    Array.isArray(block.children)
      ? block.children.map((child: any) => child.text || "").join(" ")
      : []
  );
};

// Helper: get store logo URL
const getStoreLogoUrl = (storeName: string): string => {
  const storeLogos: { [key: string]: string } = {
    Lidl: "https://placehold.co/80x40/0050aa/ffffff?text=Lidl&font=roboto",
    Tesco: "https://placehold.co/80x40/d1232a/ffffff?text=Tesco&font=roboto",
    Kaufland: "https://placehold.co/80x40/e0001b/ffffff?text=Kaufland&font=roboto",
    // Add other stores here
  };
  return (
    storeLogos[storeName] ||
    `https://placehold.co/80x40/cccccc/000000?text=${encodeURIComponent(storeName)}`
  );
};

// Main page component
export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const blog = (await getBlogBySlug(slug)) as Blog | null;

  if (!blog) {
    notFound();
  }

  // JSON-LD recipe schema
  let recipeImage = "";
  if (blog.banner) {
    const b = blog.banner as any;
    if (typeof b.src === "string") {
      recipeImage = b.src;
    } else if (b.data?.attributes?.url && typeof b.data.attributes.url === "string") {
      recipeImage = b.data.attributes.url;
    } else if (typeof b.url === "string") {
      recipeImage = b.url;
    }
  }
  if (!recipeImage && blog.image) {
    const im = blog.image as any;
    if (typeof im.src === "string") {
      recipeImage = im.src;
    } else if (im.data?.attributes?.url && typeof im.data.attributes.url === "string") {
      recipeImage = im.data.attributes.url;
    } else if (typeof im.url === "string") {
      recipeImage = im.url;
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: blog.title,
    author: {
      "@type": "Person",
      name: blog.Author || "Ismeretlen szerző",
    },
    datePublished: blog.publishedAt,
    description: blog.description,
    image: recipeImage ? [recipeImage] : [],
    recipeIngredient: extractTextFromRichText(blog.Ingredients),
    recipeInstructions: blog.instructions
      ? (blog.instructions as any[])
          .map((instruction) => {
            if (typeof instruction === "string") return instruction;
            if (instruction && instruction.children)
              return extractTextFromRichText([instruction]).join(" ");
            if (
              typeof instruction === "object" &&
              instruction &&
              "type" in instruction &&
              (instruction as any).type === "list-item"
            )
              return extractTextFromRichText([instruction]).join(" ");
            return "";
          })
          .filter(Boolean)
      : [],
    prepTime: blog.prepTime || undefined,
    cookTime: blog.cookTime || undefined,
    totalTime: blog.totalTime || undefined,
    recipeYield: blog.recipeYield || undefined,
  };

  // Example ingredientsData; adapt or fetch from blog.Ingredients if you have structured data
  const ingredientsData: Ingredient[] = [
    {
      category: "A tésztához:",
      name: "Finomliszt",
      quantity: "25",
      unit: "dkg",
      store: "Lidl",
      onSale: true,
    },
    {
      category: "A tésztához:",
      name: "Rama (vagy vaj)",
      quantity: "12",
      unit: "dkg",
      store: "Tesco",
    },
    {
      category: "A tésztához:",
      name: "Cukor",
      quantity: "5",
      unit: "dkg",
      store: "Kaufland",
      onSale: true,
    },
    { category: "A tésztához:", name: "Só", quantity: "1", unit: "csipet" },
    {
      category: "A tésztához:",
      name: "Sütőpor",
      quantity: "1",
      unit: "teáskanál",
    },
    {
      category: "A tésztához:",
      name: "Citromhéj (reszelt)",
      quantity: "1",
      unit: "db",
    },
    {
      category: "A töltelékhez:",
      name: "Alma (héjától megszabadítva, szeletelve)",
      quantity: "1,2",
      unit: "kg",
      store: "Lidl",
    },
    {
      category: "A töltelékhez:",
      name: "Cukor",
      quantity: "10",
      unit: "dkg",
      store: "Kaufland",
    },
    {
      category: "A töltelékhez:",
      name: "Fahéj",
      quantity: "1",
      unit: "teáskanál",
    },
    {
      category: "A tetejére:",
      name: "Porcukor",
      quantity: "2",
      unit: "evőkanál",
      store: "Tesco",
    },
  ];
  const groupedIngredients = ingredientsData.reduce((acc, ingredient) => {
    const { category } = ingredient;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(ingredient);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  // Example preparationSteps; adapt or fetch from blog data if available
  const preparationSteps: PreparationStep[] = [
    {
      stepNumber: 1,
      title: "Előkészítés",
      description:
        "Melegítsd elő a sütőt 180 °C-ra (légkeverés nélkül). Készíts elő egy 26 cm átmérőjű piteformát, és vékonyan kend ki olajjal vagy vajjal.",
      images: [
        Array.isArray(blog.images) && blog.images[0]
          ? typeof (blog.images[0] as any).url === "string"
            ? (blog.images[0] as any).url
            : typeof (blog.images[0] as any).src === "string"
            ? (blog.images[0] as any).src
            : "https://placehold.co/600x400/fecaca/312e81?text=Sütő+előmelegítése"
          : "https://placehold.co/600x400/fecaca/312e81?text=Sütő+előmelegítése",
      ],
    },
    {
      stepNumber: 2,
      title: "Tészta elkészítése",
      description:
        "Egy nagy tálban keverd össze a lisztet, a sütőport, a csipet sót és az 5 dkg cukrot. Add hozzá a hideg, kis kockákra vágott Rama (vagy vajat), majd gyors mozdulatokkal morzsold el a liszttel: a cél, hogy olyan állagú legyen, mint a finomított morzsa. Egy külön kis tálban keverd össze a reszelt citromhéjat és egy evőkanál hideg vízzel, majd ezt is add a lisztes-Rama keverékhez. Gyorsan dolgozd össze a tésztát, formázz belőle félgömböt, csomagold fóliába, és tedd a hűtőbe 15–20 percre pihentetni.",
      images: [
        Array.isArray(blog.images) && blog.images[1]
          ? typeof (blog.images[1] as any).url === "string"
            ? (blog.images[1] as any).url
            : typeof (blog.images[1] as any).src === "string"
            ? (blog.images[1] as any).src
            : "https://placehold.co/300x200/bfdbfe/312e81?text=Száraz+hozzávalók"
          : "https://placehold.co/300x200/bfdbfe/312e81?text=Száraz+hozzávalók",
        Array.isArray(blog.images) && blog.images[2]
          ? typeof (blog.images[2] as any).url === "string"
            ? (blog.images[2] as any).url
            : typeof (blog.images[2] as any).src === "string"
            ? (blog.images[2] as any).src
            : "https://placehold.co/300x200/ddd6fe/312e81?text=Morzsolás"
          : "https://placehold.co/300x200/ddd6fe/312e81?text=Morzsolás",
      ],
    },
    {
      stepNumber: 3,
      title: "Töltelék összeállítása",
      description:
        "A lehéjazott, vékonyra szeletelt almát tedd egy nagy tálba. Szórd rá a 10 dkg cukrot és a fahéjat, majd óvatosan forgasd össze, hogy minden szelet egyenletesen bevonódjon. Hagyd állni 5–10 percig, míg az alma kiengedi a levét.",
      images: [
        Array.isArray(blog.images) && blog.images[3]
          ? typeof (blog.images[3] as any).url === "string"
            ? (blog.images[3] as any).url
            : typeof (blog.images[3] as any).src === "string"
            ? (blog.images[3] as any).src
            : "https://placehold.co/600x400/c7d2fe/312e81?text=Almás+töltelék"
          : "https://placehold.co/600x400/c7d2fe/312e81?text=Almás+töltelék",
      ],
    },
    {
      stepNumber: 4,
      title: "Tészta kinyújtása és formázása",
      description:
        "A hűtőből kivett tésztát egy liszttel meghintett munkalapon nyújtsd ki kb. 3 mm vastag körlappá (kb. 28–30 cm átmérő). A körlap egyik felével béleld ki a piteforma alját és oldalát úgy, hogy a tészta széle kissé lelógjon.",
      images: [
        Array.isArray(blog.images) && blog.images[4]
          ? typeof (blog.images[4] as any).url === "string"
            ? (blog.images[4] as any).url
            : typeof (blog.images[4] as any).src === "string"
            ? (blog.images[4] as any).src
            : "https://placehold.co/600x400/fbcfe8/312e81?text=Tészta+nyújtása"
          : "https://placehold.co/600x400/fbcfe8/312e81?text=Tészta+nyújtása",
      ],
    },
    {
      stepNumber: 5,
      title: "Pite összeállítása",
      description:
        "Simítsd el az almás tölteléket a tésztán. Ha szeretnél rácsos tetejű pitét, vágd fel a maradék tésztalapot kb. 1–1,5 cm széles csíkokra, és rácsozd a töltelékre. Ha nem készítesz rácsot, vedd elő a másik tésztalapot, terítsd rá a töltelékre, majd a két lapot zárd le a széleken. A felső tésztára villával készíts néhány szellőző lyukat, hogy a gőz távozni tudjon sütés közben.",
      images: ["https://placehold.co/600x400/d9f99d/312e81?text=Tálalás"],
    },
    {
      stepNumber: 6,
      title: "Sütés",
      description:
        "Tedd a piteformát a sütő középső rácsára, és süsd 45 percig, vagy amíg a teteje aranybarna nem lesz, és a töltelék enyhén bugyogni nem kezd a lyukaknál. Ha a teteje nagyon gyorsan pirulna, takard le vékony alufóliával az utolsó 10 percben.",
      images: [
        Array.isArray(blog.images) && blog.images[5]
          ? typeof (blog.images[5] as any).url === "string"
            ? (blog.images[5] as any).url
            : typeof (blog.images[5] as any).src === "string"
            ? (blog.images[5] as any).src
            : "https://placehold.co/600x400/fef08a/312e81?text=Sütés"
          : "https://placehold.co/600x400/fef08a/312e81?text=Sütés",
      ],
    },
    {
      stepNumber: 7,
      title: "Kihűlés és tálalás",
      description:
        "A sütőből kivéve hagyd a pitét a formában 10–15 percre hűlni, hogy a töltelék kissé megszilárduljon. Ezután szórd meg a tetejét a 2 evőkanál porcukorral, szeleteld fel 8 egyenlő darabra, és tálald langyosan, például vaníliafagylalttal vagy tejszínhabbal.",
      images: [
        Array.isArray(blog.images) && blog.images[6]
          ? typeof (blog.images[6] as any).url === "string"
            ? (blog.images[6] as any).url
            : typeof (blog.images[6] as any).src === "string"
            ? (blog.images[6] as any).src
            : "https://placehold.co/600x400/d9f99d/312e81?text=Tálalás"
          : "https://placehold.co/600x400/d9f99d/312e81?text=Tálalás",
      ],
    },
  ];

  // Macronutrient calculations: coerce to numbers safely
  const proteinNum = blog.protein != null ? Number(blog.protein) : 0;
  const carbsNum = blog.carbs != null ? Number(blog.carbs) : 0;
  const fatNum = blog.fat != null ? Number(blog.fat) : 0;
  const nutritionValues = {
    protein: isNaN(proteinNum) ? 0 : proteinNum,
    carbs: isNaN(carbsNum) ? 0 : carbsNum,
    fat: isNaN(fatNum) ? 0 : fatNum,
  };
  const totalMacros =
    nutritionValues.protein + nutritionValues.carbs + nutritionValues.fat;
  const percentProtein = totalMacros
    ? Math.round((nutritionValues.protein / totalMacros) * 100)
    : 0;
  const percentCarbs = totalMacros
    ? Math.round((nutritionValues.carbs / totalMacros) * 100)
    : 0;
  const percentFat = totalMacros
    ? Math.round((nutritionValues.fat / totalMacros) * 100)
    : 0;

  // Banner image / fallback color
  let bannerImageUrl = "";
  if (blog.banner) {
    const b = blog.banner as any;
    if (typeof b.src === "string") {
      bannerImageUrl = b.src;
    } else if (
      b.data?.attributes?.url &&
      typeof b.data.attributes.url === "string"
    ) {
      bannerImageUrl = b.data.attributes.url;
    } else if (typeof b.url === "string") {
      bannerImageUrl = b.url;
    }
  }
  const fallbackBannerColor = "bg-pink-400";

  // totalTime: coerce prepTime and cookTime to number if needed
  let totalTimeValue: number | null = null;
  const prepNum = blog.prepTime != null ? Number(blog.prepTime) : NaN;
  const cookNum = blog.cookTime != null ? Number(blog.cookTime) : NaN;
  if (!isNaN(Number(blog.totalTime as any))) {
    totalTimeValue = Number(blog.totalTime as any);
  } else if (!isNaN(prepNum) && !isNaN(cookNum)) {
    totalTimeValue = prepNum + cookNum;
  } else {
    totalTimeValue = null;
  }

  // Table of Contents items
  const tocItems = [
    { href: "#section-leiras", label: "Leírás", dataField: blog.content },
    { href: "#section-osszefoglalo", label: "Összefoglaló", dataField: true },
    { href: "#section-hozzavalok", label: "Hozzávalók", dataField: blog.Ingredients },
    { href: "#section-elkeszites", label: "Elkészítés", dataField: blog.instructions },
    { href: "#section-tapertek", label: "Tápérték", dataField: blog.nutritioninfo },
  ];

  // Coerce rating to number for StarRating
  const ratingNum =
    blog.rating != null ? Number(blog.rating) : 0;
  const initialRatingValue = isNaN(ratingNum) ? 0 : ratingNum;

  return (
    <>
      {/* Inject JSON-LD into <head> */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Mobile TOC bubbles */}
      <TocSidebar items={tocItems} totalTime={totalTimeValue} slug={slug} />

      {/* ScrollProgressHeader now accepts slug prop */}
      <ScrollProgressHeader slug={slug} />

      <main className="mx-auto mt-10 md:mt-10 px-0 sm:px-6 lg:px-8 lg:pl-8">
        {/* 1) Banner Section */}
        <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] w-full md:rounded-xl overflow-hidden shadow-2xl mb-8">
          {bannerImageUrl ? (
            <Image
              src={bannerImageUrl}
              alt={`Banner: ${blog.title}`}
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
          ) : (
            <div className={`absolute inset-0 ${fallbackBannerColor}`} />
          )}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12 text-center">
            <div className="max-w-3xl">
              {Array.isArray(blog.tags) && blog.tags[0] && (
                <Tag
                  name={blog.tags[0] as string}
                  link={`/categories/${slugify(blog.tags[0] as string)}`}
                  className="mb-4 inline-block bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md transition-colors"
                />
              )}
              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white"
                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
              >
                {blog.title}
              </h1>
              {blog.description && (
                <p
                  className="mt-3 text-lg sm:text-xl md:text-2xl text-white/90"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
                >
                  {blog.description}
                </p>
              )}
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              {/* Pass a number */}
              <StarRating slug={slug} initialRating={initialRatingValue} />
              <span className="text-gray-800 font-medium text-sm">
                Átlag: {initialRatingValue}/5
              </span>
            </div>
          </div>
        </div>

        {/* 2) BlogDetails Section */}
        <div className="px-4 sm:px-0">
          <BlogDetails blog={blog} slug={slug} />
        </div>

        {/* 3) Grid Layout */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 sm:px-0">
          {/* Left Column: Ingredients Panel */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24">
              <div className="rounded-xl shadow-lg overflow-hidden">
                <h2 className="text-2xl font-bold text-white bg-pink-600 p-4 flex items-center">
                  <ListChecks className="h-7 w-7 mr-3" />
                  Hozzávalók
                </h2>
                <div className="bg-white p-6 space-y-4">
                  {Object.entries(groupedIngredients).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {category}
                      </h3>
                      <ul className="space-y-3">
                        {items.map((ing, idx) => (
                          <li
                            key={idx}
                            className="flex items-center text-gray-700"
                          >
                            <input
                              type="checkbox"
                              className="h-5 w-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500 mr-3 shrink-0"
                            />
                            <span className="flex-grow">
                              {`${ing.quantity} ${ing.unit} ${ing.name}`}
                            </span>
                            <div className="flex items-center shrink-0 ml-2">
                              {ing.store && (
                                <Image
                                  src={getStoreLogoUrl(ing.store)}
                                  alt={`${ing.store} logo`}
                                  width={40}
                                  height={20}
                                  className="object-contain rounded-sm"
                                />
                              )}
                              {ing.onSale && (
                                <span
                                  className="relative inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white font-bold text-xs rounded-full ml-2"
                                  title="Akciós!"
                                >
                                  %
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <button className="w-full mt-6 bg-pink-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors">
                    Mentés listába <ChevronRight className="h-5 w-5 ml-2" />
                  </button>
                </div>
              </div>
              {blog.ingredientsNote && (
                <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm p-2 bg-gray-100 rounded-lg">
                  <strong>Megjegyzés:</strong> {blog.ingredientsNote}
                </p>
              )}
            </div>
          </aside>

          {/* Center Content Area */}
          <div className="lg:col-span-6 space-y-12">
            {/* Leírás Section */}
            {blog.content &&
              (Array.isArray(blog.content)
                ? blog.content.length > 0
                : true) && (
                <section
                  id="section-leiras"
                  className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg scroll-mt-24"
                >
                  <div className="flex items-center mb-4">
                    <BookText className="h-7 w-7 text-pink-500 mr-3" />
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                      Leírás
                    </h2>
                  </div>
                  <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                    <RenderRichBlocks blocks={blog.content} />
                  </div>
                </section>
              )}

            {/* Összefoglaló Section */}
            <section
              id="section-osszefoglalo"
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg scroll-mt-24"
            >
              <div className="flex items-center mb-4">
                <Info className="h-7 w-7 text-pink-500 mr-3" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                  Összefoglaló
                </h2>
              </div>
              <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                <ul className="space-y-2 list-none p-0">
                  <li>
                    <span className="font-semibold">Előkészítési idő:</span>{" "}
                    {blog.prepTime || "N/A"}
                  </li>
                  <li>
                    <span className="font-semibold">Sütési/Főzési idő:</span>{" "}
                    {blog.cookTime || "N/A"}
                  </li>
                  <li>
                    <span className="font-semibold">Összes idő:</span>{" "}
                    {totalTimeValue != null ? totalTimeValue : "N/A"}
                  </li>
                  <li>
                    <span className="font-semibold">Adag:</span>{" "}
                    {blog.recipeYield || "N/A"}
                  </li>
                  <li>
                    <span className="font-semibold">Nehézség:</span>{" "}
                    {blog.difficulty || "N/A"}
                  </li>
                  {blog.summary && (
                    <li>
                      <span className="font-semibold">Rövid leírás:</span>{" "}
                      {blog.summary}
                    </li>
                  )}
                </ul>
              </div>
            </section>

            {/* Hozzávalók Section */}
            {blog.Ingredients &&
              (Array.isArray(blog.Ingredients)
                ? blog.Ingredients.length > 0
                : true) && (
                <section
                  id="section-hozzavalok"
                  className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg scroll-mt-24"
                >
                  <div className="flex items-center mb-4">
                    <ListChecks className="h-7 w-7 text-pink-500 mr-3" />
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                      Hozzávalók
                    </h2>
                  </div>
                  <div className="prose prose-lg dark:prose-invert max-w-none mb-6 text-gray-700 dark:text-gray-300">
                    <RenderRichBlocks blocks={blog.Ingredients} />
                  </div>

                  {Array.isArray(blog.ingredientsTable) &&
                  blog.ingredientsTable.length > 0 ? (
                    <div className="overflow-x-auto mt-6 shadow-md rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-pink-500 dark:bg-pink-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                              Név
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                              Mennyiség
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                              Egység
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {(blog.ingredientsTable as {
                            name: string;
                            qty: string;
                            unit: string;
                          }[]).map((row, idx) => (
                            <tr
                              key={idx}
                              className={`${
                                idx % 2 === 0
                                  ? "bg-white dark:bg-gray-800"
                                  : "bg-pink-50 dark:bg-gray-700"
                              } hover:bg-pink-100 dark:hover:bg-gray-600 transition-colors duration-150 ease-in-out`}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                {row.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                {row.qty}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                {row.unit}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm italic">
                      Részletes táblázat nem elérhető.
                    </p>
                  )}

                  {blog.ingredientsNote && (
                    <p className="mt-6 text-gray-600 dark:text-gray-400 text-sm">
                      <strong>Megjegyzés:</strong> {blog.ingredientsNote}
                    </p>
                  )}
                </section>
              )}

            {/* Elkészítés Section */}
            {preparationSteps.length > 0 && (
              <section
                id="section-elkeszites"
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg scroll-mt-24"
              >
                <div className="flex items-center mb-6">
                  <CookingPot className="h-7 w-7 text-pink-500 mr-3" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                    Elkészítés
                  </h2>
                </div>
                <div className="space-y-12">
                  {preparationSteps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="flex flex-col md:flex-row gap-6 md:gap-8 border-b border-gray-200 dark:border-gray-700 pb-8 last:border-b-0 last:pb-0"
                    >
                      {/* Text */}
                      <div className="md:w-3/5 flex-shrink-0">
                        <div className="flex items-center mb-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-500 text-white font-bold text-xl mr-4">
                            {step.stepNumber}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-200">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {step.description}
                        </p>
                      </div>

                      {/* Images */}
                      <div className="md:w-2/5">
                        <div
                          className={`grid gap-4 ${
                            step.images.length > 1 ? "grid-cols-2" : "grid-cols-1"
                          }`}
                        >
                          {step.images.map((imgSrc, imgIdx) => (
                            <div
                              key={imgIdx}
                              className="relative w-full aspect-square rounded-lg overflow-hidden shadow-md group"
                            >
                              <Image
                                src={imgSrc}
                                alt={`Lépés ${step.stepNumber} - ${imgIdx + 1}`}
                                fill
                                sizes="(max-width: 768px) 50vw, 33vw"
                                className="object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-110"
                              />
                            </div>
                          ))}
                          <button className="flex items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <PlusCircle className="h-8 w-8" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tápérték Section */}
            {blog.nutritioninfo &&
              (Array.isArray(blog.nutritioninfo)
                ? blog.nutritioninfo.length > 0
                : true) && (
                <section
                  id="section-tapertek"
                  className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg scroll-mt-24"
                >
                  <div className="flex items-center mb-4">
                    <BarChart3 className="h-7 w-7 text-pink-500 mr-3" />
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                      Tápérték
                    </h2>
                  </div>
                  <div className="prose prose-lg dark:prose-invert max-w-none mb-6 text-gray-700 dark:text-gray-300">
                    <RenderRichBlocks blocks={blog.nutritioninfo} />
                  </div>
                  <div className="flex justify-center mb-6">
                    <NutritionChart
                      protein={nutritionValues.protein}
                      carbs={nutritionValues.carbs}
                      fat={nutritionValues.fat}
                      size={140}
                    />
                  </div>
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                      Makrotápanyagok (hozzávetőleges)
                    </h3>
                    {totalMacros > 0 ? (
                      <div className="space-y-4">
                        {nutritionValues.protein > 0 && (
                          <div>
                            <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              <span>Fehérje ({percentProtein}%)</span>
                              <span>{nutritionValues.protein} g</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full">
                              <div
                                className="bg-pink-600 h-2.5 rounded-full"
                                style={{ width: `${percentProtein}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {nutritionValues.carbs > 0 && (
                          <div>
                            <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              <span>Szénhidrát ({percentCarbs}%)</span>
                              <span>{nutritionValues.carbs} g</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full">
                              <div
                                className="bg-sky-500 h-2.5 rounded-full"
                                style={{ width: `${percentCarbs}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {nutritionValues.fat > 0 && (
                          <div>
                            <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              <span>Zsír ({percentFat}%)</span>
                              <span>{nutritionValues.fat} g</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full">
                              <div
                                className="bg-amber-500 h-2.5 rounded-full"
                                style={{ width: `${percentFat}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm italic">
                        Részletes makrotápanyag adatok nem elérhetők.
                      </p>
                    )}
                  </div>
                </section>
              )}
          </div>

          {/* Right Column: Gallery */}
          <aside className="lg:col-span-3">
            {Array.isArray(blog.images) && blog.images.length > 0 ? (
              <div
                className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg sticky top-24"
                style={{ maxHeight: "calc(100vh - 7rem)" }}
              >
                <div className="flex items-center mb-4">
                  <ImageIconLucide className="h-7 w-7 text-pink-500 mr-3" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                    Galéria
                  </h2>
                </div>
                <div
                  className="space-y-4 overflow-y-auto pr-1"
                  style={{
                    maxHeight: "calc(100vh - 12rem)",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#fb7185 #fce7f3",
                  }}
                >
                  {blog.images.map((img: any, idx: number) => {
                    let imgSrc: string | null = null;
                    if (typeof img.url === "string") {
                      imgSrc = img.url;
                    } else if (typeof img.src === "string") {
                      imgSrc = img.src;
                    } else if (
                      img.attributes?.url &&
                      typeof img.attributes.url === "string"
                    ) {
                      imgSrc = img.attributes.url;
                    }
                    if (!imgSrc) return null;
                    const key =
                      typeof img.id === "string" || typeof img.id === "number"
                        ? img.id
                        : idx;
                    return (
                      <div
                        key={key}
                        className="relative w-full aspect-[16/10] rounded-lg overflow-hidden shadow-md group transition-all duration-300 hover:shadow-xl"
                      >
                        <Image
                          src={imgSrc}
                          alt={`${blog.title} – kép ${idx + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
                          className="object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {typeof img.caption === "string" && (
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {img.caption}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center sticky top-24">
                <div className="flex items-center mb-4 justify-center">
                  <ImageIconLucide className="h-7 w-7 text-pink-500 mr-3" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                    Galéria
                  </h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-4">
                  Ehhez a recepthez még nincsenek képek feltöltve.
                </p>
              </div>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}
