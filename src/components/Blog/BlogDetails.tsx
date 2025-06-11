import { format, parseISO } from "date-fns";
import Link from "next/link";
import React from "react";
import { slug as slugify } from "github-slugger";
import ViewCounter from "./ViewCounter";
import type { Blog } from "@/types/blog";

// Bring in our extracted components:
import { DetailItem } from "./DetailItem";
import { DifficultyScale, parseDifficulty } from "./DifficultyScale";

// Using lucide-react for icons
import {
  CalendarDays,
  Timer,
  Flame,
  Hourglass,
  Activity,
  UsersRound,
  Archive,
  CircleDollarSign,
  Eye,
  BookOpen,
  Tag as TagIcon,
} from "lucide-react";

interface BlogDetailsProps {
  blog: Blog;
  slug: string;
}

const BlogDetails: React.FC<BlogDetailsProps> = ({ blog, slug: blogSlug }) => {
  // 1) Times: always convert to string and append "perc" if numeric
  const prepTime = blog.prepTime != null ? String(blog.prepTime) : "N/A";
  const cookTime = blog.cookTime != null ? String(blog.cookTime) : "N/A";
  const totalTime = blog.totalTime != null ? String(blog.totalTime) : "N/A";

  // 2) Difficulty (use parseDifficulty)
  const rawDifficulty = blog.difficulty != null ? String(blog.difficulty) : "N/A";
  const difficultyLevel =
    rawDifficulty !== "N/A" ? parseDifficulty(rawDifficulty) : 0;

  // 3) Portions: Strapi v5 might return "portions" or "Portions"
  const rawPortions =
    blog.portions != null
      ? String(blog.portions)
      : blog.Portions != null
      ? String(blog.Portions)
      : "N/A";

  // 4) Category
  const categoryName = blog.categories != null ? String(blog.categories) : "N/A";

  // 5) Cost
  const costRaw = blog.cost != null ? String(blog.cost) : "N/A";

  // 6) Reading Time: could be { text: ... } or a number, or missing
  let readingTimeStr: string;
  if (blog.readingTime && typeof (blog.readingTime as any).text === "string") {
    readingTimeStr = (blog.readingTime as any).text;
  } else if (typeof blog.readingTime === "number") {
    readingTimeStr = `${blog.readingTime} perc olvasás`;
  } else {
    readingTimeStr = "N/A";
  }

  // 7) Append unit labels if needed
  const prepTimeUnit =
    prepTime !== "N/A" && !prepTime.includes("perc") ? "perc" : "";
  const cookTimeUnit =
    cookTime !== "N/A" && !cookTime.includes("perc") ? "perc" : "";
  const totalTimeUnit =
    totalTime !== "N/A" && !totalTime.includes("perc") ? "perc" : "";

  const portionsUnit =
    rawPortions !== "N/A" &&
    !rawPortions.toLowerCase().includes("szelet") &&
    !rawPortions.toLowerCase().includes("fő")
      ? "szelet"
      : "";

  const costUnit =
    costRaw !== "N/A" && !costRaw.toLowerCase().includes("ft") ? "Ft" : "";

  return (
    <div className="bg-gradient-to-br from-pink-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-2xl rounded-3xl p-6 md:p-8 mx-auto mb-12 w-full max-w-6xl">
      {/* —————————————————————————————————————————————————————— */}
      {/* 1) Single-line Header: Date | Author | Reading Time | Views */}
      {/* —————————————————————————————————————————————————————— */}
      <div className="flex flex-nowrap items-center gap-4 text-xs text-gray-700 dark:text-gray-300 overflow-x-auto pb-2 border-b border-gray-200 dark:border-gray-700">
        {/* Published Date */}
        <div className="flex items-center whitespace-nowrap">
          <CalendarDays className="h-4 w-4 text-pink-500 dark:text-pink-400" />
          <time className="ml-1 font-medium">
            Publikálva: {format(parseISO(blog.publishedAt), "yyyy. LLLL d.")}
          </time>
        </div>

        <span className="text-gray-400">|</span>

        {/* Author */}
        <div className="whitespace-nowrap font-medium">
          Szerző: {blog.Author ?? "N/A"}
        </div>

        <span className="text-gray-400">|</span>

        {/* Reading Time */}
        <div className="flex items-center whitespace-nowrap">
          <BookOpen className="h-4 w-4 text-pink-500 dark:text-pink-400" />
          <span className="ml-1 font-medium">Olvasási idő: {readingTimeStr}</span>
        </div>

        <span className="text-gray-400">|</span>

        {/* Views */}
        <div className="flex items-center whitespace-nowrap">
          <Eye className="h-4 w-4 text-pink-500 dark:text-pink-400" />
          <span className="ml-1 font-medium">
            <ViewCounter slug={blogSlug} />
          </span>
        </div>
      </div>

      {/* —————————————————————————————————————————————————————— */}
      {/* 2) Compact Stats Grid */}
      {/* —————————————————————————————————————————————————————— */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
        {/* Előkészítési idő */}
        <DetailItem
          icon={<Timer size={20} />}
          label="Előkészítési idő"
          value={prepTime}
          unit={prepTimeUnit}
          className="bg-white dark:bg-gray-800"
        />

        {/* Sütési idő */}
        <DetailItem
          icon={<Flame size={20} />}
          label="Sütési idő"
          value={cookTime}
          unit={cookTimeUnit}
          className="bg-white dark:bg-gray-800"
        />

        {/* Összes idő */}
        <DetailItem
          icon={<Hourglass size={20} />}
          label="Összes idő"
          value={totalTime}
          unit={totalTimeUnit}
          className="bg-white dark:bg-gray-800"
        />

        {/* Nehézség */}
        <div className="flex flex-col items-center text-center p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="text-pink-500 dark:text-pink-400 mb-1">
            <Activity size={20} />
          </div>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Nehézség
          </span>
          <div className="mt-1">
            <DifficultyScale level={difficultyLevel} />
          </div>
        </div>

        {/* Adag */}
        <DetailItem
          icon={<UsersRound size={20} />}
          label="Adag"
          value={rawPortions}
          unit={portionsUnit}
          className="bg-white dark:bg-gray-800"
        />

        {/* Kategória */}
        <DetailItem
          icon={<Archive size={20} />}
          label="Kategória"
          value={categoryName}
          className="bg-white dark:bg-gray-800"
        />

        {/* Költség */}
        <DetailItem
          icon={<CircleDollarSign size={20} />}
          label="Költség"
          value={costRaw}
          unit={costUnit}
          className="bg-white dark:bg-gray-800"
        />

        {/* Címkék (span full width on large) */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="col-span-full flex flex-col items-center text-center p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-pink-500 dark:text-pink-400 mb-1">
              <TagIcon size={20} />
            </div>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Címkék
            </span>
            <div className="flex flex-wrap justify-center mt-1 gap-1 text-[10px]">
              {blog.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/categories/${slugify(tag)}`}
                  className="bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-200 px-2 py-0.5 rounded-full hover:bg-pink-200 dark:hover:bg-pink-800 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;
