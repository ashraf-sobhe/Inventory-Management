'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Save } from 'lucide-react'
import type { CompanySettings } from '@/lib/types/database'

export default function GeneralSettings({ settings }: { settings: CompanySettings }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    name:                     settings?.name                     ?? '',
    phone:                    settings?.phone                    ?? '',
    address:                  settings?.address                  ?? '',
    currency:                 settings?.currency                 ?? 'EGP',
    low_stock_alert:          settings?.low_stock_alert          ?? 10,
    allow_sale_without_stock: settings?.allow_sale_without_stock ?? false,
  })

  async function handleSave() {
    setLoading(true)
    const supabase = createClient()
    await supabase
      .from('company_settings')
      .update(form)
      .eq('id', settings.id)

    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  return (
    <div className="card max-w-2xl space-y-6">
      <h3 className="font-semibold text-gray-900">بيانات الشركة</h3>

      <div className="space-y-4">
        {/* اسم الشركة */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">اسم الشركة *</label>
          <input
            className="input"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* التليفون */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">رقم التليفون</label>
          <input
            className="input"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            placeholder="01xxxxxxxxx"
          />
        </div>

        {/* العنوان */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">العنوان</label>
          <textarea
            className="input resize-none"
            rows={2}
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            placeholder="القاهرة، مصر"
          />
        </div>

        {/* العملة */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">العملة</label>
          <select
            className="input"
            value={form.currency}
            onChange={e => setForm({ ...form, currency: e.target.value })}
          >
            <option value="EGP">جنيه مصري (EGP)</option>
            <option value="USD">دولار أمريكي (USD)</option>
            <option value="SAR">ريال سعودي (SAR)</option>
            <option value="AED">درهم إماراتي (AED)</option>
          </select>
        </div>

        {/* حد التنبيه */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            حد تنبيه المخزون المنخفض
          </label>
          <input
            className="input"
            type="number"
            min="1"
            value={form.low_stock_alert}
            onChange={e => setForm({ ...form, low_stock_alert: Number(e.target.value) })}
          />
          <p className="text-xs text-gray-400">
            سيظهر تنبيه عند وصول الكمية لأقل من هذا الرقم
          </p>
        </div>

        {/* البيع بدون مخزون */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="text-sm font-medium text-gray-800">
              السماح بالبيع بدون مخزون
            </p>
            <p className="text-xs text-gray-400">
              السماح ببيع منتج حتى لو الكمية صفر
            </p>
          </div>
          <button
            onClick={() => setForm({ ...form, allow_sale_without_stock: !form.allow_sale_without_stock })}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              form.allow_sale_without_stock ? 'bg-primary-600' : 'bg-gray-300'
            }`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              form.allow_sale_without_stock ? 'translate-x-0.5' : 'translate-x-5'
            }`} />
          </button>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={loading}
        className={`btn-primary flex items-center gap-2 ${saved ? 'bg-green-600 hover:bg-green-600' : ''}`}
      >
        <Save size={16} />
        {loading ? 'جاري الحفظ...' : saved ? 'تم الحفظ ✓' : 'حفظ التغييرات'}
      </button>
    </div>
  )
}