"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Printer, Loader2, Calendar } from "lucide-react";
import { useGetDamageRecordsReportQuery } from "@/components/Redux/RTK/distributorApiNode";
import PrintLayout from "@/components/PrintLayout";
import { addDays, endOfMonth, endOfYear, format, startOfMonth, startOfYear, subMonths } from "date-fns";
import CustomDateRangePicker from "../_component/CustomDateRangePicker";

const DamageReport = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");
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
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
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
    setCurrentPage(1);
  }, [dateRangeType, range]);

  // Fetch report data
  const { data: reportData = [], isLoading, isFetching } = useGetDamageRecordsReportQuery({
    start_date: startDate || undefined,
    end_date: endDate || undefined,
    status: selectedStatus || undefined,
  });

  const formattedRange = `${format(range[0].startDate, "MMM d, yyyy")} - ${format(range[0].endDate, "MMM d, yyyy")}`;

  // Pagination & Filtering
  const totalPages = Math.ceil(reportData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return reportData.slice(startIdx, startIdx + pageSize);
  }, [reportData, currentPage, pageSize]);

  // Aggregate Totals
  const totals = useMemo(() => {
    return reportData.reduce(
      (acc: any, item: any) => {
        acc.qty += Number(item.qty || 0);
        acc.lossAmount += Number(item.lossAmount || 0);
        return acc;
      },
      { qty: 0, lossAmount: 0 }
    );
  }, [reportData]);

  const formatCurrency = (val: number) => {
    return `৳${val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">Approved</span>;
      case "Rejected":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100">Rejected</span>;
      case "Disposed":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">Disposed</span>;
      case "Pending":
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100">Pending</span>;
    }
  };

  const renderTable = () => (
    <table className="w-full text-left border-collapse border border-slate-200">
      <thead>
        <tr className="bg-[#f1f5f9] border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-tight">
          <th className="px-4 py-3 border-r border-slate-200 text-center">SL</th>
          <th className="px-4 py-3 border-r border-slate-200">Date</th>
          <th className="px-4 py-3 border-r border-slate-200">Product Name</th>
          <th className="px-4 py-3 border-r border-slate-200">Reason / Reference</th>
          <th className="px-4 py-3 border-r border-slate-200 text-center">Quantity</th>
          <th className="px-4 py-3 border-r border-slate-200 text-right">Loss Amount</th>
          <th className="px-4 py-3 text-center">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 text-[12px]">
        {isLoading || isFetching ? (
          <tr>
            <td colSpan={7} className="py-10 text-center text-slate-400">
              <Loader2 className="animate-spin inline-block mr-2" size={16} /> Loading damage logs...
            </td>
          </tr>
        ) : paginatedData.length === 0 ? (
          <tr className="text-center italic text-slate-400">
            <td colSpan={7} className="py-10">No data available in table</td>
          </tr>
        ) : (
          paginatedData.map((item: any, i: number) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-2.5 border-r border-slate-200 text-center">{(currentPage - 1) * pageSize + i + 1}</td>
              <td className="px-4 py-2.5 border-r border-slate-200 font-mono text-slate-500 font-bold">{item.date}</td>
              <td className="px-4 py-2.5 border-r border-slate-200 font-medium text-slate-800">{item.productName}</td>
              <td className="px-4 py-2.5 border-r border-slate-200 text-slate-600 font-semibold">{item.reason}</td>
              <td className="px-4 py-2.5 border-r border-slate-200 text-center font-bold text-slate-700">{item.qty} Pcs</td>
              <td className="px-4 py-2.5 border-r border-slate-200 text-right font-mono text-rose-600 font-bold">{formatCurrency(item.lossAmount)}</td>
              <td className="px-4 py-2.5 text-center">{getStatusBadge(item.status)}</td>
            </tr>
          ))
        )}

        {/* Footer Total Row */}
        {!isLoading && !isFetching && reportData.length > 0 && (
          <tr className="bg-slate-50 font-bold text-[12px] text-slate-800 border-t-2 border-slate-300">
            <td colSpan={4} className="px-4 py-3 text-center border-r border-slate-200">Total</td>
            <td className="px-4 py-3 text-center border-r border-slate-200 bg-slate-100 font-black">{totals.qty} Pcs</td>
            <td className="px-4 py-3 text-right border-r border-slate-200 font-mono text-rose-600">{formatCurrency(totals.lossAmount)}</td>
            <td className="px-4 py-3 text-center border-slate-200">-</td>
          </tr>
        )}
      </tbody>
    </table>
  );

  if (isPrinting) {
    return (
      <PrintLayout
        title="Damage & Write-off Records Report"
        invoiceNo={new Date().toISOString().slice(0, 10)}
        invoiceLabel="Report Date"
        onBack={() => setIsPrinting(false)}
      >
        <div className="mt-8">
          <p className="text-xs text-slate-500 font-semibold mb-4">
            Date Range Applied: {startDate && endDate ? `${startDate} to ${endDate}` : "All Time"} | Status Filter: {selectedStatus}
          </p>
          {renderTable()}
        </div>
      </PrintLayout>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-sans bg-slate-50/50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Damage Item Report</h1>
          <p className="text-xs text-slate-400 font-semibold">List and print detailed expired and damaged write-off logs along with their financial impacts</p>
        </div>
        {reportData.length > 0 && (
          <button
            onClick={() => setIsPrinting(true)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Printer size={14} className="text-[#001f3f]" />
            <span>Print Report</span>
          </button>
        )}
      </div>

      {/* Filter Options Section */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Date Filter</label>
            <select
              value={dateRangeType}
              onChange={(e) => setDateRangeType(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold outline-none focus:ring-1 focus:ring-[#001f3f] focus:border-[#001f3f]"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold outline-none focus:ring-1 focus:ring-[#001f3f] focus:border-[#001f3f]"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Disposed">Disposed</option>
            </select>
          </div>
          <div className="md:col-span-2">
            {dateRangeType === "custom" && (
              <div className="relative">
                <button
                  onClick={() => setOpenPicker(!openPicker)}
                  className="w-full h-10 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs bg-white flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-[#001f3f]" />
                  <span>Select Dates</span>
                </button>
                {openPicker && (
                  <div className="absolute right-0 bottom-full mb-2 z-50">
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
        {dateRangeType === "custom" && (
          <p className="text-[10px] font-bold text-slate-400 mt-2">Active Range: {formattedRange}</p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Show
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-slate-200 bg-white rounded-lg px-2 py-1 outline-none font-semibold text-slate-600"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            entries
          </div>
        </div>

        {/* Stock Table */}
        <div className="overflow-x-auto">
          {renderTable()}
        </div>

        {/* Pagination Section */}
        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, reportData.length)} of {reportData.length} entries
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1.5 text-xs font-bold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    currentPage === idx + 1
                      ? "bg-[#001f3f] text-white shadow-md shadow-slate-200"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="px-3 py-1.5 text-xs font-bold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DamageReport;
