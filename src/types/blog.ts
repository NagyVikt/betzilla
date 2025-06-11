// File: src/types/blog.ts

export interface MockBlogImage {
  src: string;
  width: number;
  height: number;
}

export interface MockReadingTime {
  text: string;
  minutes?: number;
  time?: number;
  words?: number;
}

export interface Blog {
  id: number;
  documentId: string;
  title: string;
  description: string;
  publishedAt: string;      // ISO date string
  updatedAt: string;        // ISO date string
  slug: string;
  Author: string;
  banner?: {
    id: number;
    url: string;
    width: number;
    height: number;
  };
  image?: {
    id: number;
    url: string;
    width: number;
    height: number;
  };
  tags?: string[];
  Ingredients?: Array<{
    type: string;
    children: { text: string }[];
  }>;
  instructions?: Array<{
    type: string;
    children: { text: string }[];
  }>;
  nutritioninfo?: Array<{
    type: string;
    children: { text: string }[];
  }>;
  prepTime?: number | string;
  cookTime?: number | string;
  totalTime?: number | string;
  difficulty?: string;
  portions?: number | string;
  Portions?: number | string;  // Sometimes Strapi V5 uses uppercase key
  categories?: string;
  rating?: number | string;    // Optional, if you track ratings
  cost?: number | string;
  avgCost?: number | string;   // Optional, if you track an average cost
  costRank?: number | string;  // Optional, if you track cost ranking
  readingTime?: { text: string } | number;
  views?: number | string;
  images?: Array<{
    id: number;
    url: string;
    width: number;
    height: number;
  }>;
  localizations?: any[];
  [key: string]: any; // Allow extra fields, just in case
}
