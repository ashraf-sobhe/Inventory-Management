'use client'

import { Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useRole } from '@/lib/hooks/useRole'
import toast from 'react-hot-toast'

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter()
  const { isManager } = useRole()

  if (!isManager) return null

  async function handleDelete() {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return
    const supabase = createClient()
    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) {
      toast.error('حدث خطأ، حاول مرة أخرى')
      return
    }

    toast.success('تم حذف المنتج')
    router.refresh()
  }

  return (
    <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 transition-colors">
      <Trash2 size={16} />
    </button>
  )
}