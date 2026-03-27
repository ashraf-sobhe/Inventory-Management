'use client'

import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

export default function SalesChart({ data }: { data: { date: string; total: number }[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    if (chartRef.current) chartRef.current.destroy()

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: data.map(d => d.date),
        datasets: [{
          data: data.map(d => d.total),
          borderColor: '#9333ea',
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: '#9333ea',
          fill: true,
          backgroundColor: 'rgba(147,51,234,0.08)',
          tension: 0.4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 }, color: '#9ca3af' },
            border: { display: false },
          },
          y: {
            grid: { color: '#f3f4f6' },
            ticks: { font: { size: 11 }, color: '#9ca3af' },
            border: { display: false },
          }
        }
      }
    })

    return () => { chartRef.current?.destroy() }
  }, [data])

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-800">المبيعات اليومية</h3>
        <span className="badge-blue">آخر 30 يوم</span>
      </div>
      {data.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-12">لا توجد بيانات بعد</p>
      ) : (
        <div style={{ position: 'relative', height: '260px' }}>
          <canvas ref={canvasRef} />
        </div>
      )}
    </div>
  )
}