'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check, Circle } from 'lucide-react';
import { OrderDetail, OrderStatus } from '@/lib/mock-data';

interface OrderDetailModalProps {
    order: OrderDetail;
    open: boolean;
    onClose: () => void;
}

export default function OrderDetailModal({ order, open, onClose }: OrderDetailModalProps) {
    const getStatusLabel = (status: OrderStatus): string => {
        const labels = {
            draft: 'Draft',
            submitted: 'Submitted',
            pending_supplier: 'Pending Supplier',
            confirmed: 'Confirmed',
            in_processing: 'In Processing',
            ready: 'Ready',
            shipped: 'Shipped',
            delivered: 'Delivered',
            closed: 'Closed',
            cancelled: 'Cancelled',
        };
        return labels[status] || status;
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Order {order.id}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Order Timeline */}
                    <div>
                        <h3 className="font-semibold mb-4">Order Timeline</h3>
                        <div className="space-y-3">
                            {order.timeline.map((entry, index) => {
                                const isCurrent = entry.status === order.status;
                                const isCompleted = entry.completed;

                                return (
                                    <div key={index} className="flex items-center gap-3">
                                        {/* Icon */}
                                        <div
                                            className={`flex h-6 w-6 items-center justify-center rounded-full ${isCompleted
                                                    ? 'bg-yellow-500'
                                                    : 'border-2 border-gray-300 bg-white'
                                                }`}
                                        >
                                            {isCompleted ? (
                                                <Check className="h-4 w-4 text-white" />
                                            ) : (
                                                <Circle className="h-2 w-2 text-gray-300 fill-gray-300" />
                                            )}
                                        </div>

                                        {/* Label */}
                                        <div className="flex items-center gap-2 flex-1">
                                            <span
                                                className={`text-sm ${isCompleted ? 'text-gray-900' : 'text-gray-400'
                                                    }`}
                                            >
                                                {getStatusLabel(entry.status)}
                                            </span>
                                            {isCurrent && (
                                                <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <Separator />

                    {/* Supplier and Order Summary */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Supplier */}
                        <Card>
                            <CardContent className="p-4">
                                <h4 className="font-semibold mb-2">Supplier</h4>
                                <p className="text-sm">{order.orderItems[0]?.product.name.includes('Premium') ? 'Premium Gold Co.' : 'Luxury Jewelers Inc.'}</p>
                                <p className="text-xs text-muted-foreground">ID: s1</p>
                            </CardContent>
                        </Card>

                        {/* Order Summary */}
                        <Card>
                            <CardContent className="p-4">
                                <h4 className="font-semibold mb-2">Order Summary</h4>
                                <p className="text-sm">Total: <span className="font-bold">${order.total.toLocaleString()}</span></p>
                                <p className="text-xs text-muted-foreground">Created: {order.date}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Separator />

                    {/* Order Items */}
                    <div>
                        <h3 className="font-semibold mb-4">Order Items</h3>
                        <div className="space-y-3">
                            {order.orderItems.map((item, index) => (
                                <Card key={index}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                                    <Package className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{item.product.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.product.specifications}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">${item.priceAtOrder.toLocaleString()}</p>
                                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function Package({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    );
}
