
import Header from '@/components/layout/Header'
import { createClient } from '@/lib/supabase'
import { Package, TrendingUp, ShoppingCart, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const supabase = createClient()

  const [productsRes, salesRes, purchasesRes] = await Promise.all([
    supabase.from('products').select('id, quantity'),
    supabase.from('sales').select('id, total_price, created_at, customer_name'),
    supabase.from('purchases').select('id, total_cost'),
  ])

  if (productsRes.error || salesRes.error || purchasesRes.error) {
    console.error('Error fetching data:', productsRes.error || salesRes.error || purchasesRes.error)
    return {
      totalProducts: 0,
      totalSales: 0,
      totalPurchases: 0,
      lowStock: 0,
      recentSales: [],
    }
  }

  const products = productsRes.data ?? []
  const sales = salesRes.data ?? []
  const purchases = purchasesRes.data ?? []

  const totalProducts = products.length

  const totalSales = sales.reduce(
    (sum, s) => sum + Number(s.total_price),
    0
  )

  const totalPurchases = purchases.reduce(
    (sum, p) => sum + Number(p.total_cost),
    0
  )

  const lowStock = products.filter(p => p.quantity < 10).length

  const recentSales = [...sales]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 5)

  return { totalProducts, totalSales, totalPurchases, lowStock, recentSales }
}

export default async function DashboardPage() {
  const {
    totalProducts,
    totalSales,
    totalPurchases,
    lowStock,
    recentSales,
  } = await getStats()

  const stats = [
    {
      label: 'إجمالي المنتجات',
      value: totalProducts,
      suffix: '',
      icon: Package,
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'إجمالي المبيعات',
      value: totalSales.toLocaleString('ar-EG'),
      suffix: ' ج.م',
      icon: TrendingUp,
      bg: 'bg-primary-50',
      iconColor: 'text-primary-600',
    },
    {
      label: 'إجمالي المشتريات',
      value: totalPurchases.toLocaleString('ar-EG'),
      suffix: ' ج.م',
      icon: ShoppingCart,
      bg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      label: 'منتجات منخفضة',
      value: lowStock,
      suffix: '',
      icon: AlertTriangle,
      bg: 'bg-red-50',
      iconColor: 'text-red-500',
    },
  ]

  return (
    <div>
      <Header title="الرئيسية" />

      <div className="p-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="stat-card">
                <div className={`stat-icon ${stat.bg}`}>
                  <Icon size={22} className={stat.iconColor} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}{stat.suffix}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Recent Sales */}
        <div className="card">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            آخر المبيعات
          </h3>

          {recentSales.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">
              لا توجد مبيعات بعد
            </p>
          ) : (
            <div className="space-y-3">
              {recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {sale.customer_name ?? 'عميل غير معروف'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(sale.created_at).toLocaleDateString('ar-EG')}
                    </p>
                  </div>

                  <span className="text-sm font-bold text-primary-600">
                    {Number(sale.total_price).toLocaleString('ar-EG')} ج.م
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'إضافة منتج', href: '/inventory', color: 'bg-blue-50 text-blue-700' },
            { label: 'تسجيل بيع', href: '/sales', color: 'bg-primary-50 text-primary-700' },
            { label: 'تسجيل مشترى', href: '/purchases', color: 'bg-green-50 text-green-700' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`card text-center font-medium text-sm hover:shadow-md transition-shadow ${link.color}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}
