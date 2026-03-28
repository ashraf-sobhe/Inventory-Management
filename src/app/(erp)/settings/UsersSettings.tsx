'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { UserPlus, Trash2, AlertTriangle, X, Mail } from 'lucide-react'
import { inviteUser, deleteUser } from '@/app/(erp)/settings/actions/users'

type User = {
  id: string
  email: string
  role: string
  full_name: string | null
  created_at: string
}

const ROLE_LABEL: Record<string, string> = {
  admin:    'مدير',
  manager:  'مشرف',
  employee: 'موظف',
}

const ROLE_BADGE: Record<string, string> = {
  admin:    'badge-red',
  manager:  'badge-blue',
  employee: 'badge-green',
}

export default function UsersSettings() {
  const [users, setUsers]           = useState<User[]>([])
  const [loading, setLoading]       = useState(true)
  const [adding, setAdding]         = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [toast, setToast]           = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [form, setForm]             = useState({ email: '', full_name: '', role: 'employee' })

  async function loadUsers() {
    const supabase = createClient()
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    setUsers(data ?? [])
    setLoading(false)
  }

  useEffect(() => { loadUsers() }, [])

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 4000)
  }

  async function handleInvite() {
    if (!form.email) return
    setAdding(true)
    const result = await inviteUser(form.email, form.full_name, form.role)
    if (result.error) {
      showToast('error', `فشل الإرسال: ${result.error}`)
    } else {
      showToast('success', `✓ تم إرسال دعوة إلى ${form.email}`)
      setForm({ email: '', full_name: '', role: 'employee' })
      loadUsers()
    }
    setAdding(false)
  }

  async function handleDelete(id: string) {
    const result = await deleteUser(id)
    if (result.error) {
      showToast('error', 'فشل الحذف، حاول مرة أخرى')
    } else {
      showToast('success', 'تم حذف المستخدم بنجاح')
      loadUsers()
    }
    setDeletingId(null)
  }

  return (
    <>
      {toast && (
        <div className={`
          fixed top-6 left-1/2 -translate-x-1/2 z-50
          flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
          ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}
        `}>
          {toast.msg}
        </div>
      )}

      {deletingId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-sm p-6" dir="rtl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle size={18} className="text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">حذف المستخدم</p>
                  <p className="text-xs text-gray-500 mt-0.5">هذا الإجراء لا يمكن التراجع عنه</p>
                </div>
              </div>
              <button onClick={() => setDeletingId(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deletingId)} className="btn-danger flex-1">
                نعم، احذف
              </button>
              <button onClick={() => setDeletingId(null)} className="btn-secondary flex-1">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card max-w-2xl space-y-6" dir="rtl">
        <h3 className="font-semibold text-gray-900">إدارة المستخدمين</h3>

        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <p className="text-sm font-medium text-gray-700">إضافة مستخدم جديد</p>

          <input
            dir="rtl"
            className="input text-right"
            placeholder="الاسم الكامل"
            value={form.full_name}
            onChange={e => setForm({ ...form, full_name: e.target.value })}
          />

          <input
            dir="ltr"
            className="input text-left"
            placeholder="example@email.com"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          {/* الدور */}
          <select
            dir="rtl"
            className="input text-right"
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
          >
            <option value="employee">موظف</option>
            <option value="manager">مشرف</option>
            <option value="admin">مدير</option>
          </select>

          <button
            disabled={adding || !form.email}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleInvite}
          >
            {adding ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                جاري الإرسال...
              </>
            ) : (
              <>
                <Mail size={15} />
                إضافة وإرسال دعوة
              </>
            )}
          </button>
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-gray-400">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span className="text-sm">جاري التحميل...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <UserPlus size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">لا يوجد مستخدمين بعد</p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.full_name ?? 'بدون اسم'}
                  </p>
                  <p className="text-xs text-gray-400 truncate" dir="ltr">
                    {user.email}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 mr-3">
                  <span className={ROLE_BADGE[user.role] ?? 'badge-blue'}>
                    {ROLE_LABEL[user.role] ?? user.role}
                  </span>
                  <button
                    onClick={() => setDeletingId(user.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}