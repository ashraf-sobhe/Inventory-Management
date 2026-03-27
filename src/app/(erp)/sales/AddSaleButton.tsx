'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { Product } from '@/lib/types/database'

type ItemRow = {
  product_id: string
  quantity: string
}

export default function AddSaleButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [customerName, setCustomerName] = useState('')
  const [items, setItems] = useState<ItemRow[]>([{ product_id: '', quantity: '' }])
  const router = useRouter()

  useEffect(() => {
    if (open) {
      createClient()
        .from('products')
        .select('*')
        .gt('quantity', 0)
        .then(({ data }) => setProducts(data ?? []))
    }
  }, [open])

  function addRow() {
    setItems([...items, { product_id: '', quantity: '' }])
  }

  function removeRow(index: number) {
    setItems(items.filter((_, i) => i !== index))
  }

  function updateRow(index: number, field: keyof ItemRow, value: string) {
    const updated = [...items]
    updated[index][field] = value
    setItems(updated)
  }

  function getTotal() {
    return items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.product_id)
      return sum + (product ? product.price * Number(item.quantity || 0) : 0)
    }, 0)
  }

  function handleClose() {
    setOpen(false)
    setCustomerName('')
    setItems([{ product_id: '', quantity: '' }])
  }

  async function handleSubmit() {
    const validItems = items.filter(i => i.product_id && i.quantity)
    if (validItems.length === 0) return
    setLoading(true)

    const supabase = createClient()
    const total = getTotal()

    const { data: invoice } = await supabase
      .from('invoices')
      .insert({ customer_name: customerName || null, total_price: total })
      .select()
      .single()

    if (!invoice) { setLoading(false); return }

    await supabase.from('invoice_items').insert(
      validItems.map(item => {
        const product = products.find(p => p.id === item.product_id)!
        return {
          invoice_id: invoice.id,
          product_id: item.product_id,
          quantity: Number(item.quantity),
          unit_price: product.price,
          total_price: product.price * Number(item.quantity),
        }
      })
    )

    await supabase.from('sales').insert(
      validItems.map(item => {
        const product = products.find(p => p.id === item.product_id)!
        return {
          product_id: item.product_id,
          quantity: Number(item.quantity),
          total_price: product.price * Number(item.quantity),
          customer_name: customerName || null,
        }
      })
    )

    for (const item of validItems) {
      const product = products.find(p => p.id === item.product_id)!
      await supabase
        .from('products')
        .update({ quantity: product.quantity - Number(item.quantity) })
        .eq('id', item.product_id)
    }

    setLoading(false)
    handleClose()
    router.refresh()
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary flex items-center gap-2">
        <Plus size={16} />
        إضافة بيع
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">إضافة عملية بيع</h3>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <input
              className="input"
              placeholder="اسم العميل"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
            />

            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    className="input flex-1"
                    value={item.product_id}
                    onChange={e => updateRow(index, 'product_id', e.target.value)}
                  >
                    <option value="">اختر المنتج *</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {p.quantity}
                      </option>
                    ))}
                  </select>

                  <input
                    className="input w-24"
                    placeholder="الكمية"
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e => updateRow(index, 'quantity', e.target.value)}
                  />

                  {items.length > 1 && (
                    <button
                      onClick={() => removeRow(index)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addRow}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <Plus size={14} />
              إضافة سلعة
            </button>

            {getTotal() > 0 && (
              <div className="bg-primary-50 rounded-lg px-4 py-3">
                <p className="text-sm text-primary-700">
                  الإجمالي:{' '}
                  <span className="font-bold">
                    {getTotal().toLocaleString('ar-EG')} ج.م
                  </span>
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1">
                {loading ? 'جاري الحفظ...' : 'حفظ'}
              </button>
              <button onClick={handleClose} className="btn-secondary flex-1">
                إلغاء
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}