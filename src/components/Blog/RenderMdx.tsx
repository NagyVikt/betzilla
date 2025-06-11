// components/Blog/RenderMdx.tsx
"use client";
import React from "react";
import MDXContent from "./MDXContent";
import type { Blog } from "@/types/blog";

const mdxComponents = {
  // Add any custom MDX components here if needed
};

interface RenderMdxProps {
  blog: Blog;
}

const RenderMdx: React.FC<RenderMdxProps> = ({ blog }) => (
  <div className="col-span-12 lg:col-span-8 font-in prose sm:prose-base md:prose-lg max-w-max ..."> 
    <MDXContent code={blog.body} components={mdxComponents}/>
  </div>
);

export default RenderMdx;
