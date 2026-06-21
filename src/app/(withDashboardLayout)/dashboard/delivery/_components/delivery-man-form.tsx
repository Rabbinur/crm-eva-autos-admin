'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';
import { DeliveryMan } from '../types';

const deliveryManSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().min(10, 'Valid phone number required'),
    nid: z.string().min(8, 'NID is required'),
    address: z.string().min(3, 'Address is required'),
    profile: z.string().url('Valid profile image URL required').optional().or(z.literal('')),
    status: z.enum(['active', 'inactive']).optional(),
});

type DeliveryManFormData = z.infer<typeof deliveryManSchema>;

interface DeliveryManFormProps {
    onSubmit: (data: DeliveryManFormData) => Promise<void> | void;
    initialData?: DeliveryMan;
    trigger?: React.ReactNode;
    title?: string;
}

export function DeliveryManForm({ onSubmit, initialData, trigger, title }: DeliveryManFormProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<DeliveryManFormData>({
        resolver: zodResolver(deliveryManSchema),
        defaultValues: initialData || {
            name: '',
            phone: '',
            nid: '',
            address: '',
            profile: '',
            status: 'active',
        },
    });

    // Reset form when dialog opens/closes or initialData changes
    useEffect(() => {
        if (open) {
            reset(initialData || {
                name: '',
                phone: '',
                nid: '',
                address: '',
                profile: '',
                status: 'active',
            });
        }
    }, [open, initialData, reset]);

    const onSubmitForm = async (data: DeliveryManFormData) => {
        setLoading(true);
        try {
            await onSubmit(data);
            reset();
            setOpen(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="gap-2">
                        <Plus size={16} /> Add Delivery Man
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title || 'Add Delivery Man'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="John Doe" disabled={loading} {...register('name')} />
                        {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
                    </div>

                    <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" placeholder="01700000001" disabled={loading} {...register('phone')} />
                        {errors.phone && <span className="text-xs text-destructive">{errors.phone.message}</span>}
                    </div>

                    <div>
                        <Label htmlFor="nid">NID</Label>
                        <Input id="nid" placeholder="1234567890" disabled={loading} {...register('nid')} />
                        {errors.nid && <span className="text-xs text-destructive">{errors.nid.message}</span>}
                    </div>

                    <div>
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" placeholder="Dhaka, Bangladesh" disabled={loading} {...register('address')} />
                        {errors.address && <span className="text-xs text-destructive">{errors.address.message}</span>}
                    </div>

                    <div>
                        <Label htmlFor="profile">Profile Image URL (Optional)</Label>
                        <Input id="profile" placeholder="https://..." disabled={loading} {...register('profile')} />
                        {errors.profile && <span className="text-xs text-destructive">{errors.profile.message}</span>}
                    </div>

                    {initialData && (
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                disabled={loading}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...register('status')}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            {errors.status && <span className="text-xs text-destructive">{errors.status.message}</span>}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />}
                        {initialData ? 'Save Changes' : 'Add Delivery Man'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
