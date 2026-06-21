'use client';

import {
  useGetDeliveryMenQuery,
  useCreateDeliveryManMutation,
  useUpdateDeliveryManMutation,
  useDeleteDeliveryManMutation
} from '@/components/Redux/RTK/distributorApiNode';
import DeliveryMenTab from './_components/DeliveryMenTab';
import { Loader2 } from 'lucide-react';

import { toast } from 'sonner';

export default function DeliveryManagementPage() {
  const { data: deliveryMen = [], isLoading } = useGetDeliveryMenQuery();
  const [createDeliveryMan] = useCreateDeliveryManMutation();
  const [updateDeliveryMan] = useUpdateDeliveryManMutation();
  const [deleteDeliveryMan] = useDeleteDeliveryManMutation();

  const handleAddDeliveryMan = async (dm: any) => {
    try {
      await createDeliveryMan(dm).unwrap();
      toast.success('Delivery representative added successfully!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create delivery representative');
      throw err;
    }
  };

  const handleUpdateDeliveryMan = async (id: string, data: any) => {
    try {
      await updateDeliveryMan({ id, data }).unwrap();
      toast.success('Delivery representative updated successfully!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update delivery representative');
      throw err;
    }
  };

  const handleDeleteDeliveryMan = async (id: string) => {
    if (!confirm('Are you sure you want to remove this delivery representative?')) return;
    try {
      await deleteDeliveryMan(id).unwrap();
      toast.success('Delivery representative removed successfully!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete delivery representative');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] p-6">
        <Loader2 className="animate-spin h-8 w-8 text-primary mb-3" />
        <p className="text-lg font-medium text-muted-foreground">
          Loading delivery representatives...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Delivery Men</h1>
          <p className="mt-2 text-muted-foreground">
            Manage delivery personnel profiles and active status
          </p>
        </div>
      </div>

      <DeliveryMenTab
        deliveryMen={deliveryMen}
        addDeliveryMan={handleAddDeliveryMan}
        updateDeliveryMan={handleUpdateDeliveryMan}
        deleteDeliveryMan={handleDeleteDeliveryMan}
      />
    </div>
  );
}
