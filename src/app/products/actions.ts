'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from '@/lib/db'
import Product from '@/models/product'

export interface FormState {
  success: boolean
  message: string
  errors?: Record<string, string>
}

export async function createProduct(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = formData.get('price') as string
  const category = formData.get('category') as string
  const brand = formData.get('brand') as string
  const stock = formData.get('stock') as string
  const image = formData.get('image') as string
  const requiresPrescription = formData.get('requiresPrescription') === 'on'

  const errors: Record<string, string> = {}
  if (!name) errors.name = 'El nombre es requerido'
  if (!description) errors.description = 'La descripción es requerida'
  if (!price || isNaN(Number(price)) || Number(price) < 0)
    errors.price = 'El precio debe ser un número positivo'
  if (!category) errors.category = 'La categoría es requerida'
  if (!brand) errors.brand = 'La marca es requerida'
  if (!stock || isNaN(Number(stock)) || Number(stock) < 0)
    errors.stock = 'El stock debe ser un número positivo'
  if (!image) errors.image = 'La URL de imagen es requerida'

  if (Object.keys(errors).length > 0) {
    return { success: false, message: 'Por favor corrige los errores', errors }
  }

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

  try {
    await dbConnect()
    await Product.create({
      name,
      slug,
      description,
      price: Number(price),
      category,
      brand,
      stock: Number(stock),
      image,
      requiresPrescription,
    })

    revalidatePath('/products')
    return { success: true, message: 'Producto creado exitosamente' }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === '11000') {
      return { success: false, message: 'Ya existe un producto con ese nombre' }
    }
    return { success: false, message: 'Error al crear el producto' }
  }
}
