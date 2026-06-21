"use client"

import { useEffect, useState } from "react"
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from "recharts"

const monthlySaleVsExpentData = [
  { name: "Jan", Sale: 4000, Expent: 2400 },
  { name: "Feb", Sale: 3000, Expent: 1398 },
  { name: "Mar", Sale: 2000, Expent: 9800 },
  { name: "Apr", Sale: 2780, Expent: 3908 },
  { name: "May", Sale: 1890, Expent: 4800 },
  { name: "Jun", Sale: 2390, Expent: 3800 },
  { name: "Jul", Sale: 3490, Expent: 4300 },
  { name: "Aug", Sale: 4200, Expent: 3200 },
  { name: "Sep", Sale: 5100, Expent: 4100 },
  { name: "Oct", Sale: 4600, Expent: 3800 },
  { name: "Nov", Sale: 5500, Expent: 4600 },
  { name: "Dec", Sale: 6200, Expent: 5000 },
]

const purchaseHistoryData = [
  { name: "January", Purchase: 2400 },
  { name: "March", Purchase: 3600 },
  { name: "May", Purchase: 3000 },
  { name: "July", Purchase: 4500 },
  { name: "September", Purchase: 4200 },
  { name: "December", Purchase: 5800 },
]

interface ChartsProps {
  monthlySaleVsExpense?: Array<{ name: string; Sale: number; Expent: number }>
  purchaseHistory?: Array<{ name: string; Purchase: number }>
  isLoading?: boolean
}

export default function SalesAndPurchaseCharts({ monthlySaleVsExpense, purchaseHistory, isLoading }: ChartsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 h-[380px] flex items-center justify-center text-slate-400">
          Loading Sale & Expense Chart...
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-6 h-[380px] flex items-center justify-center text-slate-400">
          Loading Purchase History...
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Monthly Sale vs Expense Bar Chart */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
        <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
          <h3 className="text-base font-bold text-slate-700">Monthly sale vs expent</h3>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            Annual Summary
          </span>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlySaleVsExpense || []}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSale" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.85}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0.25}/>
                </linearGradient>
                <linearGradient id="colorExpent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.85}/>
                  <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0.25}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)" }}
                labelClassName="font-bold text-slate-600"
              />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", color: "#64748b" }} />
              <Bar name="Monthly Sale" dataKey="Sale" fill="url(#colorSale)" radius={[4, 4, 0, 0]} />
              <Bar name="Monthly Expent" dataKey="Expent" fill="url(#colorExpent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Purchase History Area Chart */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
        <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
          <h3 className="text-base font-bold text-slate-700">Purchase History</h3>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            Restock Trends
          </span>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={purchaseHistory || []}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPurchase" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)" }}
                labelClassName="font-bold text-slate-600"
              />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", color: "#64748b" }} />
              <Area name="Purchase Amount" type="monotone" dataKey="Purchase" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorPurchase)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
