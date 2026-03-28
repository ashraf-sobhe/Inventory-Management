'use server'

import { createClient } from '@supabase/supabase-js'

export async function inviteUser(email: string, full_name: string, role: string) {

    const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { full_name, role },
  })

  if (error) return { error: error.message }
  if (!data.user) return { error: 'فشل إنشاء المستخدم' }


  await supabase.from('profiles').upsert({
    id: data.user.id,
    full_name,
    role,
  })

  return { success: true }
}

export async function deleteUser(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )


  const { error } = await supabase.auth.admin.deleteUser(id)
  if (error) return { error: error.message }

  return { success: true }
}