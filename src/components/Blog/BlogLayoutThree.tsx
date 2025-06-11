// src/components/Blog/BlogLayoutThree.tsx
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Blog {
  title: string;
  url?: string;            // optional
  publishedAt: string;
  tags?: string[];         // optional array
  image?: {
    src: string;
    blurDataURL?: string;
    width?: number;
    height?: number;
  };
}

interface BlogLayoutThreeProps {
  blog?: Blog;             // blog itself can be undefined
}

const BlogLayoutThree: React.FC<BlogLayoutThreeProps> = ({ blog }) => {
  if (!blog) return null;

  return (
    <div className="group flex flex-col items-center text-dark dark:text-light">
      {blog.url && blog.image ? (
        <Link
          href={blog.url}
          className="h-full rounded-xl overflow-hidden"
        >
          <Image
            src={blog.image.src}
            placeholder={blog.image.blurDataURL ? "blur" : undefined}
            blurDataURL={blog.image.blurDataURL}
            alt={blog.title}
            width={blog.image.width ?? 800}
            height={blog.image.height ?? 600}
            className="aspect-[4/3] w-full h-full object-cover object-center group-hover:scale-105 transition-all ease duration-300"
            sizes="(max-width: 640px) 100vw,(max-width: 1024px) 50vw, 33vw"
          />
        </Link>
      ) : (
        <div className="w-full h-60 bg-gray-200 rounded-xl flex items-center justify-center">
          <span className="text-gray-500">No Image Available</span>
        </div>
      )}

      <div className="flex flex-col w-full mt-4">
        {blog.tags && blog.tags.length > 0 && (
          <span className="uppercase text-accent dark:text-accentDark font-semibold text-xs sm:text-sm">
            {blog.tags[0]}
          </span>
        )}

        {blog.url ? (
          <Link href={blog.url} className="inline-block my-1">
            <h2 className="font-semibold capitalize text-base sm:text-lg">
              <span
                className="bg-gradient-to-r from-accent/50 to-accent/50 dark:from-accentDark/50
                  dark:to-accentDark/50 bg-[length:0px_6px]
                  group-hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat
                  transition-[background-size] duration-500"
              >
                {blog.title}
              </span>
            </h2>
          </Link>
        ) : (
          <h2 className="font-semibold capitalize text-base sm:text-lg">
            {blog.title}
          </h2>
        )}

        <span className="capitalize text-gray dark:text-light/50 font-semibold text-sm sm:text-base">
          {format(new Date(blog.publishedAt), "MMMM dd, yyyy")}
        </span>
      </div>
    </div>
  );
};

export default BlogLayoutThree;
