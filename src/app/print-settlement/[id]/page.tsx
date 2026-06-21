'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetSettlementByIdQuery } from '@/components/Redux/RTK/distributorApiNode';
import PrintLayout from '@/components/PrintLayout';

const formatCurrency = (val: number) => `৳${val.toFixed(2)}`;

export default function PrintSettlementPage() {
    const params = useParams();
    const router = useRouter();
    const settlementId = params.id as string;
    const { data: settlement, isLoading } = useGetSettlementByIdQuery(settlementId);

    if (isLoading) {
        return (
            <div className="p-8 space-y-4 text-center">
                <p className="text-muted-foreground">Loading details...</p>
            </div>
        );
    }

    if (!settlement) {
        return (
            <div className="p-8 space-y-4 text-center">
                <p className="text-destructive font-semibold">Settlement not found.</p>
                <Button onClick={() => router.back()}>Back</Button>
            </div>
        );
    }

    return (
        <PrintLayout
            title="Settlement Voucher"
            invoiceLabel="Voucher ID"
            invoiceNo={settlement.invoiceNo || settlement.id.slice(-8).toUpperCase()}
            onBack={() => router.back()}
        >
            {/* Info Grid */}
            <div className="grid grid-cols-3 gap-6 my-8 p-6 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Delivery Representative</p>
                    <p className="text-base font-bold text-slate-800 mt-1">{settlement.deliveryManName}</p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Settlement Date</p>
                    <p className="text-base font-medium text-slate-800 mt-1">{settlement.date}</p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Loading Sheet Reference</p>
                    <p className="text-base font-mono font-semibold text-indigo-600 mt-1">{settlement.loadingSheetInvoiceNo || settlement.loadingSheetId.slice(-8).toUpperCase()}</p>
                    {settlement.route && <p className="text-xs text-slate-600 mt-1"><strong>Route:</strong> {settlement.route}</p>}
                </div>
            </div>

            {/* Items Table */}
            <div className="my-8">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="text-slate-700 font-semibold print:text-xs">Product Name</TableHead>
                            <TableHead className="text-center text-slate-700 font-semibold print:text-xs">Loaded (pcs)</TableHead>
                            <TableHead className="text-center text-slate-700 font-semibold print:text-xs">Returned (pcs)</TableHead>
                            <TableHead className="text-center text-slate-700 font-semibold print:text-xs">Damaged (pcs)</TableHead>
                            <TableHead className="text-center text-slate-700 font-semibold print:text-xs">Sold (pcs)</TableHead>
                            <TableHead className="text-right text-slate-700 font-semibold print:text-xs">Rate</TableHead>
                            <TableHead className="text-right text-slate-700 font-semibold print:text-xs">Total Sales</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {settlement.items.map((item: any) => (
                            <TableRow key={item.productId} className="border-b last:border-none">
                                <TableCell className="font-medium text-slate-800 py-3 print:text-xs">{item.productName}</TableCell>
                                <TableCell className="text-center py-3 print:text-xs">{item.loadedQuantity}</TableCell>
                                <TableCell className="text-center py-3 print:text-xs">{item.returnedQuantity}</TableCell>
                                <TableCell className="text-center py-3 print:text-xs text-destructive">{item.damagedQuantity}</TableCell>
                                <TableCell className="text-center py-3 font-semibold text-slate-800 print:text-xs">{item.soldQuantity}</TableCell>
                                <TableCell className="text-right py-3 print:text-xs">{formatCurrency(item.sellingPrice)}</TableCell>
                                <TableCell className="text-right py-3 font-bold text-slate-800 print:text-xs">{formatCurrency(item.soldQuantity * item.sellingPrice)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Financial Summary */}
            <div className="flex justify-end my-8">
                <div className="w-full md:w-80 space-y-3">
                    <div className="flex justify-between text-sm py-1 border-b">
                        <span className="text-muted-foreground">Total Loaded Pieces:</span>
                        <span className="font-semibold text-slate-800">{settlement.totalLoaded} pcs</span>
                    </div>
                    <div className="flex justify-between text-sm py-1 border-b">
                        <span className="text-muted-foreground">Total Sold Pieces:</span>
                        <span className="font-semibold text-slate-800">{settlement.totalSold} pcs</span>
                    </div>
                    <div className="flex justify-between text-sm py-1 border-b">
                        <span className="text-muted-foreground">Damage Cost Loss:</span>
                        <span className="font-semibold text-destructive">{formatCurrency(settlement.totalLoss)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold py-2 border-t border-double border-slate-300">
                        <span className="text-slate-800">Total Net Sales Value:</span>
                        <span className="text-indigo-600">{formatCurrency(settlement.totalSales)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold py-1">
                        <span className="text-slate-800">Settlement Net Profit:</span>
                        <span className={settlement.totalProfit >= 0 ? 'text-green-600' : 'text-destructive'}>
                            {formatCurrency(settlement.totalProfit)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Signatures Row */}
            <div className="mt-20 grid grid-cols-2 gap-12 text-center pt-8 border-t border-dashed border-slate-200">
                <div>
                    <div className="w-48 mx-auto border-b border-slate-300 h-10"></div>
                    <p className="text-xs text-muted-foreground font-medium mt-2">Delivery Representative</p>
                </div>
                <div>
                    <div className="w-48 mx-auto border-b border-slate-300 h-10"></div>
                    <p className="text-xs text-muted-foreground font-medium mt-2">Warehouse Supervisor / Manager</p>
                </div>
            </div>
        </PrintLayout>
    );
}
