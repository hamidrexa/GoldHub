import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
    { params: { lang } }: PageProps,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const seoTitle = dict.marketplace.supplier.ordersPage.title || 'Your Orders';
    const seoDescription = dict.marketplace.supplier.ordersPage.description || 'View and manage your incoming orders on GoldHub.';

    return {
        title: `${seoTitle} | GoldHub`,
        description: seoDescription,
        openGraph: {
            title: `${seoTitle} | GoldHub`,
            description: seoDescription,
        },
        alternates: {
            canonical: `/${lang}/supplier/orders`,
        },
    };
}
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
import { OrdersSearch } from './orders-search';
import { URLTabs } from '@/components/ui/url-tabs';

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
        'Draft': { label: dict.marketplace.supplier.ordersPage.status.draft, className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
        'Submitted': { label: dict.marketplace.supplier.ordersPage.status.submitted, className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
        'Confirmed': { label: dict.marketplace.supplier.ordersPage.status.confirmed, className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
        'Paid': { label: dict.marketplace.supplier.ordersPage.status.paid, className: 'bg-green-100 text-green-800 hover:bg-green-100' },
        'Shipped': { label: dict.marketplace.supplier.ordersPage.status.shipped, className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
        'Delivered': { label: dict.marketplace.supplier.ordersPage.status.delivered, className: 'bg-green-100 text-green-800 hover:bg-green-100' },
        'Rejected': { label: dict.marketplace.supplier.ordersPage.status.rejected, className: 'bg-red-100 text-red-800 hover:bg-red-100' },
        'Cancelled': { label: dict.marketplace.supplier.ordersPage.status.cancelled, className: 'bg-red-100 text-red-800 hover:bg-red-100' },
    };
    const config = badges[status] || { label: status, className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' };
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
        { value: 'all', label: dict.marketplace.supplier.ordersPage.tabs.all },
        { value: 'Draft', label: dict.marketplace.supplier.ordersPage.tabs.draft },
        { value: 'Submitted', label: dict.marketplace.supplier.ordersPage.tabs.submitted },
        { value: 'Confirmed', label: dict.marketplace.supplier.ordersPage.tabs.confirmed },
        { value: 'Paid', label: dict.marketplace.supplier.ordersPage.tabs.paid },
        { value: 'Shipped', label: dict.marketplace.supplier.ordersPage.tabs.shipped },
        { value: 'Delivered', label: dict.marketplace.supplier.ordersPage.tabs.delivered },
        { value: 'Rejected', label: dict.marketplace.supplier.ordersPage.tabs.rejected },
        { value: 'Cancelled', label: dict.marketplace.supplier.ordersPage.tabs.cancelled },
    ];

    // Get card title based on active tab
    const getCardTitle = () => {
        switch (activeTab) {
            case 'draft': return dict.marketplace.supplier.ordersPage.cardTitles.draft;
            case 'submitted': return dict.marketplace.supplier.ordersPage.cardTitles.submitted;
            case 'confirmed': return dict.marketplace.supplier.ordersPage.cardTitles.confirmed;
            case 'paid': return dict.marketplace.supplier.ordersPage.cardTitles.paid;
            case 'shipped': return dict.marketplace.supplier.ordersPage.cardTitles.shipped;
            case 'delivered': return dict.marketplace.supplier.ordersPage.cardTitles.delivered;
            case 'rejected': return dict.marketplace.supplier.ordersPage.cardTitles.rejected;
            case 'cancelled': return dict.marketplace.supplier.ordersPage.cardTitles.cancelled;
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

            {/* Client-side tabs wrapper */}
            <URLTabs tabs={tabs} defaultValue={activeTab} />

            {/* Orders Table */}
            <div className="border rounded-lg shadow-sm bg-card">
                <div className="px-6 py-4 border-b">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">{getCardTitle()}</h3>
                </div>
                <div>
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <PackageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">{dict.marketplace.supplier.ordersPage.noOrders}</p>
                        </div>
                    ) : (
                        <div className="w-full overflow-x-auto max-w-[calc(100vw-3rem)]">
                            <Table className="min-w-[700px]">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="sticky left-0 z-20 bg-card shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">{dict.marketplace.supplier.ordersPage.table.orderId}</TableHead>
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
                                            <TableCell className="font-medium sticky left-0 z-10 bg-card shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">{order.id}</TableCell>
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
