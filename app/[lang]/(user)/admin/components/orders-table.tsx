'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { CheckCircle, Eye, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SmartPagination } from '@/components/ui/pagination';
import { useOrdersHistory } from '@/app/[lang]/(user)/supplier/services/orders-history';
import React from 'react';
import { OrderDialog } from '@/app/[lang]/(user)/supplier/components/order-dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export function AdminOrdersTable({ dict, lang, activeTab, searchQuery }) {

    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(10);
    const { history, count, isLoading, error } = useOrdersHistory(
        page,
        undefined,
        undefined,
        undefined,
        pageSize
    );

    const totalPages = Math.ceil((count || 0) / pageSize);
    const [selectedOrder, setSelectedOrder] = React.useState<any>(null);
    const filteredOrders = React.useMemo(() => {
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
            'Draft': { label: dict.marketplace.admin.ordersPage.status.draft, className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
            'Submitted': { label: dict.marketplace.admin.ordersPage.status.submitted, className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
            'Confirmed': { label: dict.marketplace.admin.ordersPage.status.confirmed, className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
            'Paid': { label: dict.marketplace.admin.ordersPage.status.paid, className: 'bg-green-100 text-green-800 hover:bg-green-100' },
            'Shipped': { label: dict.marketplace.admin.ordersPage.status.shipped, className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
            'Delivered': { label: dict.marketplace.admin.ordersPage.status.delivered, className: 'bg-green-100 text-green-800 hover:bg-green-100' },
            'Rejected': { label: dict.marketplace.admin.ordersPage.status.rejected, className: 'bg-red-100 text-red-800 hover:bg-red-100' },
            'Cancelled': { label: dict.marketplace.admin.ordersPage.status.cancelled, className: 'bg-red-100 text-red-800 hover:bg-red-100' },
            // Legacy status values (for mock data fallback)
            'confirmed': { label: dict.marketplace.admin.ordersPage.status.confirmed, className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
            'shipped': { label: dict.marketplace.admin.ordersPage.status.shipped, className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
            'pending_supplier': { label: dict.marketplace.admin.ordersPage.status.pendingSupplier, className: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
            'closed': { label: dict.marketplace.admin.ordersPage.status.closed, className: 'bg-green-100 text-green-800 hover:bg-green-100' },
            'cancelled': { label: dict.marketplace.admin.ordersPage.status.cancelled, className: 'bg-red-100 text-red-800 hover:bg-red-100' },
        };
        const config = badges[status] || { label: status, className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' };
        return <Badge variant="default" className={config.className}>{config.label}</Badge>;
    }

    if (isLoading) return <p className="py-8 text-center">Loading...</p>;
    if (error)
        return (
            <p className="py-8 text-center text-red-600">Error loading users</p>
        );

    return (
        <div className="border rounded-lg shadow-sm bg-card">
            <div className="w-full overflow-x-auto max-w-[calc(100vw-3rem)]">
                <Table className="min-w-[700px]">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead
                                className="font-semibold left-0 z-20 bg-card shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">{dict.marketplace.admin.ordersPage.table.orderId}</TableHead>
                            <TableHead
                                className="font-semibold">{dict.marketplace.admin.ordersPage.table.buyer}</TableHead>
                            <TableHead
                                className="font-semibold">{dict.marketplace.admin.ordersPage.table.items}</TableHead>
                            <TableHead
                                className="font-semibold">{dict.marketplace.admin.ordersPage.table.total}</TableHead>
                            <TableHead
                                className="font-semibold">{dict.marketplace.admin.ordersPage.table.status}</TableHead>
                            <TableHead
                                className="font-semibold">{dict.marketplace.admin.ordersPage.table.date}</TableHead>
                            <TableHead
                                className="font-semibold text-right">{dict.marketplace.admin.ordersPage.table.actions}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    {dict.marketplace.admin.ordersPage.table.noOrders}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders.map((order) => (
                                <TableRow key={order.id} className="hover:bg-gray-50">
                                    <TableCell
                                        className="font-medium left-0 z-10 bg-card shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">{order.id}</TableCell>
                                    <TableCell>{order.buyer.username}</TableCell>
                                    <TableCell>{order.items.length} {dict.marketplace.admin.ordersPage.table.itemsSuffix}</TableCell>
                                    <TableCell>${order.total_price.toLocaleString()}</TableCell>
                                    <TableCell><StatusBadge status={order.status} dict={dict} /></TableCell>
                                    <TableCell>{order.date}</TableCell>
                                    <TableCell>
                                        <div>
                                            <button
                                                onClick={() =>
                                                    setSelectedOrder(order)
                                                }
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
                                            >
                                                <Eye className="h-4 w-4 text-gray-600" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
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
            <div className="flex flex-col items-center justify-between gap-4 border-t px-4 py-4 sm:flex-row">
                <div className="flex items-center gap-2">
                    <p className="text-muted-foreground text-sm whitespace-nowrap">
                        {dict?.common?.rowsPerPage || 'Rows per page'}
                    </p>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => {
                            setPageSize(Number(value));
                            setPage(0);
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[5, 10, 20, 50].map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex-1">
                    <SmartPagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        dict={dict}
                    />
                </div>

                <div className="hidden text-sm text-muted-foreground sm:block">
                    {dict?.common?.pageOf
                        ?.replace('{current}', String(page + 1))
                        .replace('{total}', String(totalPages)) ||
                        `Page ${page + 1} of ${totalPages}`}
                </div>
            </div>
        </div>
    )
}