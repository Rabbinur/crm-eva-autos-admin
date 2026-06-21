"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Printer, Loader2, Calendar, Award } from "lucide-react";
import {
  useGetProductSummaryReportQuery,
  useGetDistributorProductsQuery,
  useGetDistributorCategoriesQuery,
  useGetDistributorCompaniesQuery,
} from "@/components/Redux/RTK/distributorApiNode";
import PrintLayout from "@/components/PrintLayout";
import { addDays, endOfMonth, endOfYear, format, startOfMonth, startOfYear, subMonths } from "date-fns";
import CustomDateRangePicker from "../_component/CustomDateRangePicker";

const ProductSummaryReport = () => {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
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

  // Fetch filters options
  const { data: companies = [] } = useGetDistributorCompaniesQuery();
  const { data: categories = [] } = useGetDistributorCategoriesQuery();

  // Fetch real products list
  const { data: products = [], isLoading: isProductsLoading } = useGetDistributorProductsQuery();

  // Filter products list based on selected company & category
  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => {
      const matchCompany = !selectedCompany || p.company_name === selectedCompany;
      const matchCategory = !selectedCategory || p.category_name === selectedCategory;
      return matchCompany && matchCategory;
    });
  }, [products, selectedCompany, selectedCategory]);

  // If the selected product is filtered out, clear selection
  useEffect(() => {
    if (selectedProductId) {
      const isAvailable = filteredProducts.some((p: any) => p.id === selectedProductId);
      if (!isAvailable) {
        setSelectedProductId("");
      }
    }
  }, [filteredProducts, selectedProductId]);

  // Fetch report data
  const { data: report, isLoading, isFetching } = useGetProductSummaryReportQuery(
    {
      productId: selectedProductId,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    },
    { skip: !selectedProductId }
  );

  const selectedProduct = useMemo(() => {
    return products.find((p: any) => p.id === selectedProductId);
  }, [products, selectedProductId]);

  const formattedRange = `${format(range[0].startDate, "MMM d, yyyy")} - ${format(range[0].endDate, "MMM d, yyyy")}`;

  const renderTable = () => (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-slate-200">
          <thead>
            <tr className="bg-[#f1f5f9] text-slate-700 text-xs font-bold uppercase tracking-tight border-b">
              <th className="text-center py-3 px-4 border-r border-slate-200">SL</th>
              <th className="text-left py-3 px-4 border-r border-slate-200">Date & Time</th>
              <th className="text-left py-3 px-4 border-r border-slate-200">Details</th>
              <th className="text-center py-3 px-4 border-r border-slate-200">In (Qty)</th>
              <th className="text-center py-3 px-4 border-r border-slate-200">Out (Qty)</th>
              <th className="text-center py-3 px-4 bg-slate-50 font-black">Running Stock</th>
            </tr>
          </thead>
          <tbody className="text-xs text-slate-700 divide-y divide-slate-100">
            {/* Opening Stock row */}
            {report && (
              <tr className="border-b border-slate-100 bg-slate-50/50 font-semibold italic text-slate-500">
                <td className="py-3 px-4 text-center border-r border-slate-200">-</td>
                <td className="py-3 px-4 border-r border-slate-200">
                  {startDate ? format(new Date(startDate), "dd-MMM-yyyy") : "Start Date"}
                </td>
                <td className="py-3 px-4 border-r border-slate-200">Opening Stock Balance</td>
                <td className="py-3 px-4 text-center border-r border-slate-200">-</td>
                <td className="py-3 px-4 text-center border-r border-slate-200">-</td>
                <td className="py-3 px-4 text-center font-bold text-slate-800 bg-slate-50">
                  {report.openingStock} Pcs
                </td>
              </tr>
            )}

            {isFetching || isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  <Loader2 className="animate-spin inline-block mr-2" size={16} /> Loading transaction ledger...
                </td>
              </tr>
            ) : !selectedProductId ? (
              <tr className="text-center italic text-slate-400">
                <td colSpan={6} className="py-8">Please select a product from filters above</td>
              </tr>
            ) : report?.transactions?.length === 0 ? (
              <tr className="text-center italic text-slate-400">
                <td colSpan={6} className="py-8">No transaction events logged during this period</td>
              </tr>
            ) : (
              report?.transactions?.map((item: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 text-center border-r border-slate-200">{item.sl}</td>
                  <td className="py-3 px-4 border-r border-slate-200 font-mono text-slate-500">{item.date}</td>
                  <td className="py-3 px-4 border-r border-slate-200 font-medium text-slate-700">{item.details}</td>
                  <td className="py-3 px-4 text-center border-r border-slate-200 text-blue-600 font-bold">{item.in || "-"}</td>
                  <td className="py-3 px-4 text-center border-r border-slate-200 text-rose-500 font-bold">{item.out || "-"}</td>
                  <td className="py-3 px-4 text-center font-black text-slate-800 bg-slate-50">{item.currentStock} Pcs</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Large Stock Counter */}
      {report && (
        <div className="flex justify-center items-center py-6 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl px-8 py-4 flex flex-col items-center shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Final Stock Level</span>
            <h3 className="text-3xl font-black text-slate-800">
              Current Stock = <span className="text-rose-500">{report.currentStock} Pcs</span>
            </h3>
          </div>
        </div>
      )}
    </div>
  );

  if (isPrinting) {
    return (
      <PrintLayout
        title="Product Summary Ledger Report"
        invoiceNo={new Date().toISOString().slice(0, 10)}
        invoiceLabel="Report Date"
        onBack={() => setIsPrinting(false)}
      >
        <div className="mt-8 space-y-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-700 border-b pb-3">
            <p><span className="text-slate-400 font-bold uppercase mr-1">Product:</span> {report?.productName || "Unknown"}</p>
            {selectedProduct?.company_name && (
              <p><span className="text-slate-400 font-bold uppercase mr-1">Company:</span> {selectedProduct.company_name}</p>
            )}
            {selectedProduct?.category_name && (
              <p><span className="text-slate-400 font-bold uppercase mr-1">Category:</span> {selectedProduct.category_name}</p>
            )}
          </div>
          <p className="text-xs text-slate-500 font-semibold mb-4">
            Date Range Applied: {startDate && endDate ? `${startDate} to ${endDate}` : "All Time"}
          </p>
          {renderTable()}
        </div>
      </PrintLayout>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8 font-sans space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Product Summary Ledger</h1>
            <p className="text-xs text-slate-400 font-semibold">Track historical stock movements, batch receipts, returns, and write-offs chronologically</p>
          </div>
          {selectedProductId && (
            <button
              onClick={() => setIsPrinting(true)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs self-start"
            >
              <Printer size={14} className="text-[#001f3f]" />
              <span>Print Ledger</span>
            </button>
          )}
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            {/* Company Select */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Company</label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
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

            {/* Category Select */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
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

            {/* Select Product */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Select Product</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold outline-none focus:ring-1 focus:ring-[#001f3f] focus:border-[#001f3f]"
              >
                <option value="">Select Product</option>
                {filteredProducts.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className={`${dateRangeType === "custom" ? "lg:col-span-2" : "lg:col-span-3"} space-y-1.5`}>
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

            {/* Custom Range Datepicker Trigger */}
            {dateRangeType === "custom" && (
              <div className="lg:col-span-1">
                <div className="relative">
                  <button
                    onClick={() => setOpenPicker(!openPicker)}
                    className="w-full h-10 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs bg-white flex items-center justify-center gap-2"
                    title="Select Custom Dates"
                  >
                    <Calendar className="w-4 h-4 text-[#001f3f]" />
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
              </div>
            )}
          </div>
          {dateRangeType === "custom" && (
            <p className="text-[10px] font-bold text-slate-400 mt-2">Active Range: {formattedRange}</p>
          )}
        </div>

        {/* Ledger Table Section */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          {renderTable()}
        </div>
      </div>
    </div>
  );
};

export default ProductSummaryReport;