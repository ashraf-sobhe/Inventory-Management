'use client'

import { useState } from 'react'
import { Building2, Users, Shield } from 'lucide-react'
import GeneralSettings from './GeneralSettings'
import UsersSettings from './UsersSettings'
import RolesSettings from './RolesSettings'
import type { CompanySettings } from '@/lib/types/database'

const tabs = [
  { id: 'general', label: 'عام',            icon: Building2 },
  { id: 'users',   label: 'المستخدمين',     icon: Users     },
  { id: 'roles',   label: 'الصلاحيات',      icon: Shield    },
]

export default function SettingsTabs({ settings }: { settings: CompanySettings }) {
  const [active, setActive] = useState('general')

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active === tab.id
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {active === 'general' && <GeneralSettings settings={settings} />}
      {active === 'users'   && <UsersSettings />}
      {active === 'roles'   && <RolesSettings />}
    </div>
  )
}