import Header from '@/components/layout/Header'
import { createClient } from '@/lib/supabase'
import SalesChart from '@/app/(erp)/reports/SalesChart'
import TopProductsChart from '@/app/(erp)/reports/TopProductsChart'
import StatsCards from '@/app/(erp)/reports/StatsCards'

async function getReportsData() {
  const supabase = createClient()

  const [sales, purchases, products] = await Promise.all([
    supabase.from('sales').select('*, products(name)').order('created_at'),
    supabase.from('purchases').select('*').order('created_at'),
    supabase.from('products').select('*'),
  ])

  return {
    sales: sales.data ?? [],
    purchases: purchases.data ?? [],
    products: products.data ?? [],
  }
}

export default async function ReportsPage() {
  const { sales, purchases, products } = await getReportsData()

  const totalSales = sales.reduce((sum, s) => sum + Number(s.total_price), 0)
  const totalPurchases = purchases.reduce((sum, p) => sum + Number(p.total_cost), 0)
  const profit = totalSales - totalPurchases
  const lowStock = products.filter(p => p.quantity < 10).length

  const salesByDay = sales.reduce((acc: Record<string, number>, sale) => {
    const day = new Date(sale.created_at).toLocaleDateString('ar-EG')
    acc[day] = (acc[day] ?? 0) + Number(sale.total_price)
    return acc
  }, {})

  const salesChartData = Object.entries(salesByDay).map(([date, total]) => ({
    date,
    total,
  }))

  const productSales = sales.reduce((acc: Record<string, number>, sale) => {
    const name = sale.products?.name ?? 'غير معروف'
    acc[name] = (acc[name] ?? 0) + sale.quantity
    return acc
  }, {})

  const topProducts = Object.entries(productSales)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)

  return (
    <div>
      <Header title="التقارير" />
      <div className="p-4 lg:p-6 space-y-6">

        <StatsCards
          totalSales={totalSales}
          totalPurchases={totalPurchases}
          profit={profit}
          lowStock={lowStock}
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <SalesChart data={salesChartData} />
          <TopProductsChart data={topProducts} />
        </div>

      </div>
    </div>
  )
}