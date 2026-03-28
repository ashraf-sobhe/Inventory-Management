'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import {
  LogIn, Eye, EyeOff,
  Package, TrendingUp, BarChart3,
  LayoutDashboard, ShieldCheck
} from 'lucide-react'

const FEATURES = [
  { icon: Package,    label: 'إدارة المخزون',       desc: 'تتبع المنتجات والكميات بدقة' },
  { icon: TrendingUp, label: 'المبيعات والمشتريات',  desc: 'متابعة كاملة لكل العمليات'   },
  { icon: BarChart3,  label: 'التقارير والإحصائيات', desc: 'تحليلات فورية واحترافية'      },
]

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm]                 = useState({ email: '', password: '' })
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleLogin() {
    if (!form.email || !form.password) return
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email:    form.email,
      password: form.password,
    })

    if (error) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex" dir="rtl">

      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #3b0764 0%, #4c1d95 50%, #2e1065 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(167,139,250,0.07) 1px, transparent 1px),
              linear-gradient(90deg, rgba(167,139,250,0.07) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
          }}
        />

        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)' }} />

        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(167,139,250,0.2)',
              border: '0.5px solid rgba(167,139,250,0.3)',
            }}
          >
            <LayoutDashboard size={18} className="text-purple-300" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">Inventory Management</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(196,181,253,0.6)' }}>
              نظام الإدارة المتكامل
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(167,139,250,0.15)',
              border: '0.5px solid rgba(167,139,250,0.2)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="text-xs text-purple-300">نظام متكامل واحترافي</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-white text-3xl font-bold leading-snug">
              إدارة أعمالك<br />
              <span style={{ color: '#C4B5FD' }}>بكل سهولة واحترافية</span>
            </h1>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(196,181,253,0.5)' }}>
              تحكم كامل في المخزون والمبيعات والمشتريات والتقارير من مكان واحد
            </p>
          </div>

          <div className="space-y-2.5">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '0.5px solid rgba(255,255,255,0.08)',
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: 'rgba(167,139,250,0.15)',
                    border: '0.5px solid rgba(167,139,250,0.2)',
                  }}
                >
                  <Icon size={14} className="text-purple-300" />
                </div>
                <div>
                  <p className="text-xs font-medium leading-none mb-0.5"
                    style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {label}
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(196,181,253,0.45)' }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs" style={{ color: 'rgba(167,139,250,0.3)' }}>
            © {new Date().getFullYear()}Inventory Management — جميع الحقوق محفوظة
          </p>
        </div>
      </div>

      <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">

          <div className="flex lg:hidden items-center gap-3 justify-center mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #9333ea, #7e22ce)' }}
            >
            </div>
            <p className="font-bold text-gray-900 text-lg">ERP System</p>
          </div>

          <div className="mb-8">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
              style={{
                background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
                border: '0.5px solid #e9d5ff',
              }}
            >
              <LayoutDashboard size={20} className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">مرحباً بك</h2>
            <p className="text-sm text-gray-500">أدخل بياناتك للدخول إلى لوحة التحكم</p>
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
                البريد الإلكتروني
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                dir="ltr"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full h-10 rounded-xl px-3 text-sm text-gray-900
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
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
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
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2
                             text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading || !form.email || !form.password}
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
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  <LogIn size={15} />
                  تسجيل الدخول
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-5">
            <ShieldCheck size={13} className="text-gray-400" />
            <span className="text-xs text-gray-400">اتصال آمن ومشفر بـ Supabase</span>
          </div>

        </div>
      </div>

    </div>
  )
}