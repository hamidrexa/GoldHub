'use client';

import { Eye, Package as PackageIcon } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useOrdersHistory } from '@/app/[lang]/(user)/supplier/services/orders-history';
import { KycDialog } from '@/app/[lang]/(user)/admin/users-kyc/kyc-dialog';
import { OrderDialog } from '@/app/[lang]/(user)/supplier/components/order-dialog';
import { updateOrderStatus } from '@/app/[lang]/(user)/supplier/services/update-order-status';

export function OrdersTable({ dict, lang, activeTab, searchQuery }) {
    const [selectedOrder, setSelectedOrder] = React.useState<any>(null);
    const { history = [], isLoading, error,mutate } = useOrdersHistory();
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
            Draft: {
                label: dict.marketplace.supplier.ordersPage.status.draft,
                className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
            },
            Submitted: {
                label: dict.marketplace.supplier.ordersPage.status.submitted,
                className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
            },
            Confirmed: {
                label: dict.marketplace.supplier.ordersPage.status.confirmed,
                className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
            },
            Paid: {
                label: dict.marketplace.supplier.ordersPage.status.paid,
                className: 'bg-green-100 text-green-800 hover:bg-green-100',
            },
            Shipped: {
                label: dict.marketplace.supplier.ordersPage.status.shipped,
                className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
            },
            Delivered: {
                label: dict.marketplace.supplier.ordersPage.status.delivered,
                className: 'bg-green-100 text-green-800 hover:bg-green-100',
            },
            Rejected: {
                label: dict.marketplace.supplier.ordersPage.status.rejected,
                className: 'bg-red-100 text-red-800 hover:bg-red-100',
            },
            Cancelled: {
                label: dict.marketplace.supplier.ordersPage.status.cancelled,
                className: 'bg-red-100 text-red-800 hover:bg-red-100',
            },
        };
        const config = badges[status] || {
            label: status,
            className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
        };
        return (
            <Badge variant="default" className={config.className}>
                {config.label}
            </Badge>
        );
    }

    // Get card title based on active tab
    const getCardTitle = () => {
        switch (activeTab) {
            case 'draft':
                return dict.marketplace.supplier.ordersPage.cardTitles.draft;
            case 'submitted':
                return dict.marketplace.supplier.ordersPage.cardTitles
                    .submitted;
            case 'confirmed':
                return dict.marketplace.supplier.ordersPage.cardTitles
                    .confirmed;
            case 'paid':
                return dict.marketplace.supplier.ordersPage.cardTitles.paid;
            case 'shipped':
                return dict.marketplace.supplier.ordersPage.cardTitles.shipped;
            case 'delivered':
                return dict.marketplace.supplier.ordersPage.cardTitles
                    .delivered;
            case 'rejected':
                return dict.marketplace.supplier.ordersPage.cardTitles.rejected;
            case 'cancelled':
                return dict.marketplace.supplier.ordersPage.cardTitles
                    .cancelled;
            default:
                return dict.marketplace.supplier.ordersPage.cardTitles.all;
        }
    };

    if (isLoading) return <p className="py-8 text-center">Loading...</p>;
    if (error)
        return (
            <p className="py-8 text-center text-red-600">Error loading users</p>
        );

    return (
        <div className="bg-card rounded-lg border shadow-sm">
            <div className="border-b px-6 py-4">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    {getCardTitle()}
                </h3>
            </div>
            <div>
                {filteredHistory.length === 0 ? (
                    <div className="py-12 text-center">
                        <PackageIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                        <p className="text-muted-foreground">
                            {dict.marketplace.supplier.ordersPage.noOrders}
                        </p>
                    </div>
                ) : (
                    <div className="w-full max-w-[calc(100vw-3rem)] overflow-x-auto">
                        <Table className="min-w-[700px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="bg-card sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                        {
                                            dict.marketplace.supplier.ordersPage
                                                .table.orderId
                                        }
                                    </TableHead>
                                    <TableHead>
                                        {
                                            dict.marketplace.supplier.ordersPage
                                                .table.buyer
                                        }
                                    </TableHead>
                                    <TableHead>
                                        {
                                            dict.marketplace.supplier.ordersPage
                                                .table.items
                                        }
                                    </TableHead>
                                    <TableHead>
                                        {
                                            dict.marketplace.supplier.ordersPage
                                                .table.total
                                        }
                                    </TableHead>
                                    <TableHead>
                                        {
                                            dict.marketplace.supplier.ordersPage
                                                .table.date
                                        }
                                    </TableHead>
                                    <TableHead>
                                        {
                                            dict.marketplace.supplier.ordersPage
                                                .table.status
                                        }
                                    </TableHead>
                                    <TableHead className="text-right">
                                        {
                                            dict.marketplace.supplier.ordersPage
                                                .table.actions
                                        }
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredHistory.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="bg-card sticky left-0 z-10 font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                            {order.id}
                                        </TableCell>
                                        <TableCell>
                                            {order.buyer.username}
                                        </TableCell>
                                        <TableCell>
                                            {order.items.length}{' '}
                                            {
                                                dict.marketplace.supplier
                                                    .ordersPage.itemsSuffix
                                            }
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            $
                                            {order.total_price.toLocaleString()}
                                        </TableCell>
                                        <TableCell>{order.date}</TableCell>
                                        <TableCell>
                                            <StatusBadge
                                                status={order.status}
                                                dict={dict}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {(order.status ===
                                                    'confirmed' ||
                                                    order.status ===
                                                        'Confirmed' ||
                                                    order.status ===
                                                        'Paid') && (
                                                    <Button
                                                        onClick={async ()=>{
                                                            await updateOrderStatus({
                                                                order_id: order.id,
                                                                status: "Shipped",
                                                            })
                                                            mutate();
                                                        }}
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        {
                                                            dict.marketplace
                                                                .supplier
                                                                .ordersPage
                                                                .markShipped
                                                        }
                                                    </Button>
                                                )}
                                                <Button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                    }}
                                                    size="sm"
                                                    variant="ghost"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            {!!selectedOrder && (
                <OrderDialog
                    mutate={mutate}
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
