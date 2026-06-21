'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetLoadingSheetByIdQuery, useGetDeliveryMenQuery, useGetDistributorProductsQuery } from '@/components/Redux/RTK/distributorApiNode';
import PrintLayout from '@/components/PrintLayout';

const formatCurrency = (val: number) => `৳${val.toFixed(2)}`;

export default function PrintLoadingSheetPage() {
    const params = useParams();
    const router = useRouter();
    const sheetId = params.id as string;
    
    const { data: sheet, isLoading: isLoadingSheet } = useGetLoadingSheetByIdQuery(sheetId);
    const { data: deliveryMen = [] } = useGetDeliveryMenQuery();
    const { data: products = [] } = useGetDistributorProductsQuery();

    const deliveryManInfo = useMemo(() => {
        if (!sheet) return null;
        return deliveryMen.find((dm: any) => dm.name === sheet.deliveryManName || dm.id === sheet.deliveryManId);
    }, [deliveryMen, sheet]);

    // Calculate total weight loaded based on actual product specs in inventory
    const totalWeightText = useMemo(() => {
        if (!sheet || !products.length) return '0 gm';
        let weightInGrams = 0;
        sheet.items.forEach((item: any) => {
            const p = products.find((prod: any) => prod.id === item.productId);
            if (p && p.weight) {
                weightInGrams += item.quantity * p.weight;
            }
        });

        if (weightInGrams >= 1000) {
            return `${(weightInGrams / 1000).toFixed(2)} kg`;
        }
        return `${weightInGrams} gm`;
    }, [sheet, products]);

    if (isLoadingSheet) {
        return (
            <div className="p-8 space-y-4 text-center">
                <p className="text-muted-foreground">Loading details...</p>
            </div>
        );
    }

    if (!sheet) {
        return (
            <div className="p-8 space-y-4 text-center">
                <p className="text-destructive font-semibold">Loading Sheet not found.</p>
                <Button onClick={() => router.back()}>Back</Button>
            </div>
        );
    }

    const totalQuantity = sheet.items.reduce((s: number, i: any) => s + i.quantity, 0);
    const totalCostValue = sheet.items.reduce((s: number, i: any) => s + i.quantity * i.purchasePrice, 0);
    const totalSalesValue = sheet.items.reduce((s: number, i: any) => s + i.quantity * i.sellingPrice, 0);
    const expectedProfit = Math.max(0, totalSalesValue - totalCostValue);

    return (
        <PrintLayout
            title="Loading Sheet / Challan"
            invoiceNo={sheet.invoiceNo || sheet.id.slice(-8).toUpperCase()}
            onBack={() => router.back()}
        >
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-6 my-8 p-6 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                    <h3 className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Delivery Representative Details</h3>
                    <p className="text-base font-bold text-slate-800 mt-1.5">{sheet.deliveryManName}</p>
                    {deliveryManInfo ? (
                        <div className="text-sm text-slate-600 mt-1 space-y-0.5">
                            <p><strong>Phone:</strong> {deliveryManInfo.phone}</p>
                            <p><strong>NID:</strong> {deliveryManInfo.nid}</p>
                            <p><strong>Address:</strong> {deliveryManInfo.address}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 mt-1">N/A</p>
                    )}
                </div>
                <div className="flex flex-col justify-between items-end text-right">
                    <div>
                        <h3 className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Loading Information</h3>
                        <p className="text-sm text-slate-700 mt-1.5"><strong>Date Loaded:</strong> {sheet.date}</p>
                        <p className="text-sm text-slate-700"><strong>Status:</strong> <span className="capitalize font-semibold text-orange-600">{sheet.status}</span></p>
                        {sheet.route && <p className="text-sm text-slate-700"><strong>Assigned Route:</strong> <span className="font-semibold">{sheet.route}</span></p>}
                        <p className="text-sm text-slate-700"><strong>Total Weight:</strong> <span className="font-semibold">{totalWeightText}</span></p>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="my-8">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="text-slate-700 font-semibold print:text-xs">Product Name</TableHead>
                            <TableHead className="text-center text-slate-700 font-semibold print:text-xs">Cost/Piece</TableHead>
                            <TableHead className="text-center text-slate-700 font-semibold print:text-xs">Selling/Piece</TableHead>
                            <TableHead className="text-center text-slate-700 font-semibold print:text-xs">Loaded Qty (pcs)</TableHead>
                            <TableHead className="text-right text-slate-700 font-semibold print:text-xs">Total Cost Value</TableHead>
                            <TableHead className="text-right text-slate-700 font-semibold print:text-xs">Expected Sales</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sheet.items.map((item: any) => (
                            <TableRow key={item.productId} className="border-b last:border-none">
                                <TableCell className="font-medium text-slate-800 py-3 print:text-xs">{item.productName}</TableCell>
                                <TableCell className="text-center py-3 print:text-xs">{formatCurrency(item.purchasePrice)}</TableCell>
                                <TableCell className="text-center py-3 print:text-xs">{formatCurrency(item.sellingPrice)}</TableCell>
                                <TableCell className="text-center py-3 font-semibold text-slate-800 print:text-xs">{item.quantity}</TableCell>
                                <TableCell className="text-right py-3 print:text-xs">{formatCurrency(item.quantity * item.purchasePrice)}</TableCell>
                                <TableCell className="text-right py-3 font-bold text-slate-800 print:text-xs">{formatCurrency(item.quantity * item.sellingPrice)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Summary Box */}
            <div className="flex justify-end my-8">
                <div className="w-full md:w-96 space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-100 print:bg-white print:border-none">
                    <div className="flex justify-between text-sm py-1 border-b">
                        <span className="text-muted-foreground">Product Types:</span>
                        <span className="font-semibold text-slate-800">{sheet.items.length} types</span>
                    </div>
                    <div className="flex justify-between text-sm py-1 border-b">
                        <span className="text-muted-foreground">Total Loaded Pieces:</span>
                        <span className="font-semibold text-slate-800">{totalQuantity} pcs</span>
                    </div>
                    <div className="flex justify-between text-sm py-1 border-b">
                        <span className="text-muted-foreground">Total Stock Cost:</span>
                        <span className="font-semibold text-slate-800">{formatCurrency(totalCostValue)}</span>
                    </div>
                    <div className="flex justify-between text-sm py-1 border-b">
                        <span className="text-muted-foreground">Expected Profit Margin:</span>
                        <span className="font-semibold text-green-600">{formatCurrency(expectedProfit)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold py-2 border-t border-double border-slate-300">
                        <span className="text-slate-800">Expected Sales Return:</span>
                        <span className="text-indigo-600">{formatCurrency(totalSalesValue)}</span>
                    </div>
                </div>
            </div>

            {/* Signatures Row */}
            <div className="mt-24 grid grid-cols-3 gap-6 text-center pt-8 border-t border-dashed border-slate-200">
                <div>
                    <div className="w-36 mx-auto border-b border-slate-300 h-10"></div>
                    <p className="text-xs text-muted-foreground font-medium mt-2">Loaded By (Storekeeper)</p>
                </div>
                <div>
                    <div className="w-36 mx-auto border-b border-slate-300 h-10"></div>
                    <p className="text-xs text-muted-foreground font-medium mt-2">Received By (Driver/Rep)</p>
                </div>
                <div>
                    <div className="w-36 mx-auto border-b border-slate-300 h-10"></div>
                    <p className="text-xs text-muted-foreground font-medium mt-2">Authorized Signature</p>
                </div>
            </div>
        </PrintLayout>
    );
}
