import { compareDesc, parseISO } from "date-fns";

// Utility: join classes
export const cx = (...classNames: (string | undefined | null | false)[]): string =>
  classNames.filter(Boolean).join(" ");

// Type for blogs (adjust as needed for your project)
// Generic utility: sort items with a publishedAt property by date
export const sortBlogs = <T extends { publishedAt: string; updatedAt?: string }>(blogs: T[]): T[] => {
  return blogs
    .slice()
    .sort((a, b) =>
      compareDesc(parseISO(a.publishedAt), parseISO(b.publishedAt))
    );
};
