'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LayoutDashboard, Package, ShoppingCart, TrendingUp, Settings, BarChart2, Menu, X } from 'lucide-react'
import LogoutButton from './LogoutButton'
import { useRole } from '@/lib/hooks/useRole'

const links = [
  { href: '/dashboard', label: 'الرئيسية',  icon: LayoutDashboard, role: 'all'     },
  { href: '/inventory', label: 'المخزون',    icon: Package,         role: 'all'     },
  { href: '/sales',     label: 'المبيعات',   icon: TrendingUp,      role: 'all'     },
  { href: '/purchases', label: 'المشتريات',  icon: ShoppingCart,    role: 'manager' },
  { href: '/reports',   label: 'التقارير',   icon: BarChart2,       role: 'manager' },
  { href: '/settings',  label: 'الإعدادات',  icon: Settings,        role: 'admin'   },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { role, isAdmin, isManager } = useRole()
  const [open, setOpen] = useState(false)

  function canAccess(linkRole: string) {
    if (linkRole === 'all')     return true
    if (linkRole === 'manager') return isManager
    if (linkRole === 'admin')   return isAdmin
    return false
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">i</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900">Inventory Management</h1>
            <p className="text-xs text-gray-400">إدارة المخزون</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          role === 'admin'   ? 'bg-red-100 text-red-700'   :
          role === 'manager' ? 'bg-blue-100 text-blue-700' :
          'bg-green-100 text-green-700'
        }`}>
          {role === 'admin' ? 'مدير' : role === 'manager' ? 'مشرف' : 'موظف'}
        </span>
      </div>

      <nav className="flex-1 p-3 space-y-1 mt-2">
        {links.filter(link => canAccess(link.role)).map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-primary-600' : 'text-gray-400'} />
              <span>{link.label}</span>
              {isActive && (
                <span className="mr-auto w-1.5 h-1.5 rounded-full bg-primary-600" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-2">
        <LogoutButton />
        <p className="text-xs text-gray-400 text-center">v1.0.0</p>
      </div>
    </div>
  )

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-gray-900 text-sm">Inventory Management</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-600 hover:text-gray-900"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`lg:hidden fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-xl transition-transform duration-300 ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      <aside className="hidden lg:flex lg:flex-col w-64 min-h-screen bg-white border-l border-gray-200">
        <SidebarContent />
      </aside>
    </>
  )
}