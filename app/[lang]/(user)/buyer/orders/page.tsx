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

export default function BuyerOrdersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

    const getStatusBadge = (status: OrderStatus) => {
        const badges = {
            draft: { label: 'Draft', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
            submitted: { label: 'Submitted', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
            pending_supplier: { label: 'Pending Supplier', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
            confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
            in_processing: { label: 'Processing', className: 'bg-purple-100 text-purple-800 hover:bg-purple-100' },
            ready: { label: 'Ready', className: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100' },
            shipped: { label: 'Shipped', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
            delivered: { label: 'Delivered', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
            closed: { label: 'Closed', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
            cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
        };
        const config = badges[status] || badges.draft;
        return <Badge variant="default" className={config.className}>{config.label}</Badge>;
    };

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
                <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
                <p className="text-muted-foreground">Track and manage your orders</p>
            </div>

            {/* Search and View Toggle */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by order ID or supplier..."
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
                        All Orders ({statusCounts.all})
                    </TabsTrigger>
                    <TabsTrigger value="active">
                        Active ({statusCounts.active})
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                        Completed ({statusCounts.completed})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={statusFilter} className="mt-6">
                    {filteredOrders.length === 0 ? (
                        <Card className="p-12">
                            <div className="text-center">
                                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No orders found</p>
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
                                                    <p>Supplier: {order.orderItems[0]?.product.name.includes('Premium') ? 'Premium Gold Co.' : 'Luxury Jewelers Inc.'}</p>
                                                    <p>Created: {order.date}</p>
                                                </div>

                                                {/* Timeline Progress */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-yellow-500 transition-all duration-300"
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
                                                    <p className="text-2xl font-bold text-yellow-600">
                                                        ${order.total.toLocaleString()}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {order.items} items
                                                    </p>
                                                </div>

                                                <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
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
                                            <TableHead>Order ID</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Items</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredOrders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">{order.id}</TableCell>
                                                <TableCell>{order.date}</TableCell>
                                                <TableCell>{order.items} items</TableCell>
                                                <TableCell className="font-semibold">
                                                    ${order.total.toLocaleString()}
                                                </TableCell>
                                                <TableCell>{getStatusBadge(order.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button size="sm" variant="ghost" onClick={() => setSelectedOrder(order)}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
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
                />
            )}
        </div>
    );
}
