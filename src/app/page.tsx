// src/app/page.tsx
import Link from "next/link";
import Header from "@/components/Header";
import SearchBar from "@/components/Search/SearchBar";
import BannerCarousel from "@/components/Banner/BannerCarousel";
import PopularSearches from "@/components/Search/PopularSearches";
import CategoriesSection from "@/components/Search/CategoriesSection";

// shadcn/ui Accordion
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

// icons
import { ArrowRight } from "lucide-react";

const faqItems = [
  {
    value: "faq-1",
    q: "Hogyan oszthatom meg a receptemet?",
    a: "Regisztrálj, kattints a „Recept feltöltése” gombra, töltsd fel a hozzávalókat és a lépéseket.",
  },
  {
    value: "faq-2",
    q: "Kell fizetnem, ha el akarom adni a receptem?",
    a: "Nem, a feltöltés és értékesítés alapból ingyenes – a bevételből csak 5% jutalékot vonunk le.",
  },
  {
    value: "faq-3",
    q: "Hogyan kapok visszajelzést?",
    a: "A felhasználók értékelhetik és kommentelhetik a receptedet, sőt élő chat-en is kommunikálhatsz velük.",
  },
  {
    value: "faq-4",
    q: "Biztonságos az oldalon fizetni?",
    a: "Teljesen: Stripe és PayPal integrációval, SSL titkosítással védjük a tranzakciókat.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative pt-24 pb-16 text-center px-4 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold mb-4">
              Betzilla
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8">
              Teljesen ingyen feltöltheted saját receptjeidet, vagy böngészheted és megvásárolhatod mások titkos receptjeit.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
              <Link
                href="/upload"
                className="inline-block px-6 py-3 bg-pink-500 text-white rounded-full font-semibold shadow hover:bg-pink-600 transition"
              >
                Recept feltöltése
              </Link>
              <Link
                href="/titkos-receptek"
                className="inline-flex items-center px-6 py-3 border-2 border-pink-500 text-pink-500 rounded-full font-semibold hover:bg-pink-50 dark:hover:bg-pink-900 transition"
              >
                Titkos Receptek
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="mx-auto max-w-xl">
              <SearchBar placeholder="Keresés receptre, vagy hozzávalóra..." buttonText="Keresés" />
            </div>
          </div>
        </section>

        {/* Carousel */}
        <BannerCarousel
          slides={[
            { id: 1, src: "/images/banner-free-share.jpg", alt: "Oszd meg recepted ingyen" },
            { id: 2, src: "/images/banner-secret.jpg",    alt: "Titkos Receptek piac" },
            { id: 3, src: "/images/banner-community.jpg", alt: "Nagy receptközösség" },
          ]}
        />

        {/* Popular Searches */}
        <PopularSearches
          items={[
            { label: "almás pite", imageSrc: "/images/popular/almas-pite.jpg", href: "/search?query=alm%C3%A1s+pite" },
            { label: "rántott csirke", imageSrc: "/images/popular/rantott-csirke.jpg", href: "/search?query=rantott+csirke" },
            { label: "vega burger", imageSrc: "/images/popular/vega-burger.jpg", href: "/search?query=vega+burger" },
            { label: "csokis brownie", imageSrc: "/images/popular/brownie.jpg", href: "/search?query=brownie" },
          ]}
        />

        {/* Categories */}
        <CategoriesSection
          categories={[
            {
              title: "ELŐÉTELEK",
              imageSrc: "/images/categories/appetizers.jpg",
              subItems: [
                { label: "Bruschetta", href: "/category/bruschetta" },
                { label: "Falafel",   href: "/category/falafel" },
              ],
            },
            {
              title: "FŐÉTELEK",
              imageSrc: "/images/categories/mains.jpg",
              subItems: [
                { label: "Csirke", href: "/category/csirke" },
                { label: "Tészta", href: "/category/teszta" },
              ],
            },
            {
              title: "DESSZERTEK",
              imageSrc: "/images/categories/desserts.jpg",
              subItems: [
                { label: "Sütemény", href: "/category/sutemenyek" },
                { label: "Fagylalt", href: "/category/fagylalt" },
              ],
            },
          ]}
        />

        {/* FAQ Section */}
        <section id="faq" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-950">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Gyakran ismételt kérdések
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Válaszok a leggyakoribb kérdésekre a receptmegosztó platformmal kapcsolatban.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item) => (
                  <AccordionItem
                    key={item.value}
                    value={item.value}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <AccordionTrigger className="flex justify-between items-center py-4 text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-pink-500 dark:hover:text-pink-400">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="pt-0 pb-4 text-gray-600 dark:text-gray-400 text-base">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-2">Nagyireceptjei.hu</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Oszd meg és fedezd fel a legjobb recepteket – ingyenesen és egyszerűen.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Hasznos linkek</h4>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li><Link href="/">Kezdőlap</Link></li>
              <li><Link href="/titkos-receptek">Titkos Receptek</Link></li>
              <li><Link href="/faq">GYIK</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Kapcsolat</h4>
            <p className="text-gray-600 dark:text-gray-400">info@nagyireceptjei.hu</p>
            <p className="text-gray-600 dark:text-gray-400">+36 1 234 5678</p>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-500">
          &copy; {new Date().getFullYear()} Nagyireceptjei.hu. Minden jog fenntartva.
        </div>
      </footer>
    </div>
  );
}
