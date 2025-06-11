// File: app/api/rate-recipe/[slug]/route.ts

import { NextRequest, NextResponse } from "next/server";

// -------------------------------------------------------
//  Ensure environment variables are set
// -------------------------------------------------------
if (!process.env.NEXT_PUBLIC_STRAPI_URL) {
  console.error(
    "[RateRecipe → Initialization] ERROR: NEXT_PUBLIC_STRAPI_URL is not set in environment."
  );
}
if (!process.env.STRAPI_API_TOKEN) {
  console.error(
    "[RateRecipe → Initialization] ERROR: STRAPI_API_TOKEN is not set in environment."
  );
}

const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "");
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
const COLLECTION_NAME = "recepteks"; // <-- Adjust to your Strapi collection’s plural name

// -------------------------------------------------------
//  Helper: Build Strapi URL for fetching by slug
//  We only need `rating` and `documentId` fields.
// -------------------------------------------------------
function buildFetchBySlugUrl(slug: string) {
  if (!STRAPI_BASE) throw new Error("NEXT_PUBLIC_STRAPI_URL is undefined");
  const url = new URL(`${STRAPI_BASE}/api/${COLLECTION_NAME}`);
  url.searchParams.set("filters[slug][$eq]", slug);
  url.searchParams.set("fields[0]", "rating");
  url.searchParams.set("fields[1]", "documentId");
  return url.toString();
}

// -------------------------------------------------------
//  Helper: Build Strapi URL for updating by documentId
// -------------------------------------------------------
function buildUpdateByDocumentIdUrl(documentId: string) {
  if (!STRAPI_BASE) throw new Error("NEXT_PUBLIC_STRAPI_URL is undefined");
  return `${STRAPI_BASE}/api/${COLLECTION_NAME}/${documentId}`;
}

// -------------------------------------------------------
//  PUT handler
//
//  Usage: PUT /api/rate-recipe/:slug?rating=<1–5>
//  - We read `rating` from the query string.
//  - We first GET the Strapi document for { slug } to obtain its `documentId`.
//  - Then we PUT back to Strapi with data: { rating: <newRating> }.
// -------------------------------------------------------
export async function PUT(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  // Because `params` is an asynchronous proxy, we must await it:
  const { slug } = await context.params;

  // Validate that our Strapi environment is configured
  if (!STRAPI_BASE) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_STRAPI_URL is not set" },
      { status: 500 }
    );
  }
  if (!STRAPI_TOKEN) {
    return NextResponse.json(
      { error: "STRAPI_API_TOKEN is not set" },
      { status: 500 }
    );
  }

  // -------------------------------------------------------
  //  Extract `rating` from query string
  // -------------------------------------------------------
  const url = new URL(request.url);
  const ratingParam = url.searchParams.get("rating");
  if (!ratingParam) {
    return NextResponse.json(
      { error: "Rating parameter is required (1–5)" },
      { status: 400 }
    );
  }
  const ratingValue = parseInt(ratingParam, 10);
  if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
    return NextResponse.json(
      { error: "Rating must be an integer between 1 and 5" },
      { status: 400 }
    );
  }

  try {
    // -------------------------------------------------------
    //  1) Fetch existing Strapi entry by slug to obtain documentId
    // -------------------------------------------------------
    const fetchUrl = buildFetchBySlugUrl(slug);
    const resGet = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    });

    if (!resGet.ok) {
      const text = await resGet.text();
      console.error(
        `[RateRecipe → PUT] Strapi GET error: ${resGet.statusText}`,
        text
      );
      return NextResponse.json(
        { error: "Strapi GET failed", details: text },
        { status: resGet.status }
      );
    }

    const jsonGet = await resGet.json();
    if (
      !jsonGet.data ||
      !Array.isArray(jsonGet.data) ||
      jsonGet.data.length === 0
    ) {
      return NextResponse.json(
        { error: `No recipe found for slug "${slug}"` },
        { status: 404 }
      );
    }

    // Strapi returns an array of entries; take the first
    const entry = jsonGet.data[0];
    const documentId: string = entry.documentId;

    // -------------------------------------------------------
    //  2) Update the `rating` field for this document
    // -------------------------------------------------------
    const updateUrl = buildUpdateByDocumentIdUrl(documentId);
    const payload = {
      data: {
        rating: ratingValue,
      },
    };

    const resPut = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!resPut.ok) {
      const text = await resPut.text();
      console.error(
        `[RateRecipe → PUT] Strapi PUT error: ${resPut.statusText}`,
        text
      );
      return NextResponse.json(
        { error: "Strapi PUT failed", details: text },
        { status: resPut.status }
      );
    }

    const jsonPut = await resPut.json();
    // Return the updated rating in the response
    return NextResponse.json(
      {
        documentId,
        newRating: ratingValue,
        strapiResponse: jsonPut,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(`[RateRecipe → PUT] Unexpected error:`, err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
