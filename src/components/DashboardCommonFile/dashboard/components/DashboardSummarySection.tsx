"use client"

import {
  AlertTriangle,
  ArrowUpCircle,
  BarChart3,
  DollarSign,
  Flag,
  Layers,
  Package,
  RefreshCw,
  Undo,
  Wallet,
  HelpCircle
} from "lucide-react"

interface SummaryCardProps {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  gradientClass: string // Gradient for icon wrapper
  tooltip?: string
}

function SummaryCard({ label, value, icon: Icon, gradientClass, tooltip }: SummaryCardProps) {
  return (
    <div className="group bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:border-slate-200 transition-all duration-300 transform hover:-translate-y-1">
      {/* Left Icon with Gradient Rounded Background */}
      <div className={`shrink-0 p-3 rounded-full text-white shadow-sm ${gradientClass} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Right Content */}
      <div className="flex flex-col min-w-0 flex-1 relative">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-500 transition-colors line-clamp-1">
            {label}
          </span>
          {tooltip && (
            <div className="group/tooltip relative inline-block">
              <HelpCircle className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500 transition-colors cursor-pointer" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-52 bg-slate-800 text-white text-[10px] font-medium p-2.5 rounded-lg shadow-lg text-center z-50 leading-relaxed">
                {tooltip}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
              </div>
            </div>
          )}
        </div>
        <span className="text-xl font-bold text-slate-800 tracking-tight mt-0.5">
          {value}
        </span>
      </div>
    </div>
  )
}

interface DashboardSummaryProps {
  data?: {
    stockStats?: {
      totalAvailableStock: string
      totalPurchaseStockValue: string
      totalSaleStockValue: string
    }
    damageStats?: {
      totalAvailableDamageStock: string
      totalDamageStockValue: string
      todayReturnDamage: string
      todayReturnAmount: string
      saleReturnDamage: string
    }
    duesStats?: {
      totalCustomerDue: string
      totalStaffDue: string
      totalDue: string
      totalSupplierDue: string
    }
    collectionsStats?: {
      todayStaffCollection: string
      todayCustomerCollection: string
      todaySaleCollection: string
      todayCollection: string
    }
    dailyActivity?: {
      todayExpense: string
      todaySaleAmount: string
      todaySaleDiscount: string
      todaySaleCampaignDiscount: string
      todayBadDebt: string
    }
    salesTotals?: {
      saleDiscount: string
      saleCampaignDiscount: string
      totalSale: string
    }
  }
  isLoading?: boolean
}

export default function DashboardSummarySection({ data, isLoading }: DashboardSummaryProps) {
  const metrics = [
    // Stocks (Orange)
    { 
      label: "Available Stock", 
      value: isLoading ? "..." : Math.round(Number(data?.stockStats?.totalAvailableStock || 0)).toString(), 
      icon: Package, 
      gradientClass: "bg-gradient-to-br from-amber-500 to-orange-500",
      tooltip: "বর্তমানে বিক্রির জন্য স্টকে উপলব্ধ মোট প্রোডাক্টের সংখ্যা (পিস হিসেবে)।" 
    },
    { 
      label: "Purchase Stock Value", 
      value: isLoading ? "..." : (data?.stockStats?.totalPurchaseStockValue || "0.00"), 
      icon: Flag, 
      gradientClass: "bg-gradient-to-br from-amber-500 to-orange-500",
      tooltip: "স্টকে থাকা মোট প্রোডাক্টের আনুমানিক ক্রয়মূল্য (প্রতিটি প্রোডাক্টের ক্রয় রেট অনুযায়ী হিসাব করা)।" 
    },
    { 
      label: "Sale Stock Value", 
      value: isLoading ? "..." : (data?.stockStats?.totalSaleStockValue || "0.00"), 
      icon: BarChart3, 
      gradientClass: "bg-gradient-to-br from-amber-500 to-orange-500",
      tooltip: "স্টকে থাকা মোট প্রোডাক্টের সম্ভাব্য বিক্রয়মূল্য (কাস্টমার বিক্রয় মূল্য বা প্যাক প্রাইস অনুযায়ী)।" 
    },

    // Sales Totals
    { 
      label: "Total Sale", 
      value: isLoading ? "..." : (data?.salesTotals?.totalSale || "0.00"), 
      icon: Layers, 
      gradientClass: "bg-gradient-to-br from-emerald-500 to-teal-500",
      tooltip: "শুরু থেকে এ পর্যন্ত সম্পন্ন বা সেটেল হওয়া সকল ডেলিভারির মোট বিক্রয় মূল্য।" 
    },
    { 
      label: "Today Expense", 
      value: isLoading ? "..." : (data?.dailyActivity?.todayExpense || "0.00"), 
      icon: ArrowUpCircle, 
      gradientClass: "bg-gradient-to-br from-violet-500 to-fuchsia-500",
      tooltip: "আজকের মোট বিক্রির ২% হারে হিসেবকৃত আনুমানিক পরিচালন বা অন্যান্য খরচ।" 
    },
    // Damage Stocks (Rose/Red)
    { 
      label: "Available Damage Stock", 
      value: isLoading ? "..." : Math.round(Number(data?.damageStats?.totalAvailableDamageStock || 0)).toString(), 
      icon: AlertTriangle, 
      gradientClass: "bg-gradient-to-br from-rose-500 to-red-500",
      tooltip: "ড্যামেজ হিসেবে অনুমোদিত কিন্তু এখনও নিষ্পত্তি (Dispose) না হওয়া মোট প্রোডাক্টের সংখ্যা (পিস)।" 
    },
    { 
      label: "Damage Stock Value", 
      value: isLoading ? "..." : (data?.damageStats?.totalDamageStockValue || "0.00"), 
      icon: AlertTriangle, 
      gradientClass: "bg-gradient-to-br from-rose-500 to-red-500",
      tooltip: "অনুমোদিত ড্যামেজ প্রোডাক্টগুলোর মোট ক্রয়মূল্য (যা ব্যবসায়িক ক্ষতি বা লোকসান হিসেবে গণ্য)।" 
    },

    // Dues (Indigo/Blue)
    { 
      label: "Total Due", 
      value: isLoading ? "..." : (data?.duesStats?.totalDue || "0.00"), 
      icon: Wallet, 
      gradientClass: "bg-gradient-to-br from-indigo-500 to-blue-600",
      tooltip: "ডেলিভারি প্রতিনিধিদের কাছে ট্রানজিটে থাকা মালামালের মূল্য এবং কাস্টমারদের কাছে বকেয়া মোট টাকার সমষ্টি।" 
    },
    { 
      label: "Today Return Amount", 
      value: isLoading ? "..." : (data?.damageStats?.todayReturnAmount || "0.00"), 
      icon: RefreshCw, 
      gradientClass: "bg-gradient-to-br from-rose-500 to-red-500",
      tooltip: "আজকের দিনে (বা নির্বাচিত সময়ে) ফেরত আসা ড্যামেজ প্রোডাক্টগুলোর মোট ক্রয়মূল্য বা আর্থিক ক্ষতি।" 
    },
    { 
      label: "Today Return Damage", 
      value: isLoading ? "..." : Math.round(Number(data?.damageStats?.todayReturnDamage || 0)).toString(), 
      icon: Undo, 
      gradientClass: "bg-gradient-to-br from-rose-500 to-red-500",
      tooltip: "আজকের দিনে (বা নির্বাচিত সময়ে) ফেরত আসা ড্যামেজ প্রোডাক্টের মোট সংখ্যা (পিস)।" 
    },
    // Daily Activity (Emerald/Green/Teal)
    { 
      label: "Today's Sale", 
      value: isLoading ? "..." : (data?.dailyActivity?.todaySaleAmount || "0.00"), 
      icon: DollarSign, 
      gradientClass: "bg-gradient-to-br from-emerald-500 to-teal-500",
      tooltip: "আজকের দিনে (বা নির্বাচিত সময়ে) সেটেল হওয়া মোট বিক্রির আর্থিক পরিমাণ।" 
    },
  ]

  return (
    <div className="w-full space-y-4 mb-6">
      {/* Section Header */}
      <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold text-sm shadow-[0_4px_12px_rgba(249,115,22,0.2)]">
        <Package className="w-5 h-5 text-orange-100" />
        <span>Dashboard Summary</span>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((item, idx) => (
          <SummaryCard
            key={idx}
            label={item.label}
            value={item.value}
            icon={item.icon}
            gradientClass={item.gradientClass}
            tooltip={item.tooltip}
          />
        ))}
      </div>
    </div>
  )
}
