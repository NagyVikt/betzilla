// app/api/receptek/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const url = "http://localhost:1337/api/recepteks?fields[0]=slug&pagination[pageSize]=100";
  console.log("[route.ts] Fetching slugs from:", url);

  const res = await fetch(url);
  if (!res.ok) {
    console.error("[route.ts] Strapi fetch error:", res.statusText);
    return NextResponse.json(
      { error: `Strapi fetch error: ${res.statusText}` },
      { status: res.status }
    );
  }

  const json = await res.json();
  console.log("[route.ts] Received JSON:", JSON.stringify(json, null, 2));

  if (!json.data || !Array.isArray(json.data)) {
    return NextResponse.json([], { status: 200 });
  }

  // A Te Strapi-válaszod szerint slug közvetlenül entry.slug
  const slugs = json.data.map((entry: any) => entry.slug as string);
  return NextResponse.json(slugs, { status: 200 });
}
