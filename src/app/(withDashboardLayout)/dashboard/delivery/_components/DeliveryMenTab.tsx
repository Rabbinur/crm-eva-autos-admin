'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit, Phone, IdCard, MapPin } from 'lucide-react';
import Link from 'next/link';
import { DeliveryMan } from '../types';
import { DeliveryManForm } from './delivery-man-form';

type Props = {
    deliveryMen: DeliveryMan[];
    addDeliveryMan: (dm: any) => void;
    updateDeliveryMan: (id: string, data: any) => void;
    deleteDeliveryMan: (id: string) => void;
};

export default function DeliveryMenTab({ deliveryMen, addDeliveryMan, updateDeliveryMan, deleteDeliveryMan }: Props) {
    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <DeliveryManForm
                    onSubmit={(dmData) => addDeliveryMan(dmData)}
                />
            </div>

            {deliveryMen.length ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {deliveryMen.map(dm => (
                        <Card key={dm.id} className="relative overflow-hidden hover:shadow-md transition-shadow border border-border/60">
                            {/* Decorative Top Accent */}
                            <div className={`h-1.5 w-full ${dm.status === 'active' ? 'bg-primary' : 'bg-muted-foreground/30'}`} />

                            <CardHeader className="pb-3 pt-4 flex flex-row items-center gap-3 space-y-0">
                                {dm.profile ? (
                                    <img src={dm.profile} alt={dm.name} className="w-12 h-12 rounded-full object-cover border border-border shadow-xs shrink-0" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base border border-primary/20 shadow-inner shrink-0 uppercase">
                                        {dm.name.slice(0, 2)}
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <Link href={`/dashboard/delivery/delivery-men/${dm.id}`}>
                                        <CardTitle className="text-base font-semibold truncate text-foreground hover:text-primary transition-colors cursor-pointer hover:underline">
                                            {dm.name}
                                        </CardTitle>
                                    </Link>
                                    <p className="text-xs text-muted-foreground">ID: #{dm.id.slice(-6)}</p>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="space-y-2.5 py-3 border-t border-b border-border/40 text-sm">
                                    <div className="flex items-center gap-2.5 text-muted-foreground">
                                        <Phone size={15} className="text-primary/70 shrink-0" />
                                        <span className="truncate text-foreground/80">{dm.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-muted-foreground">
                                        <IdCard size={15} className="text-primary/70 shrink-0" />
                                        <span className="truncate text-foreground/80">NID: {dm.nid}</span>
                                    </div>
                                    <div className="flex items-start gap-2.5 text-muted-foreground">
                                        <MapPin size={15} className="text-primary/70 mt-0.5 shrink-0" />
                                        <span className="line-clamp-2 text-foreground/80 leading-relaxed">{dm.address}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    {/* Toggle Switch */}
                                    <label className="relative inline-flex items-center cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={dm.status === 'active'}
                                            onChange={() =>
                                                updateDeliveryMan(dm.id, {
                                                    status: dm.status === 'active' ? 'inactive' : 'active'
                                                })
                                            }
                                        />
                                        <div className="w-9 h-5 bg-input rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                        <span className="ml-2 text-xs font-semibold text-muted-foreground min-w-[48px]">
                                            {dm.status === 'active' ? 'Active' : 'Inactive'}
                                        </span>
                                    </label>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1">
                                        <DeliveryManForm
                                            title="Edit Delivery Man"
                                            initialData={dm}
                                            trigger={
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Edit Profile">
                                                    <Edit size={15} />
                                                </Button>
                                            }
                                            onSubmit={(dmData) => updateDeliveryMan(dm.id, dmData)}
                                        />
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => deleteDeliveryMan(dm.id)}
                                            title="Remove Representative"
                                        >
                                            <Trash2 size={15} />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Empty text="No delivery men yet. Add one to get started." />
            )}
        </div>
    );
}

function Empty({ text }: { text: string }) {
    return (
        <Card>
            <CardContent className="flex h-32 items-center justify-center text-muted-foreground">
                {text}
            </CardContent>
        </Card>
    );
}
