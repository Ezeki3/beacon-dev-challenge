import { notFound } from 'next/navigation'
import Link from 'next/link'
import dbConnect from '@/lib/db'
import Product from '@/models/product'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  await dbConnect()
  const product = await Product.findOne({ slug }).lean()

  if (!product) return { title: 'Producto no encontrado' }

  return {
    title: `${product.name} | Beacon Health`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  await dbConnect()
  const product = await Product.findOne({ slug }).lean()

  if (!product) notFound()

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/products"
        className="text-sm text-blue-600 hover:underline mb-6 inline-block"
      >
        ← Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <span className="text-sm text-gray-400 uppercase tracking-wide">
              {product.brand}
            </span>
            <h1 className="text-2xl font-semibold mt-1">{product.name}</h1>
          </div>

          <p className="text-3xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </p>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          <div className="flex flex-wrap gap-2 mt-auto">
            <span className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full capitalize">
              {product.category}
            </span>
            {product.requiresPrescription && (
              <span className="bg-amber-50 text-amber-700 text-sm px-3 py-1 rounded-full">
                Requiere receta
              </span>
            )}
            <span className={`text-sm px-3 py-1 rounded-full ${
              product.stock > 0
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}>
              {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
