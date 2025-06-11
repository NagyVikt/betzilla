// lib/api.ts
export const STRAPI_BASE = process.env.STRAPI_URL || "http://localhost:1337";

/**
 * 1) Lekérdezzük az összes receptek slug-ját a Strapi-ból.
 *    (Most már a Strapi JSON-jában a data[i].slug a helyes mező)
 */
export async function getAllBlogSlugs(): Promise<string[]> {
  const url = `${STRAPI_BASE}/api/recepteks?fields[0]=slug&pagination[pageSize]=100`;
  console.log("[getAllBlogSlugs] Fetching URL:", url);

  const res = await fetch(url, { next: { revalidate: 60 } });
  console.log("[getAllBlogSlugs] HTTP status:", res.status);

  if (!res.ok) {
    console.error("[getAllBlogSlugs] Strapi fetch error:", res.statusText);
    return [];
  }

  const json = await res.json();
  console.log("[getAllBlogSlugs] Raw JSON response:", JSON.stringify(json, null, 2));

  if (!json.data || !Array.isArray(json.data)) {
    console.warn("[getAllBlogSlugs] A válaszban nincs data tömb, vagy nem tömb!");
    return [];
  }

  // A Strapi JSON-jában: entry.slug közvetlenül elérhető (nincs attributes.slug)
  return json.data.map((entry: any) => entry.slug as string);
}

/**
 * 2) Lekérünk egyetlen receptet a slug alapján, és átalakítjuk a front-endnek megfelelő formára.
 */
export async function getBlogBySlug(slug: string) {
  const query = new URLSearchParams({
    "filters[slug][$eq]": slug,
    populate: "*", // Mindent betöltünk: banner, images, featuredImage, stb.
  }).toString();

  const url = `${STRAPI_BASE}/api/recepteks?${query}`;
  console.log(`[getBlogBySlug] Fetching: ${url}`);

  const res = await fetch(url, { next: { revalidate: 60 } });
  console.log(`[getBlogBySlug] HTTP status for ${slug}:`, res.status);

  if (!res.ok) {
    console.error(`[getBlogBySlug] Strapi fetch error for ${slug}:`, res.statusText);
    return null;
  }

  const json = await res.json();
  console.log(`[getBlogBySlug] Raw JSON for ${slug}:`, JSON.stringify(json, null, 2));

  if (!json.data || !Array.isArray(json.data) || json.data.length === 0) {
    console.warn(`[getBlogBySlug] No data found for slug=${slug}`);
    return null;
  }

  // Strapi JSON-jából közvetlenül az első elem
  const raw = json.data[0];

  // === Banner kezelése ===
  let bannerObj: { src: string; width: number; height: number } | null = null;
  // 1) Ha van raw.banner.data -> raw.banner.data.attributes (régebbi Strapi-kiépítés esetén)
  if (raw.banner?.data?.attributes) {
    const bImg = raw.banner.data.attributes;
    bannerObj = {
      src: bImg.url.startsWith("http") ? bImg.url : STRAPI_BASE + bImg.url,
      width: bImg.width,
      height: bImg.height,
    };
  }
  // 2) Ha a Strapi v4 `populate=*` így adja vissza, hogy raw.banner egy objektum (nem raw.banner.data)
  else if (raw.banner?.url) {
    bannerObj = {
      src: raw.banner.url.startsWith("http") ? raw.banner.url : STRAPI_BASE + raw.banner.url,
      width: raw.banner.width,
      height: raw.banner.height,
    };
  }

  // === Több kép (images) kezelése ===
  let imagesArr: { src: string; width: number; height: number }[] = [];

  // 1) Ha raw.images.data tömbben vannak elemek (Strapi v4 általában így adja vissza)
  if (Array.isArray(raw.images?.data)) {
    imagesArr = raw.images.data.map((imgEntry: any) => {
      const attrs = imgEntry.attributes;
      return {
        src: attrs.url.startsWith("http") ? attrs.url : STRAPI_BASE + attrs.url,
        width: attrs.width,
        height: attrs.height,
      };
    });
  }
  // 2) Ha Strapi valamiért közvetlenül raw.images egyetlen objektumot tartalmaz (ritkább, csak példa)
  else if (raw.images && Array.isArray(raw.images)) {
    imagesArr = raw.images.map((attrs: any) => ({
      src: attrs.url.startsWith("http") ? attrs.url : STRAPI_BASE + attrs.url,
      width: attrs.width,
      height: attrs.height,
    }));
  }

  // === featuredImage (ha használod még) ===
  let featuredObj: { src: string; width: number; height: number } | null = null;
  if (raw.featuredImage?.data?.attributes) {
    const fImg = raw.featuredImage.data.attributes;
    featuredObj = {
      src: fImg.url.startsWith("http") ? fImg.url : STRAPI_BASE + fImg.url,
      width: fImg.width,
      height: fImg.height,
    };
  }

  // === tags tömb ===
  const tagsArray: string[] = Array.isArray(raw.tags?.data)
    ? raw.tags.data.map((t: any) => t.attributes.name)
    : [];

  // === Author mező kezelése ===
  let authorName = raw.Author || "Szerkesztő ismeretlen";
  if (raw.author?.data) {
    authorName = raw.author.data.attributes.username || raw.author.data.attributes.email;
  }

  // Visszaadjuk a front-end által elvárt struktúrát
  return {
    slug: raw.slug,
    title: raw.title,
    description: raw.description || "",
    content: raw.content,             // Rich Text Blocks tömb
    Ingredients: raw.Ingredients,      // Rich Text Blocks tömb
    instructions: raw.instructions,    // Rich Text Blocks tömb
    prepTime: raw.prepTime,
    cookTime: raw.cookTime,
    totalTime: raw.totalTime,
    readingTime: raw.readingTime,      // percekben
    cost: raw.cost,
    course: raw.course,
    publishedAt: raw.publishedAt,
    difficulty: raw.difficulty,
    Portions: raw.Portions,
    categories: raw.categories,
    Author: authorName,
    nutritioninfo: raw.nutritioninfo,  // Rich Text Blocks tömb
    views: Number(raw.views),          // biztos, hogy számként vesszük (a JSON-ben stringként is lehet)
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt || raw.publishedAt,
    image: featuredObj,                // ha használsz featuredImage-t
    banner: bannerObj,                 // a „banner” mező, ha létezik
    images: imagesArr,                 // a „images” tömb
    tags: tagsArray,
  };
}
