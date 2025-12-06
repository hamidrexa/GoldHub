import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
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
import { ArrowLeft, Package, XCircle } from 'lucide-react';
import { mockBuyerOrders } from '@/lib/buyer-mock-data';
import { OrderStatus } from '@/lib/mock-data';
import Link from 'next/link';
import OrderTimeline from '../../components/order-timeline';

interface PageProps {
    params: { lang: Locale; orderId: string };
}

// Server-side status badge component
function StatusBadge({ status, dict }: { status: OrderStatus; dict: any }) {
    const badges = {
        draft: { label: dict.marketplace.buyer.ordersPage.status.draft, className: 'bg-gray-100 text-gray-800' },
        submitted: { label: dict.marketplace.buyer.ordersPage.status.submitted, className: 'bg-blue-100 text-blue-800' },
        pending_supplier: { label: dict.marketplace.buyer.ordersPage.status.pendingSupplier, className: 'bg-yellow-100 text-yellow-800' },
        confirmed: { label: dict.marketplace.buyer.ordersPage.status.confirmed, className: 'bg-green-100 text-green-800' },
        in_processing: { label: dict.marketplace.buyer.ordersPage.status.inProcessing, className: 'bg-purple-100 text-purple-800' },
        ready: { label: dict.marketplace.buyer.ordersPage.status.ready, className: 'bg-indigo-100 text-indigo-800' },
        shipped: { label: dict.marketplace.buyer.ordersPage.status.shipped, className: 'bg-blue-100 text-blue-800' },
        delivered: { label: dict.marketplace.buyer.ordersPage.status.delivered, className: 'bg-green-100 text-green-800' },
        closed: { label: dict.marketplace.buyer.ordersPage.status.closed, className: 'bg-gray-100 text-gray-800' },
        cancelled: { label: dict.marketplace.buyer.ordersPage.status.cancelled, className: 'bg-red-100 text-red-800' },
    };
    const config = badges[status] || badges.draft;
    return <Badge className={config.className}>{config.label}</Badge>;
}

export default async function OrderDetailPage({ params: { lang, orderId } }: PageProps) {
    const dict = await getDictionary(lang);
    const order = mockBuyerOrders.find(o => o.id === orderId);

    if (!order) {
        return (
            <div className="space-y-6">
                <div className="text-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">{dict.marketplace.buyer.orderDetailPage.notFound.title}</h2>
                    <p className="text-muted-foreground mt-2">{dict.marketplace.buyer.orderDetailPage.notFound.description}</p>
                    <Link href={`/${lang}/buyer/orders`}>
                        <Button className="mt-4">{dict.marketplace.buyer.orderDetailPage.notFound.backToOrders}</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const canCancel = order.status === 'draft' || order.status === 'submitted';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/${lang}/buyer/orders`}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            {dict.marketplace.buyer.orderDetailPage.backToOrders}
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.buyer.orderDetailModal.title} {order.id}</h1>
                        <p className="text-muted-foreground">{dict.marketplace.buyer.orderDetailPage.placedOn} {order.date}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <StatusBadge status={order.status} dict={dict} />
                </div>
            </div>

            {/* Order Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle>{dict.marketplace.buyer.orderDetailPage.orderStatus}</CardTitle>
                </CardHeader>
                <CardContent>
                    <OrderTimeline timeline={order.timeline} currentStatus={order.status} dict={dict} />
                </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
                <CardHeader>
                    <CardTitle>{dict.marketplace.buyer.orderDetailPage.orderItems} ({order.items})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{dict.marketplace.buyer.orderDetailPage.table.product}</TableHead>
                                <TableHead>{dict.marketplace.buyer.orderDetailPage.table.specifications}</TableHead>
                                <TableHead>{dict.marketplace.buyer.orderDetailPage.table.quantity}</TableHead>
                                <TableHead>{dict.marketplace.buyer.orderDetailPage.table.price}</TableHead>
                                <TableHead className="text-right">{dict.marketplace.buyer.orderDetailPage.table.subtotal}</TableHead>
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
                            <span className="text-muted-foreground">{dict.marketplace.buyer.orderDetailPage.summary.subtotal}</span>
                            <span>${order.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{dict.marketplace.buyer.orderDetailPage.summary.tax}</span>
                            <span>${order.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{dict.marketplace.buyer.orderDetailPage.summary.shipping}</span>
                            <span>${order.shipping.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold text-lg">
                            <span>{dict.marketplace.buyer.orderDetailPage.summary.total}</span>
                            <span>${order.total.toLocaleString()}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Shipping Information */}
            {order.shippingAddress && (
                <Card>
                    <CardHeader>
                        <CardTitle>{dict.marketplace.buyer.orderDetailPage.shippingAddress}</CardTitle>
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
                    <Button variant="destructive">
                        <XCircle className="h-4 w-4 mr-2" />
                        {dict.marketplace.buyer.orderDetailPage.actions.cancelOrder}
                    </Button>
                )}
                <Button variant="outline">
                    {dict.marketplace.buyer.orderDetailPage.actions.contactSupplier}
                </Button>
                {(order.status === 'delivered' || order.status === 'closed') && (
                    <Button variant="outline">
                        {dict.marketplace.buyer.orderDetailPage.actions.downloadInvoice}
                    </Button>
                )}
            </div>
        </div>
    );
}
