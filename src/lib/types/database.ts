export type Product = {
  id: string
  name: string
  sku: string
  price: number
  quantity: number
  category: string
  created_at: string
}

export type Sale = {
  id: string
  product_id: string
  quantity: number
  total_price: number
  customer_name: string
  created_at: string
}

export type Purchase = {
  id: string
  product_id: string
  quantity: number
  total_cost: number
  supplier_name: string
  created_at: string
}
export type CompanySettings = {
  id: string
  name: string
  phone: string | null
  address: string | null
  currency: string
  low_stock_alert: number
  allow_sale_without_stock: boolean
  created_at: string
}

export type Profile = {
  id: string
  full_name: string | null
  role: 'admin' | 'manager' | 'employee'
  created_at: string
}