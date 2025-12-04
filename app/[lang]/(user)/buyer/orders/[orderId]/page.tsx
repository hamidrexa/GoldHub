'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { mockBuyerOrders } from '@/lib/buyer-mock-data';
import { OrderStatus, OrderTimelineEntry } from '@/lib/mock-data';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import OrderTimeline from '../../components/order-timeline';

export default function OrderDetailPage() {
    const params = useParams();
    const lang = params.lang || 'en';
    const orderId = params.orderId as string;

    const order = mockBuyerOrders.find(o => o.id === orderId);

    if (!order) {
        return (
            <div className="space-y-6">
                <div className="text-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">Order not found</h2>
                    <p className="text-muted-foreground mt-2">The order you're looking for doesn't exist</p>
                    <Link href={`/${lang}/buyer/orders`}>
                        <Button className="mt-4">Back to Orders</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status: OrderStatus) => {
        const badges = {
            draft: { label: 'Draft', className: 'bg-gray-100 text-gray-800' },
            submitted: { label: 'Submitted', className: 'bg-blue-100 text-blue-800' },
            pending_supplier: { label: 'Pending Supplier', className: 'bg-yellow-100 text-yellow-800' },
            confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-800' },
            in_processing: { label: 'In Processing', className: 'bg-purple-100 text-purple-800' },
            ready: { label: 'Ready', className: 'bg-indigo-100 text-indigo-800' },
            shipped: { label: 'Shipped', className: 'bg-blue-100 text-blue-800' },
            delivered: { label: 'Delivered', className: 'bg-green-100 text-green-800' },
            closed: { label: 'Closed', className: 'bg-gray-100 text-gray-800' },
            cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800' },
        };
        const config = badges[status] || badges.draft;
        return <Badge className={config.className}>{config.label}</Badge>;
    };

    const canCancel = order.status === 'draft' || order.status === 'submitted';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/${lang}/buyer/orders`}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Orders
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Order {order.id}</h1>
                        <p className="text-muted-foreground">Placed on {order.date}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {getStatusBadge(order.status)}
                </div>
            </div>

            {/* Order Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <OrderTimeline timeline={order.timeline} currentStatus={order.status} />
                </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Items ({order.items})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Specifications</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="text-right">Subtotal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.orderItems.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.product.name}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {item.product.specifications}
                                    </TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>${item.priceAtOrder.toLocaleString()}</TableCell>
                                    <TableCell className="text-right font-semibold">
                                        ${item.subtotal.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="mt-6 space-y-2 max-w-sm ml-auto">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>${order.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax</span>
                            <span>${order.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Shipping</span>
                            <span>${order.shipping.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold text-lg">
                            <span>Total</span>
                            <span>${order.total.toLocaleString()}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Shipping Information */}
            {order.shippingAddress && (
                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            <p>{order.shippingAddress.street}</p>
                            <p>
                                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                            </p>
                            <p>{order.shippingAddress.country}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Actions */}
            <div className="flex gap-4">
                {canCancel && (
                    <Button variant="destructive" onClick={() => alert('Cancel order functionality')}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Order
                    </Button>
                )}
                <Button variant="outline">
                    Contact Supplier
                </Button>
                {(order.status === 'delivered' || order.status === 'closed') && (
                    <Button variant="outline">
                        Download Invoice
                    </Button>
                )}
            </div>
        </div>
    );
}
