'use client'

import { Trash2, AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useRole } from '@/lib/hooks/useRole'
import toast from 'react-hot-toast'

export default function DeleteSaleButton({ id }: { id: string }) {
  const router = useRouter()
  const { isManager } = useRole()
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!isManager) return null

  async function handleDelete() {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('invoices').delete().eq('id', id)

    if (error) {
      toast.error('حدث خطأ، حاول مرة أخرى')
      setLoading(false)
      return
    }

    toast.success('تم حذف العملية')
    router.refresh()
    setShowConfirm(false)
    setLoading(false)
  }

  return (
    <>
      <button onClick={() => setShowConfirm(true)} className="text-gray-400 hover:text-red-500 transition-colors">
        <Trash2 size={16} />
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle size={18} className="text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">حذف العملية</p>
                  <p className="text-xs text-gray-500 mt-0.5">هذا الإجراء لا يمكن التراجع عنه</p>
                </div>
              </div>
              <button onClick={() => setShowConfirm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={loading} className="btn-danger flex-1 disabled:opacity-50">
                {loading ? 'جاري الحذف...' : 'نعم، احذف'}
              </button>
              <button onClick={() => setShowConfirm(false)} className="btn-secondary flex-1">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}