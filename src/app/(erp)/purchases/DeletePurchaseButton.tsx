'use client'

import { Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useRole } from '@/lib/hooks/useRole'

export default function DeletePurchaseButton({ id }: { id: string }) {
  const router = useRouter()
  const { isManager } = useRole()
if (!isManager) return null

  async function handleDelete() {
    if (!confirm('هل أنت متأكد من حذف هذه العملية؟')) return
    const supabase = createClient()
    await supabase.from('purchases').delete().eq('id', id)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="text-gray-400 hover:text-red-500 transition-colors"
    >
      <Trash2 size={16} />
    </button>
  )
}