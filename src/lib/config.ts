// File: src/lib/config.ts

/**
 * Put the Strapi base URL in your .env.local:
 *   NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
 *   STRAPI_API_TOKEN=<your_token_if_needed>
 */
export const BACKEND_STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "";
export const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || "";
