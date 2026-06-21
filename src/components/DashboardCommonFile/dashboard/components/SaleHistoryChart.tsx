"use client"

import { useEffect, useState } from "react"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from "recharts"

const saleHistoryData = [
  { name: "Sun", "Sale Units": 40, "Returned Units": 12, "Damaged Units": 5 },
  { name: "Mon", "Sale Units": 65, "Returned Units": 18, "Damaged Units": 8 },
  { name: "Tue", "Sale Units": 50, "Returned Units": 10, "Damaged Units": 3 },
  { name: "Wed", "Sale Units": 85, "Returned Units": 25, "Damaged Units": 11 },
  { name: "Thu", "Sale Units": 70, "Returned Units": 14, "Damaged Units": 6 },
  { name: "Fri", "Sale Units": 95, "Returned Units": 28, "Damaged Units": 14 },
  { name: "Sat", "Sale Units": 110, "Returned Units": 20, "Damaged Units": 9 },
]

interface WeeklyTrendProps {
  weeklyTrend?: Array<{ name: string; "Sale Units": number; "Returned Units": number; "Damaged Units": number }>
  isLoading?: boolean
}

export default function SaleHistoryChart({ weeklyTrend, isLoading }: WeeklyTrendProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-6 h-[380px] flex items-center justify-center text-slate-400 mb-6">
        Loading Sale History Chart...
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 mb-6">
      <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
        <h3 className="text-base font-bold text-slate-700">Sale History</h3>
        <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full">
          Weekly Activities
        </span>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={weeklyTrend || []}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)" }}
              labelClassName="font-bold text-slate-600"
            />
            <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", color: "#64748b" }} />
            <Line type="monotone" dataKey="Sale Units" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Returned Units" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Damaged Units" stroke="#f97316" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
