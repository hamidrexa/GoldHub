'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Eye, Package } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useOrdersHistory } from '@/app/[lang]/(user)/supplier/services/orders-history';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { OrderDialog } from '@/app/[lang]/(user)/supplier/components/order-dialog';

export function OrderSection({ dict, lang, activeTab, searchQuery, viewMode }) {
    const { history = [], isLoading, error } = useOrdersHistory();
    const [selectedOrder, setSelectedOrder] = React.useState<any>(null);
    const filteredHistory = React.useMemo(() => {
        let result = history;
        if (activeTab && activeTab !== 'all') {
            result = result.filter(
                (order) =>
                    order.status?.toLowerCase() === activeTab.toLowerCase()
            );
        }
        if (searchQuery) {
            const q = searchQuery.trim().toLowerCase();

            result = result.filter(
                (order) =>
                    order.id === parseInt(q) ||
                    order.buyer?.username?.toLowerCase().includes(q)
            );
        }
        return result;
    }, [history, activeTab, searchQuery]);

    function StatusBadge({ status, dict }: { status: string; dict: any }) {
        const badges: Record<string, { label: string; className: string }> = {
            // API status values
            Draft: {
                label: dict.marketplace.buyer.ordersPage.status.draft,
                className:
                    'bg-status-draft-bg text-status-draft-text hover:bg-status-draft-bg',
            },
            Submitted: {
                label: dict.marketplace.buyer.ordersPage.status.submitted,
                className:
                    'bg-status-shipped-bg text-status-shipped-text hover:bg-status-shipped-bg',
            },
            Confirmed: {
                label: dict.marketplace.buyer.ordersPage.status.confirmed,
                className:
                    'bg-status-confirmed-bg text-status-confirmed-text hover:bg-status-confirmed-bg',
            },
            Paid: {
                label: dict.marketplace.buyer.ordersPage.status.paid,
                className:
                    'bg-status-confirmed-bg text-status-confirmed-text hover:bg-status-confirmed-bg',
            },
            Shipped: {
                label: dict.marketplace.buyer.ordersPage.status.shipped,
                className:
                    'bg-status-shipped-bg text-status-shipped-text hover:bg-status-shipped-bg',
            },
            Delivered: {
                label: dict.marketplace.buyer.ordersPage.status.delivered,
                className:
                    'bg-status-delivered-bg text-status-delivered-text hover:bg-status-delivered-bg',
            },
            Rejected: {
                label: dict.marketplace.buyer.ordersPage.status.rejected,
                className: 'bg-red-100 text-red-800 hover:bg-red-100',
            },
            Cancelled: {
                label: dict.marketplace.buyer.ordersPage.status.cancelled,
                className: 'bg-red-100 text-red-800 hover:bg-red-100',
            },
            // Legacy status values
            draft: {
                label: dict.marketplace.buyer.ordersPage.status.draft,
                className:
                    'bg-status-draft-bg text-status-draft-text hover:bg-status-draft-bg',
            },
            submitted: {
                label: dict.marketplace.buyer.ordersPage.status.submitted,
                className:
                    'bg-status-shipped-bg text-status-shipped-text hover:bg-status-shipped-bg',
            },
            pending_supplier: {
                label: dict.marketplace.buyer.ordersPage.status.pendingSupplier,
                className:
                    'bg-status-pending-bg text-status-pending-text hover:bg-status-pending-bg',
            },
            confirmed: {
                label: dict.marketplace.buyer.ordersPage.status.confirmed,
                className:
                    'bg-status-confirmed-bg text-status-confirmed-text hover:bg-status-confirmed-bg',
            },
            in_processing: {
                label: dict.marketplace.buyer.ordersPage.status.processing,
                className:
                    'bg-status-shipped-bg text-status-shipped-text hover:bg-status-shipped-bg',
            },
            ready: {
                label: dict.marketplace.buyer.ordersPage.status.ready,
                className:
                    'bg-status-shipped-bg text-status-shipped-text hover:bg-status-shipped-bg',
            },
            shipped: {
                label: dict.marketplace.buyer.ordersPage.status.shipped,
                className:
                    'bg-status-shipped-bg text-status-shipped-text hover:bg-status-shipped-bg',
            },
            delivered: {
                label: dict.marketplace.buyer.ordersPage.status.delivered,
                className:
                    'bg-status-delivered-bg text-status-delivered-text hover:bg-status-delivered-bg',
            },
            closed: {
                label: dict.marketplace.buyer.ordersPage.status.closed,
                className:
                    'bg-status-draft-bg text-status-draft-text hover:bg-status-draft-bg',
            },
            cancelled: {
                label: dict.marketplace.buyer.ordersPage.status.cancelled,
                className: 'bg-red-100 text-red-800 hover:bg-red-100',
            },
        };
        const config = badges[status] || {
            label: status,
            className:
                'bg-status-draft-bg text-status-draft-text hover:bg-status-draft-bg',
        };
        return (
            <Badge variant="default" className={config.className}>
                {config.label}
            </Badge>
        );
    }

    function getStatusLabel(status: string, dict: any): string {
        const labels: Record<string, string> = {
            // API status values
            Draft: dict.marketplace.buyer.ordersPage.status.draft,
            Submitted: dict.marketplace.buyer.ordersPage.status.submitted,
            Confirmed: dict.marketplace.buyer.ordersPage.status.confirmed,
            Paid: dict.marketplace.buyer.ordersPage.status.paid,
            Shipped: dict.marketplace.buyer.ordersPage.status.shipped,
            Delivered: dict.marketplace.buyer.ordersPage.status.delivered,
            Rejected: dict.marketplace.buyer.ordersPage.status.rejected,
            Cancelled: dict.marketplace.buyer.ordersPage.status.cancelled,
            // Legacy values
            draft: dict.marketplace.buyer.ordersPage.status.draft,
            submitted: dict.marketplace.buyer.ordersPage.status.submitted,
            pending_supplier:
                dict.marketplace.buyer.ordersPage.status.pendingSupplier,
            confirmed: dict.marketplace.buyer.ordersPage.status.confirmed,
            in_processing:
                dict.marketplace.buyer.ordersPage.status.inProcessing,
            ready: dict.marketplace.buyer.ordersPage.status.ready,
            shipped: dict.marketplace.buyer.ordersPage.status.shipped,
            delivered: dict.marketplace.buyer.ordersPage.status.delivered,
            closed: dict.marketplace.buyer.ordersPage.status.closed,
            cancelled: dict.marketplace.buyer.ordersPage.status.cancelled,
        };
        return labels[status] || status;
    }

    // Calculate progress percentage based on status
    function getProgressPercentage(order: any): number {
        const statusProgress: Record<string, number> = {
            Draft: 10,
            Submitted: 20,
            Confirmed: 40,
            Paid: 50,
            Shipped: 70,
            Delivered: 100,
            Rejected: 100,
            Cancelled: 100,
            // Legacy
            draft: 10,
            submitted: 20,
            pending_supplier: 30,
            confirmed: 40,
            in_processing: 50,
            ready: 60,
            shipped: 70,
            delivered: 90,
            closed: 100,
        };
        return statusProgress[order.status] || 0;
    }

    // Count orders by status group
    const statusCounts = {
        all: filteredHistory.length,
        active: filteredHistory.filter(
            (o) => normalizeStatus(o.status) === 'active'
        ).length,
        completed: filteredHistory.filter(
            (o) => normalizeStatus(o.status) === 'completed'
        ).length,
    };

    function normalizeStatus(status: string): string {
        const activeStatuses = [
            'Draft',
            'Submitted',
            'Confirmed',
            'Paid',
            'Shipped',
            'draft',
            'submitted',
            'pending_supplier',
            'confirmed',
            'in_processing',
            'ready',
            'shipped',
        ];
        const completedStatuses = [
            'Delivered',
            'Rejected',
            'Cancelled',
            'delivered',
            'closed',
            'cancelled',
        ];

        if (activeStatuses.includes(status)) return 'active';
        if (completedStatuses.includes(status)) return 'completed';
        return 'active';
    }

    if (isLoading) return <p className="py-8 text-center">Loading...</p>;
    if (error)
        return (
            <p className="py-8 text-center text-red-600">Error loading users</p>
        );

    return filteredHistory.length === 0 ? (
        <Card className="p-12">
            <div className="text-center">
                <Package className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground">
                    {dict.marketplace.buyer.ordersPage.noOrders}
                </p>
            </div>
        </Card>
    ) : viewMode === 'grid' ? (
        <div className="space-y-4">
            {filteredHistory.map((order) => (
                <Card
                    key={order.id}
                    className="transition-shadow hover:shadow-md"
                >
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
                            {/* Left Section: Order Info */}
                            <div className="flex-1 space-y-3">
                                {/* Order ID and Status */}
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-semibold">
                                        {order.id}
                                    </h3>
                                    <StatusBadge
                                        status={order.status}
                                        dict={dict}
                                    />
                                </div>

                                {/* Supplier and Date */}
                                <div className="text-muted-foreground space-y-1 text-sm">
                                    <p>
                                        {
                                            dict.marketplace.buyer.ordersPage
                                                .card.supplier
                                        }{' '}
                                        {order.items[0]?.product.supplier.username.includes(
                                            'Premium'
                                        )
                                            ? 'Premium Gold Co.'
                                            : 'Luxury Jewelers Inc.'}
                                    </p>
                                    <p>
                                        {
                                            dict.marketplace.buyer.ordersPage
                                                .card.created
                                        }{' '}
                                        {order.date}
                                    </p>
                                </div>

                                {/* Timeline Progress */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                                            <div
                                                className="h-full bg-gold-600 transition-all duration-300"
                                                style={{
                                                    width: `${getProgressPercentage(order)}% `,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground text-sm">
                                        {getStatusLabel(order.status, dict)}
                                    </p>
                                </div>
                            </div>

                            {/* Right Section: Price and Action */}
                            <div className="space-y-3 text-right">
                                <div>
                                    <p className="text-2xl font-bold text-gold-600">
                                        ${order.total_price.toLocaleString()}
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        {order.items.length}{' '}
                                        {
                                            dict.marketplace.buyer.ordersPage
                                                .card.itemsSuffix
                                        }
                                    </p>
                                </div>
                                <Button
                                    onClick={() => {
                                        setSelectedOrder(order);
                                    }}
                                    variant="outline"
                                    size="sm"
                                >
                                    <Eye className="mr-2 h-4 w-4" />
                                    {
                                        dict.marketplace.buyer.ordersPage.card
                                            .viewDetails
                                    }
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
            {selectedOrder && (
                <OrderDialog
                    order={selectedOrder}
                    dict={dict}
                    lang={lang}
                    activeTab={activeTab}
                    searchQuery={searchQuery}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    ) : (
        <div className="bg-card rounded-lg border shadow-sm">
            <div>
                <div className="w-full max-w-[calc(100vw-3rem)] overflow-x-auto">
                    <Table className="min-w-[600px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="bg-card left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                    {
                                        dict.marketplace.buyer.ordersPage.table
                                            .orderId
                                    }
                                </TableHead>
                                <TableHead>
                                    {
                                        dict.marketplace.buyer.ordersPage.table
                                            .date
                                    }
                                </TableHead>
                                <TableHead>
                                    {
                                        dict.marketplace.buyer.ordersPage.table
                                            .items
                                    }
                                </TableHead>
                                <TableHead>
                                    {
                                        dict.marketplace.buyer.ordersPage.table
                                            .total
                                    }
                                </TableHead>
                                <TableHead>
                                    {
                                        dict.marketplace.buyer.ordersPage.table
                                            .status
                                    }
                                </TableHead>
                                <TableHead className="text-right">
                                    {
                                        dict.marketplace.buyer.ordersPage.table
                                            .actions
                                    }
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredHistory.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="bg-card  left-0 z-10 font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                        {order.id}
                                    </TableCell>
                                    <TableCell>{order.date}</TableCell>
                                    <TableCell>
                                        {order.items.length}{' '}
                                        {
                                            dict.marketplace.buyer.ordersPage
                                                .card.itemsSuffix
                                        }
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        ${order.total_price.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge
                                            status={order.status}
                                            dict={dict}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            onClick={() => {
                                                setSelectedOrder(order);
                                            }}
                                            size="sm"
                                            variant="ghost"
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            {
                                                dict.marketplace.buyer.ordersPage.card.viewDetails
                                            }
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {selectedOrder && (
                <OrderDialog
                    order={selectedOrder}
                    dict={dict}
                    lang={lang}
                    activeTab={activeTab}
                    searchQuery={searchQuery}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
}
