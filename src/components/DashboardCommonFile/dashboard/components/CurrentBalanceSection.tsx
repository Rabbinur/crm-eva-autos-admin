"use client"

import { Wallet, Landmark, PhoneCall, Calculator, HelpCircle } from "lucide-react"

interface BalanceCardProps {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  tooltip?: string
}

function BalanceCard({ title, value, icon: Icon, tooltip }: BalanceCardProps) {
  return (
    /* ডিজাইন হুবহু এক, শুধু হোভার কালার পরিবর্তন করে Slate/Gray টোন দেওয়া হয়েছে */
    <div className="group relative bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,2,0.02)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] hover:border-slate-300 transition-all duration-300 transform hover:-translate-y-1">
      {/* Background soft gradient overlay on hover (Orange/Amber এর বদলে Navy/Slate Light Gradient) */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/0 to-gray-50/0 group-hover:from-slate-50/50 group-hover:to-gray-100/50 transition-all duration-300 rounded-2xl" />
      
      <div className="relative z-10 flex flex-col gap-1 min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-600 transition-colors uppercase tracking-wider">
            {title}
          </span>
          {tooltip && (
            <div className="group/tooltip relative inline-block">
              <HelpCircle className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500 transition-colors cursor-pointer" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-52 bg-slate-900 text-white text-[10px] font-medium p-2.5 rounded-lg shadow-lg text-center z-50 leading-relaxed normal-case">
                {tooltip}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
              </div>
            </div>
          )}
        </div>
        <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
          {value}
        </span>
      </div>

      {/* Icon wrapper এর অরেঞ্জ থিম পরিবর্তন করে প্রফেশনাল Slate/Navy Blue এবং হোভারে Solid Black থিম দেওয়া হয়েছে */}
      <div className="relative z-10 p-3.5 rounded-2xl bg-gradient-to-br from-slate-100 to-gray-100 text-slate-700 group-hover:from-slate-800 group-hover:to-slate-950 group-hover:text-white transition-all duration-300 shadow-inner group-hover:shadow-[0_4px_12px_rgba(15,23,42,0.2)]">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  )
}

interface BalancesProps {
  balances?: {
    totalCashBalance: string
    totalBankBalance: string
    totalMobileBankBalance: string
    totalBalance: string
  }
  isLoading?: boolean
}

export default function CurrentBalanceSection({ balances, isLoading }: BalancesProps) {
  return (
    <div className="w-full space-y-4 mb-6">
      {/* Section Header: Orange এর বদলে Solid Navy Blue (Slate-900) */}
      <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold text-sm shadow-[0_4px_12px_rgba(15,23,42,0.15)]">
        <Landmark className="w-5 h-5 text-slate-300" />
        <span>Current Balance</span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
        <BalanceCard 
          title="Total Balance" 
          value={isLoading ? "..." : (balances?.totalBalance || "0.00")} 
          icon={Calculator} 
          tooltip="ডেলিভারি সেটেলমেন্ট ও বিক্রয় থেকে প্রাপ্ত মোট ক্যাশ বা নগদ ব্যালেন্স।"
        />
      </div>
    </div>
  )
}