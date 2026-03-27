'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

export default function SearchBar({ placeholder = 'بحث...' }: { placeholder?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSearch = useCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (term) {
      params.set('search', term)
    } else {
      params.delete('search')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }, [searchParams, pathname, router])

  return (
    <div className="relative">
      <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        className="input pr-9 w-64"
        placeholder={placeholder}
        defaultValue={searchParams.get('search') ?? ''}
        onChange={e => handleSearch(e.target.value)}
      />
    </div>
  )
}