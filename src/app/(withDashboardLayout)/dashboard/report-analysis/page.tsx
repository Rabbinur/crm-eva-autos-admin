export default function ReportAnalysis() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Report Analysis</h1>
      <p className="text-slate-500 mt-2">This module is currently under construction.</p>
    </div>
  );
}


// "use client"
// import {
//     useGetReportDataAnalysisQuery,
//     useLazyGetReportDataAnalysisPdfQuery,
//     useLazyGetReportDataAnalysisXlsxQuery
// } from "@/components/Redux/RTK/dashboardApi";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import {
//     addDays,
//     endOfMonth,
//     endOfYear,
//     format,
//     startOfMonth,
//     startOfYear, subMonths
// } from "date-fns";
// import { Calendar, Download } from "lucide-react";

// import { useGetCategoriesForAdminQuery } from "@/components/Redux/RTK/categoriesApi";
// import { useState } from "react";


// import { allBtnsReport } from "@/constants/allBtns";
// import { useEffect, useMemo } from "react";
// import "react-date-range/dist/styles.css"; // main style
// import "react-date-range/dist/theme/default.css"; // theme css
// import CustomDateRangePicker from "./_component/CustomDateRangePicker";
// import StatusFilter from "./_component/StatusFilter";
// function formatDate(dateString: any) {
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }).replace(/ /g, "-")
// }

// // ------------------ Main Component ------------------
// export default function ReportAnalysis() {
//     /* ===================== STATE ===================== */
//     const [dateRangeType, setDateRangeType] = useState("all")
//     const [category, setCategory] = useState<string>("all")

//     const [currentPage, setCurrentPage] = useState(1)
//     const [rowsPerPage, setRowsPerPage] = useState(5)
//     const [
//         triggerPdf,
//         { isLoading: isPdfLoading }
//     ] = useLazyGetReportDataAnalysisPdfQuery()

//     const [
//         triggerExcel,
//         { isLoading: isExcelLoading }
//     ] = useLazyGetReportDataAnalysisXlsxQuery()


//     // inside your component
//     useEffect(() => {
//         let start = "";
//         let end = "";
//         const today = new Date();

//         switch (dateRangeType) {
//             case "today":
//                 start = format(today, "yyyy-MM-dd");
//                 end = format(today, "yyyy-MM-dd");
//                 break;
//             case "monthly":
//                 start = format(startOfMonth(today), "yyyy-MM-dd");
//                 end = format(endOfMonth(today), "yyyy-MM-dd");
//                 break;
//             case "quarterly":
//                 start = format(subMonths(today, 3), "yyyy-MM-dd");
//                 end = format(today, "yyyy-MM-dd");
//                 break;
//             case "half-yearly":
//                 start = format(subMonths(today, 6), "yyyy-MM-dd");
//                 end = format(today, "yyyy-MM-dd");
//                 break;
//             case "yearly":
//                 start = format(startOfYear(today), "yyyy-MM-dd");
//                 end = format(endOfYear(today), "yyyy-MM-dd");
//                 break;
//             case "all":
//             default:
//                 start = "";
//                 end = "";
//         }

//         updateFilter("start_date", start);
//         updateFilter("end_date", end);
//     }, [dateRangeType]);

//     const getFileSuffix = () => {
//         if (dateRangeType === "custom" && filters.start_date && filters.end_date) {
//             return `${filters.start_date}_to_${filters.end_date}`
//         }

//         if (dateRangeType === "today") return "today"

//         return dateRangeType
//     }

//     const [filters, setFilters] = useState({
//         page: 1,
//         limit: 10,
//         search_query: "",
//         order_type: "",
//         dateRangeType: "",
//         status: "",
//         start_date: "",
//         end_date: "",
//         category_id: "",
//         min_price: 0,
//         max_price: 0, sub_status: "",
//     })
//     console.log("filters", filters)
//     const [range, setRange] = useState([
//         {
//             startDate: addDays(new Date(), -6),
//             endDate: new Date(),
//             key: "selection",
//         },
//     ])
//     const [openPicker, setOpenPicker] = useState(false)

//     const formattedRange = `${format(range[0].startDate, "MMM d, yyyy")} - ${format(
//         range[0].endDate,
//         "MMM d, yyyy"
//     )}`

//     const updateFilter = (key: string, value: any) => {
//         setFilters((prev) => ({
//             ...prev,
//             page: 1,
//             [key]: value,
//         }))
//     }

//     const clearAllFilters = () => {
//         setFilters({
//             page: 1,
//             limit: 10,
//             search_query: "",
//             order_type: "",
//             status: "",
//             start_date: "",
//             end_date: "",
//             category_id: "",
//             min_price: 0,
//             max_price: 0, dateRangeType: "", sub_status: "",
//         })
//         setDateRangeType("all")
//         setCategory("all")
//     }

//     const hasInputFilters = (): boolean => {
//         return Boolean(
//             filters.search_query ||
//             filters.start_date ||
//             filters.end_date ||
//             filters.status ||
//             filters.sub_status ||
//             filters.order_type
//         )
//     }



//     //  ============================//
//     // --- Categories ---
//     const { data: categoryList, isLoading: categoryLoading } = useGetCategoriesForAdminQuery(undefined)
//     const allCategories: any[] = categoryList?.data?.data || [];
//     /* ===================== API ===================== */
//     const { data } = useGetReportDataAnalysisQuery(filters)
//     const summary = data?.data?.summary
//     const allOrdersData: any[] = data?.data?.orders || []

//     /* ===================== Derived Data ===================== */
//     const totalOrders = summary?.totalOrders || 0
//     const totalRevenue = summary?.totalRevenue || 0
//     const totalNetSales = totalRevenue

//     const filteredData = useMemo(() => {
//         return allOrdersData.filter((order: any) => category === "all" || order.category_name === category)
//     }, [allOrdersData, category])

//     const totalPages = Math.ceil(filteredData.length / rowsPerPage)
//     const paginatedData = useMemo(() => {
//         const start = (currentPage - 1) * rowsPerPage
//         return allOrdersData.slice(start, start + rowsPerPage)
//     }, [filteredData, currentPage, rowsPerPage])

//     /* ===================== EXPORT HANDLERS ===================== */

//     /* ===================== EXPORT HANDLERS ===================== */
//     const downloadFile = (blob: Blob, filename: string) => {
//         const url = window.URL.createObjectURL(blob)
//         const a = document.createElement("a")
//         a.href = url
//         a.download = filename
//         document.body.appendChild(a)
//         a.click()
//         a.remove()
//         window.URL.revokeObjectURL(url)
//     }

//     const handlePDFExport = async () => {
//         try {
//             const blob = await triggerPdf(filters).unwrap()
//             downloadFile(blob, "report-analysis.pdf")
//         } catch (err) {
//             console.error("PDF download failed", err)
//         }
//     }

//     const handleExcelExport = async () => {
//         try {
//             const blob = await triggerExcel(filters).unwrap()
//             downloadFile(blob, "report-analysis.xlsx")
//         } catch (err) {
//             console.error("Excel download failed", err)
//         }
//     }


//     /* ===================== Sync Custom Range with Filters ===================== */
//     useEffect(() => {
//         if (dateRangeType === "custom") {
//             const start = format(range[0].startDate, "yyyy-MM-dd")
//             const end = format(range[0].endDate, "yyyy-MM-dd")
//             updateFilter("start_date", start)
//             updateFilter("end_date", end)
//         }
//     }, [range, dateRangeType])
//     console.log("allcateg", allCategories)
//     return (
//         <div className="flex  bg-gray-100">
//             <div className="flex-1 flex flex-col overflow-hidden">
//                 <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between">
//                     <h1 className="text-2xl font-semibold text-gray-800">Report Analysis</h1>
//                 </div>

//                 <div className="flex-1 overflow-auto p-4 space-y-6">
//                     {/* Filters Card */}
//                     <Card className="bg-white rounded-none shadow-2xl ">
//                         <CardHeader>
//                             <CardTitle>Filters & Date Range</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="grid grid-cols-6 gap-4 mb-4">
//                                 <div>
//                                     <label className="text-sm font-medium text-gray-700 mb-2 block">Search Order</label>
//                                     <Input
//                                         type="text"
//                                         value={filters.search_query}
//                                         placeholder="order id, Product name"
//                                         onChange={(e) => updateFilter("search_query", e.target.value)}
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="text-sm font-medium text-gray-700 mb-2 block">Date Range Type</label>
//                                     <Select value={dateRangeType}
//                                         onValueChange={(val) => {
//                                             setDateRangeType(val)
//                                             updateFilter("dateRangeType", val)
//                                         }}>
//                                         <SelectTrigger><SelectValue /></SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="all">All Time</SelectItem>
//                                             <SelectItem value="today">Today</SelectItem>
//                                             <SelectItem value="monthly">Monthly</SelectItem>
//                                             <SelectItem value="quarterly">Quarterly</SelectItem>
//                                             <SelectItem value="yearly">Yearly</SelectItem>
//                                             <SelectItem value="custom">Custom Range</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                 </div>

//                                 {dateRangeType === "custom" && (
//                                     <div className="relative col-span-2">
//                                         <label className="text-sm font-medium text-gray-700 mb-2 block">Select Date</label>
//                                         <button
//                                             className="flex items-center gap-2 border border-gray-300 rounded-none px-4 py-2 text-sm hover:bg-gray-50 transition w-full"
//                                             onClick={() => setOpenPicker(!openPicker)}
//                                         >
//                                             <Calendar className="w-4 h-4 text-gray-600" />
//                                             {formattedRange}
//                                         </button>
//                                         {openPicker && (
//                                             <CustomDateRangePicker
//                                                 range={range}
//                                                 setRange={setRange}
//                                                 onClose={() => setOpenPicker(false)}
//                                             />
//                                         )}
//                                     </div>
//                                 )}

//                                 <div>
//                                     <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
//                                     <Select value={category} onValueChange={(val) => {
//                                         setCategory(val)                 // UI purpose
//                                         updateFilter("category_id", val === "all" ? "" : val);
//                                     }}>
//                                         <SelectTrigger className="w-full">
//                                             <SelectValue placeholder="Select Category" />
//                                         </SelectTrigger>

//                                         <SelectContent>
//                                             <SelectItem value="all">All Categories</SelectItem>

//                                             {allCategories.map((c: any) => (
//                                                 <SelectItem key={c.id} value={c.id}>
//                                                     {c.name}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>

//                                 </div>

//                                 {/* <div>
//                                     <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
//                                     <Select value={filters.status || "all"} onValueChange={(val) => updateFilter("status", val === "all" ? "" : val)}>
//                                         <SelectTrigger className="w-full"><SelectValue placeholder="Select Status" /></SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="all">All Status</SelectItem>
//                                             {allStatus.map((o) => (
//                                                 <SelectItem key={o.label} value={o.label}> {formatLabel(o.label)} </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </div> */}

//                                 <div>
//                                     <label className="text-sm font-medium text-gray-700 mb-2 block">Order Type</label>
//                                     <Select value={filters.order_type || "all"} onValueChange={(val) => updateFilter("order_type", val === "all" ? "" : val)}>
//                                         <SelectTrigger className="w-full"><SelectValue placeholder="Select Order Type" /></SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="all">All Types</SelectItem>

//                                             <SelectItem value={"online"}>Online</SelectItem>
//                                             <SelectItem value={"custom"}>Custom</SelectItem>

//                                         </SelectContent>
//                                     </Select>
//                                 </div>

//                                 {hasInputFilters() && (
//                                     <div className="mt-6">
//                                         <Button onClick={clearAllFilters} className="px-4 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-sm">
//                                             Clear All Filters
//                                         </Button>
//                                     </div>
//                                 )}
//                             </div>
//                             <div>
//                                 <h1 className="font-semibold pb-2">Select Status: </h1>
//                                 <StatusFilter
//                                     buttons={allBtnsReport}
//                                     value={{
//                                         status: filters.status,
//                                         sub_status: filters.sub_status,
//                                     }}
//                                     onChange={({ status, sub_status }) => {
//                                         setFilters((prev) => ({
//                                             ...prev,
//                                             page: 1,
//                                             status,
//                                             sub_status,
//                                         }))
//                                     }}
//                                 />


//                             </div>
//                         </CardContent>
//                     </Card>


//                     {/* Summary Card */}
//                     <Card className="bg-white rounded-none shadow-2xl overflow-hidden">
//                         <CardHeader>
//                             <CardTitle>Summary Details</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b">
//                                 <div>
//                                     <p className="text-sm text-gray-600">Filtering Name (Category)</p>
//                                     <p className="font-semibold text-lg">{category === "all" ? "All Categories" : category}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-600">Status</p>
//                                     <p className="font-semibold text-lg">{filters.status ? filters.status : "All Status"}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-600">Order Type</p>
//                                     <p className="font-semibold text-lg">{filters.order_type ? filters.order_type : "All Types"}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-600">Date Range</p>
//                                     <p className="font-semibold text-lg">
//                                         {dateRangeType === "custom" ? `${filters.start_date} to ${filters.end_date}` : dateRangeType.toUpperCase()}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-600">Print Time (Admin Time)</p>
//                                     <p className="font-semibold text-lg">{new Date().toLocaleTimeString()}</p>
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-4 gap-4">
//                                 <Card className="bg-blue-50">
//                                     <CardContent className="p-4">
//                                         <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
//                                         <p className="text-2xl font-bold text-blue-600">${totalRevenue.toFixed(2)}</p>
//                                     </CardContent>
//                                 </Card>
//                                 <Card className="bg-green-50">
//                                     <CardContent className="p-4">
//                                         <p className="text-sm text-gray-600 mb-2">Total Orders</p>
//                                         <p className="text-2xl font-bold text-green-600">{totalOrders}</p>
//                                     </CardContent>
//                                 </Card>
//                                 <Card className="bg-orange-50">
//                                     <CardContent className="p-4">
//                                         <p className="text-sm text-gray-600 mb-2"> Net Sales</p>
//                                         <p className="text-2xl font-bold text-orange-600">{totalNetSales}</p>
//                                     </CardContent>
//                                 </Card>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     {/* Table Card */}
//                     <Card className="bg-white rounded-none shadow-2xl overflow-hidden">
//                         <CardHeader>
//                             <CardTitle>
//                                 <div className="flex flex-col xl:flex-row gap-5 justify-between ">
//                                     <div>
//                                         Order Details (Page {currentPage} of {totalPages})
//                                     </div>
//                                     <div className="flex gap-3">
//                                         <Button onClick={handlePDFExport}
//                                             disabled={isPdfLoading} className="bg-primary hover:bg-red-700">
//                                             <Download size={18} className="mr-2" />
//                                             {isPdfLoading ? "Downloading..." : "Report Summary PDF"}
//                                         </Button>
//                                         <Button onClick={handleExcelExport}
//                                             disabled={isExcelLoading} className="bg-green-600 hover:bg-green-700">
//                                             <Download size={18} className="mr-2" />
//                                             {isExcelLoading ? "Downloading..." : "Download Excel"}
//                                         </Button>
//                                     </div>
//                                 </div>
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="p-0">
//                             {/* Table */}
//                             <div className="relative overflow-x-auto rounded-none border">
//                                 <table className="w-full text-sm text-left">
//                                     <thead className="sticky top-0 z-10 bg-gray-50 border-b">
//                                         <tr className="text-gray-600 font-semibold">
//                                             <th className="px-4 py-3">Order ID</th>
//                                             <th className="px-4 py-3">Product</th>
//                                             <th className="px-4 py-3">Category</th>
//                                             <th className="px-4 py-3">Order Type</th>
//                                             <th className="px-4 py-3">Status</th>
//                                             <th className="px-4 py-3 text-center">Qty</th>
//                                             <th className="px-4 py-3 text-right">Total</th>
//                                             <th className="px-4 py-3">Date</th>
//                                             <th className="px-4 py-3">Customer</th>
//                                             <th className="px-4 py-3">Phone</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y">
//                                         {paginatedData.map((order) => (
//                                             <tr key={order.order_id} className="hover:bg-gray-50 transition">
//                                                 <td className="px-4 py-3 font-medium text-gray-900">#{order.order_id}</td>
//                                                 <td className="px-4 py-3">{order.product_name}</td>
//                                                 <td className="px-4 py-3 text-gray-600">{order.category_name}</td>
//                                                 <td className="px-4 py-3 capitalize text-gray-600">{order.order_type}</td>
//                                                 <td className="px-4 py-3">
//                                                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
//                                     ${order.status === "COMPLETED"
//                                                             ? "bg-green-100 text-green-700"
//                                                             : order.status === "ON_HOLD"
//                                                                 ? "bg-gray-700  text-white"
//                                                                 : order.status === "IN_PRODUCTION"
//                                                                     ? "bg-blue-100 text-blue-700"
//                                                                     : "bg-gray-100 text-gray-700"
//                                                         }`}>
//                                                         {order.status.replace("_", " ")}
//                                                     </span>
//                                                     <span></span>
//                                                 </td>
//                                                 <td className="px-4 py-3 text-center">{order.quantity}</td>
//                                                 <td className="px-4 py-3 text-right font-semibold text-green-600">${order.total_price.toFixed(2)}</td>
//                                                 <td className="px-4 py-3 text-gray-600">{formatDate(order.date)}</td>
//                                                 <td className="px-4 py-3">{order.customer_name}</td>
//                                                 <td className="px-4 py-3 text-gray-600">{order.customer_phone}</td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>

//                             {/* Pagination */}
//                             <div className="flex flex-col p-2 sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
//                                 <div className="flex items-center gap-2">
//                                     <span className="text-sm text-gray-600">Rows per page</span>
//                                     <Select
//                                         value={String(rowsPerPage)}
//                                         onValueChange={(val) => {
//                                             setRowsPerPage(Number(val))
//                                             setCurrentPage(1)
//                                             updateFilter("limit", Number(val))
//                                         }}
//                                     >
//                                         <SelectTrigger className="w-20 h-8"><SelectValue /></SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="5">5</SelectItem>
//                                             <SelectItem value="10">10</SelectItem>
//                                             <SelectItem value="20">20</SelectItem>
//                                             <SelectItem value="50">50</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                 </div>
//                                 <p className="text-sm text-gray-600">
//                                     {filteredData.length === 0
//                                         ? "No records"
//                                         : `${(currentPage - 1) * rowsPerPage + 1} - ${Math.min(currentPage * rowsPerPage, filteredData.length)} of ${filteredData.length}`}
//                                 </p>
//                                 <div className="flex gap-2">
//                                     <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => { setCurrentPage(p => p - 1); updateFilter("page", currentPage - 1) }}>Previous</Button>
//                                     <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => { setCurrentPage(p => p + 1); updateFilter("page", currentPage + 1) }}>Next</Button>
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     )
// }

