// components/BannerCarousel.tsx
import React from "react";
import Image from "next/image";

const slides = [
  {
    id: 1,
    src: "/images/banner-csirkes-oke.jpg", // place your banner images in /public/images
    alt: "CookpadKötény2025 – Kedvenc csirkés receptem",
  },
  {
    id: 2,
    src: "/images/banner-springcakes.jpg",
    alt: "Tavaszi sütemények a nagyi módra",
  },
  {
    id: 3,
    src: "/images/banner-desserts.jpg",
    alt: "Új desszert ötletek 2025",
  },
];

const BannerCarousel: React.FC = () => {
  // *** For simplicity, we’re only showing the first slide statically.
  //    In production, swap this out for a carousel component (e.g. react-slick).
  const slide = slides[0];

  return (
    <div className="w-full mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      <div className="relative h-56 sm:h-72 md:h-96 rounded-3xl overflow-hidden shadow-lg">
        <Image
          src={slide.src}
          alt={slide.alt}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-6 text-white font-semibold text-lg sm:text-xl md:text-2xl">
          {slide.alt}
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;
