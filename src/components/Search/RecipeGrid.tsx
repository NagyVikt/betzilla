// components/Search/RecipeGrid.tsx
import React from 'react'
import Link from 'next/link'
import { Lock, Star } from 'lucide-react'
import RecipeCardImage from '@/components/RecipeCardImage'

export interface Recipe {
  id: number
  title: string | null
  slug: string | null
  rating: number
  isFree: boolean
  imageUrl: string | null
}

export default function RecipeGrid({ recipes }: { recipes: Recipe[] }) {
  if (recipes.length === 0) {
    return <p className="text-center">Nincs a szűrőknek megfelelő találat.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map(rec => (
        <Link
          key={rec.id}
          href={rec.slug ? `/receptek/${rec.slug}` : '#'}
          className="group block rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
        >
          <div className="relative w-full h-48 bg-gray-100">
            <RecipeCardImage imageUrl={rec.imageUrl} title={rec.title} />
            <div className="absolute top-2 right-2">
              {rec.isFree ? (
                <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                  INGYENES
                </span>
              ) : (
                <span className="p-1 bg-red-500 text-white rounded-full">
                  <Lock size={12} />
                </span>
              )}
            </div>
          </div>
          <div className="p-4 bg-white">
            <h3 className="text-lg font-semibold truncate group-hover:text-pink-600">
              {rec.title || 'Nincs cím'}
            </h3>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < rec.rating ? 'currentColor' : 'none'}
                  className={i < rec.rating ? 'text-yellow-400' : 'text-gray-300'}
                />
              ))}
              <span className="text-xs text-gray-500 ml-2">({rec.rating}.0)</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
