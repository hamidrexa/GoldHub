import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Package as PackageIcon } from 'lucide-react';
import { getSellsHistory, updateOrderStatus, ApiOrderStatus } from '@/lib/api-client';
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

// Define display order type for compatibility
interface DisplayOrder {
    id: string;
    buyer: string;
    items: number;
    total: number;
    status: string;
    date: string;
}

interface PageProps {
    params: { lang: Locale };
    searchParams: { tab?: string; q?: string };
}

// Server-side status badge
function StatusBadge({ status, dict }: { status: string; dict: any }) {
    const badges: Record<string, { label: string; className: string }> = {
        // API status values
        'Draft': { label: dict.marketplace.supplier.ordersPage.status.draft || 'Draft', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
        'Submitted': { label: dict.marketplace.supplier.ordersPage.status.new, className: 'bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7]' },
        'Confirmed': { label: dict.marketplace.supplier.ordersPage.status.processing, className: 'bg-[#DBEAFE] text-[#1E40AF] hover:bg-[#DBEAFE]' },
        'Paid': { label: dict.marketplace.supplier.ordersPage.status.paid || 'Paid', className: 'bg-[#D1FAE5] text-[#065F46] hover:bg-[#D1FAE5]' },
        'Shipped': { label: dict.marketplace.supplier.ordersPage.status.shipped, className: 'bg-[#DBEAFE] text-[#1E40AF] hover:bg-[#DBEAFE]' },
        'Delivered': { label: dict.marketplace.supplier.ordersPage.status.completed, className: 'bg-[#D1FAE5] text-[#065F46] hover:bg-[#D1FAE5]' },
        'Rejected': { label: dict.marketplace.supplier.ordersPage.status.rejected || 'Rejected', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
        'Cancelled': { label: dict.marketplace.supplier.ordersPage.status.cancelled, className: 'bg-red-100 text-red-800 hover:bg-red-100' },
        // Legacy status values (for mock data fallback)
        'pending_supplier': { label: dict.marketplace.supplier.ordersPage.status.new, className: 'bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7]' },
        'confirmed': { label: dict.marketplace.supplier.ordersPage.status.processing, className: 'bg-[#DBEAFE] text-[#1E40AF] hover:bg-[#DBEAFE]' },
        'shipped': { label: dict.marketplace.supplier.ordersPage.status.shipped, className: 'bg-[#DBEAFE] text-[#1E40AF] hover:bg-[#DBEAFE]' },
        'completed': { label: dict.marketplace.supplier.ordersPage.status.completed, className: 'bg-[#D1FAE5] text-[#065F46] hover:bg-[#D1FAE5]' },
        'cancelled': { label: dict.marketplace.supplier.ordersPage.status.cancelled, className: 'bg-red-100 text-red-800 hover:bg-red-100' },
    };
    const config = badges[status] || badges['Submitted'];
    return <Badge variant="default" className={config.className}>{config.label}</Badge>;
}

// Helper to normalize status for filtering
function normalizeStatus(status: string): string {
    const statusMap: Record<string, string> = {
        'Draft': 'pending_supplier',
        'Submitted': 'pending_supplier',
        'Confirmed': 'confirmed',
        'Paid': 'confirmed',
        'Shipped': 'shipped',
        'Delivered': 'closed',
        'Rejected': 'closed',
        'Cancelled': 'closed',
        // Legacy mappings
        'pending_supplier': 'pending_supplier',
        'confirmed': 'confirmed',
        'shipped': 'shipped',
        'closed': 'closed',
        'cancelled': 'closed',
    };
    return statusMap[status] || 'pending_supplier';
}

export default async function SupplierOrdersPage({ params: { lang }, searchParams }: PageProps) {
    const dict = await getDictionary(lang);
    const activeTab = searchParams.tab || 'all';
    const searchQuery = searchParams.q || '';

    // Fetch orders from API, fallback to mock data
    let orders: DisplayOrder[] = [];
    try {
        const apiOrders = await getSellsHistory();
        orders = apiOrders.map(order => ({
            id: String(order.id),
            buyer: order.buyer || 'Unknown',
            items: order.items_count,
            total: order.total,
            status: order.status,
            date: new Date(order.created_at).toLocaleDateString(),
        }));
    } catch (error) {
        console.error('Failed to fetch sells history from API, using mock data:', error);
        // Supplier sees orders where they need to take action
        const supplierRelevantOrders = mockOrders.filter(o =>
            ['pending_supplier', 'confirmed', 'shipped', 'closed'].includes(o.status)
        );
        orders = supplierRelevantOrders.map(order => ({
            id: order.id,
            buyer: order.buyer,
            items: order.items,
            total: order.total,
            status: order.status,
            date: order.date,
        }));
    }

    // Filter orders server-side
    let filteredOrders = [...orders];

    // Filter by search
    if (searchQuery) {
        filteredOrders = filteredOrders.filter(order =>
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.buyer.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Filter by tab
    if (activeTab !== 'all') {
        filteredOrders = filteredOrders.filter(order => normalizeStatus(order.status) === activeTab);
    }

    // Count orders by status for tabs
    const statusCounts = {
        all: orders.length,
        pending_supplier: orders.filter(o => normalizeStatus(o.status) === 'pending_supplier').length,
        confirmed: orders.filter(o => normalizeStatus(o.status) === 'confirmed').length,
        shipped: orders.filter(o => normalizeStatus(o.status) === 'shipped').length,
        closed: orders.filter(o => normalizeStatus(o.status) === 'closed').length,
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
                <CardContent>
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <PackageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">{dict.marketplace.supplier.ordersPage.noOrders}</p>
                        </div>
                    ) : (
                        <Table>
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
                                                {(order.status === 'confirmed' || order.status === 'Confirmed' || order.status === 'Paid') && (
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
