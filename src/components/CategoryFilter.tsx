'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

interface CategoryFilterProps {
  categories: readonly string[]
  activeCategory?: string
}

export default function CategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSelect = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category === activeCategory) {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  const labels: Record<string, string> = {
    'medicamentos': 'Medicamentos',
    'suplementos': 'Suplementos',
    'cuidado-personal': 'Cuidado personal',
    'dispositivos-medicos': 'Dispositivos médicos',
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleSelect(cat)}
          aria-pressed={cat === activeCategory}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            cat === activeCategory
              ? 'bg-blue-800 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {labels[cat] ?? cat}
        </button>
      ))}
    </div>
  )
}
