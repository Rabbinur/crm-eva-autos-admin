'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit2, Plus, Save, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Batch } from '../types';
import { toast } from 'sonner';
import { formatShortDate } from '@/lib/utils';

const banglaToEnglishMap: Record<string, string> = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
};

const convertBanglaToEnglishNumbers = (str: string): string => {
  return str.replace(/[০-৯]/g, (w) => banglaToEnglishMap[w] || w);
};

interface BatchSectionProps {
  batches: Batch[];
  setBatches: React.Dispatch<React.SetStateAction<Batch[]>>;
  cartonPackets: number;
  isEdit?: boolean;
  onBatchAction?: (updatedBatches: Batch[]) => void;
}

export function BatchSection({ batches, setBatches, cartonPackets, isEdit, onBatchAction }: BatchSectionProps) {
  const [existingBatchIds] = useState(() => new Set(batches.map(b => b.id)));
  const [newBatch, setNewBatch] = useState({
    packs_added: '',
    pack_price: '',
    purchase_rate_carton: '',
    selling_rate_carton: '',
  });
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);

  const packsTotalPrice = React.useMemo(() => {
    const packs = Number(newBatch.packs_added) || 0;
    const price = Number(newBatch.pack_price) || 0;
    return (packs * price).toFixed(2);
  }, [newBatch.packs_added, newBatch.pack_price]);

  // Recalculate selling_rate_carton automatically when pack_price or cartonPackets changes
  React.useEffect(() => {
    const pPrice = Number(newBatch.pack_price);
    if (cartonPackets > 0 && !isNaN(pPrice) && pPrice > 0) {
      const calculatedRate = String((pPrice * cartonPackets).toFixed(2));
      setNewBatch((prev) => {
        if (prev.selling_rate_carton !== calculatedRate) {
          return { ...prev, selling_rate_carton: calculatedRate };
        }
        return prev;
      });
    } else if (newBatch.pack_price === '' || cartonPackets === 0) {
      setNewBatch((prev) => {
        if (prev.selling_rate_carton !== '') {
          return { ...prev, selling_rate_carton: '' };
        }
        return prev;
      });
    }
  }, [newBatch.pack_price, cartonPackets]);

  // Dynamically update the selling_rate_carton of all batches in the list if cartonPackets changes
  React.useEffect(() => {
    if (cartonPackets > 0) {
      setBatches((prev) =>
        prev.map((b) => {
          const recalculatedRate = Number((b.pack_price * cartonPackets).toFixed(2));
          if (b.selling_rate_carton !== recalculatedRate) {
            return { ...b, selling_rate_carton: recalculatedRate };
          }
          return b;
        })
      );
    }
  }, [cartonPackets, setBatches]);

  const handleInputChange = (key: string, val: string) => {
    const englishVal = convertBanglaToEnglishNumbers(val);
    if (key === 'packs_added') {
      if (englishVal === '' || /^[0-9]*$/.test(englishVal)) {
        setNewBatch((prev) => ({ ...prev, [key]: englishVal }));
      }
    } else {
      if (englishVal === '' || /^[0-9]*\.?[0-9]*$/.test(englishVal)) {
        setNewBatch((prev) => ({ ...prev, [key]: englishVal }));
      }
    }
  };

  const addBatch = () => {
    const { packs_added, pack_price, purchase_rate_carton, selling_rate_carton } = newBatch;
    if (!packs_added || !pack_price || !purchase_rate_carton || !selling_rate_carton) {
      return toast.error('All batch fields are required');
    }

    const numPacks = Number(packs_added);
    if (isNaN(numPacks) || !Number.isInteger(numPacks) || numPacks <= 0) {
      return toast.error('Packs added must be a positive integer');
    }

    const calculatedTotalPrice = Number((numPacks * Number(pack_price)).toFixed(2));
    let updatedBatches: Batch[];

    if (editingBatchId) {
      updatedBatches = batches.map((b) =>
        b.id === editingBatchId
          ? {
              ...b,
              packs_added: Number(packs_added),
              pack_price: Number(pack_price),
              packs_total_price: calculatedTotalPrice,
              purchase_rate_carton: Number(purchase_rate_carton),
              selling_rate_carton: Number(selling_rate_carton),
            }
          : b
      );
      setBatches(updatedBatches);
      if (onBatchAction) {
        onBatchAction(updatedBatches);
      }
      setEditingBatchId(null);
      toast.success('Batch updated locally!');
    } else {
      const batch: Batch = {
        id: uuidv4(),
        packs_added: Number(packs_added),
        pack_price: Number(pack_price),
        packs_total_price: calculatedTotalPrice,
        purchase_rate_carton: Number(purchase_rate_carton),
        selling_rate_carton: Number(selling_rate_carton),
        dateAdded: new Date().toISOString().split('T')[0],
      };
      updatedBatches = [...batches, batch];
      setBatches(updatedBatches);
      if (onBatchAction) {
        onBatchAction(updatedBatches);
      }
      toast.success('Batch added locally!');
    }

    setNewBatch({ packs_added: '', pack_price: '', purchase_rate_carton: '', selling_rate_carton: '' });
  };

  const startEditBatch = (batch: Batch) => {
    setNewBatch({
      packs_added: String(batch.packs_added),
      pack_price: String(batch.pack_price),
      purchase_rate_carton: String(batch.purchase_rate_carton),
      selling_rate_carton: String(batch.selling_rate_carton),
    });
    setEditingBatchId(batch.id);
  };

  const removeBatch = (id: string) => {
    if (editingBatchId === id) {
      setEditingBatchId(null);
      setNewBatch({ packs_added: '', pack_price: '', purchase_rate_carton: '', selling_rate_carton: '' });
    }
    const updatedBatches = batches.filter((b) => b.id !== id);
    setBatches(updatedBatches);
    if (onBatchAction) {
      onBatchAction(updatedBatches);
    }
  };

  return (
    <div className="border-t pt-6 space-y-4">
      <h3 className="font-bold text-lg text-slate-800">Product Batches</h3>

      {/* New Batch Input */}
      <div className="grid grid-cols-5 gap-2">
        <div className="flex flex-col gap-2">
          <Label className="text-slate-600 text-xs font-bold">Packs Added</Label>
          <Input
            type="text"
            value={newBatch.packs_added}
            onChange={(e) => handleInputChange('packs_added', e.target.value)}
            placeholder="12"
            className="placeholder-gray-400 text-gray-900 focus:ring-[#001f3f]/20 focus:border-[#001f3f] rounded-lg bg-gray-50 border-slate-200"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-slate-600 text-xs font-bold">Pack Price</Label>
          <Input
            type="text"
            value={newBatch.pack_price}
            onChange={(e) => handleInputChange('pack_price', e.target.value)}
            placeholder="12.50"
            className="placeholder-gray-400 text-gray-900 focus:ring-[#001f3f]/20 focus:border-[#001f3f] rounded-lg bg-gray-50 border-slate-200"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-slate-600 text-xs font-bold">Total Price</Label>
          <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-bold text-sm h-10 flex items-center">
            ৳{packsTotalPrice}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-slate-600 text-xs font-bold">Purchase / Ctn</Label>
          <Input
            type="text"
            value={newBatch.purchase_rate_carton}
            onChange={(e) => handleInputChange('purchase_rate_carton', e.target.value)}
            placeholder="300"
            className="placeholder-gray-400 text-gray-900 focus:ring-[#001f3f]/20 focus:border-[#001f3f] rounded-lg bg-gray-50 border-slate-200"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-slate-600 text-xs font-bold">Selling / Ctn</Label>
          <Input
            type="text"
            value={newBatch.selling_rate_carton}
            onChange={(e) => handleInputChange('selling_rate_carton', e.target.value)}
            placeholder="340"
            className="placeholder-gray-400 text-gray-900 focus:ring-[#001f3f]/20 focus:border-[#001f3f] rounded-lg bg-gray-50 border-slate-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="mt-2 border-[#001f3f] text-[#001f3f] hover:bg-[#001f3f] hover:text-white transition-all font-bold text-xs"
          onClick={addBatch}
        >
          {editingBatchId ? <Save className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {editingBatchId ? 'Update Batch' : 'Add Batch'}
        </Button>
        {editingBatchId && (
          <Button
            type="button"
            variant="ghost"
            className="mt-2 text-slate-500 hover:text-slate-700 transition-all font-bold text-xs"
            onClick={() => {
              setEditingBatchId(null);
              setNewBatch({ packs_added: '', pack_price: '', purchase_rate_carton: '', selling_rate_carton: '' });
            }}
          >
            Cancel Edit
          </Button>
        )}
      </div>

      {/* Batch List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        {batches.map((b, index) => (
          <div
            key={b.id}
            className={`relative overflow-hidden flex flex-col justify-between border rounded-xl p-4 bg-slate-50 hover:bg-white hover:shadow-md transition-all duration-200 ${
              editingBatchId === b.id ? 'border-amber-400 bg-amber-50/20 shadow-sm' : 'border-slate-200/80 hover:border-[#001f3f]/20'
            }`}
          >
            {/* Corner Badge for Batch Number */}
            <div className="absolute top-0 right-0 bg-[#001f3f] text-white text-[10px] font-bold px-2.5 py-1 rounded-bl-lg">
              Batch #{index + 1}
            </div>

            {/* Top-Left Badge for Batch ID */}
            <div className="absolute top-0 left-0 bg-[#001f3f]/10 text-[#001f3f] text-[9px] font-bold px-2.5 py-1 rounded-br-lg font-mono">
              {b.batch_id || (b.id && b.id.startsWith("BAT-") ? b.id : "NEW BATCH")}
            </div>

            <div className="space-y-2 mt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-slate-800">{b.packs_added}</span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Packs</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-sm font-bold text-slate-600">৳{b.pack_price.toFixed(2)} <span className="text-[10px] font-medium text-slate-400">/ pack</span></span>
                </div>
                <div className="text-xs font-black text-[#001f3f] bg-[#001f3f]/5 px-2.5 py-1 rounded-lg">
                  Total: ৳{(b.packs_added * b.pack_price).toFixed(2)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-200/60 pt-2 font-medium">
                <div>
                  <span className="text-slate-400 text-[10px]">Purchase / Ctn:</span>
                  <p className="font-bold text-[#001f3f] text-xs">৳{b.purchase_rate_carton.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Selling / Ctn:</span>
                  <p className="font-bold text-emerald-600 text-xs">৳{b.selling_rate_carton.toFixed(2)}</p>
                </div>
              </div>
            </div>

             <div className="flex items-center justify-between mt-3 pt-2 border-t border-dashed border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Added: {formatShortDate(b.dateAdded)}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-1.5 text-slate-400 hover:text-[#001f3f] hover:bg-[#001f3f]/5 rounded-lg transition-colors"
                  onClick={() => startEditBatch(b)}
                  title="Edit Batch"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  onClick={() => removeBatch(b.id)}
                  title="Delete Batch"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
