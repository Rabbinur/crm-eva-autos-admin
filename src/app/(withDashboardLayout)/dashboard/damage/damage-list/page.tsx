"use client";

import { Calendar, CheckCircle, Trash2, Package, Plus, Search, XCircle, AlertOctagon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useGetDamageRecordsQuery, useUpdateDamageRecordStatusMutation } from "@/components/Redux/RTK/distributorApiNode";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const DamageList = () => {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [sourceFilter, setSourceFilter] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [updatingRecordId, setUpdatingRecordId] = useState<string | null>(null);

    // Confirmation Modal States
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState<{
        title: string;
        description: string;
        buttonText: string;
        action: (() => Promise<void>) | null;
        variant: "default" | "destructive" | "success";
    }>({
        title: "",
        description: "",
        buttonText: "",
        action: null,
        variant: "default",
    });

    const { data, isLoading, isFetching, refetch } = useGetDamageRecordsQuery({
        page,
        limit: 10,
        search_query: searchQuery || undefined,
        status: statusFilter || undefined,
        source_type: sourceFilter || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
    });

    const [updateStatus] = useUpdateDamageRecordStatusMutation();

    const handleUpdateStatus = async (id: string, newStatus: 'Approved' | 'Rejected' | 'Disposed') => {
        setUpdatingRecordId(id);
        try {
            await updateStatus({ id, status: newStatus }).unwrap();
            toast.success(`Damage record ${newStatus.toLowerCase()} successfully!`);
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || `Failed to update status to ${newStatus}`);
        } finally {
            setUpdatingRecordId(null);
        }
    };

    const triggerConfirmation = (
        title: string,
        description: string,
        buttonText: string,
        variant: "default" | "destructive" | "success",
        action: () => Promise<void>
    ) => {
        setConfirmConfig({
            title,
            description,
            buttonText,
            variant,
            action,
        });
        setIsConfirmOpen(true);
    };

    const handleConfirmAction = async () => {
        if (confirmConfig.action) {
            const act = confirmConfig.action;
            setIsConfirmOpen(false);
            await act();
        }
    };

    const records = data?.data || [];
    const meta = data?.meta || { page: 1, limit: 10, total: 0 };
    const totalPages = Math.ceil(meta.total / meta.limit) || 1;

    const formatCurrency = (val: number) => `৳${Number(val || 0).toFixed(2)}`;

    return (
        <div className="p-6 md:p-10 bg-[#f4f7fe] min-h-screen font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#001f3f]">Damage Logs & Verification</h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">Audit trail and approvals of inventory stock damage write-offs</p>
                </div>
                <Link href="/dashboard/damage/damage-list/create">
                    <button className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 text-sm">
                        <Plus size={18} strokeWidth={3} /> Record Damage
                    </button>
                </Link>
            </div>

            {/* Filters Area */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-700">Filter Records</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search No, reason..." 
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setPage(1);
                            }}
                            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-rose-100 outline-none w-full" 
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 font-medium outline-none focus:ring-2 focus:ring-rose-100"
                    >
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Disposed">Disposed</option>
                    </select>

                    {/* Source Filter */}
                    <select
                        value={sourceFilter}
                        onChange={(e) => {
                            setSourceFilter(e.target.value);
                            setPage(1);
                        }}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 font-medium outline-none focus:ring-2 focus:ring-rose-100"
                    >
                        <option value="">All Sources</option>
                        <option value="Warehouse">Warehouse Damage</option>
                        <option value="Delivery Settlement">Delivery Settlement</option>
                        <option value="Expired">Expired Products</option>
                        <option value="Supplier Return">Supplier Return Damage</option>
                        <option value="Customer Return">Customer Return Damage</option>
                    </select>

                    {/* Start Date */}
                    <input 
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            setPage(1);
                        }}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 font-medium outline-none focus:ring-2 focus:ring-rose-100"
                        placeholder="Start Date"
                    />

                    {/* End Date */}
                    <input 
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                            setEndDate(e.target.value);
                            setPage(1);
                        }}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 font-medium outline-none focus:ring-2 focus:ring-rose-100"
                        placeholder="End Date"
                    />
                </div>
            </div>

            {/* List Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {isLoading || isFetching ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <Loader2 className="animate-spin text-rose-600 mb-3" size={32} />
                        <span className="text-sm font-semibold">Fetching logs...</span>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-[#f8f9fa] border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-400">
                                        <th className="px-6 py-4 text-center">SL</th>
                                        <th className="px-6 py-4">Damage No</th>
                                        <th className="px-6 py-4">Product Details</th>
                                        <th className="px-6 py-4">Source & Reason</th>
                                        <th className="px-6 py-4 text-right">Loss Amount</th>
                                        <th className="px-6 py-4">Created By</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-center">Approvals</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {records.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="text-center py-12 text-slate-400 italic text-sm">
                                                No damage records found matching the filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        records.map((item: any, index: number) => (
                                            <tr key={item.id} className="group hover:bg-rose-50/20 transition-all duration-200 text-slate-700">
                                                <td className="px-6 py-5 text-sm font-bold text-slate-300 text-center">
                                                    {(page - 1) * meta.limit + index + 1}
                                                </td>
                                                <td className="px-6 py-5 text-xs font-bold text-slate-800">
                                                    {item.damage_number}
                                                    <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1">
                                                        <Calendar size={10} /> {item.damage_date}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="space-y-1">
                                                        {item.items?.map((subItem: any, subIndex: number) => (
                                                            <div key={subIndex} className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-md bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                                                                    <Package size={12} />
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs font-bold text-slate-700">{subItem.product_name}</span>
                                                                    <span className="text-[10px] text-slate-400 font-medium ml-1.5 bg-slate-100 px-1.5 py-0.5 rounded">
                                                                        Batch: {subItem.batch_id} — {subItem.qty} pcs
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md w-fit mb-1">
                                                        {item.source_type}
                                                    </div>
                                                    <span className="text-xs text-slate-500 italic font-medium">
                                                        {item.damage_reason || "No reason specified"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right font-black text-rose-600 text-xs">
                                                    {formatCurrency(item.loss_amount)}
                                                    <div className="text-[10px] text-slate-400 font-bold mt-1">
                                                        {item.qty} pcs total
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-xs font-bold text-slate-600">
                                                    {item.created_by}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase inline-block ${
                                                        item.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                                        item.status === 'Pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                                        item.status === 'Rejected' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                                                        'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                                    }`}>
                                                        {item.status}
                                                    </span>
                                                    {item.approved_by && (
                                                        <div className="text-[9px] text-slate-400 font-semibold mt-1">
                                                            By: {item.approved_by}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    {updatingRecordId === item.id ? (
                                                        <Loader2 className="animate-spin text-rose-600 mx-auto" size={16} />
                                                    ) : (
                                                        <div className="flex items-center justify-center gap-2">
                                                            {item.status === 'Pending' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => triggerConfirmation(
                                                                            "Approve Write-off",
                                                                            "Are you sure you want to approve this damage record? This will permanently subtract quantity from available inventory stock.",
                                                                            "Approve",
                                                                            "success",
                                                                            () => handleUpdateStatus(item.id, 'Approved')
                                                                        )}
                                                                        className="p-1 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg shadow-sm transition-all"
                                                                        title="Approve Write-off"
                                                                    >
                                                                        <CheckCircle size={15} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => triggerConfirmation(
                                                                            "Reject Write-off",
                                                                            "Are you sure you want to reject this damage record?",
                                                                            "Reject",
                                                                            "destructive",
                                                                            () => handleUpdateStatus(item.id, 'Rejected')
                                                                        )}
                                                                        className="p-1 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg shadow-sm transition-all"
                                                                        title="Reject Write-off"
                                                                    >
                                                                        <XCircle size={15} />
                                                                    </button>
                                                                </>
                                                            )}
                                                            {item.status === 'Approved' && (
                                                                <button
                                                                    onClick={() => triggerConfirmation(
                                                                        "Dispose Damaged Stock",
                                                                        "Are you sure you want to transition this record to disposed?",
                                                                        "Dispose",
                                                                        "default",
                                                                        () => handleUpdateStatus(item.id, 'Disposed')
                                                                    )}
                                                                    className="flex items-center gap-1 px-2.5 py-1 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-[10px] font-bold shadow-sm transition-all"
                                                                    title="Dispose of damaged products"
                                                                >
                                                                    <AlertOctagon size={11} /> Dispose
                                                                </button>
                                                            )}
                                                            {(item.status === 'Rejected' || item.status === 'Disposed') && (
                                                                <span className="text-[10px] text-slate-400 font-medium italic">Voucher Closed</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
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
                    </>
                )}
            </div>

            {/* Custom Confirmation Modal */}
            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-slate-800 font-bold">
                            <AlertTriangle className={`h-5.5 w-5.5 ${
                                confirmConfig.variant === 'destructive' ? 'text-rose-500' : 
                                confirmConfig.variant === 'success' ? 'text-emerald-500' : 
                                'text-blue-500'
                            }`} />
                            {confirmConfig.title}
                        </DialogTitle>
                        <DialogDescription className="text-slate-600 font-medium text-xs leading-relaxed pt-2">
                            {confirmConfig.description}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex sm:justify-end gap-2 pt-4 border-t border-slate-100">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsConfirmOpen(false)}
                            className="bg-transparent hover:bg-slate-50"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleConfirmAction}
                            className={`font-bold uppercase tracking-wider text-xs ${
                                confirmConfig.variant === 'destructive' ? 'bg-rose-600 hover:bg-rose-700 text-white' : 
                                confirmConfig.variant === 'success' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 
                                'bg-slate-800 hover:bg-slate-900 text-white'
                            }`}
                        >
                            {confirmConfig.buttonText}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

// Simple AlertTriangle fallback in case icons are nested
const AlertTriangle = ({ className, ...props }: any) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
        {...props}
    >
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

export default DamageList;