'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Package, LayoutGrid, List } from 'lucide-react';
import { mockBuyerOrders } from '@/lib/buyer-mock-data';
import { OrderDetail, OrderStatus } from '@/lib/mock-data';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import OrderDetailModal from '../components/order-detail-modal';
import { useParams } from 'next/navigation';

type StatusFilter = 'all' | 'active' | 'completed';

interface BuyerOrdersClientProps {
    dict: any;
}

export default function BuyerOrdersClient({ dict }: BuyerOrdersClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

    const getStatusBadge = (status: OrderStatus) => {
        const badges = {
            draft: { label: dict.marketplace.buyer.ordersPage.status.draft, className: 'bg-status-draft-bg text-status-draft-text hover:bg-status-draft-bg' },
            submitted: { label: dict.marketplace.buyer.ordersPage.status.submitted, className: 'bg-status-shipped-bg text-status-shipped-text hover:bg-status-shipped-bg' },
            pending_supplier: { label: dict.marketplace.buyer.ordersPage.status.pendingSupplier, className: 'bg-status-pending-bg text-status-pending-text hover:bg-status-pending-bg' },
            confirmed: { label: dict.marketplace.buyer.ordersPage.status.confirmed, className: 'bg-status-confirmed-bg text-status-confirmed-text hover:bg-status-confirmed-bg' },
            in_processing: { label: dict.marketplace.buyer.ordersPage.status.processing, className: 'bg-status-shipped-bg text-status-shipped-text hover:bg-status-shipped-bg' },
            ready: { label: dict.marketplace.buyer.ordersPage.status.ready, className: 'bg-status-shipped-bg text-status-shipped-text hover:bg-status-shipped-bg' },
            shipped: { label: dict.marketplace.buyer.ordersPage.status.shipped, className: 'bg-status-shipped-bg text-status-shipped-text hover:bg-status-shipped-bg' },
            delivered: { label: dict.marketplace.buyer.ordersPage.status.delivered, className: 'bg-status-delivered-bg text-status-delivered-text hover:bg-status-delivered-bg' },
            closed: { label: dict.marketplace.buyer.ordersPage.status.closed, className: 'bg-status-draft-bg text-status-draft-text hover:bg-status-draft-bg' },
            cancelled: { label: dict.marketplace.buyer.ordersPage.status.cancelled, className: 'bg-red-100 text-red-800 hover:bg-red-100' },
        };
        const config = badges[status] || badges.draft;
        return <Badge variant="default" className={config.className}>{config.label}</Badge>;
    };

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

    // Get current status from timeline
    const getCurrentStatusLabel = (order: OrderDetail): string => {
        const currentEntry = order.timeline.find(t => t.status === order.status);
        return currentEntry ? getStatusLabel(order.status) : '';
    };

    const filterOrders = (orders: OrderDetail[]) => {
        let filtered = orders;

        // Filter by status group
        if (statusFilter !== 'all') {
            if (statusFilter === 'active') {
                filtered = filtered.filter(o =>
                    !['delivered', 'closed', 'cancelled'].includes(o.status)
                );
            } else if (statusFilter === 'completed') {
                filtered = filtered.filter(o => ['delivered', 'closed'].includes(o.status));
            }
        }

        // Filter by search
        if (searchQuery) {
            filtered = filtered.filter(order =>
                order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.buyer.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredOrders = filterOrders(mockBuyerOrders);

    // Count orders by status group
    const statusCounts = {
        all: mockBuyerOrders.length,
        active: mockBuyerOrders.filter(o =>
            !['delivered', 'closed', 'cancelled'].includes(o.status)
        ).length,
        completed: mockBuyerOrders.filter(o => ['delivered', 'closed'].includes(o.status)).length,
    };

    // Calculate progress percentage based on completed timeline steps
    const getProgressPercentage = (order: OrderDetail): number => {
        const totalSteps = order.timeline.length;
        const completedSteps = order.timeline.filter(t => t.completed).length;
        return (completedSteps / totalSteps) * 100;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.buyer.ordersPage.title}</h1>
                <p className="text-muted-foreground">{dict.marketplace.buyer.ordersPage.description}</p>
            </div>

            {/* Search and View Toggle */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder={dict.marketplace.buyer.ordersPage.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Status Filter Tabs */}
            <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                <TabsList>
                    <TabsTrigger value="all">
                        {dict.marketplace.buyer.ordersPage.tabs.all} ({statusCounts.all})
                    </TabsTrigger>
                    <TabsTrigger value="active">
                        {dict.marketplace.buyer.ordersPage.tabs.active} ({statusCounts.active})
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                        {dict.marketplace.buyer.ordersPage.tabs.completed} ({statusCounts.completed})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={statusFilter} className="mt-6">
                    {filteredOrders.length === 0 ? (
                        <Card className="p-12">
                            <div className="text-center">
                                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">{dict.marketplace.buyer.ordersPage.noOrders}</p>
                            </div>
                        </Card>
                    ) : viewMode === 'grid' ? (
                        <div className="space-y-4">
                            {filteredOrders.map((order) => (
                                <Card key={order.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            {/* Left Section: Order Info */}
                                            <div className="flex-1 space-y-3">
                                                {/* Order ID and Status */}
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-lg">{order.id}</h3>
                                                    {getStatusBadge(order.status)}
                                                </div>

                                                {/* Supplier and Date */}
                                                <div className="text-sm text-muted-foreground space-y-1">
                                                    <p>{dict.marketplace.buyer.ordersPage.card.supplier} {order.orderItems[0]?.product.name.includes('Premium') ? 'Premium Gold Co.' : 'Luxury Jewelers Inc.'}</p>
                                                    <p>{dict.marketplace.buyer.ordersPage.card.created} {order.date}</p>
                                                </div>

                                                {/* Timeline Progress */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gold-600 transition-all duration-300"
                                                                style={{ width: `${getProgressPercentage(order)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {getCurrentStatusLabel(order)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right Section: Price and Action */}
                                            <div className="text-right space-y-3">
                                                <div>
                                                    <p className="text-2xl font-bold text-gold-600">
                                                        ${order.total.toLocaleString()}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {order.items} {dict.marketplace.buyer.ordersPage.card.itemsSuffix}
                                                    </p>
                                                </div>

                                                <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    {dict.marketplace.buyer.ordersPage.card.viewDetails}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{dict.marketplace.buyer.ordersPage.table.orderId}</TableHead>
                                            <TableHead>{dict.marketplace.buyer.ordersPage.table.date}</TableHead>
                                            <TableHead>{dict.marketplace.buyer.ordersPage.table.items}</TableHead>
                                            <TableHead>{dict.marketplace.buyer.ordersPage.table.total}</TableHead>
                                            <TableHead>{dict.marketplace.buyer.ordersPage.table.status}</TableHead>
                                            <TableHead className="text-right">{dict.marketplace.buyer.ordersPage.table.actions}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredOrders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">{order.id}</TableCell>
                                                <TableCell>{order.date}</TableCell>
                                                <TableCell>{order.items} {dict.marketplace.buyer.ordersPage.card.itemsSuffix}</TableCell>
                                                <TableCell className="font-semibold">
                                                    ${order.total.toLocaleString()}
                                                </TableCell>
                                                <TableCell>{getStatusBadge(order.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button size="sm" variant="ghost" onClick={() => setSelectedOrder(order)}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        {dict.marketplace.buyer.ordersPage.card.viewDetails}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    open={!!selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    dict={dict}
                />
            )}
        </div>
    );
}
