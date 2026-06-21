"use client"

import { useEffect, useState } from "react"
import { Calendar } from "lucide-react"
import { addDays, format, isValid } from "date-fns"
import CustomDateRangePicker from "./CustomDateRangePicker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props {
  filters: {
    dateRangeType: string
    start_date: string
    end_date: string
  }
  updateFilter: (key: string, value: any) => void
}

const DateRangeFilter = ({ filters, updateFilter }: Props) => {
  const [open, setOpen] = useState(false)

  const [range, setRange] = useState([
    {
      startDate: filters.start_date ? new Date(filters.start_date) : addDays(new Date(), -6),
      endDate: filters.end_date ? new Date(filters.end_date) : new Date(),
      key: "selection",
    },
  ])

  // --- Sync custom range to filters ---
  useEffect(() => {
    if (filters.dateRangeType === "custom") {
      const start = range[0].startDate
      const end = range[0].endDate

      if (isValid(start) && isValid(end)) {
        updateFilter("start_date", format(start, "yyyy-MM-dd"))
        updateFilter("end_date", format(end, "yyyy-MM-dd"))
      }
    }
  }, [range, filters.dateRangeType])

  const label =
    filters.dateRangeType === "custom"
      ? range[0].startDate && range[0].endDate
        ? `${format(range[0].startDate, "MMM d, yyyy")} - ${format(
            range[0].endDate,
            "MMM d, yyyy"
          )}`
        : "Select Date"
      : filters.dateRangeType
      ? filters.dateRangeType.toUpperCase()
      : "All Time"

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Date Range</label>

      <Select
        value={filters.dateRangeType || "all"}
        onValueChange={(val) => updateFilter("dateRangeType", val)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="quarterly">Quarterly</SelectItem>
          <SelectItem value="yearly">Yearly</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>

      {filters.dateRangeType === "custom" && (
        <div className="relative mt-2">
          <button
            className="flex items-center gap-2 border px-4 py-2 w-full text-sm"
            onClick={() => setOpen(!open)}
          >
            <Calendar className="w-4 h-4" />
            {label}
          </button>

          {open && (
            <CustomDateRangePicker
              range={range}
              setRange={setRange}
              onClose={() => setOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default DateRangeFilter
