import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
    { params: { lang } }: PageProps,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const seoTitle = dict.marketplace.buyer.welcomeBack || 'Your Dashboard';
    const seoDescription = dict.marketplace.buyer.browseDescription || 'View your recent orders, track shipments, and discover new products on GoldHub.';

    return {
        title: `${seoTitle}`,
        description: seoDescription,
        openGraph: {
            title: `${seoTitle}`,
            description: seoDescription,
        },
        alternates: {
            canonical: `/${lang}/buyer/dashboard`,
        },
    };
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, DollarSign, Clock, Heart, TrendingUp, ArrowRight } from 'lucide-react';
import { mockBuyerOrders } from '@/lib/buyer-mock-data';
import { mockProducts } from '@/lib/mock-data';
import { mockWishlist } from '@/lib/buyer-mock-data';
import Link from 'next/link';
import { BuyerStartCards } from '@/app/[lang]/(user)/buyer/components/start-cards';

interface PageProps {
    params: { lang: Locale };
}

// Server-side status badge component
function StatusBadge({ status, dict }: { status: string; dict: any }) {
    const badges: Record<string, { label: string; className: string }> = {
        'Draft': { label: dict.marketplace.buyer.ordersPage.status.draft, className: 'bg-status-draft-bg text-status-draft-text' },
        'Submitted': { label: dict.marketplace.buyer.ordersPage.status.submitted, className: 'bg-status-shipped-bg text-status-shipped-text' },
        'Confirmed': { label: dict.marketplace.buyer.ordersPage.status.confirmed, className: 'bg-status-confirmed-bg text-status-confirmed-text' },
        'Paid': { label: dict.marketplace.buyer.ordersPage.status.paid, className: 'bg-status-confirmed-bg text-status-confirmed-text' },
        'Shipped': { label: dict.marketplace.buyer.ordersPage.status.shipped, className: 'bg-status-shipped-bg text-status-shipped-text' },
        'Delivered': { label: dict.marketplace.buyer.ordersPage.status.delivered, className: 'bg-status-delivered-bg text-status-delivered-text' },
        'Rejected': { label: dict.marketplace.buyer.ordersPage.status.rejected, className: 'bg-red-100 text-red-800' },
        'Cancelled': { label: dict.marketplace.buyer.ordersPage.status.cancelled, className: 'bg-red-100 text-red-800' },
    };
    const config = badges[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.className}>{config.label}</Badge>;
}

export default async function BuyerDashboardPage({ params: { lang } }: PageProps) {
    const dict = await getDictionary(lang);

    // Calculate stats
    const activeOrders = mockBuyerOrders.filter(o =>
        !['delivered', 'closed', 'cancelled'].includes(o.status)
    ).length;

    const totalSpent = mockBuyerOrders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, order) => sum + order.total, 0);

    const pendingDeliveries = mockBuyerOrders.filter(o =>
        ['shipped', 'ready'].includes(o.status)
    ).length;

    const savedItems = mockWishlist.length;

    // Market prices (mock data)
    const marketPrices = [
        { metal: 'Gold (24K)', price: 74.50, unit: 'g', change: 1.2 },
        { metal: 'Silver', price: 0.85, unit: 'g', change: -0.5 },
        { metal: 'Platinum', price: 33.00, unit: 'g', change: 0.8 },
    ];

    // Recent orders (top 3)
    const recentOrders = mockBuyerOrders.slice(0, 3);

    // Featured products (first 4)
    const featuredProducts = mockProducts.filter(p => p.status === 'active').slice(0, 4);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.buyer.welcomeBack}</h1>
                    <p className="text-muted-foreground">{dict.marketplace.buyer.browseDescription}</p>
                </div>
                <Link href={`/${lang}/buyer/catalog`}>
                    <Button className="bg-gold-600 hover:bg-gold-700 text-black">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        {dict.marketplace.buyer.browseCatalog}
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <BuyerStartCards dict={dict} lang={lang} />

            <div className="grid gap-6 lg:grid-cols-5">
                {/* Market Prices */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">{dict.marketplace.buyer.marketPrices}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {marketPrices.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-sm">{item.metal}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <TrendingUp className={`h-3 w-3 ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                                        <span className={`text-xs ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {item.change >= 0 ? '+' : ''}{item.change}%
                                        </span>
                                    </div>
                                </div>
                                <p className="text-lg font-bold text-yellow-600">
                                    ${item.price.toFixed(2)}/{item.unit}
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card className="lg:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">{dict.marketplace.buyer.recentOrders}</CardTitle>
                        <Link href={`/${lang}/buyer/orders`}>
                            <Button variant="ghost" size="sm">
                                {dict.marketplace.common.viewAll}
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-semibold">{order.id}</p>
                                        <StatusBadge status={order.status} dict={dict} />
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {order.orderItems[0]?.product.name.includes('Premium') ? 'Premium Gold Co.' : 'Luxury Jewelers Inc.'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">${order.total.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Featured Products */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">{dict.marketplace.buyer.featuredProducts}</CardTitle>
                    <Link href={`/${lang}/buyer/catalog`}>
                        <Button variant="ghost" size="sm">
                            {dict.marketplace.buyer.viewCatalog}
                            <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {featuredProducts.map((product) => (
                            <Link key={product.id} href={`/${lang}/buyer/catalog/${product.id}`}>
                                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="p-4">
                                        {/* Product Image */}
                                        <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                                            <ShoppingBag className="h-12 w-12 text-gray-400" />
                                        </div>

                                        {/* Product Info */}
                                        <div className="space-y-1">
                                            <h4 className="font-semibold text-sm line-clamp-2">{product.name}</h4>
                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                Premium Gold Co.
                                            </p>
                                            <p className="text-lg font-bold text-yellow-600">
                                                ${product.price.toLocaleString()}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
