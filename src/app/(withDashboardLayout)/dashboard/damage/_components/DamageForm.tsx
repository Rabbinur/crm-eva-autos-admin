"use client";

import { AlertTriangle, ChevronLeft, Package, Save, Plus, Trash2, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useGetDistributorProductsQuery, useCreateDamageRecordMutation } from "@/components/Redux/RTK/distributorApiNode";
import { toast } from "sonner";

interface DamageFormProps {
    type: "add" | "edit";
    initialData?: any;
}

interface SelectedItem {
    productId: string;
    productName: string;
    batchId: string;
    cartonPackets: number;
    availableStock: number;
    purchasePrice: number;
    boxQty: string;
    singleQty: string;
    totalQty: number;
    subtotal: number;
}

export const DamageForm = ({ type, initialData }: DamageFormProps) => {
    const router = useRouter();
    const { data: products = [], isLoading: isLoadingProducts } = useGetDistributorProductsQuery();
    const [createDamage, { isLoading: isSaving }] = useCreateDamageRecordMutation();

    const [damageDate, setDamageDate] = useState(new Date().toISOString().slice(0, 10));
    const [sourceType, setSourceType] = useState<"Warehouse" | "Expired" | "Supplier Return" | "Customer Return">("Warehouse");
    const [damageReason, setDamageReason] = useState("");

    // Selected Items List
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

    // Product & Batch Dropdown Selections
    const [currentProductId, setCurrentProductId] = useState("");
    const [currentBatchId, setCurrentBatchId] = useState("");

    // Memos for currently selected product & batch
    const currentProduct = useMemo(() => {
        return products.find((p: any) => p.id === currentProductId);
    }, [products, currentProductId]);

    const currentProductBatches = useMemo(() => {
        return currentProduct?.batches || [];
    }, [currentProduct]);

    const currentBatch = useMemo(() => {
        return currentProductBatches.find((b: any) => b.batch_id === currentBatchId || b.id === currentBatchId);
    }, [currentProductBatches, currentBatchId]);

    const handleAddItem = () => {
        if (!currentProduct) {
            toast.error("Please select a product first");
            return;
        }
        if (!currentBatch) {
            toast.error("Please select a batch first");
            return;
        }

        // Check if item-batch combination is already added
        const isAlreadyAdded = selectedItems.some(
            (item) => item.productId === currentProduct.id && item.batchId === currentBatch.batch_id
        );
        if (isAlreadyAdded) {
            toast.error("This product batch is already in the list");
            return;
        }

        const cartonPackets = currentProduct.carton_packets || 1;
        const purchasePricePerPiece = Number(currentBatch.purchase_rate_carton) / cartonPackets;
        const availableStock = Number(currentBatch.packs_added) || 0;

        if (availableStock <= 0) {
            toast.error("Selected batch has no available stock left");
            return;
        }

        const newItem: SelectedItem = {
            productId: currentProduct.id,
            productName: currentProduct.name,
            batchId: currentBatch.batch_id,
            cartonPackets,
            availableStock,
            purchasePrice: purchasePricePerPiece,
            boxQty: "",
            singleQty: "",
            totalQty: 0,
            subtotal: 0,
        };

        setSelectedItems((prev) => [...prev, newItem]);
        setCurrentBatchId("");
    };

    const handleRemoveItem = (index: number) => {
        setSelectedItems((prev) => prev.filter((_, i) => i !== index));
    };

    const handleQtyChange = (index: number, field: "boxQty" | "singleQty", val: string) => {
        setSelectedItems((prev) =>
            prev.map((item, idx) => {
                if (idx !== index) return item;

                const updated = { ...item, [field]: val };
                const boxCount = parseInt(updated.boxQty, 10) || 0;
                const singleCount = parseInt(updated.singleQty, 10) || 0;
                const calculatedTotal = boxCount * updated.cartonPackets + singleCount;

                if (calculatedTotal > item.availableStock) {
                    toast.error(`Stock limit breached. Available in this batch: ${item.availableStock} pieces.`);
                    // Cap it
                    if (field === "boxQty") {
                        const maxBoxes = Math.floor(item.availableStock / item.cartonPackets);
                        updated.boxQty = maxBoxes.toString();
                        updated.singleQty = (item.availableStock % item.cartonPackets).toString();
                    } else {
                        updated.singleQty = (item.availableStock - (parseInt(updated.boxQty, 10) || 0) * item.cartonPackets).toString();
                    }
                    
                    const finalBox = parseInt(updated.boxQty, 10) || 0;
                    const finalSingle = parseInt(updated.singleQty, 10) || 0;
                    const finalTotal = finalBox * updated.cartonPackets + finalSingle;
                    updated.totalQty = finalTotal;
                    updated.subtotal = finalTotal * updated.purchasePrice;
                } else {
                    updated.totalQty = calculatedTotal;
                    updated.subtotal = calculatedTotal * updated.purchasePrice;
                }

                return updated;
            })
        );
    };

    const grandTotals = useMemo(() => {
        return selectedItems.reduce(
            (acc, item) => {
                acc.totalQty += item.totalQty;
                acc.totalLoss += item.subtotal;
                return acc;
            },
            { totalQty: 0, totalLoss: 0 }
        );
    }, [selectedItems]);

    const handleSaveRecord = async () => {
        if (selectedItems.length === 0) {
            toast.error("Please add at least one damaged product batch");
            return;
        }

        const validItems = selectedItems.filter(item => item.totalQty > 0);
        if (validItems.length === 0) {
            toast.error("Please enter a valid quantity for the items");
            return;
        }

        try {
            await createDamage({
                source_type: sourceType,
                damage_date: damageDate,
                damage_reason: damageReason || `${sourceType} Damage`,
                items: validItems.map(item => ({
                    productId: item.productId,
                    productName: item.productName,
                    batchId: item.batchId,
                    qty: item.totalQty,
                    purchasePrice: item.purchasePrice,
                })),
            }).unwrap();

            toast.success("Damage write-off record logged successfully!");
            router.push("/dashboard/damage/damage-list");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to save damage record");
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-8 font-sans bg-[#f4f7fe] min-h-screen">
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600 border border-rose-100">
                        <Package size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800">
                            {type === "add" ? "Create Damage Product Log" : "Edit Damage Product Log"}
                        </h1>
                        <p className="text-[12px] text-slate-400 font-medium italic">Stock adjustment record</p>
                        <p className="text-[12px] text-rose-500 font-semibold italic">Warning: Approved entries deduct inventory from physical warehouse batches.</p>
                    </div>
                </div>
                <Link href="/dashboard/damage/damage-list" className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-md">
                    <ChevronLeft size={16} strokeWidth={3} /> Back
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                <div className="p-6 md:p-8 space-y-8">
                    {/* Source and General Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-bold text-slate-700 ml-1">Damage Date <span className="text-rose-500">*</span></label>
                            <input
                                type="date"
                                value={damageDate}
                                onChange={(e) => setDamageDate(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-50 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[13px] font-bold text-slate-700 ml-1">Damage Source / Type <span className="text-rose-500">*</span></label>
                            <select
                                value={sourceType}
                                onChange={(e: any) => setSourceType(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold text-sm outline-none focus:border-rose-400 transition-all"
                            >
                                <option value="Warehouse">Warehouse Damage</option>
                                <option value="Expired">Expired Products</option>
                                <option value="Supplier Return">Supplier Return Damage</option>
                                <option value="Customer Return">Customer Return Damage</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[13px] font-bold text-slate-700 ml-1">Reason / Explanation</label>
                            <input
                                type="text"
                                placeholder="E.g., Rats, Leaked packet, expired on shelf"
                                value={damageReason}
                                onChange={(e) => setDamageReason(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-50 transition-all"
                            />
                        </div>
                    </div>

                    {/* Selector Area */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                        <h3 className="text-sm font-bold text-slate-700">Add Product Batch to Write-off</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            {/* Product Select */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-500 uppercase">Product</label>
                                <select
                                    value={currentProductId}
                                    onChange={(e) => {
                                        setCurrentProductId(e.target.value);
                                        setCurrentBatchId("");
                                    }}
                                    className="w-full px-3 py-2 bg-white border border-slate-250 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-rose-400"
                                >
                                    <option value="">Select Product</option>
                                    {products.map((p: any) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Batch Select */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-500 uppercase">Batch Code</label>
                                <select
                                    value={currentBatchId}
                                    onChange={(e) => setCurrentBatchId(e.target.value)}
                                    disabled={!currentProductId}
                                    className="w-full px-3 py-2 bg-white border border-slate-250 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-rose-400 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">Select Batch</option>
                                    {currentProductBatches.map((b: any) => (
                                        <option key={b.batch_id} value={b.batch_id}>
                                            {b.batch_id} ({b.packs_added} pcs available)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Add Item Button */}
                            <button
                                type="button"
                                onClick={handleAddItem}
                                className="flex items-center justify-center gap-2 bg-[#001f3f] hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 w-full md:w-fit"
                            >
                                <Plus size={14} /> Add to List
                            </button>
                        </div>
                    </div>

                    {/* Selected Items Table */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-[12px] font-bold text-slate-600">
                                    <th className="px-4 py-3.5">Product</th>
                                    <th className="px-3 py-3.5 text-center">Batch</th>
                                    <th className="px-3 py-3.5 text-center">Ctn Packets</th>
                                    <th className="px-3 py-3.5 text-center bg-rose-50/50 text-rose-600 border-x border-rose-100">Stock (Pcs)</th>
                                    <th className="px-3 py-3.5 text-center">Cost/Pc</th>
                                    <th className="px-3 py-3.5 text-center w-24">Ctn Qty</th>
                                    <th className="px-3 py-3.5 text-center w-24">Single Qty</th>
                                    <th className="px-3 py-3.5 text-center text-slate-800">Total Qty (Pcs)</th>
                                    <th className="px-3 py-3.5 text-center text-slate-800 font-bold">Subtotal Loss</th>
                                    <th className="px-4 py-3.5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {selectedItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="px-4 py-10 text-center text-slate-400 italic text-xs">
                                            No products added yet. Select a product and batch above to add.
                                        </td>
                                    </tr>
                                ) : (
                                    selectedItems.map((item, index) => (
                                        <tr key={index} className="text-[13px] font-medium text-slate-700 hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-4 font-bold text-slate-800">{item.productName}</td>
                                            <td className="px-3 py-4 text-center text-slate-500 font-bold">{item.batchId}</td>
                                            <td className="px-3 py-4 text-center text-slate-500">{item.cartonPackets}</td>
                                            <td className="px-3 py-4 text-center font-bold text-rose-600 bg-rose-50/20">{item.availableStock}</td>
                                            <td className="px-3 py-4 text-center">৳{item.purchasePrice.toFixed(2)}</td>
                                            <td className="px-3 py-4">
                                                <input 
                                                    type="number" 
                                                    min={0}
                                                    placeholder="0" 
                                                    value={item.boxQty}
                                                    onChange={(e) => handleQtyChange(index, "boxQty", e.target.value)}
                                                    className="w-16 mx-auto block border border-slate-200 rounded py-1 text-center font-bold text-slate-800 outline-none focus:border-rose-400" 
                                                />
                                            </td>
                                            <td className="px-3 py-4">
                                                <input 
                                                    type="number" 
                                                    min={0}
                                                    placeholder="0" 
                                                    value={item.singleQty}
                                                    onChange={(e) => handleQtyChange(index, "singleQty", e.target.value)}
                                                    className="w-16 mx-auto block border border-slate-200 rounded py-1 text-center font-bold text-slate-800 outline-none focus:border-rose-400" 
                                                />
                                            </td>
                                            <td className="px-3 py-4 text-center font-bold text-slate-900">{item.totalQty}</td>
                                            <td className="px-3 py-4 text-center font-black text-rose-600">৳{item.subtotal.toFixed(2)}</td>
                                            <td className="px-4 py-4 text-right">
                                                <button 
                                                    onClick={() => handleRemoveItem(index)}
                                                    className="text-slate-350 hover:text-red-500 p-1.5 rounded-md transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}

                                {/* Footer Total Summary */}
                                <tr className="bg-[#001f3f] text-white">
                                    <td colSpan={7} className="px-4 py-3 text-[11px] font-black uppercase tracking-widest">Grand Total</td>
                                    <td className="px-3 py-3 text-center font-bold text-rose-300">{grandTotals.totalQty} pcs</td>
                                    <td className="px-3 py-3 text-center font-black text-emerald-400">৳{grandTotals.totalLoss.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => setSelectedItems([])} className="text-white hover:text-red-400 transition-colors opacity-75">
                                            <X size={14} className="ml-auto" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Action Footer */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-2 text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                            <AlertTriangle size={14} />
                            <span className="text-[11px] font-bold uppercase tracking-tight">Requires Managerial Approval to adjustment</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => router.push("/dashboard/damage/damage-list")}
                                disabled={isSaving}
                                className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-all uppercase tracking-wider disabled:opacity-50"
                            >
                                Discard
                            </button>
                            <button 
                                onClick={handleSaveRecord}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-10 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-100 transition-all active:scale-95 uppercase tracking-widest disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="animate-spin" size={16} /> Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} /> Save Record
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};