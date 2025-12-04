'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Eye, CheckCircle, XCircle } from 'lucide-react';
import { mockOrders, Order } from '@/lib/mock-data';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    const getStatusBadge = (status: Order['status']) => {
        const badges = {
            confirmed: { variant: 'default' as const, label: 'Confirmed', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
            shipped: { variant: 'default' as const, label: 'Shipped', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
            pending_supplier: { variant: 'default' as const, label: 'Pending Supplier', className: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
            closed: { variant: 'default' as const, label: 'Closed', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
            cancelled: { variant: 'default' as const, label: 'Cancelled', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
        };
        const config = badges[status];
        return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
    };

    const filterOrders = (orders: Order[]) => {
        let filtered = orders;

        // Filter by search
        if (searchQuery) {
            filtered = filtered.filter(order =>
                order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.buyer.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by tab
        if (activeTab === 'pending') {
            filtered = filtered.filter(order => order.status === 'pending_supplier');
        } else if (activeTab === 'active') {
            filtered = filtered.filter(order => order.status === 'confirmed' || order.status === 'shipped');
        } else if (activeTab === 'closed') {
            filtered = filtered.filter(order => order.status === 'closed');
        }

        return filtered;
    };

    const filteredOrders = filterOrders(mockOrders);
    const pendingCount = mockOrders.filter(o => o.status === 'pending_supplier').length;
    const activeCount = mockOrders.filter(o => o.status === 'confirmed' || o.status === 'shipped').length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <p className="text-muted-foreground">Manage incoming orders from buyers</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-transparent border-b w-full justify-start rounded-none h-auto p-0 space-x-4">
                    <TabsTrigger
                        value="all"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                    >
                        All Orders
                    </TabsTrigger>
                    <TabsTrigger
                        value="pending"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                    >
                        Pending Action ({pendingCount})
                    </TabsTrigger>
                    <TabsTrigger
                        value="active"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                    >
                        Active ({activeCount})
                    </TabsTrigger>
                    <TabsTrigger
                        value="closed"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                    >
                        Closed
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                    <div className="rounded-lg border bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold">Order ID</TableHead>
                                    <TableHead className="font-semibold">Buyer</TableHead>
                                    <TableHead className="font-semibold">Items</TableHead>
                                    <TableHead className="font-semibold">Total</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Date</TableHead>
                                    <TableHead className="font-semibold text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            No orders found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <TableRow key={order.id} className="hover:bg-gray-50">
                                            <TableCell className="font-medium">{order.id}</TableCell>
                                            <TableCell>{order.buyer}</TableCell>
                                            <TableCell>{order.items} items</TableCell>
                                            <TableCell>${order.total.toLocaleString()}</TableCell>
                                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                                            <TableCell>{order.date}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Eye className="h-4 w-4 text-gray-600" />
                                                    </Button>
                                                    {order.status === 'pending_supplier' && (
                                                        <>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <XCircle className="h-4 w-4 text-red-600" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
