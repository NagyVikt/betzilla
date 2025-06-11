// components/RenderRichBlocks.tsx
"use client";

import React from "react";

interface RichBlock {
  type: string;
  children: { text: string }[];
}

interface RenderRichBlocksProps {
  blocks: RichBlock[];
}

/**
 * Egy nagyon egyszerű megközelítés:
 * Minden block.children[0].text mezőben ott lapul a HTML (például "<p>...</p>").
 * A blokkok összefűzése után innerHTML-ként beillesztjük egy <div>-be.
 */
export default function RenderRichBlocks({ blocks }: RenderRichBlocksProps) {
  // 1) Fűzzük össze a blokkok szövegét
  const concatenated = blocks
    .map(block => block.children.map(child => child.text).join(""))
    .join("");

  return (
    <div
      className="prose max-w-none" 
      dangerouslySetInnerHTML={{ __html: concatenated }}
    />
  );
}


