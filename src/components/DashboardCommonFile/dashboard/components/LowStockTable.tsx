"use client"

import React, { useState, useMemo } from "react"
import { Search, ChevronLeft, ChevronRight, AlertOctagon } from "lucide-react"

interface LowStockItem {
  sl: number
  product: string
  purchase: string
  quantity: number
  subTotal: string
}

interface LowStockTableProps {
  lowStockItems?: LowStockItem[]
  isLoading?: boolean
}

export default function LowStockTable({ lowStockItems, isLoading }: LowStockTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [entriesCount, setEntriesCount] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const displayItems = lowStockItems || []

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    return displayItems.filter(item =>
      item.product.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, displayItems])

  // Total pages
  const totalPages = Math.ceil(filteredItems.length / entriesCount) || 1

  // Paginated items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesCount
    return filteredItems.slice(startIndex, startIndex + entriesCount)
  }, [filteredItems, currentPage, entriesCount])

  // Display indices
  const showingFrom = filteredItems.length > 0 ? (currentPage - 1) * entriesCount + 1 : 0
  const showingTo = Math.min(currentPage * entriesCount, filteredItems.length)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page on search
  }

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesCount(Number(e.target.value))
    setCurrentPage(1)
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
      {/* Title Header */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-3">
        <h3 className="text-base font-bold text-slate-700 flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-rose-500" />
          <span>Low Stock</span>
        </h3>
        <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
          Attention Required
        </span>
      </div>

      {/* Table Controls (Show Entries & Search) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        {/* Left: Show Entries */}
        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
          <span>Show</span>
          <select 
            value={entriesCount}
            onChange={handleEntriesChange}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span>entries</span>
        </div>

        {/* Right: Search Input */}
        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-300"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th className="px-5 py-3.5 w-16">SL</th>
              <th className="px-5 py-3.5">Product</th>
              <th className="px-5 py-3.5 text-right">Purchase Price</th>
              <th className="px-5 py-3.5 text-center w-28">Quantity</th>
              <th className="px-5 py-3.5 text-right">Sub Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-600">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-slate-400 font-semibold bg-slate-50/20">
                  Loading low stock items...
                </td>
              </tr>
            ) : paginatedItems.length > 0 ? (
              paginatedItems.map((item, idx) => (
                <tr key={item.sl} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-400">{showingFrom + idx}</td>
                  <td className="px-5 py-4 text-slate-800 font-semibold">{item.product}</td>
                  <td className="px-5 py-4 text-right">${Number(item.purchase).toFixed(2)}</td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-slate-800">${Number(item.subTotal).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-slate-400 font-semibold bg-slate-50/20">
                  No data available in table
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-5 pt-4 border-t border-slate-50">
        {/* Left Status info */}
        <span className="text-xs font-medium text-slate-400">
          Showing {showingFrom} to {showingTo} of {filteredItems.length} entries
        </span>

        {/* Right Nav Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center justify-center p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-500 px-3 py-1 bg-slate-50 rounded-lg border border-slate-150">
            {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
