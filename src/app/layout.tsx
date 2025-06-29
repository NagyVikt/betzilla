// app/layout.tsx (or pages/_app.tsx if you’re still on the Pages Router)

import "./globals.css";
import { cx } from "@/utils";
import { Inter, Manrope } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import siteMetadata from "@/utils/siteMetadata";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-in",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mr",
});

export const metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    template: `%s | ${siteMetadata.title}`,
    default: siteMetadata.title,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    images: [siteMetadata.socialBanner],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cx(
          inter.variable,
          manrope.variable,
          "font-mr bg-light dark:bg-dark"
        )}
      >
        {/* Theme‐Switcher Script */}
        <Script id="theme-switcher" strategy="beforeInteractive">
          {`
            if (
              localStorage.getItem('theme') === 'dark' ||
              (!('theme' in localStorage) &&
                window.matchMedia('(prefers-color-scheme: dark)').matches)
            ) {
              document.documentElement.classList.add('dark')
            } else {
              document.documentElement.classList.remove('dark')
            }
          `}
        </Script>

        {/* 1) The fixed header remains at the top */}
        <Header />

        {/*
          2) Wrap all page content in a div with pt-16 so it's always
             pushed below the 4rem-tall header. If you change <Header>
             to be taller/shorter, simply update this class once.
        */}
        <div className="pt-16">
          {children}
        </div>

        {/* 3) Optional footer at the bottom */}
        <Footer />
      </body>
    </html>
  );
}
