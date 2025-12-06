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
import { Check, Circle, Package as PackageIcon } from 'lucide-react';
import { OrderDetail, OrderStatus } from '@/lib/mock-data';

interface OrderDetailModalProps {
    order: OrderDetail;
    open: boolean;
    onClose: () => void;
    dict: any;
}

export default function OrderDetailModal({ order, open, onClose, dict }: OrderDetailModalProps) {
    const getStatusLabel = (status: OrderStatus): string => {
        const labels = {
            draft: dict.marketplace.buyer.ordersPage.status.draft,
            submitted: dict.marketplace.buyer.ordersPage.status.submitted,
            pending_supplier: dict.marketplace.buyer.ordersPage.status.pendingSupplier,
            confirmed: dict.marketplace.buyer.ordersPage.status.confirmed,
            in_processing: dict.marketplace.buyer.ordersPage.status.inProcessing,
            ready: dict.marketplace.buyer.ordersPage.status.ready,
            shipped: dict.marketplace.buyer.ordersPage.status.shipped,
            delivered: dict.marketplace.buyer.ordersPage.status.delivered,
            closed: dict.marketplace.buyer.ordersPage.status.closed,
            cancelled: dict.marketplace.buyer.ordersPage.status.cancelled,
        };
        return labels[status] || status;
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{dict.marketplace.buyer.orderDetailModal.title} {order.id}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Order Timeline */}
                    <div>
                        <h3 className="font-semibold mb-4">{dict.marketplace.buyer.orderDetailModal.timeline}</h3>
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
                                                    {dict.marketplace.buyer.orderDetailModal.current}
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
                                <h4 className="font-semibold mb-2">{dict.marketplace.buyer.orderDetailModal.supplier}</h4>
                                <p className="text-sm">{order.orderItems[0]?.product.name.includes('Premium') ? 'Premium Gold Co.' : 'Luxury Jewelers Inc.'}</p>
                                <p className="text-xs text-muted-foreground">{dict.marketplace.buyer.orderDetailModal.supplierId} s1</p>
                            </CardContent>
                        </Card>

                        {/* Order Summary */}
                        <Card>
                            <CardContent className="p-4">
                                <h4 className="font-semibold mb-2">{dict.marketplace.buyer.orderDetailModal.summary}</h4>
                                <p className="text-sm">{dict.marketplace.buyer.orderDetailModal.total} <span className="font-bold">${order.total.toLocaleString()}</span></p>
                                <p className="text-xs text-muted-foreground">{dict.marketplace.buyer.orderDetailModal.created} {order.date}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Separator />

                    {/* Order Items */}
                    <div>
                        <h3 className="font-semibold mb-4">{dict.marketplace.buyer.orderDetailModal.items}</h3>
                        <div className="space-y-3">
                            {order.orderItems.map((item, index) => (
                                <Card key={index}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                                    <PackageIcon className="h-6 w-6 text-gray-400" />
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
                                                <p className="text-xs text-muted-foreground">{dict.marketplace.buyer.orderDetailModal.qty} {item.quantity}</p>
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
