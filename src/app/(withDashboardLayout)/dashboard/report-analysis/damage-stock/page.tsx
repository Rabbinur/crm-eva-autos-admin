"use client";

import { useState, useEffect, useMemo } from "react";
import { useGetDamageReportsQuery } from "@/components/Redux/RTK/distributorApiNode";
import { Calendar, TrendingDown, Package, UserCheck, Warehouse, DollarSign, Loader2, ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";
import { addDays, endOfMonth, endOfYear, format, startOfMonth, startOfYear, subMonths } from "date-fns";
import CustomDateRangePicker from "../_component/CustomDateRangePicker";
import PrintLayout from "@/components/PrintLayout";

const DamageProductReports = () => {
  const [dateRangeType, setDateRangeType] = useState("all");
  const [range, setRange] = useState([
    {
      startDate: addDays(new Date(), -29),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openPicker, setOpenPicker] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);

  // Sync date selection with formatted start/end strings
  useEffect(() => {
    let start = "";
    let end = "";
    const today = new Date();

    switch (dateRangeType) {
      case "today":
        start = format(today, "yyyy-MM-dd");
        end = format(today, "yyyy-MM-dd");
        break;
      case "monthly":
        start = format(startOfMonth(today), "yyyy-MM-dd");
        end = format(endOfMonth(today), "yyyy-MM-dd");
        break;
      case "quarterly":
        start = format(subMonths(today, 3), "yyyy-MM-dd");
        end = format(today, "yyyy-MM-dd");
        break;
      case "yearly":
        start = format(startOfYear(today), "yyyy-MM-dd");
        end = format(endOfYear(today), "yyyy-MM-dd");
        break;
      case "custom":
        start = format(range[0].startDate, "yyyy-MM-dd");
        end = format(range[0].endDate, "yyyy-MM-dd");
        break;
      case "all":
      default:
        start = "";
        end = "";
    }

    setStartDate(start);
    setEndDate(end);
  }, [dateRangeType, range]);

  const queryParams = useMemo(() => {
    return {
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    };
  }, [startDate, endDate]);

  const { data: reportData, isLoading, isFetching } = useGetDamageReportsQuery(queryParams);

  const formatCurrency = (val: number) =>
    `৳${Number(val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const summary = reportData?.summary || { totalLoss: 0, totalQty: 0, totalRecords: 0 };
  const lossBySource = reportData?.lossBySource || [];
  const lossByMonth = reportData?.lossByMonth || [];
  const lossByProduct = reportData?.lossByProduct || [];
  const lossByBatch = reportData?.lossByBatch || [];
  const lossByDeliveryMan = reportData?.lossByDeliveryMan || [];
  const lossByWarehouse = reportData?.lossByWarehouse || [];

  // Helper to calculate max for progress bars
  const maxProductLoss = Math.max(...lossByProduct.map((p: any) => p.loss), 1);
  const maxSourceLoss = Math.max(...lossBySource.map((s: any) => s.loss), 1);
  const maxRepLoss = Math.max(...lossByDeliveryMan.map((d: any) => d.loss), 1);
  const maxWarehouseLoss = Math.max(...lossByWarehouse.map((w: any) => w.loss), 1);

  const formattedRange = `${format(range[0].startDate, "MMM d, yyyy")} - ${format(range[0].endDate, "MMM d, yyyy")}`;

  const renderContent = () => (
    <div className="space-y-6">
      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Total Loss Value */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Loss Value</p>
            <h3 className="text-xl font-black text-rose-600">{formatCurrency(summary.totalLoss)}</h3>
            <p className="text-[9px] text-slate-400 font-semibold">Expected write-off based on purchase price</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
            <TrendingDown size={20} />
          </div>
        </div>

        {/* Card 2: Total Pieces Damaged */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pcs Written-Off</p>
            <h3 className="text-xl font-black text-[#001f3f]">{Math.round(summary.totalQty)} pcs</h3>
            <p className="text-[9px] text-slate-400 font-semibold">Total physical write-off quantities</p>
          </div>
          <div className="p-3 bg-slate-50 text-slate-700 rounded-xl border border-slate-200">
            <Package size={20} />
          </div>
        </div>

        {/* Card 3: Total Logs */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Damage Vouchers</p>
            <h3 className="text-xl font-black text-emerald-600">{summary.totalRecords} logs</h3>
            <p className="text-[9px] text-slate-400 font-semibold">Approved write-off requests in system</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <Calendar size={20} />
          </div>
        </div>
      </div>

      {/* Breakdown Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breakdown 1: Damage By Product */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider border-b border-slate-50 pb-3 flex items-center gap-2">
            <Package size={14} className="text-rose-500" /> Top Damaged Products
          </h3>
          <div className="space-y-3">
            {lossByProduct.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">No product write-offs logged.</p>
            ) : (
              lossByProduct.slice(0, 5).map((p: any, i: number) => {
                const percent = (p.loss / maxProductLoss) * 100;
                return (
                  <div key={i} className="space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-slate-600">
                      <span>{p.product} ({Math.round(p.qty)} pcs)</span>
                      <span className="text-rose-600">{formatCurrency(p.loss)}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Breakdown 2: Damage By Source */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider border-b border-slate-50 pb-3 flex items-center gap-2">
            <Warehouse size={14} className="text-blue-500" /> Losses By Source
          </h3>
          <div className="space-y-3">
            {lossBySource.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">No source records logged.</p>
            ) : (
              lossBySource.map((s: any, i: number) => {
                const percent = (s.loss / maxSourceLoss) * 100;
                return (
                  <div key={i} className="space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-slate-600">
                      <span>{s.source} ({Math.round(s.qty)} pcs)</span>
                      <span className="text-blue-600">{formatCurrency(s.loss)}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Breakdown 3: Damage By Delivery Man */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider border-b border-slate-50 pb-3 flex items-center gap-2">
            <UserCheck size={14} className="text-emerald-500" /> Losses By Delivery Personnel
          </h3>
          <div className="space-y-3">
            {lossByDeliveryMan.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">No delivery representative losses logged.</p>
            ) : (
              lossByDeliveryMan.slice(0, 5).map((d: any, i: number) => {
                const percent = (d.loss / maxRepLoss) * 100;
                return (
                  <div key={i} className="space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-slate-600">
                      <span>{d.deliveryMan} ({Math.round(d.qty)} pcs)</span>
                      <span className="text-emerald-600">{formatCurrency(d.loss)}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Breakdown 4: Damage By Warehouse Reason */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider border-b border-slate-50 pb-3 flex items-center gap-2">
            <Warehouse size={14} className="text-amber-500" /> Warehouse Damages By Reason
          </h3>
          <div className="space-y-3">
            {lossByWarehouse.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">No warehouse write-offs logged.</p>
            ) : (
              lossByWarehouse.map((w: any, i: number) => {
                const percent = (w.loss / maxWarehouseLoss) * 100;
                return (
                  <div key={i} className="space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-slate-600">
                      <span>{w.reason} ({Math.round(w.qty)} pcs)</span>
                      <span className="text-amber-600">{formatCurrency(w.loss)}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Trend Breakdowns: Monthly and Batch Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Damage Report */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-1 md:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider border-b border-slate-50 pb-3">Monthly Damage Trends</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-semibold">
              <thead>
                <tr className="border-b text-slate-400 text-[10px] uppercase tracking-wider">
                  <th className="py-2">Month</th>
                  <th className="py-2 text-center">Qty (Pcs)</th>
                  <th className="py-2 text-right">Total Loss Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {lossByMonth.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-slate-400 italic">No monthly logs found.</td>
                  </tr>
                ) : (
                  lossByMonth.map((m: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="py-2.5 font-bold">{m.month}</td>
                      <td className="py-2.5 text-center font-medium">{Math.round(m.qty)} pcs</td>
                      <td className="py-2.5 text-right font-black text-rose-600">{formatCurrency(m.loss)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Batch Damage summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider border-b border-slate-50 pb-3">Loss by Batch (Top 10)</h3>
          <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
            {lossByBatch.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">No batch codes recorded.</p>
            ) : (
              lossByBatch.slice(0, 10).map((b: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-xs font-semibold py-1.5 border-b border-dashed border-slate-100 last:border-0">
                  <span className="font-mono text-slate-400 font-bold">{b.batch}</span>
                  <div className="text-right">
                    <div className="text-slate-700">{Math.round(b.qty)} pcs</div>
                    <div className="text-[10px] text-rose-500 font-bold">{formatCurrency(b.loss)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (isPrinting) {
    return (
      <PrintLayout
        title="Damage & Loss Intelligence Report"
        invoiceNo={new Date().toISOString().slice(0, 10)}
        invoiceLabel="Report Date"
        onBack={() => setIsPrinting(false)}
      >
        <div className="mt-8">
          <p className="text-xs text-slate-500 font-semibold mb-4">
            Date Range Applied: {startDate && endDate ? `${startDate} to ${endDate}` : "All Time"}
          </p>
          {renderContent()}
        </div>
      </PrintLayout>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Damage & Loss Intelligence</h1>
            <p className="text-xs text-slate-400 font-semibold">Aggregated reporting, batch write-off analytics, and financial impact summaries</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPrinting(true)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Printer size={14} className="text-[#001f3f]" />
              <span>Print Report</span>
            </button>
            <Link
              href="/dashboard/damage/damage-list"
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <ArrowLeft size={14} /> Back to Logs
            </Link>
          </div>
        </div>

        {/* Date Filter Bar */}
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Date Filter</span>
            <select
              value={dateRangeType}
              onChange={(e) => setDateRangeType(e.target.value)}
              className="w-[140px] px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold outline-none focus:ring-1 focus:ring-[#001f3f] focus:border-[#001f3f]"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {dateRangeType === "custom" && (
            <div className="relative">
              <button
                onClick={() => setOpenPicker(!openPicker)}
                className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs bg-white"
              >
                <Calendar className="w-3.5 h-3.5 text-[#001f3f]" />
                <span>{formattedRange}</span>
              </button>
              {openPicker && (
                <CustomDateRangePicker
                  range={range}
                  setRange={setRange}
                  onClose={() => setOpenPicker(false)}
                />
              )}
            </div>
          )}
        </div>

        {isLoading || isFetching ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <Loader2 className="animate-spin text-rose-600 mb-3" size={32} />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Compiling write-off metrics...</span>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default DamageProductReports;