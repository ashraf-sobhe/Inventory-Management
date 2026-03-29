'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

type Role = 'admin' | 'manager' | 'employee' | null

let cachedRole: Role = null

export function useRole() {
  const [role, setRole] = useState<Role>(cachedRole)
  const [loading, setLoading] = useState(!cachedRole)

  useEffect(() => {
    if (cachedRole) {
      setRole(cachedRole)
      setLoading(false)
      return
    }

    let isMounted = true

    async function getRole() {
      try {
        const supabase = createClient()

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) console.error('Auth error:', userError)

        if (!user) {
          if (isMounted) {
            setRole(null)
            setLoading(false)
          }
          return
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error) console.error('Role fetch error:', error)

        const r = (data?.role as Role) ?? 'employee'
        cachedRole = r

        if (isMounted) {
          setRole(r)
          setLoading(false)
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        if (isMounted) setLoading(false)
      }
    }

    getRole()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    role,
    loading,
    isAdmin:    role === 'admin',
    isManager:  role === 'admin' || role === 'manager',
    isEmployee: role === 'employee',
  }
}