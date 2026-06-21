'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState, useEffect, Suspense } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { useGetLoadingSheetsQuery, useCreateSettlementMutation, useUpdateLoadingSheetMutation } from '@/components/Redux/RTK/distributorApiNode';
import { toast } from 'sonner';

// Helper to format currency
const formatCurrency = (amount: number) => `৳${amount.toFixed(2)}`;

function SettlementForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const querySheetId = searchParams.get('sheetId') || '';

    const { data: loadingSheets = [] } = useGetLoadingSheetsQuery();
    const [createSettlement] = useCreateSettlementMutation();
    const [updateLoadingSheet] = useUpdateLoadingSheetMutation();

    const [selectedLoadingSheetId, setSelectedLoadingSheetId] = useState(querySheetId);
    
    const [submitting, setSubmitting] = useState(false);
    
    // Key: productId, Value: { returned: string | number, damaged: string | number }
    const [quantities, setQuantities] = useState<Record<string, { returned: string | number; damaged: string | number }>>({});

    const pendingSheets = useMemo(() => {
        return loadingSheets.filter((s: any) => s.status === 'loaded');
    }, [loadingSheets]);

    const activeSheet = useMemo(() => {
        return loadingSheets.find((s: any) => s.id === selectedLoadingSheetId);
    }, [loadingSheets, selectedLoadingSheetId]);

    // Update quantities map when active sheet changes
    useEffect(() => {
        if (activeSheet) {
            const initialMap: Record<string, { returned: string | number; damaged: string | number }> = {};
            activeSheet.items.forEach((item: any) => {
                initialMap[item.productId] = { returned: '', damaged: '' };
            });
            setQuantities(initialMap);
        } else {
            setQuantities({});
        }
    }, [activeSheet]);

    // Automatically select query sheet ID when sheets load
    useEffect(() => {
        if (querySheetId) {
            setSelectedLoadingSheetId(querySheetId);
        }
    }, [querySheetId]);

    const handleQuantityChange = (productId: string, field: 'returned' | 'damaged', rawValue: string) => {
        if (!activeSheet) return;
        const item = activeSheet.items.find((i: any) => i.productId === productId);
        if (!item) return;

        if (rawValue === '') {
            setQuantities((prev) => {
                const current = prev[productId] || { returned: '', damaged: '' };
                return { ...prev, [productId]: { ...current, [field]: '' } };
            });
            return;
        }

        const numericVal = parseInt(rawValue, 10);
        if (isNaN(numericVal)) return;

        const val = Math.max(0, numericVal);
        
        setQuantities((prev) => {
            const current = prev[productId] || { returned: '', damaged: '' };
            const otherField = field === 'returned' ? 'damaged' : 'returned';
            const otherVal = current[otherField] === '' ? 0 : Number(current[otherField] || 0);

            const updated = { ...current, [field]: val };
            
            // Validate: sum cannot exceed loaded quantity
            if (val + otherVal > item.quantity) {
                toast.error(`Return + Damage quantity cannot exceed loaded quantity (${item.quantity} pieces)`);
                updated[field] = item.quantity - otherVal;
            }
            return { ...prev, [productId]: updated };
        });
    };

    // Calculate totals for rendering and submit
    const computedItems = useMemo(() => {
        if (!activeSheet) return [];
        return activeSheet.items.map((item: any) => {
            const q = quantities[item.productId] || { returned: '', damaged: '' };
            const returnedQtyNumeric = q.returned === '' ? 0 : Number(q.returned || 0);
            const damagedQtyNumeric = q.damaged === '' ? 0 : Number(q.damaged || 0);

            const soldQuantity = Math.max(0, item.quantity - returnedQtyNumeric - damagedQtyNumeric);
            const totalSales = soldQuantity * item.sellingPrice;
            const profit = soldQuantity * (item.sellingPrice - item.purchasePrice);
            const loss = damagedQtyNumeric * item.purchasePrice;

            return {
                ...item,
                returnedQuantity: q.returned,
                damagedQuantity: q.damaged,
                returnedQtyNumeric,
                damagedQtyNumeric,
                soldQuantity,
                totalSales,
                profit,
                loss,
            };
        });
    }, [activeSheet, quantities]);

    const totals = useMemo(() => {
        return computedItems.reduce(
            (acc: any, item: any) => {
                acc.loaded += item.quantity;
                acc.returned += item.returnedQtyNumeric;
                acc.damaged += item.damagedQtyNumeric;
                acc.sold += item.soldQuantity;
                acc.sales += item.totalSales;
                acc.profit += item.profit;
                acc.loss += item.loss;
                return acc;
            },
            { loaded: 0, returned: 0, damaged: 0, sold: 0, sales: 0, profit: 0, loss: 0 }
        );
    }, [computedItems]);

    const handleSubmit = async () => {
        if (!activeSheet) {
            toast.error('Please select a loading sheet first.');
            return;
        }

        setSubmitting(true);
        try {
            // Add Settlement record
            await createSettlement({
                date: new Date().toISOString().slice(0, 10),
                deliveryManName: activeSheet.deliveryManName,
                deliveryManId: activeSheet.deliveryManId,
                loadingSheetId: activeSheet.id,
                totalLoaded: totals.loaded,
                totalSold: totals.sold,
                totalReturned: totals.returned,
                totalDamaged: totals.damaged,
                totalSales: totals.sales,
                totalProfit: totals.profit - totals.loss, // Net Profit
                totalLoss: totals.loss,
                items: computedItems.map((item: any) => ({
                    productId: item.productId,
                    productName: item.productName,
                    loadedQuantity: item.quantity,
                    soldQuantity: item.soldQuantity,
                    returnedQuantity: item.returnedQtyNumeric,
                    damagedQuantity: item.damagedQtyNumeric,
                    purchasePrice: item.purchasePrice,
                    sellingPrice: item.sellingPrice,
                })),
            }).unwrap();

            // Mark loading sheet as settled on backend
            await updateLoadingSheet({ id: activeSheet.id, data: { status: 'settled' } }).unwrap();

            toast.success('Settlement created and inventory updated successfully!');
            router.push('/dashboard/delivery/settlements');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to create settlement');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Select Sheet */}
            <Card>
                <CardHeader>
                    <CardTitle>Select Loading Sheet to Settle</CardTitle>
                </CardHeader>
                <CardContent>
                    <Select
                        value={selectedLoadingSheetId}
                        onValueChange={setSelectedLoadingSheetId}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select loading sheet" />
                        </SelectTrigger>
                        <SelectContent>
                            {pendingSheets.map((sheet: any) => (
                                <SelectItem key={sheet.id} value={sheet.id}>
                                    {sheet.invoiceNo || sheet.id.slice(-8).toUpperCase()} — {sheet.deliveryManName} ({sheet.date})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {activeSheet && (
                        <div className="mt-3 flex gap-2">
                            <Badge className="bg-blue-600">Representative: {activeSheet.deliveryManName}</Badge>
                            <Badge className="bg-indigo-600">Date: {activeSheet.date}</Badge>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Items Table */}
            {computedItems.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Settlement Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-center">Loaded (pcs)</TableHead>
                                    <TableHead className="text-center">Selling/Piece</TableHead>
                                    <TableHead className="text-center">Return (pcs)</TableHead>
                                    <TableHead className="text-center">Damage (pcs)</TableHead>
                                    <TableHead className="text-center">Sold (pcs)</TableHead>
                                    <TableHead className="text-right">Total Sales</TableHead>
                                    <TableHead className="text-right">Gross Profit</TableHead>
                                    <TableHead className="text-right">Damage Loss</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {computedItems.map((item: any) => (
                                    <TableRow key={item.productId}>
                                        <TableCell className="font-medium">{item.productName}</TableCell>
                                        <TableCell className="text-center font-semibold bg-muted/10">{item.quantity}</TableCell>
                                        <TableCell className="text-center">{formatCurrency(item.sellingPrice)}</TableCell>
                                        {/* Return pieces input */}
                                        <TableCell className="text-center w-24">
                                            <Input
                                                type="number"
                                                min={0}
                                                value={item.returnedQuantity}
                                                onChange={(e) =>
                                                    handleQuantityChange(
                                                        item.productId,
                                                        'returned',
                                                        e.target.value
                                                    )
                                                }
                                                className="h-8 text-center"
                                            />
                                        </TableCell>

                                        {/* Damage pieces input */}
                                        <TableCell className="text-center w-24">
                                            <Input
                                                type="number"
                                                min={0}
                                                value={item.damagedQuantity}
                                                onChange={(e) =>
                                                    handleQuantityChange(
                                                        item.productId,
                                                        'damaged',
                                                        e.target.value
                                                    )
                                                }
                                                className="h-8 text-center"
                                            />
                                        </TableCell>

                                        {/* Sold quantity auto-calculated */}
                                        <TableCell className="text-center font-bold text-blue-600 bg-blue-50/30">
                                            {item.soldQuantity}
                                        </TableCell>

                                        {/* Total sales */}
                                        <TableCell className="text-right font-medium">
                                            {formatCurrency(item.totalSales)}
                                        </TableCell>

                                        {/* Gross profit */}
                                        <TableCell className="text-right font-semibold text-green-600">
                                            {formatCurrency(item.profit)}
                                        </TableCell>

                                        {/* Loss */}
                                        <TableCell className="text-right font-semibold text-destructive">
                                            {formatCurrency(item.loss)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Summary Section */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-4">
                            <h3 className="font-bold text-lg text-slate-800">Settlement Summary</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Total Sold Pieces</p>
                                    <p className="text-xl font-bold text-blue-600 mt-1">{totals.sold} pcs</p>
                                </div>
                                <div className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Total Sales Value</p>
                                    <p className="text-xl font-bold text-indigo-600 mt-1">{formatCurrency(totals.sales)}</p>
                                </div>
                                <div className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Damage Loss</p>
                                    <p className="text-xl font-bold text-destructive mt-1">{formatCurrency(totals.loss)}</p>
                                </div>
                                <div className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Net Profit/Loss</p>
                                    <p className={`text-xl font-bold mt-1 ${totals.profit - totals.loss >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                                        {formatCurrency(totals.profit - totals.loss)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Action */}
            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => router.push('/dashboard/delivery/settlements')} disabled={submitting}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit} disabled={!activeSheet || submitting}>
                                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    <Check className="h-4 w-4 mr-1" />
                                    Finalize Settlement
                                </Button>
                            </div>
        </div>
    );
}

export default function CreateSettlementPage() {
    const router = useRouter();

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/delivery/settlements')} className="bg-transparent">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Daily Settlement</h1>
                    <p className="text-muted-foreground">
                        Piece-wise sales, profit & loss calculation
                    </p>
                </div>
            </div>

            <Suspense fallback={<div className="text-center py-10">Loading settlement form...</div>}>
                <SettlementForm />
            </Suspense>
        </div>
    );
}
