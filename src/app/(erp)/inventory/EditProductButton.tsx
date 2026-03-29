'use client'

import { useState } from 'react'
import { Pencil, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useRole } from '@/lib/hooks/useRole'
import type { Product } from '@/lib/types/database'
import toast from 'react-hot-toast'

export default function EditProductButton({ product }: { product: Product }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { isManager } = useRole()

  const [form, setForm] = useState({
    name:     product.name,
    sku:      product.sku,
    price:    String(product.price),
    quantity: String(product.quantity),
    category: product.category ?? '',
  })

  if (!isManager) return null

  async function handleSave() {
    if (!form.name || !form.sku || !form.price) return
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('products')
      .update({
        name:     form.name,
        sku:      form.sku,
        price:    Number(form.price),
        quantity: Number(form.quantity),
        category: form.category,
      })
      .eq('id', product.id)

    if (error) {
      toast.error('حدث خطأ، حاول مرة أخرى')
      setLoading(false)
      return
    }

    toast.success('تم تعديل المنتج بنجاح')
    setLoading(false)
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-gray-400 hover:text-primary-500 transition-colors">
        <Pencil size={16} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">تعديل المنتج</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <input
                className="input"
                placeholder="اسم المنتج *"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="input"
                placeholder="كود المنتج (SKU) *"
                value={form.sku}
                onChange={e => setForm({ ...form, sku: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="input"
                  placeholder="السعر *"
                  type="number"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                />
                <input
                  className="input"
                  placeholder="الكمية"
                  type="number"
                  value={form.quantity}
                  onChange={e => setForm({ ...form, quantity: e.target.value })}
                />
              </div>
              <input
                className="input"
                placeholder="الفئة"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={loading} className="btn-primary flex-1">
                {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
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