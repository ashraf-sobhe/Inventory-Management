import Header from '@/components/layout/Header'
import { createClient } from '@/lib/supabase'
import SettingsTabs from '@/app/(erp)/settings/SettingsTabs'

async function getSettings() {
  const supabase = createClient()
  const { data } = await supabase
    .from('company_settings')
    .select('*')
    .single()
  return data
}

export default async function SettingsPage() {
  const settings = await getSettings()

  return (
    <div>
      <Header title="الإعدادات" />
      <div className="p-6">
        <SettingsTabs settings={settings} />
      </div>
    </div>
  )
}