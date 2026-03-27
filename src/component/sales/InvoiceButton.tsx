'use client'

import { FileText, X, Printer } from 'lucide-react'

type InvoiceItem = {
  quantity: number
  unit_price: number
  total_price: number
  products: { name: string } | null
}

type Invoice = {
  id: string
  customer_name: string | null
  total_price: number
  created_at: string
  invoice_items: InvoiceItem[]
}

type CompanySettings = {
  name: string
  phone: string | null
  address: string | null
  currency: string
}

export default function InvoiceButton({
  invoice,
  company,
}: {
  invoice: Invoice
  company: CompanySettings
}) {
  async function handlePrint() {
    const { default: html2pdf } = await import('html2pdf.js')
    const element = document.getElementById('invoice-preview')
    if (!element) return

    await html2pdf()
      .set({
        margin: 10,
        filename: `invoice-${invoice.id.slice(0, 8).toUpperCase()}.pdf`,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(element)
      .save()
  }

  function openModal() {
    const modal = document.getElementById('invoice-modal')
    if (modal) modal.style.display = 'flex'
  }

  function closeModal() {
    const modal = document.getElementById('invoice-modal')
    if (modal) modal.style.display = 'none'
  }

  const date = new Date(invoice.created_at).toLocaleDateString('ar-EG')
  const invoiceNumber = invoice.id.slice(0, 8).toUpperCase()
  const totalPrice = Number(invoice.total_price).toLocaleString('ar-EG')

  return (
    <>
      <button
        onClick={openModal}
        className="text-gray-400 hover:text-primary-500 transition-colors"
        title="معاينة الفاتورة"
      >
        <FileText size={16} />
      </button>

      <div
        id="invoice-modal"
        style={{ display: 'none' }}
        className="fixed inset-0 bg-black/50 items-center justify-center z-50 p-4"
      >
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">

          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">معاينة الفاتورة</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <Printer size={15} />
                طباعة PDF
              </button>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto p-6">
            <div id="invoice-preview" dir="rtl" style={{ fontFamily: "'Cairo', 'Segoe UI', sans-serif", color: '#1f2937' }}>

              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>{company.name}</h1>
                {company.phone && <p style={{ margin: '4px 0', fontSize: '13px', color: '#6b7280' }}>{company.phone}</p>}
                {company.address && <p style={{ margin: '4px 0', fontSize: '13px', color: '#6b7280' }}>{company.address}</p>}
              </div>

              <hr style={{ border: '1px solid #e5e7eb', marginBottom: '24px' }} />

              <h2 style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>فاتورة</h2>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '24px' }}>
                <div>
                  <p style={{ margin: '4px 0' }}><strong>رقم الفاتورة:</strong> {invoiceNumber}</p>
                  <p style={{ margin: '4px 0' }}><strong>التاريخ:</strong> {date}</p>
                </div>
                <div>
                  <p style={{ margin: '4px 0' }}><strong>العميل:</strong> {invoice.customer_name ?? 'عميل نقدي'}</p>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '24px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#9333ea', color: 'white' }}>
                    <th style={{ padding: '10px', textAlign: 'right' }}>المنتج</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>الكمية</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>سعر الوحدة</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.invoice_items.map((item, index) => (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9fafb' : 'white', borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '10px', textAlign: 'right' }}>{item.products?.name ?? '—'}</td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ padding: '10px', textAlign: 'left' }}>{Number(item.unit_price).toLocaleString('ar-EG')} {company.currency}</td>
                      <td style={{ padding: '10px', textAlign: 'left' }}>{Number(item.total_price).toLocaleString('ar-EG')} {company.currency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <hr style={{ border: '1px solid #e5e7eb' }} />

              <div style={{ textAlign: 'left', marginTop: '12px' }}>
                <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
                  الإجمالي: {totalPrice} {company.currency}
                </p>
              </div>

              <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '40px' }}>
                شكراً لتعاملكم معنا
              </p>

            </div>
          </div>

        </div>
      </div>
    </>
  )
}
