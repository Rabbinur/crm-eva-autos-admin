'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { useCreateLoadingSheetMutation, useGetAreasQuery, useGetDeliveryMenQuery, useGetDistributorProductsQuery } from '@/components/Redux/RTK/distributorApiNode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Circle, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { ArrowLeft, Check, Loader2, MapPin, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface LoadingItem {
    productId: string;
    productName: string;
    quantity: number | string;
    purchasePrice: number;
    sellingPrice: number;
    totalStock: number;
}

const formatCurrency = (value: number) => `৳${value.toFixed(2)}`;

const libraries: any[] = ['places'];

export default function CreateLoadingSheetPage() {
    const router = useRouter();
    const { data: deliveryMen = [] } = useGetDeliveryMenQuery();
    const { data: products = [] } = useGetDistributorProductsQuery();
    const { data: areas = [] } = useGetAreasQuery();
    const [createLoadingSheet, { isLoading: isCreating }] = useCreateLoadingSheetMutation();

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries,
    });

    const [selectedDeliveryManId, setSelectedDeliveryManId] = useState('');
    const [route, setRoute] = useState('');

    const selectedArea = useMemo(
        () => areas.find((a: any) => a.name === route),
        [areas, route]
    );
    const [loadingItems, setLoadingItems] = useState<LoadingItem[]>([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState('');

    const selectedDeliveryMan = useMemo(
        () => deliveryMen.find((dm: any) => dm.id === selectedDeliveryManId),
        [deliveryMen, selectedDeliveryManId]
    );

    const currentProduct = useMemo(
        () => products.find((p: any) => p.id === selectedProductId),
        [products, selectedProductId]
    );

    const currentStock = useMemo(
        () => (currentProduct ? (currentProduct.total_stock || 0) : 0),
        [currentProduct]
    );

    // Get prices from the latest batch
    const latestBatch = useMemo(() => {
        if (!currentProduct || !currentProduct.batches || currentProduct.batches.length === 0) return null;
        return currentProduct.batches[currentProduct.batches.length - 1];
    }, [currentProduct]);

    const currentPurchasePrice = useMemo(() => {
        if (!currentProduct || !latestBatch) return 0;
        const cartonPackets = currentProduct.carton_packets || 1;
        return latestBatch.purchase_rate_carton / cartonPackets;
    }, [currentProduct, latestBatch]);

    const currentSellingPrice = useMemo(() => {
        if (!latestBatch) return 0;
        return latestBatch.pack_price; // pack_price is single piece selling price
    }, [latestBatch]);

    const handleAddItem = () => {
        const qty = Number(quantity);

        if (!currentProduct || !qty || qty <= 0) {
            toast.error('Select a product and valid quantity');
            return;
        }

        if (qty > currentStock) {
            toast.error(`Stock limit exceeded (Available ${currentStock} pieces)`);
            return;
        }

        if (loadingItems.some((i) => i.productId === currentProduct.id)) {
            toast.error('Product already added to loading sheet');
            return;
        }

        setLoadingItems((prev) => [
            ...prev,
            {
                productId: currentProduct.id,
                productName: currentProduct.name,
                quantity: qty,
                purchasePrice: currentPurchasePrice,
                sellingPrice: currentSellingPrice,
                totalStock: currentStock,
            },
        ]);

        setSelectedProductId('');
        setQuantity('');
    };

    const handleUpdateQuantity = (productId: string, rawVal: string) => {
        if (rawVal === '') {
            setLoadingItems((prev) =>
                prev.map((item) =>
                    item.productId === productId ? { ...item, quantity: '' } : item
                )
            );
            return;
        }

        const qty = parseInt(rawVal, 10);
        if (isNaN(qty)) return;

        setLoadingItems((prev) =>
            prev.map((item) => {
                if (item.productId !== productId) return item;
                const cappedQty = Math.min(qty, item.totalStock);
                if (qty > item.totalStock) {
                    toast.error(`Stock limit exceeded (Available ${item.totalStock} pieces)`);
                }
                return { ...item, quantity: cappedQty };
            })
        );
    };

    const handleRemoveItem = (productId: string) => {
        setLoadingItems((prev) => prev.filter((i) => i.productId !== productId));
    };

    const handleSubmit = async () => {
        if (!selectedDeliveryMan) {
            toast.error('Select delivery person');
            return;
        }
        if (loadingItems.length === 0) {
            toast.error('Add at least one product to load');
            return;
        }

        try {
            await createLoadingSheet({
                date: new Date().toISOString().slice(0, 10),
                deliveryManName: selectedDeliveryMan.name,
                deliveryManId: selectedDeliveryMan.id,
                route: route || undefined,
                items: loadingItems.map((item) => ({
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity === '' ? 0 : Number(item.quantity),
                    purchasePrice: item.purchasePrice,
                    sellingPrice: item.sellingPrice,
                })),
            }).unwrap();

            toast.success(`Loading Sheet created for ${selectedDeliveryMan.name}`);
            router.push('/dashboard/delivery/loading-sheets');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to create loading sheet');
        }
    };

    const totalQuantity = loadingItems.reduce((s, i) => s + (i.quantity === '' ? 0 : Number(i.quantity)), 0);
    const totalValue = loadingItems.reduce((s, i) => s + (i.quantity === '' ? 0 : Number(i.quantity)) * i.purchasePrice, 0);

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/delivery/loading-sheets')} className="bg-transparent">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Create Loading Sheet</h1>
                    <p className="text-muted-foreground">Warehouse → Delivery transfer (piece based)</p>
                </div>
            </div>

            {/* Step 1: Select Delivery Person & Route */}
            <Card>
                <CardHeader>
                    <CardTitle>Step 1: Select Delivery Person & Route</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6 items-stretch">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <div>
                            <Label>Delivery Person</Label>
                            <Select value={selectedDeliveryManId} onValueChange={setSelectedDeliveryManId}>
                                <SelectTrigger className="mt-1.5">
                                    <SelectValue placeholder="Select delivery person" />
                                </SelectTrigger>
                                <SelectContent>
                                    {deliveryMen
                                        .filter((dm: any) => dm.status === 'active')
                                        .map((dm: any) => (
                                            <SelectItem key={dm.id} value={dm.id}>
                                                {dm.name} — {dm.phone}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Assigned Area / Route</Label>
                            <Select value={route} onValueChange={setRoute}>
                                <SelectTrigger className="mt-1.5">
                                    <SelectValue placeholder="Select area" />
                                </SelectTrigger>
                                <SelectContent>
                                    {areas
                                        .filter((a: any) => a.status === 'Active')
                                        .map((a: any) => (
                                            <SelectItem key={a.id} value={a.name}>
                                                {a.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {(selectedDeliveryMan || selectedArea) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6 w-full">
                            {/* Delivery Man Details */}
                            {selectedDeliveryMan ? (
                                <div className="flex gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-xs">
                                    {selectedDeliveryMan.profile ? (
                                        <img
                                            src={selectedDeliveryMan.profile}
                                            alt={selectedDeliveryMan.name}
                                            className="h-14 w-14 rounded-full border object-cover shrink-0"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base border border-primary/20 shrink-0 uppercase">
                                            {selectedDeliveryMan.name.slice(0, 2)}
                                        </div>
                                    )}
                                    <div className="space-y-0.5 text-xs min-w-0">
                                        <h4 className="font-bold text-slate-800 text-sm mb-1">Delivery Representative</h4>
                                        <p className="truncate text-slate-600"><strong>Name:</strong> {selectedDeliveryMan.name}</p>
                                        <p className="truncate text-slate-600"><strong>Phone:</strong> {selectedDeliveryMan.phone}</p>
                                        <p className="truncate text-slate-600"><strong>NID:</strong> {selectedDeliveryMan.nid}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center bg-slate-50/50 p-4 rounded-xl border border-dashed text-xs text-slate-400">
                                    Select a delivery representative to view details
                                </div>
                            )}

                            {/* Area Details */}
                            {selectedArea ? (
                                <div className="flex flex-col bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-xs gap-4">
                                    <div className="space-y-0.5">
                                        <h4 className="font-bold text-slate-800 text-sm mb-1">Route / Area Details</h4>
                                        <p className="text-xs text-slate-700"><strong>Name:</strong> {selectedArea.name}</p>
                                        {selectedArea.note ? (
                                            <p className="text-xs text-slate-600 mt-1 italic leading-relaxed">
                                                <strong>Note:</strong> {selectedArea.note}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-slate-400 mt-1 italic">No special instructions/notes</p>
                                        )}
                                    </div>

                                    {/* Google Map */}
                                    <div className="w-full h-[180px] rounded-xl overflow-hidden border border-slate-200">
                                        {isLoaded ? (
                                            <GoogleMap
                                                mapContainerClassName="w-full h-full"
                                                center={{
                                                    lat: selectedArea.latitude || 24.9197,
                                                    lng: selectedArea.longitude || 89.9481,
                                                }}
                                                zoom={selectedArea.zoom || 12}
                                                options={{
                                                    disableDefaultUI: true,
                                                    zoomControl: true,
                                                }}
                                            >
                                                <Marker
                                                    position={{
                                                        lat: selectedArea.latitude || 24.9197,
                                                        lng: selectedArea.longitude || 89.9481,
                                                    }}
                                                />
                                                <Circle
                                                    center={{
                                                        lat: selectedArea.latitude || 24.9197,
                                                        lng: selectedArea.longitude || 89.9481,
                                                    }}
                                                    radius={(selectedArea.coverage_radius || 5) * 1000}
                                                    options={{
                                                        fillColor: '#2563eb',
                                                        fillOpacity: 0.15,
                                                        strokeColor: '#2563eb',
                                                        strokeOpacity: 0.8,
                                                        strokeWeight: 2,
                                                    }}
                                                />
                                            </GoogleMap>
                                        ) : loadError ? (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-xs text-slate-500 bg-slate-50 p-2 text-center">
                                                <MapPin size={24} className="text-slate-300 mb-1" />
                                                <span className="font-semibold">Map Unavailable</span>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 bg-slate-100">
                                                Loading map...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center bg-slate-50/50 p-4 rounded-xl border border-dashed text-xs text-slate-400">
                                    Select an area/route to view details
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Step 2: Add Products */}
            <Card>
                <CardHeader>
                    <CardTitle>Step 2: Add Products</CardTitle>
                </CardHeader>
                <CardContent className="grid lg:grid-cols-5 gap-4">
                    <div className="lg:col-span-2">
                        <Label>Product</Label>
                        <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                                {products
                                    .filter((p: any) => (p.total_stock || 0) > 0 && !loadingItems.some((i) => i.productId === p.id))
                                    .map((p: any) => (
                                        <SelectItem key={p.id} value={p.id}>
                                            {p.name} ({p.total_stock} pcs available)
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Available (Pieces)</Label>
                        <div className="h-10 px-3 flex items-center border rounded-md bg-muted/20">{currentStock}</div>
                    </div>

                    <div>
                        <Label>Cost / Piece</Label>
                        <div className="h-10 px-3 flex items-center border rounded-md bg-muted/20">
                            {formatCurrency(currentPurchasePrice)}
                        </div>
                    </div>

                    <div>
                        <Label>Quantity</Label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                min={1}
                                max={currentStock}
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="Qty"
                            />
                            <Button onClick={handleAddItem}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Step 3: Review Items */}
            {loadingItems.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Step 3: Review Loading Sheet</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">Cost/Piece</TableHead>
                                    <TableHead className="text-right">Selling/Piece</TableHead>
                                    <TableHead className="text-right">Quantity (Pcs)</TableHead>
                                    <TableHead className="text-right">Total Cost</TableHead>
                                    <TableHead />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loadingItems.map((item) => (
                                    <TableRow key={item.productId}>
                                        <TableCell className="font-medium">{item.productName}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(item.purchasePrice)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(item.sellingPrice)}</TableCell>
                                        <TableCell className="text-right w-28">
                                            <Input
                                                type="number"
                                                min={1}
                                                max={item.totalStock}
                                                value={item.quantity}
                                                onChange={(e) => handleUpdateQuantity(item.productId, e.target.value)}
                                                className="h-8 text-right"
                                            />
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            {formatCurrency((item.quantity === '' ? 0 : Number(item.quantity)) * item.purchasePrice)}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(item.productId)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="mt-4 flex justify-end gap-10">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Loaded Pieces</p>
                                <p className="text-2xl font-bold text-right">{totalQuantity}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Cost Value</p>
                                <p className="text-2xl font-bold text-right text-primary">{formatCurrency(totalValue)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => router.push('/dashboard/delivery/loading-sheets')} disabled={isCreating}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isCreating}>
                    {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Check className="h-4 w-4 mr-1" />
                    Create Loading Sheet
                </Button>
            </div>
        </div>
    );
}
