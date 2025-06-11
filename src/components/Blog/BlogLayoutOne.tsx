// src/components/Blog/BlogLayoutOne.tsx
import Image from "next/image";
import Link from "next/link";

interface Blog {
  title: string;
  slug?: string;      // optional
  excerpt: string;
  publishedAt: string;
  author: string;
  image?: {
    src: string;
    blurDataURL?: string;
    width?: number;
    height?: number;
  };
}

interface BlogLayoutOneProps {
  blog?: Blog;       // blog can now be undefined
}

export default function BlogLayoutOne({ blog }: BlogLayoutOneProps) {
  // If blog is missing, render nothing (or a placeholder)
  if (!blog) return null;

  return (
    <article className="max-w-4xl mx-auto py-8">
      <h2 className="text-3xl font-bold mb-4">
        {blog.slug ? (
          <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
        ) : (
          blog.title
        )}
      </h2>

      {blog.image ? (
        <Image
          src={blog.image.src}
          alt={blog.title}
          width={blog.image.width ?? 800}
          height={blog.image.height ?? 450}
          placeholder={blog.image.blurDataURL ? "blur" : undefined}
          blurDataURL={blog.image.blurDataURL}
          className="w-full h-auto mb-4 rounded-lg"
        />
      ) : (
        <div className="w-full h-60 bg-gray-200 mb-4 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">No Image Available</span>
        </div>
      )}

      <p className="text-gray-700 mb-6">{blog.excerpt}</p>

      <div className="flex items-center text-sm text-gray-500">
        <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
        <span className="mx-2">•</span>
        <span>{blog.author}</span>
      </div>
    </article>
  );
}
