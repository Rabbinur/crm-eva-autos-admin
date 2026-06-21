"use client";

import { FileEdit, Trash2, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useGetDamageStockQuery } from "@/components/Redux/RTK/distributorApiNode";

const DamageStockList = () => {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const { data, isLoading, isFetching } = useGetDamageStockQuery({
        page,
        limit: 10,
        search_query: searchQuery || undefined,
    });

    const records = data?.data || [];
    const meta = data?.meta || { page: 1, limit: 10, total: 0 };
    const totalPages = Math.ceil(meta.total / meta.limit) || 1;

    const formatCurrency = (val: number) => `৳${Number(val || 0).toFixed(2)}`;

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 font-sans bg-[#f8f9fa] min-h-screen">
            {/* Header Section */}
            <div className="bg-white rounded-t-lg border border-slate-200 p-4 flex items-center justify-between shadow-sm">
                <div>
                    <h1 className="text-[18px] font-semibold text-slate-800">Damage Stock Inventory</h1>
                    <p className="text-xs text-slate-400">Total physical write-off stock currently in quarantine</p>
                </div>
                <Link
                    href="/dashboard/damage/damage-list"
                    className="bg-[#3b82f6] hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-all shadow-sm active:scale-95 flex items-center gap-2"
                >
                    Damage Verification & Logs
                </Link>
            </div>

            <div className="bg-white rounded-b-lg border-x border-b border-slate-200 shadow-sm overflow-hidden">
                {/* Table Controls */}
                <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-sm text-slate-650">
                        Show <strong className="text-slate-800">10</strong> entries
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        Search:
                        <input
                            type="text"
                            placeholder="Search product, company..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setPage(1);
                            }}
                            className="border border-slate-300 rounded px-3 py-1.5 outline-none focus:border-blue-400 w-48 md:w-64 text-xs font-semibold"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {isLoading || isFetching ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                            <Loader2 className="animate-spin text-blue-600 mb-3" size={30} />
                            <span className="text-sm font-semibold">Updating inventory totals...</span>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f1f5f9] border-b border-slate-200 text-[13px] font-semibold text-slate-700">
                                    <th className="px-4 py-3 border-r border-slate-200">SL</th>
                                    <th className="px-4 py-3 border-r border-slate-200">Company</th>
                                    <th className="px-4 py-3 border-r border-slate-200">Product</th>
                                    <th className="px-4 py-3 border-r border-slate-200">Batch Code</th>
                                    <th className="px-4 py-3 border-r border-slate-200 text-center">Unit Price (Pc)</th>
                                    <th className="px-4 py-3 border-r border-slate-200 text-center">Quantity (Pcs)</th>
                                    <th className="px-4 py-3 text-right">Total Loss Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-600 text-xs font-medium">
                                {records.length === 0 ? (
                                    <tr className="text-center italic text-slate-500 text-sm">
                                        <td colSpan={7} className="py-12">No damage stock available in table</td>
                                    </tr>
                                ) : (
                                    records.map((item: any, index: number) => (
                                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-3 border-r border-slate-100">
                                                {(page - 1) * meta.limit + index + 1}
                                            </td>
                                            <td className="px-4 py-3 border-r border-slate-100 font-bold text-slate-700">
                                                {item.company}
                                            </td>
                                            <td className="px-4 py-3 border-r border-slate-100 font-bold text-slate-800">
                                                {item.product}
                                            </td>
                                            <td className="px-4 py-3 border-r border-slate-100 font-mono font-bold text-slate-550 text-center">
                                                {item.batch_id}
                                            </td>
                                            <td className="px-4 py-3 border-r border-slate-100 text-center">
                                                {formatCurrency(item.purchase_price)}
                                            </td>
                                            <td className="px-4 py-3 border-r border-slate-100 text-center font-bold text-rose-600 bg-rose-50/10">
                                                {item.qty} pcs
                                            </td>
                                            <td className="px-4 py-3 text-right font-black text-rose-600 bg-rose-50/20">
                                                {formatCurrency(item.total_value)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer Pagination */}
                <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-100">
                    <p className="text-[13px] text-slate-600 font-medium">
                        Showing {records.length > 0 ? (page - 1) * meta.limit + 1 : 0} to {Math.min(page * meta.limit, meta.total)} of {meta.total} entries
                    </p>
                    <div className="flex items-center border border-slate-200 rounded overflow-hidden">
                        <button 
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1.5 text-[13px] text-slate-500 hover:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed border-r border-slate-200"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-1.5 text-[13px] bg-slate-50 text-slate-800 font-bold border-r border-slate-200">
                            Page {page} of {totalPages}
                        </span>
                        <button 
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1.5 text-[13px] text-slate-500 hover:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DamageStockList;