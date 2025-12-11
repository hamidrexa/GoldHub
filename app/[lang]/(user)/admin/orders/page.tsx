import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Badge } from '@/components/ui/badge';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { getOrdersHistory, ApiOrderStatus, mapApiOrderToUi } from '@/lib/api-client';
import { mockOrders, Order } from '@/lib/mock-data';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { URLTabs } from '@/components/ui/url-tabs';
import Link from 'next/link';
import { OrdersSearch } from './orders-search';

// Define order type compatible with both API and mock data
interface DisplayOrder {
    id: string;
    buyer: string;
    items: number;
    total: number;
    status: string;
    date: string;
}

// Server-side status badge component
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

interface PageProps {
    params: { lang: Locale };
    searchParams: { tab?: string; q?: string };
}

// Helper to normalize status for filtering
// Helper to get status label for display
function getStatusLabel(status: string, dict: any): string {
    const labels: Record<string, string> = {
        'Draft': dict.marketplace.admin.ordersPage.status.draft,
        'Submitted': dict.marketplace.admin.ordersPage.status.submitted,
        'Confirmed': dict.marketplace.admin.ordersPage.status.confirmed,
        'Paid': dict.marketplace.admin.ordersPage.status.paid,
        'Shipped': dict.marketplace.admin.ordersPage.status.shipped,
        'Delivered': dict.marketplace.admin.ordersPage.status.delivered,
        'Rejected': dict.marketplace.admin.ordersPage.status.rejected,
        'Cancelled': dict.marketplace.admin.ordersPage.status.cancelled,
        'confirmed': dict.marketplace.admin.ordersPage.status.confirmed,
        'shipped': dict.marketplace.admin.ordersPage.status.shipped,
        'pending_supplier': dict.marketplace.admin.ordersPage.status.pendingSupplier,
        'closed': dict.marketplace.admin.ordersPage.status.closed,
        'cancelled': dict.marketplace.admin.ordersPage.status.cancelled,
    };
    return labels[status] || status;
}
function normalizeStatus(status: string): string {
    const statusMap: Record<string, string> = {
        'Draft': 'pending',
        'Submitted': 'pending',
        'Confirmed': 'active',
        'Paid': 'active',
        'Shipped': 'active',
        'Delivered': 'closed',
        'Rejected': 'closed',
        'Cancelled': 'closed',
        // Legacy mappings
        'pending_supplier': 'pending',
        'confirmed': 'active',
        'shipped': 'active',
        'closed': 'closed',
        'cancelled': 'closed',
    };
    return statusMap[status] || 'pending';
}

export default async function OrdersPage({ params: { lang }, searchParams }: PageProps) {
    const dict = await getDictionary(lang);
    const activeTab = searchParams.tab || 'all';
    const searchQuery = searchParams.q || '';

    // Fetch orders from API, fallback to mock data on error
    let orders: DisplayOrder[] = [];
    try {
        const apiOrders = await getOrdersHistory();
        orders = apiOrders.map(order => ({
            id: String(order.id),
            buyer: order.buyer || 'Unknown',
            items: order.items_count,
            total: order.total,
            status: order.status,
            date: new Date(order.created_at).toLocaleDateString(),
        }));
    } catch (error) {
        console.error('Failed to fetch orders from API, using mock data:', error);
        orders = mockOrders.map(order => ({
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
    if (activeTab === 'pending') {
        filteredOrders = filteredOrders.filter(order => normalizeStatus(order.status) === 'pending');
    } else if (activeTab === 'active') {
        filteredOrders = filteredOrders.filter(order => normalizeStatus(order.status) === 'active');
    } else if (activeTab === 'closed') {
        filteredOrders = filteredOrders.filter(order => normalizeStatus(order.status) === 'closed');
    }

    const pendingCount = orders.filter(o => normalizeStatus(o.status) === 'pending').length;
    const activeCount = orders.filter(o => normalizeStatus(o.status) === 'active').length;

    // Fix: prevent horizontal scroll on the whole page
    return (
        <div className="space-y-6 max-w-full overflow-x-hidden">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.admin.ordersPage.title}</h1>
                <p className="text-muted-foreground">{dict.marketplace.admin.ordersPage.description}</p>
            </div>

            {/* Client-side search component */}
            <OrdersSearch
                placeholder={dict.marketplace.admin.ordersPage.searchPlaceholder}
                defaultValue={searchQuery}
            />

            {/* Client-side tabs wrapper */}
            <URLTabs tabs={[
                { value: 'all', label: dict.marketplace.admin.ordersPage.tabs.all },
                { value: 'Draft', label: dict.marketplace.admin.ordersPage.tabs.draft },
                { value: 'Submitted', label: dict.marketplace.admin.ordersPage.tabs.submitted },
                { value: 'Confirmed', label: dict.marketplace.admin.ordersPage.tabs.confirmed },
                { value: 'Paid', label: dict.marketplace.admin.ordersPage.tabs.paid },
                { value: 'Shipped', label: dict.marketplace.admin.ordersPage.tabs.shipped },
                { value: 'Delivered', label: dict.marketplace.admin.ordersPage.tabs.delivered },
                { value: 'Rejected', label: dict.marketplace.admin.ordersPage.tabs.rejected },
                { value: 'Cancelled', label: dict.marketplace.admin.ordersPage.tabs.cancelled },
            ]} defaultValue={activeTab} />

            {/* Server-rendered table */}
            <div className="border rounded-lg shadow-sm bg-card">
                <div className="w-full overflow-x-auto max-w-[calc(100vw-3rem)]">
                    <Table className="min-w-[700px]">
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-semibold sticky left-0 z-20 bg-card shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">{dict.marketplace.admin.ordersPage.table.orderId}</TableHead>
                                <TableHead className="font-semibold">{dict.marketplace.admin.ordersPage.table.buyer}</TableHead>
                                <TableHead className="font-semibold">{dict.marketplace.admin.ordersPage.table.items}</TableHead>
                                <TableHead className="font-semibold">{dict.marketplace.admin.ordersPage.table.total}</TableHead>
                                <TableHead className="font-semibold">{dict.marketplace.admin.ordersPage.table.status}</TableHead>
                                <TableHead className="font-semibold">{dict.marketplace.admin.ordersPage.table.date}</TableHead>
                                <TableHead className="font-semibold text-right">{dict.marketplace.admin.ordersPage.table.actions}</TableHead>
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
                                        <TableCell className="font-medium sticky left-0 z-10 bg-card shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">{order.id}</TableCell>
                                        <TableCell>{order.buyer}</TableCell>
                                        <TableCell>{order.items} {dict.marketplace.admin.ordersPage.table.itemsSuffix}</TableCell>
                                        <TableCell>${order.total.toLocaleString()}</TableCell>
                                        <TableCell><StatusBadge status={order.status} dict={dict} /></TableCell>
                                        <TableCell>{order.date}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/${lang}/admin/orders/${order.id}`}
                                                    className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100"
                                                >
                                                    <Eye className="h-4 w-4 text-gray-600" />
                                                </Link>
                                                {(order.status === 'pending_supplier' || order.status === 'Submitted') && (
                                                    <>
                                                        <button className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100">
                                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                                        </button>
                                                        <button className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100">
                                                            <XCircle className="h-4 w-4 text-red-600" />
                                                        </button>
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
            </div>
        </div>
    );
}
