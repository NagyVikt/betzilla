"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";
import {
  SearchIcon,
  CookbookIcon,
  LockIcon,
  HeartIcon,
  UserIcon,
} from "../Icons";

const cx = (...args: (string | undefined | null | false | 0)[]) =>
  args.filter(Boolean).join(" ");

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState("");

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Track current URL + hash to highlight active links
  useEffect(() => {
    const updateActivePath = () => {
      setActivePath(window.location.pathname + window.location.hash);
    };
    updateActivePath();
    window.addEventListener("hashchange", updateActivePath);
    return () => window.removeEventListener("hashchange", updateActivePath);
  }, []);

  // Add shadow / background on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  // Common link styles
  const commonLinkClasses =
    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out text-base font-medium group focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400";
  const scrolledLinkTextColor = "text-gray-700 dark:text-gray-200";
  const topLinkTextColor = "text-gray-800 dark:text-gray-100";
  const hoverScrolledClasses =
    "hover:bg-pink-100 dark:hover:bg-pink-700/50 hover:text-pink-700 dark:hover:text-pink-300";
  const hoverTopClasses =
    "hover:bg-white/30 dark:hover:bg-black/30 hover:text-pink-700 dark:hover:text-pink-300";
  const activeScrolledClasses =
    "bg-pink-500 text-white dark:bg-pink-600 dark:text-white shadow-md";
  const activeTopClasses =
    "bg-pink-500/80 text-white dark:bg-pink-600/90 dark:text-white shadow-md";

  // Determine each link’s classes
  const getLinkClasses = (path: string) => {
    const isActive =
      activePath === path ||
      (path === "/napi-ajanlat" &&
        (activePath === "/" || activePath === "/#"));

    let linkClasses = cx(commonLinkClasses);
    if (isActive) {
      linkClasses = cx(
        linkClasses,
        scrolled ? activeScrolledClasses : activeTopClasses
      );
    } else {
      linkClasses = cx(
        linkClasses,
        scrolled ? scrolledLinkTextColor : topLinkTextColor
      );
      linkClasses = cx(
        linkClasses,
        scrolled ? hoverScrolledClasses : hoverTopClasses
      );
    }
    return linkClasses;
  };

  // Nav links array (desktop + mobile)
  const navLinks = [
    {
      href: "/search",
      text: "Kereső",
      icon: (
        <SearchIcon className="w-5 h-5 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors" />
      ),
    },
    {
      href: "/receptek",
      text: "Receptek",
      icon: (
        <CookbookIcon className="w-5 h-5 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors" />
      ),
    },
    {
      href: "/titkos-receptek",
      text: "Titkos Receptek",
      icon: (
        <LockIcon className="w-5 h-5 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors" />
      ),
    },
    {
      href: "/create",
      text: "Recept Létrehozása",
      icon: (
        <HeartIcon className="w-5 h-5 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors" />
      ),
    },
  ];

  // Framer Motion variants for the overlay
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  // Framer Motion variants for the menu panel (drop-down effect)
  const menuVariants = {
    hidden: { scaleY: 0, opacity: 0, transformOrigin: "top center" },
    visible: {
      scaleY: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
      transformOrigin: "top center",
    },
    exit: {
      scaleY: 0,
      opacity: 0,
      transition: { type: "spring", stiffness: 250, damping: 35 },
      transformOrigin: "top center",
    },
  };

  return (
    <header
      className={cx(
        // Header sits above everything (z-[200])
        "fixed top-0 left-0 w-full z-[200] transition-all duration-300 ease-in-out",
        !scrolled
          ? "bg-white/70 dark:bg-gray-950/60 backdrop-blur-sm"
          : "bg-white/85 dark:bg-gray-900/85 backdrop-blur-md shadow-lg"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <Logo />

        {/* ======================================================== */}
        {/* MOBILE HAMBURGER BUTTON                                */}
        {/* ======================================================== */}
        <div className="relative z-[210] sm:hidden">
          <button
            className={cx(
              "flex items-center justify-center p-2 rounded-md transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500",
              scrolled || mobileMenuOpen
                ? "text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                : "text-gray-700 dark:text-gray-200"
            )}
            onClick={toggleMobileMenu}
            aria-label="Mobil menü"
            aria-expanded={mobileMenuOpen}
          >
            {/* Hamburger / Close Icon */}
            <div className="w-6 h-6 relative">
              <span
                className={cx(
                  "absolute block h-0.5 w-full bg-current rounded-full transform transition-all duration-300 ease-in-out",
                  mobileMenuOpen
                    ? "top-1/2 -translate-y-1/2 rotate-45"
                    : "top-[25%]"
                )}
              />
              <span
                className={cx(
                  "absolute block h-0.5 w-full bg-current rounded-full top-1/2 -translate-y-1/2 transition-opacity duration-200 ease-in-out",
                  mobileMenuOpen ? "opacity-0" : "opacity-100"
                )}
              />
              <span
                className={cx(
                  "absolute block h-0.5 w-full bg-current rounded-full transform transition-all duration-300 ease-in-out",
                  mobileMenuOpen
                    ? "bottom-1/2 translate-y-1/2 -rotate-45"
                    : "bottom-[25%]"
                )}
              />
            </div>
          </button>
        </div>

        {/* ======================================================== */}
        {/* DESKTOP NAVIGATION (VISIBLE FROM sm UP)                 */}
        {/* ======================================================== */}
        <nav className="hidden sm:flex items-center space-x-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={getLinkClasses(link.href)}
            >
              {React.cloneElement(link.icon, {
                className: cx(
                  link.icon.props.className,
                  (activePath === link.href ||
                  (link.href === "/napi-ajanlat" &&
                    (activePath === "/" || activePath === "/#")))
                    ? "text-white dark:text-white"
                    : "group-hover:text-pink-600 dark:group-hover:text-pink-400"
                ),
              })}
              <span>{link.text}</span>
            </a>
          ))}

          {/* Desktop “Belépés” button */}
          <a
            href="/belepes"
            className={cx(
              commonLinkClasses,
              scrolled ? scrolledLinkTextColor : topLinkTextColor,
              scrolled ? hoverScrolledClasses : hoverTopClasses,
              "ml-2"
            )}
          >
            <UserIcon className="w-5 h-5 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors" />
            <span>Belépés</span>
          </a>
        </nav>
      </div>

      {/* ======================================================== */}
      {/* FULLSCREEN MOBILE MENU WITH FRAMER MOTION               */}
      {/* ======================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-lg sm:hidden"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={toggleMobileMenu}
              aria-hidden="true"
            />

            {/* Menu panel */}
            <motion.div
              className="fixed inset-0 z-[150] h-screen flex flex-col pb-8 px-4 bg-white dark:bg-gray-900/95 overflow-y-auto sm:hidden transform-gpu"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Spacer so that content starts below the header */}
              <div className="h-16" />

              {/* Logo at top of mobile menu */}
              <div className="mb-6 flex justify-center">
                <Logo />
              </div>

              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={cx(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out font-medium text-base",
                      "focus:outline-none focus:ring-2 focus:ring-pink-500",
                      activePath === link.href
                        ? "bg-pink-500 text-white shadow-lg hover:bg-pink-600"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-700/50 hover:text-pink-700 dark:hover:text-pink-300 shadow-sm hover:shadow-md"
                    )}
                    onClick={() => {
                      setActivePath(link.href);
                      toggleMobileMenu();
                    }}
                  >
                    {React.cloneElement(link.icon, {
                      className: cx(
                        link.icon.props.className,
                        activePath === link.href
                          ? "text-white"
                          : "group-hover:text-pink-600 dark:group-hover:text-pink-400"
                      ),
                    })}
                    <span>{link.text}</span>
                  </a>
                ))}

                {/* Separator line */}
                <div className="border-t border-gray-300 dark:border-gray-700 my-4" />

                {/* “Belépés” Link at the bottom */}
                <a
                  href="/belepes"
                  className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-pink-500 text-white font-semibold transition-all duration-200 ease-in-out hover:bg-pink-600 shadow-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                  onClick={() => {
                    setActivePath("/belepes");
                    toggleMobileMenu();
                  }}
                >
                  <UserIcon className="w-5 h-5 text-white" />
                  <span>Belépés</span>
                </a>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
