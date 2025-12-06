import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Package as PackageIcon } from 'lucide-react';
import { mockOrders, Order } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { OrdersSearch } from './orders-search';

interface PageProps {
    params: { lang: Locale };
    searchParams: { tab?: string; q?: string };
}

// Server-side status badge
function StatusBadge({ status, dict }: { status: Order['status']; dict: any }) {
    const badges = {
        pending_supplier: { label: dict.marketplace.supplier.ordersPage.status.new, className: 'bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7]' },
        confirmed: { label: dict.marketplace.supplier.ordersPage.status.processing, className: 'bg-[#DBEAFE] text-[#1E40AF] hover:bg-[#DBEAFE]' },
        shipped: { label: dict.marketplace.supplier.ordersPage.status.shipped, className: 'bg-[#DBEAFE] text-[#1E40AF] hover:bg-[#DBEAFE]' },
        completed: { label: dict.marketplace.supplier.ordersPage.status.completed, className: 'bg-[#D1FAE5] text-[#065F46] hover:bg-[#D1FAE5]' },
        cancelled: { label: dict.marketplace.supplier.ordersPage.status.cancelled, className: 'bg-red-100 text-red-800 hover:bg-red-100' },
    };
    const config = badges[status] || badges.pending_supplier;
    return <Badge variant="default" className={config.className}>{config.label}</Badge>;
}

export default async function SupplierOrdersPage({ params: { lang }, searchParams }: PageProps) {
    const dict = await getDictionary(lang);
    const activeTab = searchParams.tab || 'all';
    const searchQuery = searchParams.q || '';

    // Supplier sees orders where they need to take action
    const supplierRelevantOrders = mockOrders.filter(o =>
        ['pending_supplier', 'confirmed', 'shipped', 'closed'].includes(o.status)
    );

    // Filter orders server-side
    let filteredOrders = [...supplierRelevantOrders];

    // Filter by search
    if (searchQuery) {
        filteredOrders = filteredOrders.filter(order =>
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.buyer.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Filter by tab
    if (activeTab !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === activeTab);
    }

    // Count orders by status for tabs
    const statusCounts = {
        all: supplierRelevantOrders.length,
        pending_supplier: supplierRelevantOrders.filter(o => o.status === 'pending_supplier').length,
        confirmed: supplierRelevantOrders.filter(o => o.status === 'confirmed').length,
        shipped: supplierRelevantOrders.filter(o => o.status === 'shipped').length,
        closed: supplierRelevantOrders.filter(o => o.status === 'closed').length,
    };

    const tabs = [
        { value: 'all', label: `${dict.marketplace.supplier.ordersPage.tabs.all} (${statusCounts.all})` },
        { value: 'pending_supplier', label: `${dict.marketplace.supplier.ordersPage.tabs.new} (${statusCounts.pending_supplier})` },
        { value: 'confirmed', label: `${dict.marketplace.supplier.ordersPage.tabs.processing} (${statusCounts.confirmed})` },
        { value: 'shipped', label: `${dict.marketplace.supplier.ordersPage.tabs.shipped} (${statusCounts.shipped})` },
        { value: 'closed', label: `${dict.marketplace.supplier.ordersPage.tabs.closed} (${statusCounts.closed})` },
    ];

    // Get card title based on active tab
    const getCardTitle = () => {
        switch (activeTab) {
            case 'pending_supplier': return dict.marketplace.supplier.ordersPage.cardTitles.new;
            case 'confirmed': return dict.marketplace.supplier.ordersPage.cardTitles.processing;
            case 'shipped': return dict.marketplace.supplier.ordersPage.cardTitles.shipped;
            case 'closed': return dict.marketplace.supplier.ordersPage.cardTitles.closed;
            default: return dict.marketplace.supplier.ordersPage.cardTitles.all;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.supplier.ordersPage.title}</h1>
                <p className="text-muted-foreground">{dict.marketplace.supplier.ordersPage.description}</p>
            </div>

            {/* Search */}
            <OrdersSearch
                placeholder={dict.marketplace.supplier.ordersPage.searchPlaceholder}
                defaultValue={searchQuery}
            />

            {/* Server-side tabs using URL params */}
            <div className="border-b w-full flex space-x-4 overflow-x-auto">
                {tabs.map((tab) => (
                    <Link
                        key={tab.value}
                        href={`/${lang}/supplier/orders?tab=${tab.value}${searchQuery ? `&q=${searchQuery}` : ''}`}
                        className={`px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.value
                            ? 'border-primary text-primary font-medium'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle>{getCardTitle()}</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <PackageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">{dict.marketplace.supplier.ordersPage.noOrders}</p>
                        </div>
                    ) : (
                        <Table className="min-w-[700px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{dict.marketplace.supplier.ordersPage.table.orderId}</TableHead>
                                    <TableHead>{dict.marketplace.supplier.ordersPage.table.buyer}</TableHead>
                                    <TableHead>{dict.marketplace.supplier.ordersPage.table.items}</TableHead>
                                    <TableHead>{dict.marketplace.supplier.ordersPage.table.total}</TableHead>
                                    <TableHead>{dict.marketplace.supplier.ordersPage.table.date}</TableHead>
                                    <TableHead>{dict.marketplace.supplier.ordersPage.table.status}</TableHead>
                                    <TableHead className="text-right">{dict.marketplace.supplier.ordersPage.table.actions}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">{order.id}</TableCell>
                                        <TableCell>{order.buyer}</TableCell>
                                        <TableCell>{order.items} {dict.marketplace.supplier.ordersPage.itemsSuffix}</TableCell>
                                        <TableCell className="font-semibold">
                                            ${order.total.toLocaleString()}
                                        </TableCell>
                                        <TableCell>{order.date}</TableCell>
                                        <TableCell><StatusBadge status={order.status} dict={dict} /></TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {order.status === 'confirmed' && (
                                                    <Button size="sm" variant="outline">
                                                        {dict.marketplace.supplier.ordersPage.markShipped}
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
        </div>
    );
}
