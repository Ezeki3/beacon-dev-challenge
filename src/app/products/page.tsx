import Link from 'next/link'
import dbConnect from '@/lib/db'
import Product, { IProduct } from '@/models/product'
import ProductCard from '@/components/ProductCard'
import SearchBar from '@/components/SearchBar'
import CategoryFilter from '@/components/CategoryFilter'

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string }>
}

const CATEGORIES = [
  'medicamentos',
  'suplementos',
  'cuidado-personal',
  'dispositivos-medicos',
] as const

export const metadata = {
  title: 'Catálogo de productos | Beacon Health',
  description: 'Explora nuestro catálogo de productos de salud y bienestar',
}

function buildQuery(q?: string, category?: string) {
  const filter: Record<string, unknown> = {}
  if (q) filter.name = { $regex: q, $options: 'i' }
  if (category && CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
    filter.category = category
  }
  return filter
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { q, category } = await searchParams

  await dbConnect()
  const products = await Product.find(buildQuery(q, category))
    .sort({ createdAt: -1 })
    .lean<IProduct[]>()

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-semibold">Catálogo de salud</h1>
        <Link
          href="/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Añadir producto
        </Link>
      </div>
      <p className="text-gray-500 mb-6">{products.length} productos encontrados</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <SearchBar initialValue={q} />
        <CategoryFilter categories={CATEGORIES} activeCategory={category} />
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-400 py-16">
          No se encontraron productos con esos filtros.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={String(product._id)} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}
