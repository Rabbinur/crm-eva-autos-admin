"use client"

import { useState, useEffect, useMemo } from "react"
import { useGetDashboardSummaryQuery } from "@/components/Redux/RTK/distributorApiNode"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { addDays, endOfMonth, endOfYear, format, startOfMonth, startOfYear, subMonths } from "date-fns"
import CustomDateRangePicker from "@/app/(withDashboardLayout)/dashboard/report-analysis/_component/CustomDateRangePicker"

import DashboardHeaderInfo from "./components/DashboardHeaderInfo"
import CurrentBalanceSection from "./components/CurrentBalanceSection"
import DashboardSummarySection from "./components/DashboardSummarySection"
import SalesAndPurchaseCharts from "./components/SalesAndPurchaseCharts"
import SaleHistoryChart from "./components/SaleHistoryChart"
import ProductAndMarketSection from "./components/ProductAndMarketSection"
import LowStockTable from "./components/LowStockTable"

export default function DashboardContent() {
  const [dateRangeType, setDateRangeType] = useState("all")
  const [range, setRange] = useState([
    {
      startDate: addDays(new Date(), -6),
      endDate: new Date(),
      key: "selection",
    },
  ])
  const [openPicker, setOpenPicker] = useState(false)

  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Sync date selection with formatted start/end strings
  useEffect(() => {
    let start = ""
    let end = ""
    const today = new Date()

    switch (dateRangeType) {
      case "today":
        start = format(today, "yyyy-MM-dd")
        end = format(today, "yyyy-MM-dd")
        break;
      case "monthly":
        start = format(startOfMonth(today), "yyyy-MM-dd")
        end = format(endOfMonth(today), "yyyy-MM-dd")
        break;
      case "quarterly":
        start = format(subMonths(today, 3), "yyyy-MM-dd")
        end = format(today, "yyyy-MM-dd")
        break;
      case "yearly":
        start = format(startOfYear(today), "yyyy-MM-dd")
        end = format(endOfYear(today), "yyyy-MM-dd")
        break;
      case "custom":
        start = format(range[0].startDate, "yyyy-MM-dd")
        end = format(range[0].endDate, "yyyy-MM-dd")
        break;
      case "all":
      default:
        start = ""
        end = ""
    }

    setStartDate(start)
    setEndDate(end)
  }, [dateRangeType, range])

  const queryParams = useMemo(() => {
    return {
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    }
  }, [startDate, endDate])

  const { data, isLoading } = useGetDashboardSummaryQuery(queryParams)

  const formattedRange = `${format(range[0].startDate, "MMM d, yyyy")} - ${format(
    range[0].endDate,
    "MMM d, yyyy"
  )}`

  return (
    <div className="bg-slate-50/50 min-h-screen p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header Container */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex-1">
          <DashboardHeaderInfo isLoading={isLoading} />
        </div>
        
        {/* Date Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] w-fit self-start lg:self-center lg:mt-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Date Filter</span>
            <Select value={dateRangeType} onValueChange={setDateRangeType}>
              <SelectTrigger className="w-[140px] rounded-xl border-slate-200 focus:ring-1 focus:ring-[#001f3f] focus:border-[#001f3f] text-slate-700 font-semibold">
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {dateRangeType === "custom" && (
            <div className="relative">
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-xl border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 font-semibold"
                onClick={() => setOpenPicker(!openPicker)}
              >
                <Calendar className="w-4 h-4 text-[#001f3f]" />
                <span>{formattedRange}</span>
              </Button>
              {openPicker && (
                <div className="absolute right-0 top-full mt-2 z-50">
                  <CustomDateRangePicker
                    range={range}
                    setRange={setRange}
                    onClose={() => setOpenPicker(false)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <CurrentBalanceSection balances={data?.balances} isLoading={isLoading} />
      <DashboardSummarySection data={data} isLoading={isLoading} />
      <SalesAndPurchaseCharts 
        monthlySaleVsExpense={data?.monthlySaleVsExpense} 
        purchaseHistory={data?.purchaseHistory} 
        isLoading={isLoading} 
      />
      <SaleHistoryChart weeklyTrend={data?.weeklyTrend} isLoading={isLoading} />
      <ProductAndMarketSection 
        topProducts={data?.topProductsList} 
        balances={data?.balances} 
        isLoading={isLoading} 
      />
      <LowStockTable lowStockItems={data?.lowStockItems} isLoading={isLoading} />
    </div>
  )
}
