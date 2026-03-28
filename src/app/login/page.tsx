'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import {
  LogIn, Eye, EyeOff,
  Package, TrendingUp, BarChart3,
  LayoutDashboard, ShieldCheck, Zap
} from 'lucide-react'

const FEATURES = [
  { icon: Package,    label: 'إدارة المخزون',       desc: 'تتبع المنتجات والكميات بدقة', delay: '0ms' },
  { icon: TrendingUp, label: 'المبيعات والمشتريات',  desc: 'متابعة كاملة لكل العمليات',   delay: '100ms' },
  { icon: BarChart3,  label: 'التقارير والإحصائيات', desc: 'تحليلات فورية واحترافية',      delay: '200ms' },
]

const STATS = [
  { value: '+500', label: 'منتج مُدار' },
  { value: '99%',  label: 'دقة المخزون' },
  { value: '24/7', label: 'متاح دائماً' },
]

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm]                 = useState({ email: '', password: '' })
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted]           = useState(false)

  useEffect(() => { setMounted(true) }, [])

  async function handleLogin() {
    if (!form.email || !form.password) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email, password: form.password,
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
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(90px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(90px) rotate(-360deg); }
        }
        @keyframes orbit2 {
          from { transform: rotate(180deg) translateX(120px) rotate(-180deg); }
          to   { transform: rotate(540deg) translateX(120px) rotate(-540deg); }
        }
        .anim-fade-up   { animation: fadeUp 0.7s ease both; }
        .anim-fade-in   { animation: fadeIn 0.5s ease both; }
        .float-anim     { animation: float 4s ease-in-out infinite; }
        .pulse-slow     { animation: pulse-slow 3s ease-in-out infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, #C4B5FD 0%, #ffffff 40%, #C4B5FD 60%, #a78bfa 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .orbit-1 { animation: orbit  8s linear infinite; }
        .orbit-2 { animation: orbit2 12s linear infinite; }
        .feature-card {
          transition: all 0.3s ease;
          cursor: default;
        }
        .feature-card:hover {
          background: rgba(255,255,255,0.08) !important;
          border-color: rgba(167,139,250,0.3) !important;
          transform: translateX(-4px);
        }
      `}</style>

      <div className="min-h-screen flex" dir="rtl">

        <div
          className="hidden lg:flex lg:w-[52%] flex-col justify-between p-14 relative overflow-hidden"
          style={{ background: 'linear-gradient(150deg, #1e0533 0%, #3b0764 35%, #4c1d95 70%, #2d1b69 100%)' }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `
              linear-gradient(rgba(167,139,250,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(167,139,250,0.06) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }} />

          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none pulse-slow"
            style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 65%)' }} />
          <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full pointer-events-none pulse-slow"
            style={{ background: 'radial-gradient(circle, rgba(109,40,217,0.35) 0%, transparent 65%)', animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)' }} />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 0, height: 0 }}>
            <div className="orbit-1 w-2.5 h-2.5 rounded-full"
              style={{ background: 'rgba(196,181,253,0.6)', boxShadow: '0 0 8px rgba(196,181,253,0.8)' }} />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 0, height: 0 }}>
            <div className="orbit-2 w-1.5 h-1.5 rounded-full"
              style={{ background: 'rgba(167,139,250,0.5)', boxShadow: '0 0 6px rgba(167,139,250,0.7)' }} />
          </div>

          <div
            className="relative z-10 flex items-center gap-3 anim-fade-in"
            style={{ animationDelay: '0ms' }}
          >
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center float-anim"
              style={{
                background: 'linear-gradient(135deg, rgba(167,139,250,0.3), rgba(109,40,217,0.2))',
                border: '1px solid rgba(167,139,250,0.4)',
                boxShadow: '0 0 20px rgba(147,51,234,0.3)',
              }}>
              <LayoutDashboard size={20} className="text-purple-200" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none tracking-wide">Inventory Management</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(196,181,253,0.55)' }}>نظام الإدارة المتكامل</p>
            </div>
          </div>

          <div className="relative z-10 space-y-8">

            <div
              className="anim-fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                animationDelay: '100ms',
                background: 'rgba(167,139,250,0.12)',
                border: '1px solid rgba(167,139,250,0.25)',
                boxShadow: '0 0 20px rgba(147,51,234,0.15)',
              }}
            >
              <Zap size={12} className="text-purple-300" />
              <span className="text-xs text-purple-300 font-medium">نظام متكامل واحترافي</span>
            </div>

            <div className="anim-fade-up space-y-3" style={{ animationDelay: '200ms' }}>
              <h1 className="text-white text-4xl font-bold leading-tight">
                إدارة أعمالك<br />
                <span className="shimmer-text">بكل سهولة واحترافية</span>
              </h1>
              <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'rgba(196,181,253,0.5)' }}>
                تحكم كامل في المخزون والمبيعات والمشتريات والتقارير من مكان واحد
              </p>
            </div>

            <div className="anim-fade-up grid grid-cols-3 gap-3" style={{ animationDelay: '300ms' }}>
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-center py-3 px-2 rounded-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}>
                  <p className="text-white font-bold text-lg leading-none">{value}</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(196,181,253,0.45)' }}>{label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2.5">
              {FEATURES.map(({ icon: Icon, label, desc, delay }, i) => (
                <div
                  key={label}
                  className="feature-card anim-fade-up flex items-center gap-4 px-4 py-3.5 rounded-2xl"
                  style={{
                    animationDelay: `${400 + i * 100}ms`,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(109,40,217,0.15))',
                      border: '1px solid rgba(167,139,250,0.25)',
                      boxShadow: '0 0 12px rgba(147,51,234,0.2)',
                    }}>
                    <Icon size={15} className="text-purple-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold leading-none mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>
                      {label}
                    </p>
                    <p className="text-xs" style={{ color: 'rgba(196,181,253,0.45)' }}>{desc}</p>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(167,139,250,0.5)' }} />
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 anim-fade-in" style={{ animationDelay: '800ms' }}>
            <div className="flex items-center justify-between">
              <p className="text-xs" style={{ color: 'rgba(167,139,250,0.3)' }}>
                © {new Date().getFullYear()} Inventory Management — جميع الحقوق محفوظة
              </p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: '0 0 6px rgba(74,222,128,0.8)' }} />
                <span className="text-xs" style={{ color: 'rgba(196,181,253,0.3)' }}>متصل</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">

            <div className="flex lg:hidden flex-col items-center mb-8">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)', border: '0.5px solid #e9d5ff' }}>
                <LayoutDashboard size={22} className="text-purple-600" />
              </div>
              <p className="font-bold text-gray-900 text-lg">Inventory Management</p>
              <p className="text-xs text-gray-400 mt-0.5">نظام الإدارة المتكامل</p>
            </div>

            <div className="hidden lg:block mb-8 anim-fade-up" style={{ animationDelay: '200ms' }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{
                  background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
                  border: '0.5px solid #e9d5ff',
                  boxShadow: '0 4px 14px rgba(147,51,234,0.1)',
                }}>
                <LayoutDashboard size={20} className="text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">مرحباً بك </h2>
              <p className="text-sm text-gray-500">أدخل بياناتك للدخول إلى لوحة التحكم</p>
            </div>

            {error && (
              <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                <span>⚠</span>{error}
              </div>
            )}

            <div
              className="bg-white rounded-2xl p-6 space-y-5 anim-fade-up"
              style={{
                animationDelay: '300ms',
                border: '0.5px solid #e5e7eb',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              }}
            >
              <div className="lg:hidden mb-2">
                <h2 className="text-xl font-bold text-gray-900 mb-1">مرحباً بك</h2>
                <p className="text-sm text-gray-500">أدخل بياناتك للدخول</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-700">البريد الإلكتروني</label>
                <input
                  type="email" placeholder="example@email.com" dir="ltr"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className="w-full h-10 rounded-xl px-3 text-sm text-gray-900 bg-gray-50 outline-none transition-all"
                  style={{ border: '1px solid #e5e7eb' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#9333ea'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(147,51,234,0.1)' }}
                  onBlur={e  => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-700">كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    className="w-full h-10 rounded-xl px-3 pl-10 text-sm text-gray-900 bg-gray-50 outline-none transition-all"
                    style={{ border: '1px solid #e5e7eb' }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#9333ea'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(147,51,234,0.1)' }}
                    onBlur={e  => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading || !form.email || !form.password}
                className="w-full h-11 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
                style={{
                  background: 'linear-gradient(135deg, #9333ea, #7e22ce)',
                  boxShadow: '0 4px 20px rgba(147,51,234,0.4)',
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  <><LogIn size={15} /> تسجيل الدخول</>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 mt-5">
              <ShieldCheck size={13} className="text-gray-400" />
              <span className="text-xs text-gray-400">Inventory Management — جميع الحقوق محفوظة</span>
            </div>

          </div>
        </div>

      </div>
    </>
  )
}