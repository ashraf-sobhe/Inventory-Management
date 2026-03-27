'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

const categories = ['الكل', 'إلكترونيات', 'ملابس', 'أغذية', 'أثاث', 'أخرى']

export default function FilterBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = searchParams.get('category') ?? 'الكل'

  function handleFilter(category: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (category === 'الكل') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleFilter(cat)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            current === cat
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}