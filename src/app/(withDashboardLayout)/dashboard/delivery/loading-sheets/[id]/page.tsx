'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Printer } from 'lucide-react';
import { useGetLoadingSheetByIdQuery, useGetDeliveryMenQuery, useGetDistributorProductsQuery } from '@/components/Redux/RTK/distributorApiNode';

const formatCurrency = (val: number) => `৳${val.toFixed(2)}`;

export default function LoadingSheetDetailPage() {
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

    // Calculate total weight of loaded items based on specs in inventory
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
                <Button onClick={() => router.push('/dashboard/delivery/loading-sheets')}>Back to List</Button>
            </div>
        );
    }

    const totalQuantity = sheet.items.reduce((s: number, i: any) => s + i.quantity, 0);
    const totalCostValue = sheet.items.reduce((s: number, i: any) => s + i.quantity * i.purchasePrice, 0);
    const totalSalesValue = sheet.items.reduce((s: number, i: any) => s + i.quantity * i.sellingPrice, 0);
    const expectedProfit = Math.max(0, totalSalesValue - totalCostValue);

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/delivery/loading-sheets')} className="bg-transparent gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Loading Sheet Details</h1>
                        <p className="mt-1 text-muted-foreground">Detailed overview of stock loaded for representative</p>
                    </div>
                </div>

                <Button onClick={() => router.push(`/print-loading-sheet/${sheet.id}`)} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Printer className="h-4 w-4" /> Print Challan
                </Button>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* General Info */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold uppercase text-slate-500">General Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Invoice No:</strong> <span className="font-mono font-semibold text-indigo-600">{sheet.invoiceNo || sheet.id.slice(-8).toUpperCase()}</span></p>
                        <p><strong>Date Loaded:</strong> {sheet.date}</p>
                        <p><strong>Assigned Route:</strong> {sheet.route || 'Not assigned'}</p>
                        <p><strong>Total Weight:</strong> {totalWeightText}</p>
                        <p className="flex items-center gap-2">
                            <strong>Status:</strong>
                            <Badge variant={sheet.status === 'settled' ? 'secondary' : 'default'}>
                                {sheet.status}
                            </Badge>
                        </p>
                    </CardContent>
                </Card>

                {/* Delivery Representative */}
                <Card className="">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold uppercase text-slate-500">Representative Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-4 items-center text-sm">
                        {deliveryManInfo?.profile && (
                            <img
                                src={deliveryManInfo.profile}
                                alt={sheet.deliveryManName}
                                className="h-14 w-14 rounded-full border object-cover"
                            />
                        )}
                        <div className="space-y-1">
                            <p><strong>Name:</strong> {sheet.deliveryManName}</p>
                            {deliveryManInfo && (
                                <>
                                    <p><strong>Phone:</strong> {deliveryManInfo.phone}</p>
                                    <p><strong>NID:</strong> {deliveryManInfo.nid}</p>
                                    <p><strong>Address:</strong> {deliveryManInfo.address}</p>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Loaded Products Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Loaded Products</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product Name</TableHead>
                                <TableHead className="text-center">Cost/Piece</TableHead>
                                <TableHead className="text-center">Selling/Piece</TableHead>
                                <TableHead className="text-center">Loaded Qty (pcs)</TableHead>
                                <TableHead className="text-right">Total Cost Value</TableHead>
                                <TableHead className="text-right">Expected Sales</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sheet.items.map((item: any) => (
                                <TableRow key={item.productId}>
                                    <TableCell className="font-semibold text-slate-800">{item.productName}</TableCell>
                                    <TableCell className="text-center">{formatCurrency(item.purchasePrice)}</TableCell>
                                    <TableCell className="text-center">{formatCurrency(item.sellingPrice)}</TableCell>
                                    <TableCell className="text-center font-bold">{item.quantity} pcs</TableCell>
                                    <TableCell className="text-right font-medium">{formatCurrency(item.quantity * item.purchasePrice)}</TableCell>
                                    <TableCell className="text-right font-bold text-indigo-600">{formatCurrency(item.quantity * item.sellingPrice)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Summary Boxes */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-4">
                        <h3 className="font-bold text-lg text-slate-800">Total Loading Summary</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Product Types</p>
                                <p className="text-xl font-bold text-slate-800 mt-1">{sheet.items.length} types</p>
                            </div>
                            <div className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Total Loaded Pieces</p>
                                <p className="text-xl font-bold text-slate-800 mt-1">{totalQuantity} pcs</p>
                            </div>
                            <div className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Total Cost Value</p>
                                <p className="text-xl font-bold text-slate-800 mt-1">{formatCurrency(totalCostValue)}</p>
                            </div>
                            <div className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Expected Sales Value</p>
                                <p className="text-xl font-bold text-indigo-600 mt-1">{formatCurrency(totalSalesValue)}</p>
                            </div>
                            <div className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm col-span-2 md:col-span-1">
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Expected Profit Margin</p>
                                <p className="text-xl font-bold text-green-600 mt-1">{formatCurrency(expectedProfit)}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
