'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Eye, Package as PackageIcon } from 'lucide-react';
import { mockOrders, Order } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type StatusFilter = 'all' | 'pending_supplier' | 'confirmed' | 'shipped' | 'closed';

export default function SupplierOrdersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

    const getStatusBadge = (status: Order['status']) => {
        const badges = {
            pending_supplier: { label: 'New', className: 'bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7]' },
            confirmed: { label: 'Processing', className: 'bg-[#DBEAFE] text-[#1E40AF] hover:bg-[#DBEAFE]' },
            shipped: { label: 'Shipped', className: 'bg-[#DBEAFE] text-[#1E40AF] hover:bg-[#DBEAFE]' },
            completed: { label: 'Completed', className: 'bg-[#D1FAE5] text-[#065F46] hover:bg-[#D1FAE5]' },
            cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
        };
        const config = badges[status] || badges.pending_supplier;
        return <Badge variant="default" className={config.className}>{config.label}</Badge>;
    };

    const filterOrders = (orders: Order[]) => {
        let filtered = orders;

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter);
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

    // Supplier sees orders where they need to take action
    const supplierRelevantOrders = mockOrders.filter(o =>
        ['pending_supplier', 'confirmed', 'shipped', 'closed'].includes(o.status)
    );

    const filteredOrders = filterOrders(supplierRelevantOrders);

    // Count orders by status for tabs
    const statusCounts = {
        all: supplierRelevantOrders.length,
        pending_supplier: supplierRelevantOrders.filter(o => o.status === 'pending_supplier').length,
        confirmed: supplierRelevantOrders.filter(o => o.status === 'confirmed').length,
        shipped: supplierRelevantOrders.filter(o => o.status === 'shipped').length,
        closed: supplierRelevantOrders.filter(o => o.status === 'closed').length,
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <p className="text-muted-foreground">Manage and track your supplier orders</p>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Status Filter Tabs */}
            <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                <TabsList>
                    <TabsTrigger value="all">
                        All ({statusCounts.all})
                    </TabsTrigger>
                    <TabsTrigger value="pending_supplier">
                        New ({statusCounts.pending_supplier})
                    </TabsTrigger>
                    <TabsTrigger value="confirmed">
                        Processing ({statusCounts.confirmed})
                    </TabsTrigger>
                    <TabsTrigger value="shipped">
                        Shipped ({statusCounts.shipped})
                    </TabsTrigger>
                    <TabsTrigger value="closed">
                        Closed ({statusCounts.closed})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={statusFilter} className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {statusFilter === 'all' ? 'All Orders' :
                                    statusFilter === 'pending_supplier' ? 'New Orders' :
                                        statusFilter === 'confirmed' ? 'Processing Orders' :
                                            statusFilter === 'shipped' ? 'Shipped Orders' :
                                                'Closed Orders'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {filteredOrders.length === 0 ? (
                                <div className="text-center py-12">
                                    <PackageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">No orders found</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order ID</TableHead>
                                            <TableHead>Buyer</TableHead>
                                            <TableHead>Items</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredOrders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">{order.id}</TableCell>
                                                <TableCell>{order.buyer}</TableCell>
                                                <TableCell>{order.items} items</TableCell>
                                                <TableCell className="font-semibold">
                                                    ${order.total.toLocaleString()}
                                                </TableCell>
                                                <TableCell>{order.date}</TableCell>
                                                <TableCell>{getStatusBadge(order.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {order.status === 'confirmed' && (
                                                            <Button size="sm" variant="outline">
                                                                Mark Shipped
                                                            </Button>
                                                        )}
                                                        <Button size="sm" variant="ghost">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
