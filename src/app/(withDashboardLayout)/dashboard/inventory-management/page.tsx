//@ts-nocheck
'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { useGetDistributorProductsQuery } from '@/components/Redux/RTK/distributorApiNode';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatShortDate } from '@/lib/utils';
import { ChevronDown, ChevronUp, Edit, Eye } from 'lucide-react';
import { formatCurrency } from './types';



export default function InventoryPage() {
    const router = useRouter();
    const [openBatches, setOpenBatches] = useState<Record<string, boolean>>({});
    const { data: products = [], isLoading } = useGetDistributorProductsQuery();

    const toggleBatches = (id: string) =>
        setOpenBatches((prev) => ({ ...prev, [id]: !prev[id] }));

    return (
        <div className="space-y-6 p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">Product List</h1>
                <Button
                    onClick={() => router.push('/dashboard/inventory-management/add')}
                    className="gap-2"
                >
                    + Add Product
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className='text-nowrap '>
                                <TableHead>Product</TableHead>
                                <TableHead>Company Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Weight</TableHead>
                                <TableHead>Total Pieces</TableHead>
                                <TableHead>Piece Price</TableHead>
                                <TableHead>Purchase / Ctn</TableHead>
                                <TableHead>Selling / Ctn</TableHead>
                                <TableHead>Stock Value</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Batches</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={12} className="text-center py-8 text-black">
                                        Loading inventory products...
                                    </TableCell>
                                </TableRow>
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={12} className="text-center py-8 text-black">
                                        No products found. Add a product to get started.
                                    </TableCell>
                                </TableRow>
                            ) : products.map((product) => {
                                const totalStock = product.total_stock; // from JSON
                                const stockValue = product.total_stock_value; // from JSON
                                const lowStock = totalStock <= product.lowStockThreshold;

                                const latestBatch =
                                    product.batches.length > 0
                                        ? product.batches[product.batches.length - 1]
                                        : null;

                                return (
                                    <React.Fragment key={product.id}>
                                        <TableRow>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>{product.company_name}</TableCell>
                                            <TableCell>{product.category_name}</TableCell>
                                            <TableCell>{product.weight}{product.unit ? ` ${product.unit}` : ''}</TableCell>

                                            <TableCell>{totalStock}</TableCell>

                                            {/* Latest batch prices */}
                                            <TableCell>
                                                {latestBatch ? `৳${latestBatch.pack_price.toFixed(2)}` : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {latestBatch ? `৳${latestBatch.purchase_rate_carton.toFixed(2)}` : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {latestBatch ? `৳${latestBatch.selling_rate_carton.toFixed(2)}` : '-'}
                                            </TableCell>

                                            <TableCell>{formatCurrency(stockValue)}</TableCell>

                                            <TableCell>
                                                {lowStock ? (
                                                    <Badge variant="destructive">Low</Badge>
                                                ) : (
                                                    <Badge variant="secondary">OK</Badge>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => toggleBatches(product.id)}
                                                >
                                                    {openBatches[product.id] ? <ChevronUp /> : <ChevronDown />}
                                                </Button>
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        router.push(`/dashboard/inventory-management/${product.id}`)
                                                    }
                                                >
                                                    <Eye />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        router.push(
                                                            `/dashboard/inventory-management/${product.id}/edit`
                                                        )
                                                    }
                                                >
                                                    <Edit />
                                                </Button>
                                            </TableCell>
                                        </TableRow>

                                        {/* Batch dropdown mapping all batches */}
                                        {openBatches[product.id] && (
                                            <TableRow>
                                                <TableCell colSpan={12} className="bg-slate-50 py-4 px-6 border-y">
                                                    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
                                                        <Table>
                                                            <TableHeader className="bg-slate-50/80">
                                                                <TableRow className="hover:bg-slate-50 border-b">
                                                                    <TableHead className="text-xs font-bold text-slate-500 py-2">Batch ID</TableHead>
                                                                    <TableHead className="text-xs font-bold text-slate-500">Date Added</TableHead>
                                                                    <TableHead className="text-xs font-bold text-slate-500 text-right">Available (Pcs)</TableHead>
                                                                    <TableHead className="text-xs font-bold text-slate-500 text-right">In Transit (Pcs)</TableHead>
                                                                    <TableHead className="text-xs font-bold text-slate-500 text-right">Pack Price</TableHead>
                                                                    <TableHead className="text-xs font-bold text-slate-500 text-right">Purchase / Ctn</TableHead>
                                                                    <TableHead className="text-xs font-bold text-slate-500 text-right">Wholesale / Ctn</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {product.batches.map((batch: any, bIdx: number) => (
                                                                    <TableRow key={batch.id || bIdx} className="hover:bg-[#001f3f]/5 border-slate-100">
                                                                        <TableCell className="font-mono text-xs text-[#001f3f] font-semibold py-2">
                                                                            {batch.batch_id || (batch.id ? (batch.id.startsWith("BAT-") ? batch.id : `#${batch.id.slice(-8).toUpperCase()}`) : `B${bIdx + 1}`)}
                                                                        </TableCell>
                                                                        <TableCell className="text-xs text-slate-650">
                                                                            {formatShortDate(batch.dateAdded)}
                                                                        </TableCell>
                                                                        <TableCell className="text-xs text-slate-800 text-right font-medium">
                                                                            {batch.packs_added} Pcs
                                                                        </TableCell>
                                                                        <TableCell className="text-xs text-slate-800 text-right font-medium">
                                                                            {batch.hold_qty || 0} Pcs
                                                                        </TableCell>
                                                                        <TableCell className="text-xs text-blue-600 text-right font-semibold">
                                                                            ৳{batch.pack_price.toFixed(2)}
                                                                        </TableCell>
                                                                        <TableCell className="text-xs text-green-600 text-right font-semibold">
                                                                            ৳{batch.purchase_rate_carton.toFixed(2)}
                                                                        </TableCell>
                                                                        <TableCell className="text-xs text-orange-600 text-right font-semibold">
                                                                            ৳{batch.selling_rate_carton.toFixed(2)}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </TableBody>

                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
