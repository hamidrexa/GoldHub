import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Badge } from '@/components/ui/badge';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { mockOrders, Order } from '@/lib/mock-data';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { OrdersSearch } from './orders-search';

// Server-side status badge component
function StatusBadge({ status, dict }: { status: Order['status']; dict: any }) {
    const badges = {
        confirmed: { label: dict.marketplace.admin.ordersPage.status.confirmed, className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
        shipped: { label: dict.marketplace.admin.ordersPage.status.shipped, className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
        pending_supplier: { label: dict.marketplace.admin.ordersPage.status.pendingSupplier, className: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
        closed: { label: dict.marketplace.admin.ordersPage.status.closed, className: 'bg-green-100 text-green-800 hover:bg-green-100' },
        cancelled: { label: dict.marketplace.admin.ordersPage.status.cancelled, className: 'bg-red-100 text-red-800 hover:bg-red-100' },
    };
    const config = badges[status];
    return <Badge variant="default" className={config.className}>{config.label}</Badge>;
}

interface PageProps {
    params: { lang: Locale };
    searchParams: { tab?: string; q?: string };
}

export default async function OrdersPage({ params: { lang }, searchParams }: PageProps) {
    const dict = await getDictionary(lang);
    const activeTab = searchParams.tab || 'all';
    const searchQuery = searchParams.q || '';

    // Filter orders server-side
    let filteredOrders = [...mockOrders];

    // Filter by search
    if (searchQuery) {
        filteredOrders = filteredOrders.filter(order =>
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.buyer.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Filter by tab
    if (activeTab === 'pending') {
        filteredOrders = filteredOrders.filter(order => order.status === 'pending_supplier');
    } else if (activeTab === 'active') {
        filteredOrders = filteredOrders.filter(order => order.status === 'confirmed' || order.status === 'shipped');
    } else if (activeTab === 'closed') {
        filteredOrders = filteredOrders.filter(order => order.status === 'closed');
    }

    const pendingCount = mockOrders.filter(o => o.status === 'pending_supplier').length;
    const activeCount = mockOrders.filter(o => o.status === 'confirmed' || o.status === 'shipped').length;

    const tabs = [
        { value: 'all', label: dict.marketplace.admin.ordersPage.tabs.all },
        { value: 'pending', label: `${dict.marketplace.admin.ordersPage.tabs.pending} (${pendingCount})` },
        { value: 'active', label: `${dict.marketplace.admin.ordersPage.tabs.active} (${activeCount})` },
        { value: 'closed', label: dict.marketplace.admin.ordersPage.tabs.closed },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.admin.ordersPage.title}</h1>
                <p className="text-muted-foreground">{dict.marketplace.admin.ordersPage.description}</p>
            </div>

            {/* Client-side search component */}
            <OrdersSearch
                placeholder={dict.marketplace.admin.ordersPage.searchPlaceholder}
                defaultValue={searchQuery}
            />

            {/* Server-side tabs using URL params */}
            <div className="border-b w-full flex space-x-4 overflow-x-auto">
                {tabs.map((tab) => (
                    <Link
                        key={tab.value}
                        href={`/${lang}/admin/orders?tab=${tab.value}${searchQuery ? `&q=${searchQuery}` : ''}`}
                        className={`px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.value
                            ? 'border-primary text-primary font-medium'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>

            {/* Server-rendered table */}
            <div className="rounded-lg border bg-white overflow-x-auto">
                <Table className="min-w-[700px]">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-semibold">{dict.marketplace.admin.ordersPage.table.orderId}</TableHead>
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
                                    <TableCell className="font-medium">{order.id}</TableCell>
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
                                            {order.status === 'pending_supplier' && (
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
    );
}
