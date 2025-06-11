// src/components/Blog/BlogLayoutTwo.tsx
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Blog {
  title: string;
  url?: string;           // now optional
  publishedAt: string;
  tags?: string[];        // tags might be undefined or empty
  image?: {
    src: string;
    blurDataURL?: string;
    width?: number;
    height?: number;
  };
}

interface BlogLayoutTwoProps {
  blog?: Blog;            // blog itself can be undefined
}

const BlogLayoutTwo: React.FC<BlogLayoutTwoProps> = ({ blog }) => {
  if (!blog) return null; // nothing to render if no blog provided

  const { title, url, publishedAt, tags, image } = blog;

  return (
    <div className="group grid grid-cols-12 gap-4 items-center text-dark dark:text-light">
      {url ? (
        <Link
          href={url}
          className="col-span-12 lg:col-span-4 h-full rounded-xl overflow-hidden"
        >
          {image ? (
            <Image
              src={image.src}
              placeholder={image.blurDataURL ? "blur" : undefined}
              blurDataURL={image.blurDataURL}
              alt={title}
              width={image.width ?? 800}
              height={image.height ?? 450}
              className="aspect-square w-full h-full object-cover object-center group-hover:scale-105 transition-all ease duration-300"
              sizes="(max-width: 640px) 100vw,(max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </Link>
      ) : (
        // If there’s no URL, we still want to show the image or placeholder
        <div className="col-span-12 lg:col-span-4 h-full rounded-xl overflow-hidden">
          {image ? (
            <Image
              src={image.src}
              placeholder={image.blurDataURL ? "blur" : undefined}
              blurDataURL={image.blurDataURL}
              alt={title}
              width={image.width ?? 800}
              height={image.height ?? 450}
              className="aspect-square w-full h-full object-cover object-center"
              sizes="(max-width: 640px) 100vw,(max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>
      )}

      <div className="col-span-12 lg:col-span-8 w-full">
        {tags && tags.length > 0 && (
          <span className="inline-block w-full uppercase text-accent dark:text-accentDark font-semibold text-xs sm:text-sm">
            {tags[0]}
          </span>
        )}

        {url ? (
          <Link href={url} className="inline-block my-1">
            <h2 className="font-semibold capitalize text-base sm:text-lg">
              <span
                className="bg-gradient-to-r from-accent/50 dark:from-accentDark/50 to-accent/50 dark:to-accentDark/50 bg-[length:0px_6px]
                   group-hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500"
              >
                {title}
              </span>
            </h2>
          </Link>
        ) : (
          <h2 className="font-semibold capitalize text-base sm:text-lg mb-1">
            {title}
          </h2>
        )}

        <span className="inline-block w-full capitalize text-gray dark:text-light/50 font-semibold text-xs sm:text-base">
          {publishedAt
            ? format(new Date(publishedAt), "MMMM dd, yyyy")
            : ""}
        </span>
      </div>
    </div>
  );
};

export default BlogLayoutTwo;
