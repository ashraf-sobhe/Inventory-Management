'use client'

import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-sm px-3 py-2 rounded-lg hover:bg-red-50 w-full"
    >
      <LogOut size={16} />
      تسجيل الخروج
    </button>
  )
}