"use client"
import { useCustomersDocumentsQuery } from "@/components/Redux/RTK/fileApi";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import {
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    FileText,
    Layers,
    Loader2,
    Mail,
    ShieldCheck,
    User
} from "lucide-react";
import { useState } from "react";

export default function Documents() {
    const [page, setPage] = useState(1);
    const limit = 10;
    const { data: response, isLoading, isFetching } = useCustomersDocumentsQuery({ page, limit });

    const documents = response?.data?.data || [];
    const meta = response?.data?.meta;
    const totalPages = meta ? Math.ceil(meta.total / limit) : 0;

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };



    return (
        <div className="min-h-screen p-4 md:p-8 bg-[#f8fafc]">
            <div className=" space-y-6">

                {/* Top Header & Breadcrumbs */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <Breadcrumbs items={[{ label: "Documents", href: "" }]} />
                        <h1 className="text-3xl font-bold text-slate-900 mt-2">Customer Documentation</h1>
                        <p className="text-slate-500">Review and manage verified business documentation.</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-none border border-slate-200 shadow-sm text-sm">
                        <span className="text-slate-500">Total Records: </span>
                        <span className="font-bold text-slate-900">{meta?.total || 0}</span>
                    </div>
                </div>

                {/* Main Table Container */}
                <div className="bg-white  rounded-none shadow border-slate-200 overflow-hidden flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-y-3">

                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b">Customer Info</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b">Tax & Compliance</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b">Additional Files</th>

                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading || isFetching ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-5">
                                            <div className="flex items-center justify-center">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            </div>
                                        </td>
                                    </tr>
                                ) : documents.map((item: any) => (
                                    <tr key={item._id} className=" bg-white
    rounded-none
    shadow-sm
    hover:shadow-md
    transition-all">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                                        {item.user.profile_picture ? (
                                                            <img src={item.user.profile_picture} alt={item.user.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <User className="w-6 h-6 text-slate-400" />
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 leading-tight">{item.user.name}</h3>
                                                    <div className="flex flex-col gap-1 mt-1">
                                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                                            <Mail className="w-3 h-3" /> {item.user.email}
                                                        </span>
                                                        <span className="text-[10px] font-mono text-slate-400 uppercase">ID: {item.user.user_id}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="space-y-2">
                                                <DocLink label="W-9 Form" url={item.w9} />
                                                <DocLink label="Reseller Certificate" url={item.reseller_certificate} />
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex flex-wrap gap-2 max-w-[250px]">
                                                {Object.entries(item.others || {}).length > 0 ? (
                                                    Object.entries(item.others).map(([key, value]: [string, any]) => (
                                                        <a
                                                            key={key}
                                                            href={value}
                                                            target="_blank"
                                                            className="inline-flex items-center px-2.5 py-1 rounded-none text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm"
                                                        >
                                                            <Layers className="w-3 h-3 mr-1 opacity-70" />
                                                            {key.replace(/_/g, ' ')}
                                                        </a>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">No additional files</span>
                                                )}
                                            </div>
                                        </td>


                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* --- PAGINATION SECTION --- */}
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-slate-500">
                            Showing <span className="font-semibold text-slate-900">{((page - 1) * limit) + 1}</span> to <span className="font-semibold text-slate-900">{Math.min(page * limit, meta?.total || 0)}</span> of <span className="font-semibold text-slate-900">{meta?.total}</span> results
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className="p-2 rounded-none border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-1">
                                {[...Array(totalPages)].map((_, index) => {
                                    const pageNum = index + 1;
                                    // Logic to show limited page numbers if totalPages is huge
                                    if (totalPages > 5 && Math.abs(pageNum - page) > 1 && pageNum !== 1 && pageNum !== totalPages) {
                                        if (pageNum === 2 || pageNum === totalPages - 1) return <span key={pageNum} className="px-2 text-slate-400">...</span>;
                                        return null;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`min-w-[40px] h-10 px-3 rounded-none text-sm font-medium transition-all ${page === pageNum
                                                ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                                                : "bg-white border border-slate-200 text-slate-600 hover:border-blue-400"
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages}
                                className="p-2 rounded-none border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DocLink({ label, url }: { label: string; url: string | null }) {
    if (!url) {
        return (
            <div className="flex items-center gap-2 opacity-40 grayscale">
                <div className="p-1.5 bg-slate-100 rounded-none">
                    <FileText className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs text-slate-500 line-through">{label}</span>
            </div>
        );
    }

    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group/link w-fit">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-none group-hover/link:bg-blue-600 group-hover/link:text-white transition-colors">
                <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-700 group-hover/link:text-blue-600 transition-colors">{label}</span>
            <ExternalLink className="w-3 h-3 text-slate-300 group-hover/link:text-blue-400" />
        </a>
    );
}