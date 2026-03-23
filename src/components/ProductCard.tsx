import Link from 'next/link'
import { IProduct } from '@/models/product'

interface ProductCardProps {
  product: IProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-square bg-gray-50 relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.requiresPrescription && (
          <span className="absolute top-2 right-2 bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
            Receta
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{product.brand}</p>
        <h2 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {product.name}
        </h2>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-semibold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            product.stock > 0
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
          </span>
        </div>
      </div>
    </Link>
  )
}
