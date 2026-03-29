'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AddProductButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    sku: '',
    price: '',
    quantity: '',
    category: '',
  })

  async function handleSubmit() {
    if (!form.name || !form.sku || !form.price || !form.quantity) return
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.from('products').insert({
      name: form.name,
      sku: form.sku,
      price: Number(form.price),
      quantity: Number(form.quantity),
      category: form.category,
    })

    if (error) {
      toast.error('حدث خطأ، حاول مرة أخرى')
      setLoading(false)
      return
    }

    toast.success('تم إضافة المنتج بنجاح')
    setLoading(false)
    setOpen(false)
    setForm({ name: '', sku: '', price: '', quantity: '', category: '' })
    router.refresh()
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary flex items-center gap-2">
        <Plus size={16} />
        إضافة منتج
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">إضافة منتج جديد</h3>
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
                  placeholder="الكمية *"
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
              <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1">
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