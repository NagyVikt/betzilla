// File: app/api/view-counter/[slug]/route.ts

import { NextRequest, NextResponse } from "next/server";

// 1) Ensure environment variables exist
if (!process.env.NEXT_PUBLIC_STRAPI_URL) {
  console.error(
    "[ViewCounter → Initialization] ERROR: NEXT_PUBLIC_STRAPI_URL is not set in environment."
  );
}
if (!process.env.STRAPI_API_TOKEN) {
  console.error(
    "[ViewCounter → Initialization] ERROR: STRAPI_API_TOKEN is not set in environment."
  );
}

const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "");
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
const COLLECTION_NAME = "recepteks"; // Make sure this matches your collection’s plural name

// Helper: build Strapi URL for fetching by slug (only documentId & views)
function buildFetchBySlugUrl(slug: string) {
  if (!STRAPI_BASE) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is not defined");
  }
  // e.g. http://localhost:1337/api/recepteks?filters[slug][$eq]=<slug>&fields[0]=views&fields[1]=documentId
  const url = new URL(`${STRAPI_BASE}/api/${COLLECTION_NAME}`);
  url.searchParams.set("filters[slug][$eq]", slug);
  url.searchParams.set("fields[0]", "views");
  url.searchParams.set("fields[1]", "documentId");
  return url.toString();
}

// Helper: build Strapi URL for updating by documentId
function buildUpdateByDocumentIdUrl(documentId: string) {
  if (!STRAPI_BASE) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is not defined");
  }
  // e.g. http://localhost:1337/api/recepteks/<documentId>
  return `${STRAPI_BASE}/api/${COLLECTION_NAME}/${documentId}`;
}

// --------------
// GET handler
// --------------
// Usage: GET  /api/view-counter/:slug
// Returns the raw Strapi JSON containing documentId & views (for debugging).
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;

  if (!STRAPI_BASE) {
    return new NextResponse(
      JSON.stringify({ error: "NEXT_PUBLIC_STRAPI_URL is not set" }),
      { status: 500 }
    );
  }
  if (!STRAPI_TOKEN) {
    return new NextResponse(
      JSON.stringify({ error: "STRAPI_API_TOKEN is not set" }),
      { status: 500 }
    );
  }

  try {
    const fetchUrl = buildFetchBySlugUrl(slug);
    console.log(`[ViewCounter → GET] Fetching Strapi URL: ${fetchUrl}`);

    const res = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    });
    console.log(`[ViewCounter → GET] Strapi responded with status ${res.status}`);

    if (!res.ok) {
      const text = await res.text();
      console.error(
        `[ViewCounter → GET] Strapi GET error: ${res.statusText}`,
        text
      );
      return new NextResponse(
        JSON.stringify({ error: "Strapi GET failed", details: text }),
        { status: res.status }
      );
    }

    const json = await res.json();
    console.log(
      `[ViewCounter → GET] Strapi GET JSON:`,
      JSON.stringify(json, null, 2)
    );

    if (!json.data || !Array.isArray(json.data) || json.data.length === 0) {
      const msg = `No entry found for slug "${slug}"`;
      console.warn(`[ViewCounter → GET] ${msg}`);
      return new NextResponse(JSON.stringify({ error: msg }), { status: 404 });
    }

    return NextResponse.json(json, { status: 200 });
  } catch (err: any) {
    console.error(`[ViewCounter → GET] Unexpected error:`, err);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error", details: err.message }),
      { status: 500 }
    );
  }
}

// --------------
// PUT handler
// --------------
// Usage: PUT  /api/view-counter/:slug
// - Fetches the existing “views” and “documentId” from Strapi (using GET),
// - Increments views by 1,
// - Sends a PUT to update the “views” field via the route that uses documentId.
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;

  if (!STRAPI_BASE) {
    return new NextResponse(
      JSON.stringify({ error: "NEXT_PUBLIC_STRAPI_URL is not set" }),
      { status: 500 }
    );
  }
  if (!STRAPI_TOKEN) {
    return new NextResponse(
      JSON.stringify({ error: "STRAPI_API_TOKEN is not set" }),
      { status: 500 }
    );
  }

  try {
    // 1) Fetch existing entry by slug
    const fetchUrl = buildFetchBySlugUrl(slug);
    console.log(`[ViewCounter → PUT] Step 1: GET entry from Strapi: ${fetchUrl}`);

    const resGet = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    });
    console.log(`[ViewCounter → PUT] Strapi GET status: ${resGet.status}`);

    if (!resGet.ok) {
      const text = await resGet.text();
      console.error(
        `[ViewCounter → PUT] Strapi GET error: ${resGet.statusText}`,
        text
      );
      return new NextResponse(
        JSON.stringify({ error: "Strapi GET failed", details: text }),
        { status: resGet.status }
      );
    }

    const jsonGet = await resGet.json();
    console.log(
      `[ViewCounter → PUT] Strapi GET returned:`,
      JSON.stringify(jsonGet, null, 2)
    );

    if (!jsonGet.data || !Array.isArray(jsonGet.data) || jsonGet.data.length === 0) {
      const msg = `No entry found for slug "${slug}"`;
      console.warn(`[ViewCounter → PUT] ${msg}`);
      return new NextResponse(JSON.stringify({ error: msg }), { status: 404 });
    }

    // Each entry has a top‐level "views" and "documentId"
    const entry = jsonGet.data[0];
    const documentId: string = entry.documentId;
    const currentViews = Number(entry.views ?? 0);

    console.log(
      `[ViewCounter → PUT] Found entry documentId=${documentId}, currentViews=${currentViews}`
    );

    // 2) Increment and PUT updated views back to Strapi
    const updatedViews = currentViews + 1;
    const updateUrl = buildUpdateByDocumentIdUrl(documentId);
    console.log(
      `[ViewCounter → PUT] Step 2: PUT updated views to Strapi: ${updateUrl}`
    );
    console.log(
      `[ViewCounter → PUT] Payload:`,
      JSON.stringify({ data: { views: updatedViews } })
    );

    const resPut = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify({ data: { views: updatedViews } }),
    });
    console.log(`[ViewCounter → PUT] Strapi PUT status: ${resPut.status}`);

    if (!resPut.ok) {
      const text = await resPut.text();
      console.error(
        `[ViewCounter → PUT] Strapi PUT error: ${resPut.statusText}`,
        text
      );
      return new NextResponse(
        JSON.stringify({ error: "Strapi PUT failed", details: text }),
        { status: resPut.status }
      );
    }

    const jsonPut = await resPut.json();
    console.log(
      `[ViewCounter → PUT] Strapi PUT returned:`,
      JSON.stringify(jsonPut, null, 2)
    );

    // 3) Return updated view count
    return NextResponse.json(
      { documentId, updatedViews, strapiResponse: jsonPut },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(`[ViewCounter → PUT] Unexpected error:`, err);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error", details: err.message }),
      { status: 500 }
    );
  }
}
