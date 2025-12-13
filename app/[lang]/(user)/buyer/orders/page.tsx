import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
    { params: { lang } }: PageProps,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const seoTitle = dict.marketplace.buyer.ordersPage.title || 'Your Orders';
    const seoDescription = dict.marketplace.buyer.ordersPage.description || 'Track your current and past orders on GoldHub.';

    return {
        title: `${seoTitle}`,
        description: seoDescription,
        openGraph: {
            title: `${seoTitle}`,
            description: seoDescription,
        },
        alternates: {
            canonical: `/${lang}/buyer/orders`,
        },
    };
}
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Package } from 'lucide-react';
import { getOrdersHistory, ApiOrderStatus } from '@/lib/api-client';
import { mockBuyerOrders } from '@/lib/buyer-mock-data';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { URLTabs } from '@/components/ui/url-tabs';
import { OrdersSearch } from './orders-search';
import { ViewToggle } from './orders-view-toggle';
import { OrderSection } from '@/app/[lang]/(user)/buyer/components/order-section';

interface PageProps {
    params: { lang: Locale };
    searchParams: { tab?: string; q?: string; view?: string };
}

// Display order type for compatibility
interface DisplayOrder {
    id: string;
    buyer: string;
    items: number;
    total: number;
    status: string;
    date: string;
    timeline: { status: string; timestamp: string; completed: boolean; notes?: string }[];
    orderItems: { product: { name: string }; quantity: number; priceAtOrder: number; subtotal: number }[];
}

// Server-side status badge component
function StatusBadge({ status, dict }: { status: string; dict: any }) {
    const badges: Record<string, { label: string; className: string }> = {
        // API status values
        'Draft': { label: dict.marketplace.buyer.ordersPage.status.draft, className: 'bg-status-draft-bg text-status-draft-text hover:bg-status-draft-bg' },
        'Submitted': { label: dict.marketplace.buyer.ordersPage.status.submitted, className: 'bg-status-shipped-bg text-status-shipped-text hover:bg-status-shipped-bg' },
        'Confirmed': { label: dict.marketplace.buyer.ordersPage.status.confirmed, className: 'bg-status-confirmed-bg text-status-confirmed-text hover:bg-status-confirmed-bg' },
        'Paid': { label: dict.marketplace.buyer.ordersPage.status.paid, className: 'bg-status-confirmed-bg text-status-confirmed-text hover:bg-status-confirmed-bg' },
        'Shipped': { label: dict.marketplace.buyer.ordersPage.status.shipped, className: 'bg-status-shipped-bg text-status-shipped-text hover:bg-status-shipped-bg' },
        'Delivered': { label: dict.marketplace.buyer.ordersPage.status.delivered, className: 'bg-status-delivered-bg text-status-delivered-text hover:bg-status-delivered-bg' },
        'Rejected': { label: dict.marketplace.buyer.ordersPage.status.rejected, className: 'bg-red-100 text-red-800 hover:bg-red-100' },
        'Cancelled': { label: dict.marketplace.buyer.ordersPage.status.cancelled, className: 'bg-red-100 text-red-800 hover:bg-red-100' },
        // Legacy status values
        'draft': { label: dict.marketplace.buyer.ordersPage.status.draft, className: 'bg-status-draft-bg text-status-draft-text hover:bg-status-draft-bg' },
        'submitted': { label: dict.marketplace.buyer.ordersPage.status.submitted, className: 'bg-status-shipped-bg text-status-shipped-text hover:bg-status-shipped-bg' },
        'pending_supplier': { label: dict.marketplace.buyer.ordersPage.status.pendingSupplier, className: 'bg-status-pending-bg text-status-pending-text hover:bg-status-pending-bg' },
        'confirmed': { label: dict.marketplace.buyer.ordersPage.status.confirmed, className: 'bg-status-confirmed-bg text-status-confirmed-text hover:bg-status-confirmed-bg' },
        'in_processing': { label: dict.marketplace.buyer.ordersPage.status.processing, className: 'bg-status-shipped-bg text-status-shipped-text hover:bg-status-shipped-bg' },
        'ready': { label: dict.marketplace.buyer.ordersPage.status.ready, className: 'bg-status-shipped-bg text-status-shipped-text hover:bg-status-shipped-bg' },
        'shipped': { label: dict.marketplace.buyer.ordersPage.status.shipped, className: 'bg-status-shipped-bg text-status-shipped-text hover:bg-status-shipped-bg' },
        'delivered': { label: dict.marketplace.buyer.ordersPage.status.delivered, className: 'bg-status-delivered-bg text-status-delivered-text hover:bg-status-delivered-bg' },
        'closed': { label: dict.marketplace.buyer.ordersPage.status.closed, className: 'bg-status-draft-bg text-status-draft-text hover:bg-status-draft-bg' },
        'cancelled': { label: dict.marketplace.buyer.ordersPage.status.cancelled, className: 'bg-red-100 text-red-800 hover:bg-red-100' },
    };
    const config = badges[status] || { label: status, className: 'bg-status-draft-bg text-status-draft-text hover:bg-status-draft-bg' };
    return <Badge variant="default" className={config.className}>{config.label}</Badge>;
}

// Helper function to get status label
function getStatusLabel(status: string, dict: any): string {
    const labels: Record<string, string> = {
        // API status values
        'Draft': dict.marketplace.buyer.ordersPage.status.draft,
        'Submitted': dict.marketplace.buyer.ordersPage.status.submitted,
        'Confirmed': dict.marketplace.buyer.ordersPage.status.confirmed,
        'Paid': dict.marketplace.buyer.ordersPage.status.paid,
        'Shipped': dict.marketplace.buyer.ordersPage.status.shipped,
        'Delivered': dict.marketplace.buyer.ordersPage.status.delivered,
        'Rejected': dict.marketplace.buyer.ordersPage.status.rejected,
        'Cancelled': dict.marketplace.buyer.ordersPage.status.cancelled,
        // Legacy values
        'draft': dict.marketplace.buyer.ordersPage.status.draft,
        'submitted': dict.marketplace.buyer.ordersPage.status.submitted,
        'pending_supplier': dict.marketplace.buyer.ordersPage.status.pendingSupplier,
        'confirmed': dict.marketplace.buyer.ordersPage.status.confirmed,
        'in_processing': dict.marketplace.buyer.ordersPage.status.inProcessing,
        'ready': dict.marketplace.buyer.ordersPage.status.ready,
        'shipped': dict.marketplace.buyer.ordersPage.status.shipped,
        'delivered': dict.marketplace.buyer.ordersPage.status.delivered,
        'closed': dict.marketplace.buyer.ordersPage.status.closed,
        'cancelled': dict.marketplace.buyer.ordersPage.status.cancelled,
    };
    return labels[status] || status;
}

// Calculate progress percentage based on status
function getProgressPercentage(order: DisplayOrder): number {
    const statusProgress: Record<string, number> = {
        'Draft': 10, 'Submitted': 20, 'Confirmed': 40, 'Paid': 50,
        'Shipped': 70, 'Delivered': 100, 'Rejected': 100, 'Cancelled': 100,
        // Legacy
        'draft': 10, 'submitted': 20, 'pending_supplier': 30, 'confirmed': 40,
        'in_processing': 50, 'ready': 60, 'shipped': 70, 'delivered': 90, 'closed': 100,
    };
    return statusProgress[order.status] || 0;
}

// Helper to normalize status for filtering
function normalizeStatus(status: string): string {
    const activeStatuses = ['Draft', 'Submitted', 'Confirmed', 'Paid', 'Shipped',
        'draft', 'submitted', 'pending_supplier', 'confirmed', 'in_processing', 'ready', 'shipped'];
    const completedStatuses = ['Delivered', 'Rejected', 'Cancelled', 'delivered', 'closed', 'cancelled'];

    if (activeStatuses.includes(status)) return 'active';
    if (completedStatuses.includes(status)) return 'completed';
    return 'active';
}

export default async function BuyerOrdersPage({ params: { lang }, searchParams }: PageProps) {
    const dict = await getDictionary(lang);
    const activeTab = searchParams.tab || 'all';
    const searchQuery = searchParams.q || '';
    const viewMode = (searchParams.view || 'grid') as 'grid' | 'list';

    // Fetch orders from API, fallback to mock data
    let orders: DisplayOrder[] = [];
    try {
        const apiOrders = await getOrdersHistory();
        orders = apiOrders.map(order => ({
            id: String(order.id),
            buyer: order.buyer || 'You',
            items: order.items_count,
            total: order.total,
            status: order.status,
            date: new Date(order.created_at).toLocaleDateString(),
            timeline: [
                { status: 'Submitted', timestamp: order.created_at, completed: true },
                { status: order.status, timestamp: order.updated_at, completed: true },
            ],
            orderItems: order.items?.map(item => ({
                product: { name: item.product.title },
                quantity: item.quantity,
                priceAtOrder: item.price_at_order,
                subtotal: item.price_at_order * item.quantity,
            })) || [],
        }));
    } catch (error) {
        console.error('Failed to fetch orders from API, using mock data:', error);
        orders = mockBuyerOrders.map(order => ({
            id: order.id,
            buyer: order.buyer,
            items: order.items,
            total: order.total,
            status: order.status,
            date: order.date,
            timeline: order.timeline,
            orderItems: order.orderItems.map(item => ({
                product: { name: item.product.name },
                quantity: item.quantity,
                priceAtOrder: item.priceAtOrder,
                subtotal: item.subtotal,
            })),
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
    if (activeTab === 'active') {
        filteredOrders = filteredOrders.filter(o => normalizeStatus(o.status) === 'active');
    } else if (activeTab === 'completed') {
        filteredOrders = filteredOrders.filter(o => normalizeStatus(o.status) === 'completed');
    }

    // Count orders by status group
    const statusCounts = {
        all: orders.length,
        active: orders.filter(o => normalizeStatus(o.status) === 'active').length,
        completed: orders.filter(o => normalizeStatus(o.status) === 'completed').length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.buyer.ordersPage.title}</h1>
                <p className="text-muted-foreground">{dict.marketplace.buyer.ordersPage.description}</p>
            </div>

            {/* Search and View Toggle */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <OrdersSearch
                    placeholder={dict.marketplace.buyer.ordersPage.searchPlaceholder}
                    defaultValue={searchQuery}
                />
                <ViewToggle currentView={viewMode} />
            </div>

            {/* Client-side tabs wrapper */}
            <URLTabs tabs={[
                { value: 'all', label: dict.marketplace.buyer.ordersPage.tabs.all },
                { value: 'Draft', label: dict.marketplace.buyer.ordersPage.tabs.draft },
                { value: 'Submitted', label: dict.marketplace.buyer.ordersPage.tabs.submitted },
                { value: 'Confirmed', label: dict.marketplace.buyer.ordersPage.tabs.confirmed },
                { value: 'Paid', label: dict.marketplace.buyer.ordersPage.tabs.paid },
                { value: 'Shipped', label: dict.marketplace.buyer.ordersPage.tabs.shipped },
                { value: 'Delivered', label: dict.marketplace.buyer.ordersPage.tabs.delivered },
                { value: 'Rejected', label: dict.marketplace.buyer.ordersPage.tabs.rejected },
                { value: 'Cancelled', label: dict.marketplace.buyer.ordersPage.tabs.cancelled },
            ]} defaultValue={activeTab} />
            <OrderSection dict={dict} viewMode={viewMode} searchQuery={searchQuery} lang={lang} activeTab={activeTab}/>

            {/* Orders Content */}
        </div>
    );
}
