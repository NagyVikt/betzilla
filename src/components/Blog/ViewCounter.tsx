// File: src/components/Blog/ViewCounter.tsx
"use client";

import { useState, useEffect } from "react";

interface ViewCounterProps {
  slug: string;
}

export default function ViewCounter({ slug }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function incrementViews() {
      try {
        // Call our Next.js API route, which handles GET+PUT to Strapi internally.
        // The API route’s PUT handler returns { id, updatedViews, strapiResponse }
        const res = await fetch(`/api/view-counter/${encodeURIComponent(slug)}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          // Attempt to read the error details JSON, if any
          let details = "";
          try {
            const json = await res.json();
            details = json.details ?? json.error ?? res.statusText;
          } catch {
            details = res.statusText;
          }
          throw new Error(`Hiba: ${details}`);
        }

        const json = await res.json();
        // json.updatedViews should be the new view count
        if (typeof json.updatedViews === "number") {
          setViews(json.updatedViews);
        } else {
          // Fallback if the API returned some unexpected shape
          throw new Error("Frissített nézetek nem találhatók a válaszban.");
        }
      } catch (err: any) {
        console.error("[ViewCounter] hiba történt:", err.message);
        setError(err.message);
      }
    }

    incrementViews();
  }, [slug]);

  if (error) {
    return <span className="text-red-600">Hiba: {error}</span>;
  }
  if (views === null) {
    return <span>Betöltés…</span>;
  }
  return <span>{views} megtekintés</span>;
}
