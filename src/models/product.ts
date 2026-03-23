import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IProduct extends Document {
  name: string
  slug: string
  description: string
  price: number
  category: 'medicamentos' | 'suplementos' | 'cuidado-personal' | 'dispositivos-medicos'
  brand: string
  stock: number
  image: string
  requiresPrescription: boolean
  createdAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    name:                 { type: String, required: true, trim: true },
    slug:                 { type: String, required: true, unique: true, lowercase: true },
    description:          { type: String, required: true },
    price:                { type: Number, required: true, min: 0 },
    category:             {
      type: String,
      required: true,
      enum: ['medicamentos', 'suplementos', 'cuidado-personal', 'dispositivos-medicos'],
    },
    brand:                { type: String, required: true },
    stock:                { type: Number, required: true, min: 0, default: 0 },
    image:                { type: String, required: true },
    requiresPrescription: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Product: Model<IProduct> =
  mongoose.models.Product ?? mongoose.model<IProduct>('Product', ProductSchema)

export default Product
