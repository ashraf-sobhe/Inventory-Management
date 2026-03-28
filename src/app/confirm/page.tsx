'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Eye, EyeOff, ShieldCheck } from 'lucide-react'

export default function ConfirmPage() {
  const router = useRouter()
  const [password, setPassword]         = useState('')
  const [confirm, setConfirm]           = useState('')
  const [showPass, setShowPass]         = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')

  async function handleSetPassword() {
    if (!password || !confirm) return
    if (password.length < 6) {
      setError('كلمة المرور لازم تكون 6 أحرف على الأقل')
      return
    }
    if (password !== confirm) {
      setError('كلمة المرور مش متطابقة')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('حصل خطأ، حاول تاني')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8" dir="rtl">
      <div className="w-full max-w-sm">

        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
            style={{
              background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
              border: '0.5px solid #e9d5ff',
            }}
          >
            <LayoutDashboard size={22} className="text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">تعيين كلمة المرور</h2>
          <p className="text-sm text-gray-500 text-center">
            أدخل كلمة مرور جديدة للدخول على حسابك
          </p>
        </div>

        {error && (
          <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200
                          text-red-600 text-sm px-4 py-3 rounded-xl">
            <span>⚠</span>
            {error}
          </div>
        )}

        <div
          className="bg-white rounded-2xl p-6 space-y-5"
          style={{ border: '0.5px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        >
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full h-10 rounded-xl px-3 pl-10 text-sm text-gray-900
                           bg-gray-50 outline-none transition-all"
                style={{ border: '1px solid #e5e7eb' }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#9333ea'
                  e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(147,51,234,0.1)'
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#e5e7eb'
                  e.currentTarget.style.boxShadow   = 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">
              تأكيد كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSetPassword()}
                className="w-full h-10 rounded-xl px-3 pl-10 text-sm text-gray-900
                           bg-gray-50 outline-none transition-all"
                style={{ border: '1px solid #e5e7eb' }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#9333ea'
                  e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(147,51,234,0.1)'
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#e5e7eb'
                  e.currentTarget.style.boxShadow   = 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSetPassword}
            disabled={loading || !password || !confirm}
            className="w-full h-11 rounded-xl text-white text-sm font-medium
                       flex items-center justify-center gap-2
                       transition-all disabled:opacity-50 disabled:cursor-not-allowed
                       active:scale-[0.99]"
            style={{
              background: 'linear-gradient(135deg, #9333ea, #7e22ce)',
              boxShadow: '0 4px 14px rgba(147,51,234,0.35)',
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                جاري الحفظ...
              </>
            ) : (
              'تعيين كلمة المرور'
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-5">
          <ShieldCheck size={13} className="text-gray-400" />
          <span className="text-xs text-gray-400">اتصال آمن ومشفر بـ Supabase</span>
        </div>

      </div>
    </div>
  )
}
