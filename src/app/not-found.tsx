// src/app/not-found.tsx

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="my-32 w-full dark:bg-dark flex justify-center items-center font-mr px-4">
      <div className="relative flex flex-col items-center justify-center text-center">
        {/* SVG of a searching grandma */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          className="w-48 h-48 mb-8 text-dark dark:text-light"
          aria-labelledby="grandmaIconTitle"
          role="img"
        >
          <title id="grandmaIconTitle">Searching Grandma Icon</title>
          {/* Head */}
          <circle cx="100" cy="60" r="25" fill="currentColor" />
          {/* Hair bun */}
          <circle cx="125" cy="50" r="10" fill="currentColor" />
          <circle cx="118" cy="45" r="8" fill="currentColor" />
          {/* Body */}
          <path
            d="M70 90 Q100 130 130 90 L130 150 Q100 160 70 150 Z"
            fill="currentColor"
          />
          {/* Glasses */}
          <circle cx="90" cy="60" r="8" stroke="gray" strokeWidth="2" fill="none" />
          <circle cx="110" cy="60" r="8" stroke="gray" strokeWidth="2" fill="none" />
          <line x1="98" y1="60" x2="102" y2="60" stroke="gray" strokeWidth="2" />
          {/* Searching/Confused expression lines */}
          <line x1="90" y1="50" x2="95" y2="45" stroke="gray" strokeWidth="1.5" />
          <line x1="110" y1="50" x2="105" y2="45" stroke="gray" strokeWidth="1.5" />
          {/* Magnifying glass */}
          <circle
            cx="60"
            cy="110"
            r="15"
            stroke="gray"
            strokeWidth="3"
            fill="rgba(200,200,255,0.3)"
          />
          <line x1="50" y1="125" x2="40" y2="135" stroke="gray" strokeWidth="3" />
          {/* Question mark */}
          <text
            x="150"
            y="70"
            fontSize="40"
            fontFamily="Arial, sans-serif"
            fill="currentColor"
            transform="rotate(15 150 70)"
          >
            ?
          </text>
        </svg>

        <h1
          className={`inline-block text-dark dark:text-light text-6xl font-bold w-full capitalize xl:text-8xl text-center`}
        >
          404
        </h1>
        <h2
          className={`inline-block text-dark dark:text-light text-4xl sm:text-5xl font-bold w-full xl:text-6xl text-center mt-4 tracking-wide leading-snug`}
        >
          Ezt a receptet még a nagyi sem találja!
        </h2>

        {/* Use Next.js Link for client-side navigation */}
        <Link
          href="/"
          className="self-center mt-8 inline-block rounded-lg border-2 border-solid bg-dark px-4 py-2
            font-semibold text-light hover:border-dark hover:bg-light hover:text-dark
            dark:bg-light dark:text-dark hover:dark:bg-dark hover:dark:text-light hover:dark:border-light
            transition-colors duration-200 ease-in-out"
        >
          Vissza a főoldalra
        </Link>
      </div>
    </main>
  );
}
