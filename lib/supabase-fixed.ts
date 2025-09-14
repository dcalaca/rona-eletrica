import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos TypeScript para as tabelas
export interface RonaUser {
  id: string
  email: string
  name: string
  phone?: string
  cpf?: string
  birth_date?: string
  gender?: string
  role: 'customer' | 'vendor' | 'admin'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RonaAddress {
  id: string
  user_id: string
  type: 'billing' | 'shipping'
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zip_code: string
  is_default: boolean
  created_at: string
}

export interface RonaCategory {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  parent_id?: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface RonaBrand {
  id: string
  name: string
  slug: string
  logo_url?: string
  website?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RonaProduct {
  id: string
  name: string
  slug: string
  description?: string
  short_description?: string
  sku: string
  barcode?: string
  category_id?: string
  brand_id?: string
  price: number
  compare_price?: number
  cost_price?: number
  weight?: number
  dimensions?: {
    length?: number
    width?: number
    height?: number
  }
  stock_quantity: number
  min_stock_quantity: number
  max_stock_quantity?: number
  is_digital: boolean
  is_active: boolean
  is_featured: boolean
  meta_title?: string
  meta_description?: string
  tags?: string[]
  specifications?: Record<string, any>
  features?: string[]
  created_at: string
  updated_at: string
  // Relacionamentos
  category?: RonaCategory
  brand?: RonaBrand
  images?: RonaProductImage[]
}

export interface RonaProductImage {
  id: string
  product_id: string
  url: string
  alt_text?: string
  sort_order: number
  is_primary: boolean
  created_at: string
}

export interface RonaProductReview {
  id: string
  product_id: string
  user_id: string
  rating: number
  title?: string
  comment?: string
  is_verified: boolean
  is_approved: boolean
  created_at: string
  updated_at: string
  // Relacionamentos
  user?: RonaUser
}

export interface RonaCartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
  // Relacionamentos
  product?: RonaProduct
}

export interface RonaOrder {
  id: string
  order_number: string
  user_id: string
  vendor_id?: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
  payment_method?: string
  payment_id?: string
  subtotal: number
  shipping_cost: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  currency: string
  notes?: string
  shipping_address?: Record<string, any>
  billing_address?: Record<string, any>
  tracking_code?: string
  estimated_delivery?: string
  delivered_at?: string
  created_at: string
  updated_at: string
  // Relacionamentos
  user?: RonaUser
  vendor?: RonaUser
  items?: RonaOrderItem[]
}

export interface RonaOrderItem {
  id: string
  order_id: string
  product_id?: string
  product_name: string
  product_sku: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface RonaCoupon {
  id: string
  code: string
  name: string
  description?: string
  type: 'percentage' | 'fixed_amount'
  value: number
  minimum_amount?: number
  maximum_discount?: number
  usage_limit?: number
  used_count: number
  is_active: boolean
  valid_from?: string
  valid_until?: string
  created_at: string
  updated_at: string
}

export interface RonaVendor {
  id: string
  user_id: string
  commission_rate: number
  is_active: boolean
  created_at: string
  updated_at: string
  // Relacionamentos
  user?: RonaUser
}

export interface RonaCommission {
  id: string
  vendor_id: string
  order_id: string
  order_amount: number
  commission_rate: number
  commission_amount: number
  status: 'pending' | 'paid' | 'cancelled'
  paid_at?: string
  created_at: string
}

export interface RonaSetting {
  id: string
  key: string
  value?: string
  type: 'string' | 'number' | 'boolean' | 'json'
  description?: string
  is_public: boolean
  created_at: string
  updated_at: string
}

// Funções auxiliares para acessar as tabelas
export const tables = {
  users: 'rona_users',
  addresses: 'rona_addresses',
  categories: 'rona_categories',
  brands: 'rona_brands',
  products: 'rona_products',
  productImages: 'rona_product_images',
  productReviews: 'rona_product_reviews',
  cartItems: 'rona_cart_items',
  orders: 'rona_orders',
  orderItems: 'rona_order_items',
  coupons: 'rona_coupons',
  couponUsage: 'rona_coupon_usage',
  vendors: 'rona_vendors',
  commissions: 'rona_commissions',
  settings: 'rona_settings'
}
