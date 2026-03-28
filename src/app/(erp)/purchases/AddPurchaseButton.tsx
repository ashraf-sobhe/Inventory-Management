'use client'

import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { Product } from '@/lib/types/database'

export default function AddPurchaseButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const router = useRouter()

  const [form, setForm] = useState({
    product_id: '',
    quantity: '',
    cost_per_unit: '',
    supplier_name: '',
  })

  useEffect(() => {
    if (open) {
      createClient()
        .from('products')
        .select('*')
        .then(({ data }) => setProducts(data ?? []))
    }
  }, [open])

  async function handleSubmit() {
    if (!form.product_id || !form.quantity || !form.cost_per_unit) return
    setLoading(true)

    const supabase = createClient()
    const product = products.find(p => p.id === form.product_id)

    if (!product) {
      setLoading(false)
      return
    }

    const total_cost = Number(form.cost_per_unit) * Number(form.quantity)

    const [{ error: purchaseError }] = await Promise.all([
      supabase.from('purchases').insert({
        product_id: form.product_id,
        quantity: Number(form.quantity),
        total_cost,
        supplier_name: form.supplier_name,
      }),
      supabase
        .from('products')
        .update({ quantity: product.quantity + Number(form.quantity) })
        .eq('id', form.product_id),
    ])

    if (purchaseError) {
      setLoading(false)
      return
    }

    setLoading(false)
    setOpen(false)
    setForm({ product_id: '', quantity: '', cost_per_unit: '', supplier_name: '' })
    router.refresh()
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary flex items-center gap-2">
        <Plus size={16} />
        إضافة مشترى
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">

            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">إضافة عملية شراء</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <select
                className="input"
                value={form.product_id}
                onChange={e => setForm({ ...form, product_id: e.target.value })}
              >
                <option value="">اختر المنتج *</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} — الكمية الحالية: {p.quantity}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-3">
                <input
                  className="input"
                  placeholder="الكمية *"
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={e => setForm({ ...form, quantity: e.target.value })}
                />
                <input
                  className="input"
                  placeholder="سعر الوحدة *"
                  type="number"
                  value={form.cost_per_unit}
                  onChange={e => setForm({ ...form, cost_per_unit: e.target.value })}
                />
              </div>

              <input
                className="input"
                placeholder="اسم المورد"
                value={form.supplier_name}
                onChange={e => setForm({ ...form, supplier_name: e.target.value })}
              />

              {form.quantity && form.cost_per_unit && (
                <div className="bg-green-50 rounded-lg px-4 py-3">
                  <p className="text-sm text-green-700">
                    إجمالي التكلفة:{' '}
                    <span className="font-bold">
                      {(Number(form.cost_per_unit) * Number(form.quantity)).toLocaleString('ar-EG')}{' '}
                      ج.م
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? 'جاري الحفظ...' : 'حفظ'}
              </button>
              <button onClick={() => setOpen(false)} className="btn-secondary flex-1">
                إلغاء
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}