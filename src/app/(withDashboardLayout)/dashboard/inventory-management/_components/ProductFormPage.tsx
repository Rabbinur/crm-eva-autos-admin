'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Batch, Product } from '../types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { BatchSection } from './BatchSection';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetDistributorCategoriesQuery, useGetDistributorCompaniesQuery, useGetDistributorUnitsQuery } from '@/components/Redux/RTK/distributorApiNode';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

const banglaToEnglishMap: Record<string, string> = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
};

const convertBanglaToEnglishNumbers = (str: string): string => {
  return str.replace(/[০-৯]/g, (w) => banglaToEnglishMap[w] || w);
};

/* ---------------- Schema ---------------- */
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  weight: z
    .string()
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Weight must be a positive number'),
  product_summary: z.string().optional(),
  carton_packets: z
    .string()
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0 && Number.isInteger(Number(v)), 'Carton packets must be a positive integer'),
  box_size: z
    .string()
    .optional()
    .refine((v) => !v || (!isNaN(Number(v)) && Number(v) > 0 && Number.isInteger(Number(v))), 'Box size must be a positive integer'),
  company_name: z.string().min(1, 'Company name is required'),
  category_name: z.string().min(1, 'Category name is required'),
  unit: z.string().min(1, 'Unit is required'),
  lowStockThreshold: z
    .string()
    .optional()
    .refine((v) => !v || (!isNaN(Number(v)) && Number(v) >= 0 && Number.isInteger(Number(v))), 'Threshold must be a non-negative integer'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormPageProps {
  onSubmit: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  initialData?: Product;
  isEdit?: boolean;
  onAutoSave?: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<any>;
}

export function ProductFormPage({ onSubmit, onCancel, initialData, isEdit, onAutoSave }: ProductFormPageProps) {
  const [batches, setBatches] = useState<Batch[]>(initialData?.batches || []);
  const { data: categories = [], isLoading: isLoadingCategories } = useGetDistributorCategoriesQuery();
  const { data: companies = [], isLoading: isLoadingCompanies } = useGetDistributorCompaniesQuery();
  const { data: units = [], isLoading: isLoadingUnits } = useGetDistributorUnitsQuery();

  const activeCompanies = React.useMemo(() => {
    return companies.filter((comp: any) => comp.status === 'Active' || comp.name === initialData?.company_name);
  }, [companies, initialData]);

  const activeUnits = React.useMemo(() => {
    return units.filter((unit: any) => unit.status === 'Active' || unit.name === initialData?.unit);
  }, [units, initialData]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? {
        name: initialData.name,
        weight: String(initialData.weight),
        product_summary: initialData.product_summary,
        carton_packets: String(initialData.carton_packets),
        box_size: initialData.box_size ? String(initialData.box_size) : '',
        company_name: initialData.company_name,
        category_name: initialData.category_name || '',
        unit: initialData.unit || '',
        lowStockThreshold: String(initialData.lowStockThreshold),
      }
      : {
        name: '',
        weight: '',
        product_summary: '',
        carton_packets: '',
        box_size: '',
        company_name: '',
        category_name: '',
        unit: 'gm',
        lowStockThreshold: '',
      },
  });

  // Set default unit to 'gm' if found in active units list from API in add mode
  React.useEffect(() => {
    if (!isEdit && !initialData && units.length > 0) {
      const activeUnitsList = units.filter((u: any) => u.status === 'Active');
      const hasGm = activeUnitsList.find((u: any) => u.name.toLowerCase() === 'gm');
      if (hasGm) {
        setValue('unit', hasGm.name, { shouldValidate: true });
      }
    }
  }, [units, isEdit, initialData, setValue]);

  const watchedCompanyName = watch('company_name');

  const activeCategories = React.useMemo(() => {
    return categories.filter((cat: any) =>
      (cat.status === 'Active' && cat.company_name === watchedCompanyName) ||
      (cat.name === initialData?.category_name && cat.company_name === initialData?.company_name)
    );
  }, [categories, watchedCompanyName, initialData]);

  // Reset category if company changes to a different one
  React.useEffect(() => {
    if (isEdit) {
      if (watchedCompanyName && watchedCompanyName !== initialData?.company_name) {
        setValue('category_name', '', { shouldValidate: true });
      }
    } else {
      if (watchedCompanyName) {
        setValue('category_name', '', { shouldValidate: true });
      }
    }
  }, [watchedCompanyName, setValue, initialData, isEdit]);

  // Watch carton_packets to pass it to BatchSection for dynamic selling rate calculation
  const watchedCartonPackets = watch('carton_packets');
  const convertedPackets = convertBanglaToEnglishNumbers(watchedCartonPackets || '');
  const cartonPackets = Number(convertedPackets) || 0;

  // Automatically sync threshold if lowStockThreshold field hasn't been manually dirtied
  React.useEffect(() => {
    if (cartonPackets <= 0) return;
    if (!dirtyFields.lowStockThreshold) {
      setValue('lowStockThreshold', String(cartonPackets), { shouldValidate: true });
    }
  }, [cartonPackets, setValue, dirtyFields.lowStockThreshold]);

  const handleBatchAction = React.useCallback(async (updatedBatches: Batch[]) => {
    if (isEdit && onAutoSave) {
      const currentValues = watch();
      const total_stock = updatedBatches.reduce((sum, b) => sum + b.packs_added, 0);
      const total_stock_value = Number(updatedBatches.reduce((sum, b) => sum + b.packs_added * b.pack_price, 0).toFixed(2));

      const toastId = toast.loading('Syncing batch updates to server...');
      try {
        await onAutoSave({
          name: currentValues.name,
          weight: Number(currentValues.weight),
          product_summary: currentValues.product_summary || '',
          carton_packets: Number(currentValues.carton_packets),
          box_size: currentValues.box_size ? Number(currentValues.box_size) : undefined,
          company_name: currentValues.company_name,
          category_name: currentValues.category_name,
          unit: currentValues.unit,
          lowStockThreshold: currentValues.lowStockThreshold ? Number(currentValues.lowStockThreshold) : Number(currentValues.carton_packets),
          batches: updatedBatches,
          total_stock,
          total_stock_value,
        });
        toast.success('Server batch records updated!', { id: toastId });
      } catch (err: any) {
        toast.error('Failed to sync batches: ' + (err?.data?.message || err?.message), { id: toastId });
      }
    }
  }, [isEdit, onAutoSave, watch]);

  const onSubmitForm = async (data: ProductFormData) => {
    if (batches.length === 0) return toast.error('Please add at least one batch!');

    const total_stock = batches.reduce((sum, b) => sum + b.packs_added, 0);
    const total_stock_value = Number(batches.reduce((sum, b) => sum + b.packs_added * b.pack_price, 0).toFixed(2));

    try {
      await onSubmit({
        name: data.name,
        weight: Number(data.weight),
        product_summary: data.product_summary || '',
        carton_packets: Number(data.carton_packets),
        box_size: data.box_size ? Number(data.box_size) : undefined,
        company_name: data.company_name,
        category_name: data.category_name,
        unit: data.unit,
        lowStockThreshold: data.lowStockThreshold ? Number(data.lowStockThreshold) : Number(data.carton_packets),
        batches,
        total_stock,
        total_stock_value,
      });
    } catch (err) {
      // Error handled in parent page handler
    }
  };

  return (
    <TooltipProvider>
      <Card className="relative w-full bg-white shadow-lg rounded-xl overflow-hidden">
        {isSubmitting && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[1px]">
            <div className="w-10 h-10 border-4 border-[#001f3f] border-t-transparent rounded-full animate-spin shadow-md" />
            <p className="mt-3 text-sm font-bold text-[#001f3f] tracking-wide animate-pulse">
              {isEdit ? 'Updating Product...' : 'Saving Product...'}
            </p>
          </div>
        )}
        <CardContent className="pt-6 px-6 space-y-6">
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Product Name */}
              <div className="flex flex-col gap-2">
                <Label>Product Name *</Label>
                <Input
                  {...register('name')}
                  className="placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                  placeholder="Butter Cookies Gold"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              {/* Weight & Unit Group */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 flex flex-col gap-2">
                  <Label>Weight *</Label>
                  <Input
                    {...register('weight', {
                      onChange: (e) => {
                        e.target.value = convertBanglaToEnglishNumbers(e.target.value);
                      }
                    })}
                    className="placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                    placeholder="300"
                  />
                  {errors.weight && <p className="text-sm text-red-500">{errors.weight.message}</p>}
                </div>
                <div className="col-span-1 flex flex-col gap-2">
                  <Label>Unit *</Label>
                  <Select
                    onValueChange={(val) => setValue('unit', val, { shouldValidate: true })}
                    value={watch('unit')}
                    disabled={isEdit}
                  >
                    <SelectTrigger className="w-full placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg">
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingUnits ? (
                        <SelectItem value="_loading" disabled>Loading units...</SelectItem>
                      ) : activeUnits.length === 0 ? (
                        <SelectItem value="_none" disabled>No units available</SelectItem>
                      ) : (
                        activeUnits.map((u: any) => (
                          <SelectItem key={u.id || u._id} value={u.name}>
                            {u.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.unit && <p className="text-sm text-red-500">{errors.unit.message}</p>}
                </div>
              </div>
            </div>

            {/* Pack Type, Carton size & Box size */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Product Summary</Label>
                <Textarea
                  {...register('product_summary')}
                  className="placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                  placeholder="Product Summary"
                  disabled={isEdit}
                />
                {errors.product_summary && <p className="text-sm text-red-500">{errors.product_summary.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <Label>Carton Packets *</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="text-muted-foreground hover:text-foreground transition-colors cursor-help">
                        <Info className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900 text-white rounded-lg p-2 max-w-xs shadow-md border border-slate-800">
                      <p className="font-normal text-xs leading-normal">
                        ১টি কার্টনে মোট কত পিস বা প্যাকেট থাকবে (যেমন: ৭২ পিস)।
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  {...register('carton_packets', {
                    onChange: (e) => {
                      e.target.value = convertBanglaToEnglishNumbers(e.target.value).replace(/[^0-9]/g, '');
                    }
                  })}
                  className="placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                  placeholder="24"
                />
                {errors.carton_packets && <p className="text-sm text-red-500">{errors.carton_packets.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <Label>Box Size (Optional)</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="text-muted-foreground hover:text-foreground transition-colors cursor-help">
                        <Info className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900 text-white rounded-lg p-2 max-w-xs shadow-md border border-slate-800">
                      <p className="font-normal text-xs leading-normal">
                        ১টি ছোট ইনার বক্সে (Inner Box) কত পিস বা প্যাকেট থাকবে (যেমন: ১২ পিস)। না থাকলে ফাঁকা রাখুন।
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  {...register('box_size', {
                    onChange: (e) => {
                      e.target.value = convertBanglaToEnglishNumbers(e.target.value).replace(/[^0-9]/g, '');
                    }
                  })}
                  className="placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                  placeholder="Optional (e.g. 12)"
                />
                {errors.box_size && <p className="text-sm text-red-500">{errors.box_size.message}</p>}
              </div>
            </div>

            {/* Company & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Company Name *</Label>
                <Select
                  onValueChange={(val) => setValue('company_name', val, { shouldValidate: true })}
                  value={watch('company_name')}
                  disabled={isEdit}
                >
                  <SelectTrigger className="w-full placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg">
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingCompanies ? (
                      <SelectItem value="_loading" disabled>Loading companies...</SelectItem>
                    ) : activeCompanies.length === 0 ? (
                      <SelectItem value="_none" disabled>No companies available</SelectItem>
                    ) : (
                      activeCompanies.map((comp: any) => (
                        <SelectItem key={comp.id || comp._id} value={comp.name}>
                          {comp.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.company_name && <p className="text-sm text-red-500">{errors.company_name.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Category *</Label>
                <Select
                  onValueChange={(val) => setValue('category_name', val, { shouldValidate: true })}
                  value={watch('category_name')}
                  disabled={!watchedCompanyName || isEdit}
                >
                  <SelectTrigger className="w-full placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg disabled:opacity-50">
                    <SelectValue placeholder={watchedCompanyName ? "Select Category" : "Please select a company first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingCategories ? (
                      <SelectItem value="_loading" disabled>Loading categories...</SelectItem>
                    ) : !watchedCompanyName ? (
                      <SelectItem value="_none" disabled>Please select a company first</SelectItem>
                    ) : activeCategories.length === 0 ? (
                      <SelectItem value="_none" disabled>No categories available for this company</SelectItem>
                    ) : (
                      activeCategories.map((cat: any) => (
                        <SelectItem key={cat.id || cat._id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.category_name && <p className="text-sm text-red-500">{errors.category_name.message}</p>}
              </div>
            </div>

            {/* Operations / Threshold */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <Label>Low Stock Threshold</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="text-muted-foreground hover:text-foreground transition-colors cursor-help">
                        <Info className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900 text-white rounded-lg p-2 max-w-xs shadow-md border border-slate-800">
                      <p className="font-normal text-xs leading-normal">
                        ফাঁকা রাখলে এটি অটোমেটিক ১ কার্টনের সমান (যেমন: ২৪ পিস) সেট হবে।
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  {...register('lowStockThreshold', {
                    onChange: (e) => {
                      e.target.value = convertBanglaToEnglishNumbers(e.target.value).replace(/[^0-9]/g, '');
                    }
                  })}
                  className="placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                  placeholder="Optional (Defaults to 1 Carton)"
                />
              </div>
            </div>

            {/* Batch Sub-section (Reusable Component) */}
            <BatchSection 
              batches={batches} 
              setBatches={setBatches} 
              cartonPackets={cartonPackets} 
              isEdit={isEdit}
              onBatchAction={handleBatchAction}
            />

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="bg-[#001f3f] hover:bg-black text-white shadow-md transition-all rounded-lg px-6 flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isEdit ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEdit ? 'Update Product' : 'Create Product'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-slate-300 text-slate-600 hover:bg-slate-50 transition-all rounded-lg"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
