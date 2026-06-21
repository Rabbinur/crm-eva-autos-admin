'use client';

import { useParams, useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  AlertTriangle, 
  ArrowLeft, 
  Boxes, 
  Building, 
  Calendar, 
  Package, 
  Scale, 
  Tag, 
  TrendingUp, 
  DollarSign, 
  Layers, 
  ShoppingBag, 
  Edit3 
} from 'lucide-react';

import { formatShortDate } from '@/lib/utils';
import { useGetDistributorProductByIdQuery } from '@/components/Redux/RTK/distributorApiNode';
import { type Product, formatCurrency } from '../types';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const { data: product, isLoading } = useGetDistributorProductByIdQuery(productId);

  if (isLoading) {
    return (
      <div className="space-y-6 p-8 flex items-center justify-center py-32">
        <div className="relative flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#001f3f]"></div>
          <p className="text-[#001f3f] font-medium animate-pulse">Loading product dashboard...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-6 p-8 max-w-lg mx-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/dashboard/inventory-management')}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Inventory
        </Button>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-sm animate-fade-in">
          <AlertTriangle className="h-12 w-12 text-rose-500 mb-4 animate-bounce" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Product Not Found</h2>
          <p className="text-slate-500 mb-6 text-sm">
            We couldn't retrieve the details for this product ID. It may have been deleted.
          </p>
        </div>
      </div>
    );
  }

  const totalStock = product.total_stock || 0;
  const totalValue = product.total_stock_value || 0;
  const isLowStock = totalStock <= product.lowStockThreshold;

  const latestBatch =
    product.batches.length > 0
      ? product.batches[product.batches.length - 1]
      : null;

  const batches = product.batches || [];
  const minPurchase = product.minPurchase || 0;
  const maxPurchase = product.maxPurchase || 0;
  const minSelling = product.minSelling || 0;
  const maxSelling = product.maxSelling || 0;
  const weightedAvgPurchase = product.weightedAvgPurchase || 0;
  const weightedAvgSelling = product.weightedAvgSelling || 0;
  const estTotalPurchaseCost = product.estTotalPurchaseCost || 0;
  const estProfit = product.estProfit || 0;
  const profitMarginPercent = product.profitMarginPercent || 0;

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Top action bar & back button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard/inventory-management')}
            className="group flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-all duration-300 hover:scale-105 shadow-sm"
            title="Go Back"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[10px] tracking-widest font-bold text-[#001f3f] px-2 py-0.5 rounded bg-blue-50 border border-blue-100 uppercase">
                Inventory Detail
              </span>
              {isLowStock ? (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-rose-700 px-2 py-0.5 rounded bg-rose-50 border border-rose-100 animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping"></span>
                  Low Stock Warning
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-750 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Stock OK
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1.5 tracking-tight">
              {product.name}
            </h1>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => router.push(`/dashboard/inventory-management/${product.id}/edit`)}
            className="bg-[#001f3f] hover:bg-blue-900 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300 hover:scale-[1.02] border border-blue-800 flex items-center gap-2 shadow-sm"
          >
            <Edit3 className="h-4 w-4" />
            Edit Product
          </Button>
        </div>
      </div>

      {/* Main Stock KPIs Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Total Pieces & Breakdown */}
        <div className="relative overflow-hidden group bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-[#001f3f]/40 hover:shadow-[0_4px_25px_rgba(0,31,63,0.06)] transition-all duration-300 hover:-translate-y-0.5 shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100/50 transition-colors"></div>
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Stock</p>
            <div className="p-2.5 bg-blue-50/50 rounded-xl text-[#001f3f] border border-blue-100">
              <Boxes className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {totalStock} <span className="text-sm font-normal text-slate-500">Available Pcs</span>
            </h3>
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>In Transit: {product.total_hold_stock || 0} Pcs</span>
              <span>Physical Total: {product.total_physical_stock || 0} Pcs</span>
            </div>
            
            <div className="grid grid-cols-3 gap-1 text-center bg-slate-50 p-2.5 rounded-xl border border-slate-100/80">
              <div>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Cartons</p>
                <p className="text-sm font-extrabold text-[#001f3f] mt-0.5">{product.cartons || 0}</p>
              </div>
              {product.has_box_size ? (
                <div className="border-l border-slate-200/60">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Boxes</p>
                  <p className="text-sm font-extrabold text-[#001f3f] mt-0.5">{product.boxes || 0}</p>
                </div>
              ) : null}
              <div className={`border-l border-slate-200/60 ${product.has_box_size ? "" : "col-span-2"}`}>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Pieces</p>
                <p className="text-sm font-extrabold text-[#001f3f] mt-0.5">{product.pieces || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* KPI 2: Latest Purchase Price */}
        <div className="relative overflow-hidden group bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-[#001f3f]/40 hover:shadow-[0_4px_25px_rgba(0,31,63,0.06)] transition-all duration-300 hover:-translate-y-0.5 shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100/50 transition-colors"></div>
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Purchase / Carton</p>
            <div className="p-2.5 bg-blue-50/50 rounded-xl text-[#001f3f] border border-blue-100">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {latestBatch ? formatCurrency(latestBatch.purchase_rate_carton) : '৳0.00'}
            </h3>
            <p className="text-[11px] text-slate-500 mt-2.5 flex items-center gap-1.5 flex-wrap">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              {batches.length > 1 
                ? `Avg: ৳${weightedAvgPurchase.toFixed(2)} | Range: ৳${minPurchase.toFixed(0)}-৳${maxPurchase.toFixed(0)}` 
                : 'Rate applied for most recent batch'}
            </p>
          </div>
        </div>

        {/* KPI 3: Latest Selling Price */}
        <div className="relative overflow-hidden group bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-[#001f3f]/40 hover:shadow-[0_4px_25px_rgba(0,31,63,0.06)] transition-all duration-300 hover:-translate-y-0.5 shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100/50 transition-colors"></div>
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Selling / Carton</p>
            <div className="p-2.5 bg-blue-50/50 rounded-xl text-[#001f3f] border border-blue-100">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {latestBatch ? formatCurrency(latestBatch.selling_rate_carton) : '৳0.00'}
            </h3>
            <p className="text-[11px] text-slate-500 mt-2.5 flex items-center gap-1.5 flex-wrap">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {batches.length > 1 
                ? `Avg: ৳${weightedAvgSelling.toFixed(2)} | Range: ৳${minSelling.toFixed(0)}-৳${maxSelling.toFixed(0)}` 
                : 'Current wholesale selling rate'}
            </p>
          </div>
        </div>

        {/* KPI 4: Total Stock Value */}
        <div className="relative overflow-hidden group bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-[#001f3f]/40 hover:shadow-[0_4px_25px_rgba(0,31,63,0.06)] transition-all duration-300 hover:-translate-y-0.5 shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl group-hover:bg-emerald-100/30 transition-colors"></div>
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Stock Value</p>
            <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-700 border border-emerald-100">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{formatCurrency(totalValue)}</h3>
            <p className="text-[11px] text-slate-500 mt-2.5 flex items-center gap-1.5 flex-wrap">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-650 animate-pulse"></span>
              {totalStock > 0 
                ? `Cost: ৳${estTotalPurchaseCost.toFixed(2)} | Profit: ৳${estProfit.toFixed(2)} (${profitMarginPercent.toFixed(1)}%)`
                : 'Sum of active inventory batches'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: FIFO Stock Batches */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-[#001f3f] animate-pulse" />
                <h3 className="font-bold text-slate-800 text-base">FIFO Stock Batches</h3>
              </div>
              <Badge variant="outline" className="border-blue-200 text-[#001f3f] bg-blue-50/50 font-semibold">
                {product.batches.length} Active {product.batches.length === 1 ? 'Batch' : 'Batches'}
              </Badge>
            </div>
 
            {/* Financial Summary Info Bar */}
            {batches.length > 0 && (
              <div className="mx-6 mt-4 p-4 rounded-xl bg-[#001f3f]/5 border border-[#001f3f]/10 grid grid-cols-3 gap-4 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Est. Revenue (Selling Value)</span>
                  <p className="text-base font-extrabold text-[#001f3f] mt-0.5">{formatCurrency(totalValue)}</p>
                </div>
                <div className="border-l border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Est. Acquisition Cost</span>
                  <p className="text-base font-extrabold text-slate-700 mt-0.5">{formatCurrency(estTotalPurchaseCost)}</p>
                </div>
                <div className="border-l border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Est. Profit Margin</span>
                  <p className="text-base font-extrabold text-emerald-600 mt-0.5">
                    {formatCurrency(estProfit)} <span className="text-xs font-semibold text-emerald-500">({profitMarginPercent.toFixed(1)}%)</span>
                  </p>
                </div>
              </div>
            )}

            <div className="p-4 sm:p-6 overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                  <TableRow className="hover:bg-slate-50/80 border-slate-100">
                    <TableHead className="text-slate-500 text-xs font-bold tracking-wider py-3.5">Batch ID</TableHead>
                    <TableHead className="text-slate-500 text-xs font-bold tracking-wider">Date Added</TableHead>
                    <TableHead className="text-slate-500 text-xs font-bold tracking-wider text-right">Available (Pcs)</TableHead>
                    <TableHead className="text-slate-500 text-xs font-bold tracking-wider text-right">In Transit (Pcs)</TableHead>
                    <TableHead className="text-slate-500 text-xs font-bold tracking-wider text-right">Pack Price</TableHead>
                    <TableHead className="text-slate-500 text-xs font-bold tracking-wider text-right">Total Price</TableHead>
                    <TableHead className="text-slate-500 text-xs font-bold tracking-wider text-right">Purchase/Ctn</TableHead>
                    <TableHead className="text-slate-500 text-xs font-bold tracking-wider text-right">Selling/Ctn</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.batches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-slate-400 text-sm">
                        No active stock batches found. Add batches via editing.
                      </TableCell>
                    </TableRow>
                  ) : (
                    product.batches.map((b: any, index: number) => (
                      <TableRow 
                        key={b.id || index}
                        className="border-slate-100 hover:bg-[#001f3f]/5 transition-colors group"
                      >
                        <TableCell className="font-mono text-xs text-[#001f3f] font-semibold py-4">
                          {b.batch_id || (b.id ? (b.id.startsWith("BAT-") ? b.id : `#${b.id.slice(-8).toUpperCase()}`) : 'N/A')}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">
                          {formatShortDate(b.dateAdded)}
                        </TableCell>
                        <TableCell className="text-xs text-slate-800 text-right font-medium">
                          {b.packs_added} Pcs
                        </TableCell>
                        <TableCell className="text-xs text-slate-800 text-right font-medium">
                          {b.hold_qty || 0} Pcs
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 text-right">
                          {formatCurrency(b.pack_price)}
                        </TableCell>
                        <TableCell className="text-xs text-[#001f3f] text-right font-bold">
                          <div>{formatCurrency(b.packs_total_price || (b.packs_added * b.pack_price))}</div>
                          <div className="text-[10px] text-slate-400 font-medium mt-0.5 font-sans">
                            Cost: ৳{(b.purchase_cost || 0).toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 text-right">
                          {formatCurrency(b.purchase_rate_carton)}
                        </TableCell>
                        <TableCell className="text-xs text-right font-semibold text-emerald-600">
                          <div>{formatCurrency(b.selling_rate_carton)}</div>
                          <div className="text-[10px] text-emerald-550 font-medium mt-0.5 font-sans">
                            Profit: ৳{(b.profit || 0).toFixed(2)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Right Column: Specifications Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/60 flex items-center gap-2">
              <Building className="h-5 w-5 text-[#001f3f]" />
              <h3 className="font-bold text-slate-800 text-base font-sans">Product Specifications</h3>
            </div>

            <div className="p-6 space-y-4 flex-1">
              {/* Company */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50 transition-all duration-300">
                <div className="p-2.5 bg-white border border-slate-200/80 rounded-lg text-[#001f3f] shadow-sm">
                  <Building className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Manufacturer / Company</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5 truncate">{product.company_name}</p>
                </div>
              </div>

              {/* Category */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50 transition-all duration-300">
                <div className="p-2.5 bg-white border border-slate-200/80 rounded-lg text-[#001f3f] shadow-sm">
                  <Tag className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Product Category</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5 truncate">{product.category_name || 'N/A'}</p>
                </div>
              </div>

              {/* Pack Type */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50 transition-all duration-300">
                <div className="p-2.5 bg-white border border-slate-200/80 rounded-lg text-[#001f3f] shadow-sm">
                  <Package className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Packaging Style</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5 truncate">{product.pack_type}</p>
                </div>
              </div>

              {/* Weight */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50 transition-all duration-300">
                <div className="p-2.5 bg-white border border-slate-200/80 rounded-lg text-[#001f3f] shadow-sm">
                  <Scale className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Weight / Net Contents</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    {product.weight}{product.unit ? ` ${product.unit}` : ''}
                  </p>
                </div>
              </div>

              {/* Carton Packets */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50 transition-all duration-300">
                <div className="p-2.5 bg-white border border-slate-200/80 rounded-lg text-[#001f3f] shadow-sm">
                  <Boxes className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Carton Capacity</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    {product.carton_packets} Packets per Carton
                  </p>
                </div>
              </div>

              {/* Box Packets */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50 transition-all duration-300">
                <div className="p-2.5 bg-white border border-slate-200/80 rounded-lg text-[#001f3f] shadow-sm">
                  <Layers className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Internal Box Size</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    {product.box_size && product.box_size < product.carton_packets
                      ? `${product.box_size} Packets per Box`
                      : 'N/A (No sub-boxes)'}
                  </p>
                </div>
              </div>

              {/* Low stock threshold */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50 transition-all duration-300">
                <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-lg text-rose-600 shadow-sm">
                  <AlertTriangle className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Low Stock Threshold</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    {product.lowStockThreshold} Pcs
                  </p>
                </div>
              </div>

              {/* Timestamps */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50 transition-all duration-300">
                <div className="p-2.5 bg-white border border-slate-200/80 rounded-lg text-[#001f3f] shadow-sm">
                  <Calendar className="h-4.5 w-4.5" />
                </div>
                <div className="w-full font-sans">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Dashboard Log Metrics</p>
                  <div className="flex justify-between items-center mt-1 text-[11px] text-slate-650">
                    <div>
                      <span className="font-semibold text-slate-500">Created:</span>{' '}
                      {formatShortDate(product.createdAt)}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500">Updated:</span>{' '}
                      {formatShortDate(product.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
