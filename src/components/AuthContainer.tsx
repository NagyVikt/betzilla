import React from "react";

// A simple SVG loader component
const Loader = () => (
  <svg
    className="animate-spin h-8 w-8 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// A simple Logo component
const Logo = ({
  inline = false,
  className = "",
}: {
  inline?: boolean;
  className?: string;
}) => {
  const logoText = "Cal.com";
  if (inline) {
    return <span className={`text-2xl font-bold ${className}`}>{logoText}</span>;
  }
  return <h1 className={`text-2xl font-bold ${className}`}>{logoText}</h1>;
};

interface Props {
  footerText?: React.ReactNode;
  showLogo?: boolean;
  heading?: string;
  loading?: boolean;
}

export default function AuthContainer({
  children,
  footerText,
  showLogo = false,
  heading,
  loading = false,
}: React.PropsWithChildren<Props>) {
  return (
    <div className="bg-white flex min-h-screen flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Logo up top */}
      {showLogo && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <Logo inline className="text-white" />
        </div>
      )}

      {/* Card */}
      <div className="relative mx-auto w-full max-w-md">
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 rounded-lg">
            <Loader />
          </div>
        )}

        <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-8 py-10 shadow-xl">
          {/* Heading */}
          {heading && (
            <h2 className="text-center text-3xl font-bold text-white mb-8">
              {heading}
            </h2>
          )}
          {children}
        </div>

        {footerText && (
          <p className="mt-8 text-center text-sm text-gray-400">
            {footerText}
          </p>
        )}
      </div>
    </div>
  );
}
