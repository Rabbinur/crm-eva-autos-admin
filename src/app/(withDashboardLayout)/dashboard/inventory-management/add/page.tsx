'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useCreateDistributorProductMutation } from '@/components/Redux/RTK/distributorApiNode';
import { Product } from '../types';
import { ProductFormPage } from '../_components/ProductFormPage';
import { toast } from 'sonner';


export default function CreateProductPage() {
  const router = useRouter();
  const [createProduct] = useCreateDistributorProductMutation();

  const handleSubmit = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const toastId = toast.loading('Adding product...');
    try {
      const result = await createProduct(productData).unwrap();
      toast.success('Product added successfully!', { id: toastId });
      router.push('/dashboard/inventory-management');
      return result;
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to add product', { id: toastId });
      throw err;
    }
  };

  const handleCancel = () => router.back();

  return (
   
      <div className="space-y-6 p-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleCancel} className="gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create New Product</h1>
            <p className="mt-1 text-muted-foreground">Add a new product to your inventory</p>
          </div>
        </div>

        {/* Form */}
        <div className="">
          <ProductFormPage onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>
  
  );
}
