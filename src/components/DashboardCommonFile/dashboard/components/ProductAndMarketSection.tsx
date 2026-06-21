"use client"

import { useEffect, useState } from "react"
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from "recharts"
import { Package, Award, ArrowUpRight, TrendingUp } from "lucide-react"

const topProducts = [
  { rank: 1, name: "Premium A4 Copier Paper", category: "Stationery", sales: "1,240 Units", revenue: "$4,960.00", growth: "+12%" },
  { rank: 2, name: "Glossy Photo Paper (180gsm)", category: "Media", sales: "850 Units", revenue: "$3,400.00", growth: "+8%" },
  { rank: 3, name: "Heavy Duty Binding Combs", category: "Binding", sales: "620 Units", revenue: "$1,860.00", growth: "+5%" },
  { rank: 4, name: "Matte Laminating Pouches", category: "Lamination", sales: "540 Units", revenue: "$1,620.00", growth: "+2%" },
]

const marketData = [
  { name: "Bank Balance Status", value: 30, fill: "#3b82f6" },
  { name: "Net Power Balance", value: 70, fill: "#f97316" },
]

interface ProductAndMarketProps {
  topProducts?: Array<{ rank: number; name: string; category: string; sales: string; revenue: string; growth: string }>
  balances?: {
    totalCashBalance: string
    totalBankBalance: string
    totalMobileBankBalance: string
    totalBalance: string
  }
  isLoading?: boolean
}

export default function ProductAndMarketSection({ topProducts, balances, isLoading }: ProductAndMarketProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const bankVal = Number(balances?.totalBankBalance || 0)
  const totalVal = Number(balances?.totalBalance || 0)
  const bankPercent = totalVal > 0 ? Math.round((bankVal / totalVal) * 100) : 30
  const cashVal = Number(balances?.totalCashBalance || 0)
  const cashPercent = totalVal > 0 ? Math.round((cashVal / totalVal) * 100) : 70

  const dynamicMarketData = [
    { name: "Bank Balance Status", value: bankPercent, fill: "#3b82f6" },
    { name: "Net Power Balance", value: cashPercent, fill: "#f97316" },
  ]

  const displayProducts = topProducts || []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Top Selling Products Component */}
      <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
            <h3 className="text-base font-bold text-slate-700 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" />
              <span>Top Selling Products</span>
            </h3>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              Best Sellers
            </span>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="text-sm text-slate-400 py-8 text-center font-medium">Loading top products...</div>
            ) : displayProducts.length > 0 ? (
              displayProducts.map((product) => (
                <div 
                  key={product.rank} 
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50/50 hover:border-slate-100 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                      product.rank === 1 ? "bg-amber-100 text-amber-700" :
                      product.rank === 2 ? "bg-slate-100 text-slate-700" :
                      product.rank === 3 ? "bg-orange-100 text-orange-700" :
                      "bg-slate-100 text-slate-600"
                    }`}>
                      {product.rank}
                    </span>
                    
                    {/* Info */}
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-800 line-clamp-1">{product.name}</span>
                      <span className="text-xs text-slate-400 font-medium">{product.category}</span>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">{product.sales}</span>
                      <span className="text-xs text-slate-400 font-semibold">{product.revenue}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-0.5">
                      <ArrowUpRight className="w-3 h-3" />
                      {product.growth}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-400 py-8 text-center font-medium">No sales recorded yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Market Info Gauge */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
            <h3 className="text-base font-bold text-slate-700 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <span>Market Info</span>
            </h3>
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
              Capital Status
            </span>
          </div>

          <div className="h-[180px] w-full flex items-center justify-center relative">
            {mounted && !isLoading ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="30%" 
                  outerRadius="80%" 
                  barSize={12} 
                  data={dynamicMarketData}
                  startAngle={180}
                  endAngle={-180}
                >
                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={6}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9", borderRadius: "12px" }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-sm text-slate-400">Loading Chart...</span>
            )}
            
            {/* Center Summary Indicator */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl font-extrabold text-slate-800">100%</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Stability</span>
            </div>
          </div>
        </div>

        {/* Legend / Metrics list */}
        <div className="space-y-2.5 pt-4 border-t border-slate-50">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm" />
              <span>Bank Balance Status</span>
            </div>
            <span className="font-bold text-slate-800">
              {isLoading ? "..." : (balances?.totalBankBalance || "0.00")}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm" />
              <span>Net Power Balance</span>
            </div>
            <span className="font-bold text-slate-800">
              {isLoading ? "..." : (balances?.totalCashBalance || "0.00")}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
