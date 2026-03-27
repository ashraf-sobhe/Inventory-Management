import { TrendingUp, ShoppingCart, TrendingDown, AlertTriangle } from 'lucide-react'

export default function StatsCards({
  totalSales,
  totalPurchases,
  profit,
  lowStock,
}: {
  totalSales: number
  totalPurchases: number
  profit: number
  lowStock: number
}) {
  const stats = [
    {
      label: 'إجمالي المبيعات',
      value: `${totalSales.toLocaleString('ar-EG')} ج.م`,
      icon: TrendingUp,
      bg: 'bg-primary-50',
      iconColor: 'text-primary-600',
    },
    {
      label: 'إجمالي المشتريات',
      value: `${totalPurchases.toLocaleString('ar-EG')} ج.م`,
      icon: ShoppingCart,
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'صافي الربح',
      value: `${profit.toLocaleString('ar-EG')} ج.م`,
      icon: TrendingDown,
      bg: profit >= 0 ? 'bg-green-50' : 'bg-red-50',
      iconColor: profit >= 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      label: 'منتجات منخفضة',
      value: lowStock,
      icon: AlertTriangle,
      bg: 'bg-red-50',
      iconColor: 'text-red-500',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="stat-card">
            <div className={`stat-icon ${stat.bg}`}>
              <Icon size={20} className={stat.iconColor} />
            </div>
            <div>
              <p className="text-gray-500 text-xs">{stat.label}</p>
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}