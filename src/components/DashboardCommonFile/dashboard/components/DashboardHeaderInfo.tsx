"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"

import { LayoutDashboard, Calendar } from "lucide-react"

interface HeaderProps {
  isLoading?: boolean
}

export default function DashboardHeaderInfo({ isLoading }: HeaderProps) {
  const [mounted, setMounted] = useState(false)
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    setMounted(true)
    setCurrentDate(format(new Date(), "dd MMM yyyy, cccc"))
  }, [])

  return (
    <div className="flex flex-col gap-2 animate-fade-in">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-slate-100 text-[#001f3f] shadow-xs">
          <LayoutDashboard className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-[#001f3f] flex items-center gap-2">
          Dashboard Overview
          {isLoading && (
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping inline-block" />
          )}
        </h1>
      </div>
      
      <div className="flex flex-col   gap-3 pt-1">
        <p className="text-sm text-slate-500 font-medium">
          Welcome back! Here is your company business summary and analytics status
        </p>
        <div className="flex items-center gap-2 text-xs font-bold text-[#001f3f] bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200/60 shadow-xs w-fit shrink-0">
          <Calendar className="w-3.5 h-3.5 text-[#001f3f]/80" />
          <span>Today: {mounted ? currentDate : "Loading date..."}</span>
        </div>
      </div>
    </div>
  )
}
