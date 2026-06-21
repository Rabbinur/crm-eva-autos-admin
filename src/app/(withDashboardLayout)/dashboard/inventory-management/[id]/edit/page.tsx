'use client';

import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ProductFormPage } from '../../_components/ProductFormPage';
import { useGetDistributorProductByIdQuery, useUpdateDistributorProductMutation } from '@/components/Redux/RTK/distributorApiNode';
import { Product } from '../../types';
import { toast } from 'sonner';


export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const { data: product, isLoading } = useGetDistributorProductByIdQuery(productId);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateDistributorProductMutation();

  if (isLoading) {
    return (
      <div className="space-y-6 p-8">
        <div className="text-center py-12 text-muted-foreground">Loading product data...</div>
      </div>
    );
  }

  if (!product) {
    return (

      <div className="space-y-6 p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/inventory-management')} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </div>
        <div className="flex items-center justify-center rounded-lg border border-border bg-card p-12">
          <p className="text-muted-foreground">Product not found</p>
        </div>
      </div>

    );
  }

  const handleSubmit = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const toastId = toast.loading('Updating product...');
    try {
      const result = await updateProduct({ id: productId, data: productData }).unwrap();
      toast.success('Product updated successfully!', { id: toastId });
      router.push(`/dashboard/inventory-management/${productId}`);
      return result;
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update product', { id: toastId });
      throw err;
    }
  };

  const handleAutoSave = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await updateProduct({ id: productId, data: productData }).unwrap();
  };

  const handleCancel = () => router.push(`/dashboard/inventory-management/${productId}`);

  return (

    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleCancel} className="gap-2 bg-transparent">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Product</h1>
          <p className="mt-1 text-muted-foreground">Update product details</p>
        </div>
      </div>

      {/* Form */}
      <div>
        <ProductFormPage 
          onSubmit={handleSubmit} 
          onCancel={handleCancel} 
          initialData={product} 
          isEdit 
          onAutoSave={handleAutoSave}
        />
      </div>
    </div>

  );
}
