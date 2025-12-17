import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Metadata, ResolvingMetadata } from 'next';

type Props = {
    params: { lang: Locale };
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
    { params: { lang } }: Props,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const seoTitle = dict.marketplace.admin.ordersPage.title || 'Manage Orders';
    const seoDescription = dict.marketplace.admin.ordersPage.description || 'View, track, and manage all customer orders in the GoldHub marketplace.';

    return {
        title: `${seoTitle}`,
        description: seoDescription,
        openGraph: {
            title: `${seoTitle}`,
            description: seoDescription,
        },
        alternates: {
            canonical: `/${lang}/admin/orders`,
        },
    };
}
import { getOrdersHistory } from '@/lib/api-client';
import { mockOrders, Order } from '@/lib/mock-data';
import { URLTabs } from '@/components/ui/url-tabs';
import Link from 'next/link';
import { OrdersSearch } from './orders-search';
import { AdminOrdersTable } from '@/app/[lang]/(user)/admin/components/orders-table';


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
           <AdminOrdersTable dict={dict} searchQuery={searchQuery} activeTab={activeTab} lang={lang}/>

        </div>
    );
}
