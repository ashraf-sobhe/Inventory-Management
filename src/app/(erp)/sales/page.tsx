import Header from '@/components/layout/Header'
import { createClient } from '@/lib/supabase'
import { TrendingUp } from 'lucide-react'
import AddSaleButton from '@/app/(erp)/sales/AddSaleButton'
import DeleteSaleButton from '@/app/(erp)/sales/DeleteSaleButton'
import InvoiceButton from '@/component/sales/InvoiceButton'

async function getInvoices() {
  const supabase = createClient()
  const { data } = await supabase
    .from('invoices')
    .select('*, invoice_items(*, products(name))')
    .order('created_at', { ascending: false })
  return data ?? []
}

async function getCompany() {
  const supabase = createClient()
  const { data } = await supabase
    .from('company_settings')
    .select('*')
    .single()
  return data
}

export default async function SalesPage() {
  const [invoices, company] = await Promise.all([getInvoices(), getCompany()])
  const total = invoices.reduce((sum, i) => sum + Number(i.total_price), 0)

  return (
    <div>
      <Header title="المبيعات" />
      <div className="p-4 lg:p-6 space-y-6">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-primary-600" />
            <p className="text-sm text-gray-500">
              إجمالي المبيعات:
              <span className="font-semibold text-gray-800 mr-1">
                {total.toLocaleString('ar-EG')} {company?.currency ?? 'ج.م'}
              </span>
            </p>
          </div>
          <AddSaleButton />
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block table-container">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">العميل</th>
                <th className="table-header">السلع</th>
                <th className="table-header">الإجمالي</th>
                <th className="table-header">التاريخ</th>
                <th className="table-header"></th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                    لا توجد مبيعات بعد
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="table-row">
                    <td className="table-cell font-medium text-gray-900">
                      {invoice.customer_name ?? 'عميل نقدي'}
                    </td>
                    <td className="table-cell text-gray-600 text-sm">
                      {invoice.invoice_items.map((item: any) => item.products?.name).join('، ')}
                    </td>
                    <td className="table-cell font-semibold text-primary-700">
                      {Number(invoice.total_price).toLocaleString('ar-EG')} {company?.currency ?? 'ج.م'}
                    </td>
                    <td className="table-cell text-gray-400 text-xs">
                      {new Date(invoice.created_at).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <InvoiceButton invoice={invoice} company={company} />
                        <DeleteSaleButton id={invoice.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3">
          {invoices.length === 0 ? (
            <p className="text-center py-12 text-gray-400 text-sm">
              لا توجد مبيعات بعد
            </p>
          ) : (
            invoices.map((invoice) => (
              <div key={invoice.id} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {invoice.customer_name ?? 'عميل نقدي'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(invoice.created_at).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                  <span className="font-bold text-primary-700">
                    {Number(invoice.total_price).toLocaleString('ar-EG')} {company?.currency ?? 'ج.م'}
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  {invoice.invoice_items.map((item: any) => item.products?.name).join('، ')}
                </p>

                <div className="flex items-center justify-end gap-3 pt-1 border-t border-gray-100">
                  <InvoiceButton invoice={invoice} company={company} />
                  <DeleteSaleButton id={invoice.id} />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}