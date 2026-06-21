"use client";

import { useState, useMemo } from "react";
import { Search, Printer, Loader2 } from "lucide-react";
import {
  useGetCurrentStockReportQuery,
  useGetDistributorCategoriesQuery,
  useGetDistributorCompaniesQuery,
} from "@/components/Redux/RTK/distributorApiNode";
import PrintLayout from "@/components/PrintLayout";

const CurrentStock = () => {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);

  // Fetch filters options
  const { data: companies = [], isLoading: isCompaniesLoading } = useGetDistributorCompaniesQuery();
  const { data: categories = [], isLoading: isCategoriesLoading } = useGetDistributorCategoriesQuery();

  // Fetch report data
  const { data: stockData = [], isLoading, isFetching } = useGetCurrentStockReportQuery({
    company_name: selectedCompany || undefined,
    category_name: selectedCategory || undefined,
    search_query: searchVal || undefined,
  });

  const handleSearchClick = () => {
    setSearchVal(searchInput);
    setCurrentPage(1);
  };

  // Pagination & Filtering Logic
  const filteredData = useMemo(() => {
    return stockData;
  }, [stockData]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredData.slice(startIdx, startIdx + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Aggregate Totals
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc: any, item: any) => {
        acc.stockQty += Number(item.stockQty || 0);
        acc.stockValue += Number(item.stockValue || 0);
        acc.saleValue += Number(item.saleValue || 0);
        acc.damageQty += Number(item.damageQty || 0);
        return acc;
      },
      { stockQty: 0, stockValue: 0, saleValue: 0, damageQty: 0 }
    );
  }, [filteredData]);

  const formatCurrency = (val: number) => {
    return `৳${val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const renderTable = (printMode = false) => (
    <table className="w-full text-left border-collapse border border-slate-200">
      <thead>
        <tr className="bg-[#f1f5f9] border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-tight">
          <th className="px-3 py-3 border-r border-slate-200 text-center">SL</th>
          <th className="px-3 py-3 border-r border-slate-200">Product Name</th>
          <th className="px-3 py-3 border-r border-slate-200 text-center">Code</th>
          <th className="px-3 py-3 border-r border-slate-200 text-center">Unit</th>
          <th className="px-3 py-3 border-r border-slate-200 text-center">Box Size</th>
          <th className="px-3 py-3 border-r border-slate-200 text-right">Cost Price</th>
          <th className="px-3 py-3 border-r border-slate-200 text-center">In (Qty)</th>
          <th className="px-3 py-3 border-r border-slate-200 text-center">Out (Qty)</th>
          <th className="px-3 py-3 border-r border-slate-200 text-center bg-slate-100/80">Stock Qty</th>
          <th className="px-3 py-3 border-r border-slate-200 text-right">Stock Value</th>
          <th className="px-3 py-3 border-r border-slate-200 text-right">Sale Value</th>
          <th className="px-3 py-3 text-center">Damage</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 text-[12px]">
        {isLoading || isFetching ? (
          <tr>
            <td colSpan={12} className="py-10 text-center text-slate-400">
              <Loader2 className="animate-spin inline-block mr-2" size={16} /> Loading stock details...
            </td>
          </tr>
        ) : paginatedData.length === 0 ? (
          <tr className="text-center italic text-slate-400">
            <td colSpan={12} className="py-10">No data available in table</td>
          </tr>
        ) : (
          paginatedData.map((item: any, i: number) => (
            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-3 py-2.5 border-r border-slate-200 text-center">{(currentPage - 1) * pageSize + i + 1}</td>
              <td className="px-3 py-2.5 border-r border-slate-200 font-medium text-slate-800">{item.name}</td>
              <td className="px-3 py-2.5 border-r border-slate-200 text-center font-mono text-slate-600">{item.code}</td>
              <td className="px-3 py-2.5 border-r border-slate-200 text-center text-slate-500">{item.unit}</td>
              <td className="px-3 py-2.5 border-r border-slate-200 text-center text-slate-600">{item.boxSize}</td>
              <td className="px-3 py-2.5 border-r border-slate-200 text-right font-mono text-slate-700">{formatCurrency(item.costPrice)}</td>
              <td className="px-3 py-2.5 border-r border-slate-200 text-center font-semibold text-blue-600">{item.inQty}</td>
              <td className="px-3 py-2.5 border-r border-slate-200 text-center font-semibold text-indigo-600">{item.outQty}</td>
              <td className="px-3 py-2.5 border-r border-slate-200 text-center font-bold text-slate-800 bg-slate-50">{item.stockQty}</td>
              <td className="px-3 py-2.5 border-r border-slate-200 text-right font-mono text-emerald-600 font-bold">{formatCurrency(item.stockValue)}</td>
              <td className="px-3 py-2.5 border-r border-slate-200 text-right font-mono text-[#001f3f] font-bold">{formatCurrency(item.saleValue)}</td>
              <td className="px-3 py-2.5 text-center font-semibold text-rose-500">{item.damageQty}</td>
            </tr>
          ))
        )}

        {/* Footer Total Row */}
        {!isLoading && !isFetching && filteredData.length > 0 && (
          <tr className="bg-slate-50 font-bold text-[12px] text-slate-800 border-t-2 border-slate-300">
            <td colSpan={8} className="px-3 py-3 text-center border-r border-slate-200">Total</td>
            <td className="px-3 py-3 text-center border-r border-slate-200 bg-slate-100 font-black">{totals.stockQty} Pcs</td>
            <td className="px-3 py-3 text-right border-r border-slate-200 font-mono text-emerald-700">{formatCurrency(totals.stockValue)}</td>
            <td className="px-3 py-3 text-right border-r border-slate-200 font-mono text-[#001f3f]">{formatCurrency(totals.saleValue)}</td>
            <td className="px-3 py-3 text-center text-rose-600">{totals.damageQty} Pcs</td>
          </tr>
        )}
      </tbody>
    </table>
  );

  if (isPrinting) {
    return (
      <PrintLayout
        title="Current Stock Report"
        invoiceNo={new Date().toISOString().slice(0, 10)}
        invoiceLabel="Report Date"
        onBack={() => setIsPrinting(false)}
      >
        <div className="mt-8">
          <p className="text-xs text-slate-500 font-semibold mb-4">
            Filters Applied: {selectedCompany || "All Companies"} | {selectedCategory || "All Categories"}
          </p>
          {renderTable(true)}
        </div>
      </PrintLayout>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-sans bg-slate-50/50 min-h-screen space-y-6">
      {/* Top Filter Section */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Company</label>
            <select
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold outline-none focus:ring-1 focus:ring-[#001f3f] focus:border-[#001f3f]"
            >
              <option value="">Select Company</option>
              {companies.map((c: any) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold outline-none focus:ring-1 focus:ring-[#001f3f] focus:border-[#001f3f]"
            >
              <option value="">Select Category</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <button
              onClick={handleSearchClick}
              className="w-full h-10 bg-[#001f3f] hover:bg-[#001f3f]/90 text-white rounded-xl flex items-center justify-center shadow-md shadow-slate-200 transition-all active:scale-95 text-sm font-bold gap-2"
            >
              <Search size={18} />
              <span>Search</span>
            </button>
          </div>
        </div>
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

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsPrinting(true)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Printer size={14} className="text-[#001f3f]" />
              <span>Print Report</span>
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Search:
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
                placeholder="Product name..."
                className="border border-slate-200 rounded-xl px-3 py-1.5 outline-none focus:ring-1 focus:ring-[#001f3f] focus:border-[#001f3f] w-48 text-slate-700 normal-case"
              />
            </div>
          </div>
        </div>

        {/* Stock Table */}
        <div className="overflow-x-auto">
          {renderTable(false)}
        </div>

        {/* Pagination Section */}
        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
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

export default CurrentStock;