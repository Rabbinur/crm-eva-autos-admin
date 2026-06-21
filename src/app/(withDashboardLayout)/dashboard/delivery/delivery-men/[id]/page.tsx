"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetDeliveryManStatsQuery } from "@/components/Redux/RTK/distributorApiNode";
import { ArrowLeft, Loader2, Phone, IdCard, MapPin, Package, Check, Printer, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const formatCurrency = (val: number) => `৳${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function DeliveryManDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data, isLoading, isFetching } = useGetDeliveryManStatsQuery(id);

    if (isLoading || isFetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] p-6 text-slate-500">
                <Loader2 className="animate-spin h-8 w-8 text-primary mb-3" />
                <p className="text-sm font-medium">Fetching representative ledger and challans...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-8 space-y-6 max-w-4xl mx-auto">
                <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/delivery")}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <div className="text-center py-20 bg-white border rounded-xl shadow-xs text-slate-400">
                    Delivery representative record not found.
                </div>
            </div>
        );
    }

    const { deliveryMan, summary, challans = [] } = data;

    // Stacked bar percentages
    const totalLoaded = summary.totalLoaded || 1;
    const soldPercent = Math.min(100, ((summary.totalSold || 0) / totalLoaded) * 100);
    const returnedPercent = Math.min(100, ((summary.totalReturned || 0) / totalLoaded) * 100);
    const damagedPercent = Math.min(100, ((summary.totalDamaged || 0) / totalLoaded) * 100);

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto bg-[#f8f9fa] min-h-screen">
            {/* Header / Back Link */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => router.push("/dashboard/delivery")} 
                        className="bg-white border-slate-200"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Representative Ledger</h1>
                        <p className="text-xs text-slate-500">Traceability dashboard for individual loading sheets (challans) and settlements</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className={deliveryMan.status === 'active' ? 'bg-emerald-600' : 'bg-slate-400'}>
                        {deliveryMan.status === 'active' ? 'Active Representative' : 'Inactive'}
                    </Badge>
                </div>
            </div>

            {/* Profile Detail Card */}
            <Card className="border border-border/70 shadow-xs bg-white overflow-hidden">
                <div className="h-1.5 w-full bg-primary" />
                <CardContent className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
                    {deliveryMan.profile ? (
                        <img 
                            src={deliveryMan.profile} 
                            alt={deliveryMan.name} 
                            className="w-24 h-24 rounded-full object-cover border border-slate-200 shadow-sm shrink-0" 
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-3xl border border-primary/20 shrink-0 uppercase shadow-inner">
                            {deliveryMan.name.slice(0, 2)}
                        </div>
                    )}
                    <div className="flex-1 space-y-4 text-center md:text-left min-w-0">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">{deliveryMan.name}</h2>
                            <p className="text-xs text-slate-400 font-semibold mt-0.5">UID: #{deliveryMan.id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-600">
                            <div className="flex items-center justify-center md:justify-start gap-2.5">
                                <Phone size={14} className="text-primary shrink-0" />
                                <span>{deliveryMan.phone}</span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-2.5">
                                <IdCard size={14} className="text-primary shrink-0" />
                                <span>NID: {deliveryMan.nid}</span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-2.5">
                                <MapPin size={14} className="text-primary shrink-0" />
                                <span className="truncate" title={deliveryMan.address}>{deliveryMan.address}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Summary KPI Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Assigned Challans */}
                <Card className="shadow-xs border border-border/70 bg-white">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Challan Summary</p>
                            <h3 className="text-2xl font-black text-slate-800">{summary.totalChallans}</h3>
                            <p className="text-[10px] text-slate-500 font-medium">
                                <span className="text-emerald-600 font-bold">{summary.settledChallans} Settled</span> • {summary.pendingChallans} In-Transit
                            </p>
                        </div>
                        <div className="p-3 bg-slate-50 text-slate-600 rounded-xl border">
                            <Package size={20} />
                        </div>
                    </CardContent>
                </Card>

                {/* Total Sales Value */}
                <Card className="shadow-xs border border-border/70 bg-white">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Sales (Sold)</p>
                            <h3 className="text-2xl font-black text-blue-600">{formatCurrency(summary.totalSales)}</h3>
                            <p className="text-[10px] text-slate-500 font-medium">Aggregate revenue finalized</p>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                            <Check size={20} />
                        </div>
                    </CardContent>
                </Card>

                {/* Total Net Profit */}
                <Card className="shadow-xs border border-border/70 bg-white">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Profit Contribution</p>
                            <h3 className="text-2xl font-black text-emerald-600">{formatCurrency(summary.totalProfit)}</h3>
                            <p className="text-[10px] text-slate-500 font-medium">Deducted of damage losses</p>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                            <Printer size={20} />
                        </div>
                    </CardContent>
                </Card>

                {/* Total Damage Loss */}
                <Card className="shadow-xs border border-border/70 bg-white">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Damage Loss</p>
                            <h3 className="text-2xl font-black text-rose-600">{formatCurrency(summary.totalLoss)}</h3>
                            <p className="text-[10px] text-slate-500 font-medium">Expected purchase cost loss</p>
                        </div>
                        <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                            <ArrowLeft size={20} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quantity Stacked Segment Allocation Bar */}
            <Card className="border border-border/70 bg-white shadow-xs">
                <CardHeader className="pb-3 border-b border-slate-50">
                    <CardTitle className="text-sm font-bold text-slate-800">Assigned Stock Segment Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="space-y-1 text-xs">
                        <div className="flex justify-between font-bold text-slate-600">
                            <span>Loaded stock distribution tracking</span>
                            <span className="text-slate-800">Total Loaded: {summary.totalLoaded} pcs</span>
                        </div>
                        {/* Stacked Progress Bar */}
                        <div className="w-full bg-slate-100 h-5.5 rounded-lg overflow-hidden flex shadow-inner">
                            {summary.totalSold > 0 && (
                                <div 
                                    className="bg-blue-500 h-full flex items-center justify-center text-[10px] font-black text-white" 
                                    style={{ width: `${soldPercent}%` }}
                                    title={`Sold: ${summary.totalSold} pcs`}
                                >
                                    {soldPercent > 10 && `Sold: ${summary.totalSold}`}
                                </div>
                            )}
                            {summary.totalReturned > 0 && (
                                <div 
                                    className="bg-emerald-500 h-full flex items-center justify-center text-[10px] font-black text-white" 
                                    style={{ width: `${returnedPercent}%` }}
                                    title={`Returned: ${summary.totalReturned} pcs`}
                                >
                                    {returnedPercent > 10 && `Ret: ${summary.totalReturned}`}
                                </div>
                            )}
                            {summary.totalDamaged > 0 && (
                                <div 
                                    className="bg-rose-500 h-full flex items-center justify-center text-[10px] font-black text-white" 
                                    style={{ width: `${damagedPercent}%` }}
                                    title={`Damaged: ${summary.totalDamaged} pcs`}
                                >
                                    {damagedPercent > 10 && `Dmg: ${summary.totalDamaged}`}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Legend keys */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-slate-500 pt-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 bg-blue-500 rounded" />
                            <span>Sold Items ({summary.totalSold} pcs)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 bg-emerald-500 rounded" />
                            <span>Returned Items ({summary.totalReturned} pcs)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 bg-rose-500 rounded" />
                            <span>Damaged Write-offs ({summary.totalDamaged} pcs)</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Challans assigned Table */}
            <Card className="border border-border/70 bg-white shadow-xs">
                <CardHeader className="pb-3 border-b border-slate-50">
                    <CardTitle className="text-sm font-bold text-slate-800">Assigned Challans & Daily Settlements History</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="px-4 py-3.5">SL</th>
                                    <th className="px-4 py-3.5">Date</th>
                                    <th className="px-4 py-3.5">Challan No</th>
                                    <th className="px-4 py-3.5">Route</th>
                                    <th className="px-4 py-3.5 text-center">Status</th>
                                    <th className="px-4 py-3.5 text-center">Loaded (pcs)</th>
                                    <th className="px-4 py-3.5 text-center">Sold (pcs)</th>
                                    <th className="px-4 py-3.5 text-center">Return (pcs)</th>
                                    <th className="px-4 py-3.5 text-center">Damage (pcs)</th>
                                    <th className="px-4 py-3.5 text-right">Sales Revenue</th>
                                    <th className="px-4 py-3.5 text-right">Profit Contribution</th>
                                    <th className="px-4 py-3.5 text-right">Damage Loss</th>
                                    <th className="px-4 py-3.5 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                                {challans.length === 0 ? (
                                    <tr>
                                        <td colSpan={13} className="text-center py-10 text-slate-400 italic">
                                            No loading sheets or settlements assigned to this representative yet.
                                        </td>
                                    </tr>
                                ) : (
                                    challans.map((challan: any, index: number) => {
                                        const isSettled = challan.status === "settled";
                                        const setInfo = challan.settlement;
                                        return (
                                            <tr key={challan.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-4 py-4 text-slate-300 font-bold">{index + 1}</td>
                                                <td className="px-4 py-4 whitespace-nowrap">{challan.date}</td>
                                                <td className="px-4 py-4 font-bold text-slate-800">{challan.invoiceNo}</td>
                                                <td className="px-4 py-4 whitespace-nowrap">{challan.route}</td>
                                                <td className="px-4 py-4 text-center whitespace-nowrap">
                                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                                                        isSettled ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                                    }`}>
                                                        {isSettled ? "Settled" : "In-Transit"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-center font-bold text-slate-800 bg-slate-50/50">
                                                    {isSettled ? setInfo.totalLoaded : "—"}
                                                </td>
                                                <td className="px-4 py-4 text-center font-bold text-blue-600 bg-blue-50/10">
                                                    {isSettled ? setInfo.totalSold : "—"}
                                                </td>
                                                <td className="px-4 py-4 text-center font-bold text-emerald-600 bg-emerald-50/10">
                                                    {isSettled ? setInfo.totalReturned : "—"}
                                                </td>
                                                <td className="px-4 py-4 text-center font-bold text-rose-600 bg-rose-50/10">
                                                    {isSettled ? setInfo.totalDamaged : "—"}
                                                </td>
                                                <td className="px-4 py-4 text-right font-bold text-slate-800">
                                                    {isSettled ? formatCurrency(setInfo.totalSales) : "—"}
                                                </td>
                                                <td className="px-4 py-4 text-right font-black text-emerald-600">
                                                    {isSettled ? formatCurrency(setInfo.totalProfit) : "—"}
                                                </td>
                                                <td className="px-4 py-4 text-right font-bold text-rose-600">
                                                    {isSettled ? formatCurrency(setInfo.totalLoss) : "—"}
                                                </td>
                                                <td className="px-4 py-4 text-center whitespace-nowrap">
                                                    {isSettled ? (
                                                        <Link href={`/dashboard/delivery/settlements`}>
                                                            <Button size="sm" variant="ghost" className="h-7 text-[10px] font-bold text-slate-500 hover:text-slate-800">
                                                                Print Ledger
                                                            </Button>
                                                        </Link>
                                                    ) : (
                                                        <Link href={`/dashboard/delivery/settlements/create?sheetId=${challan.id}`}>
                                                            <Button size="sm" className="h-7 text-[10px] font-black uppercase tracking-wider bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1 active:scale-95 shadow-xs">
                                                                Settle <ArrowRight size={10} strokeWidth={3} />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
