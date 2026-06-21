"use client"

import { useGetAllCompaniesQuery } from "@/components/Redux/RTK/fileApi";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import {
    Building2,
    ChevronLeft,
    ChevronRight,
    Globe,
    Mail,
    MapPin,
    Phone
} from "lucide-react";
import { useState } from "react";

export default function Companies() {
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: response, isLoading, isFetching } = useGetAllCompaniesQuery({ page, limit });

    const companies = response?.data?.data || [];
    const meta = response?.data?.meta;
    const totalPages = meta ? Math.ceil(meta.total / limit) : 0;



    return (
        <div className="min-h-screen p-4 md:p-8 bg-[#f8fafc]">
            <div className=" space-y-6">

                {/* ================= Header ================= */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Breadcrumbs items={[{ label: "Companies", href: "" }]} />
                        <h1 className="text-3xl font-bold text-slate-900 mt-2">
                            Business Directory
                        </h1>
                        <p className="text-slate-500">
                            Manage registered companies and their legal information.
                        </p>
                    </div>
                </div>

                {/* ================= Table Card ================= */}
                <div className="bg-white  rounded-none border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">

                        <table className="w-full text-left border-separate border-spacing-y-2">
                            {/* ---------- Header ---------- */}
                            <thead className="sticky top-0 bg-slate-50/80 backdrop-blur z-10">
                                <tr className="border-b border-slate-200">
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                                        Company & Domain
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                                        Business Contact
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                                        Primary Contact
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                                        Legal Address
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                                        Owner
                                    </th>
                                </tr>
                            </thead>

                            {/* ---------- Body ---------- */}
                            <tbody className="text-sm">
                                {isLoading || isFetching ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4">
                                            <div className="animate-spin rounded-full h-5 w-5 border-4 border-blue-500 border-t-transparent"></div>
                                        </td>
                                    </tr>
                                ) : companies.map((company: any) => (
                                    <tr
                                        key={company._id}
                                        className="
                      bg-white
                      rounded-xl
                      shadow-sm
                      hover:shadow-md
                      hover:bg-blue-50/40
                      transition-all
                      duration-200
                      group
                    "
                                    >
                                        {/* Company */}
                                        <td className="px-6 py-5 rounded-l-xl">
                                            <div className="flex items-start gap-3 border-l-4 border-transparent pl-3 group-hover:border-blue-500 transition-all">
                                                <div className="p-2 bg-blue-50 rounded-none text-blue-600">
                                                    <Building2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">
                                                        {company.company_name}
                                                    </p>
                                                    <p className="text-xs text-slate-400 uppercase font-medium">
                                                        {company.business_name}
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-1 text-blue-500 hover:underline cursor-pointer">
                                                        <Globe className="w-3 h-3" />
                                                        <span className="text-xs">{company.domain}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Business Contact */}
                                        <td className="px-6 py-5">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                    {company.business_email}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                    {company.business_phone || "N/A"}
                                                </div>
                                                <span className="inline-block px-2 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-500 rounded uppercase">
                                                    {company.business_type || "Standard"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Primary Contact */}
                                        <td className="px-6 py-5">
                                            <div className="bg-slate-50 p-3 rounded-none border border-slate-100 space-y-1">
                                                <p className="text-sm font-bold text-slate-800">
                                                    {company.contact_name}
                                                </p>
                                                <p className="text-[11px] text-slate-500 truncate max-w-[150px]">
                                                    {company.contact_email}
                                                </p>
                                                <p className="text-[11px] text-slate-500">
                                                    {company.contact_phone}
                                                </p>
                                            </div>
                                        </td>

                                        {/* Legal Address */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-start gap-2 max-w-[220px]">
                                                <MapPin className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                                                <div className="text-xs text-slate-600 leading-5 space-y-0.5">
                                                    <p className="font-medium text-slate-900">
                                                        {company.legal_address.street}
                                                    </p>
                                                    <p>
                                                        {company.legal_address.city},{" "}
                                                        {company.legal_address.state}
                                                    </p>
                                                    <p className="font-semibold text-slate-400 tracking-wide">
                                                        {company.legal_address.country} (
                                                        {company.legal_address.zip_code})
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Owner */}
                                        <td className="px-6 py-5 rounded-r-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full overflow-hidden border border-white ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all">
                                                    {company.user.profile_picture ? (
                                                        <img
                                                            src={company.user.profile_picture}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-xs font-bold">
                                                            {company.user.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-xs">
                                                    <p className="font-bold text-slate-900">
                                                        {company.user.name}
                                                    </p>
                                                    <p className="text-slate-400">Owner</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ================= Pagination ================= */}
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                        <p className="text-sm text-slate-500 font-medium">
                            Showing{" "}
                            <span className="text-slate-900 font-bold">
                                {companies.length}
                            </span>{" "}
                            of{" "}
                            <span className="text-slate-900 font-bold">
                                {meta?.total}
                            </span>{" "}
                            companies
                        </p>

                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-none border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 active:scale-95 transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-10 h-10 rounded-none text-sm font-bold transition-all active:scale-95 ${page === i + 1
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                        : "bg-white border border-slate-200 text-slate-600 hover:border-blue-400"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 rounded-none border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 active:scale-95 transition-all"
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