// components/RecipeCardImage.tsx
"use client";

import React from "react";
import Image from "next/image";

interface RecipeCardImageProps {
  imageUrl: string | null;
  title: string;
}

export default function RecipeCardImage({
  imageUrl,
  title,
}: RecipeCardImageProps) {
  const [currentUrl, setCurrentUrl] = React.useState<string | null>(imageUrl);
  const [errored, setErrored] = React.useState(false);

  React.useEffect(() => {
    // Whenever the parent updates `imageUrl`, reset local state
    setCurrentUrl(imageUrl);
    setErrored(false);
  }, [imageUrl]);

  const handleError = () => {
    setErrored(true);
    // Fall back to the local placeholder:
    setCurrentUrl(null);
  };

  // If there's no imageUrl or we've already had an error, show local placeholder
  if (!currentUrl || errored) {
    return (
      <Image
        src="/placeholder.png"
        alt={title || "Nincs kép elérhető"}
        fill
        className="object-cover object-center"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    );
  }

  return (
    <Image
      src={currentUrl}
      alt={title || "Recept kép"}
      fill
      className="object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-in-out"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      onError={handleError}
      priority
    />
  );
}
