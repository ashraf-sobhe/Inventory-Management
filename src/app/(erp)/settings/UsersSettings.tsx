'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { UserPlus, Trash2 } from 'lucide-react'

type User = {
  id: string
  email: string
  role: string
  full_name: string | null
  created_at: string
}

export default function UsersSettings() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ email: '', full_name: '', role: 'employee' })
  const [adding, setAdding] = useState(false)

  async function loadUsers() {
    const supabase = createClient()
    const { data } = await supabase.from('profiles').select('*')
    setUsers(data ?? [])
    setLoading(false)
  }

  useEffect(() => { loadUsers() }, [])

  const roleLabel: Record<string, string> = {
    admin:    'مدير',
    manager:  'مشرف',
    employee: 'موظف',
  }

  const roleBadge: Record<string, string> = {
    admin:    'badge-red',
    manager:  'badge-blue',
    employee: 'badge-green',
  }

  return (
    <div className="card max-w-2xl space-y-6">
      <h3 className="font-semibold text-gray-900">إدارة المستخدمين</h3>

      {/* Add User Form */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <p className="text-sm font-medium text-gray-700">إضافة مستخدم جديد</p>
        <input
          className="input"
          placeholder="الاسم الكامل"
          value={form.full_name}
          onChange={e => setForm({ ...form, full_name: e.target.value })}
        />
        <input
          className="input"
          placeholder="البريد الإلكتروني *"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <select
          className="input"
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
          <option value="employee">موظف</option>
          <option value="manager">مشرف</option>
          <option value="admin">مدير</option>
        </select>
        <button
          disabled={adding || !form.email}
          className="btn-primary flex items-center gap-2"
          onClick={async () => {
            setAdding(true)
            const supabase = createClient()
            const { data } = await supabase.auth.admin.inviteUserByEmail(form.email)
            if (data.user) {
              await supabase.from('profiles').insert({
                id: data.user.id,
                full_name: form.full_name,
                role: form.role,
              })
            }
            setForm({ email: '', full_name: '', role: 'employee' })
            setAdding(false)
            loadUsers()
          }}
        >
          <UserPlus size={16} />
          {adding ? 'جاري الإضافة...' : 'إضافة وإرسال دعوة'}
        </button>
      </div>

      {/* Users List */}
      <div className="space-y-2">
        {loading ? (
          <p className="text-sm text-gray-400 text-center py-4">جاري التحميل...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">لا يوجد مستخدمين بعد</p>
        ) : (
          users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user.full_name ?? 'بدون اسم'}
                </p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={roleBadge[user.role] ?? 'badge-blue'}>
                  {roleLabel[user.role] ?? user.role}
                </span>
                <button
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  onClick={async () => {
                    if (!confirm('هل أنت متأكد؟')) return
                    const supabase = createClient()
                    await supabase.from('profiles').delete().eq('id', user.id)
                    loadUsers()
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}