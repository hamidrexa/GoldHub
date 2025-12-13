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
        title: `${seoTitle}`,
        description: seoDescription,
        openGraph: {
            title: `${seoTitle}`,
            description: seoDescription,
        },
        alternates: {
            canonical: `/${lang}/supplier/orders`,
        },
    };
}
import { getSellsHistory, updateOrderStatus, ApiOrderStatus } from '@/lib/api-client';
import { mockOrders, Order } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { OrdersSearch } from './orders-search';
import { URLTabs } from '@/components/ui/url-tabs';
import { OrdersTable } from '@/app/[lang]/(user)/supplier/components/orders-table';

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
            <OrdersTable dict={dict} lang={lang} activeTab={activeTab} searchQuery={searchQuery}/>
            {/* Orders Table */}
        </div>
    );
}
