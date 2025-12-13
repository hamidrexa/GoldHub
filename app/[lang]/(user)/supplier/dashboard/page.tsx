import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Metadata, ResolvingMetadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, DollarSign, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { mockSupplierStats, mockOrders, mockProducts } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PageProps {
    params: { lang: Locale };
}

export async function generateMetadata(
    { params: { lang } }: PageProps,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const seoTitle = dict.marketplace.common.dashboard || 'Supplier Dashboard';
    const seoDescription = dict.marketplace.supplier.welcomeMessage || 'Manage your products, orders, and view sales analytics on the GoldHub supplier dashboard.';

    return {
        title: `${seoTitle} | GoldHub`,
        description: seoDescription,
        openGraph: {
            title: `${seoTitle} | GoldHub`,
            description: seoDescription,
        },
        alternates: {
            canonical: `/${lang}/supplier/dashboard`,
        },
    };
}

export default async function SupplierDashboardPage({ params: { lang } }: PageProps) {
    const dict = await getDictionary(lang);
    const stats = mockSupplierStats;

    // Get recent orders (supplier perspective - pending ones)
    const recentOrders = mockOrders.filter(o => o.status === 'pending_supplier' || o.status === 'confirmed').slice(0, 5);

    // Get top products
    const topProducts = mockProducts.filter(p => p.status === 'active').slice(0, 4);

    const statsCards = [
        {
            title: dict.marketplace.supplier.activeProducts,
            value: stats.activeProducts,
            icon: Package,
            description: dict.marketplace.supplier.listedProducts,
            color: 'text-navy-600',
            bgColor: 'bg-navy-50',
        },
        {
            title: dict.marketplace.supplier.pendingOrders,
            value: stats.pendingOrders,
            icon: ShoppingCart,
            description: dict.marketplace.supplier.awaitingFulfillment,
            color: 'text-gold-600',
            bgColor: 'bg-gold-50',
        },
        {
            title: dict.marketplace.supplier.revenueMtd,
            value: `$${stats.revenueMTD.toLocaleString()}`,
            icon: DollarSign,
            description: dict.marketplace.supplier.monthToDate,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
        },
        {
            title: dict.marketplace.supplier.avgOrderValue,
            value: `$${stats.avgOrderValue.toLocaleString()}`,
            icon: TrendingUp,
            description: dict.marketplace.supplier.perTransaction,
            color: 'text-navy-500',
            bgColor: 'bg-navy-50',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.common.dashboard}</h1>
                    <p className="text-muted-foreground">{dict.marketplace.supplier.welcomeMessage}</p>
                </div>
                <Link href={`/${lang}/supplier/products`}>
                    <Button className="bg-gold-600 hover:bg-gold-700 text-black">
                        <Package className="h-4 w-4 mr-2" />
                        {dict.marketplace.supplier.manageProducts || 'Manage Products'}
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statsCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                        <p className="text-3xl font-bold mt-2">{stat.value}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                                    </div>
                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${stat.bgColor}`}>
                                        <Icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Live Gold Price Card */}
            <Card className="border-gold-200 bg-gradient-to-br from-gold-50 to-gold-100">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>{dict.marketplace.supplier.liveGoldPrice}</span>
                        {stats.goldPriceChange >= 0 ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +{stats.goldPriceChange}%
                            </Badge>
                        ) : (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                <TrendingDown className="h-3 w-3 mr-1" />
                                {stats.goldPriceChange}%
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-gold-700">
                        ${stats.liveGoldPrice.toFixed(2)}
                        <span className="text-base font-normal text-muted-foreground ml-2">{dict.marketplace.common.perGram}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        {dict.marketplace.supplier.lastUpdated}: {new Date().toLocaleTimeString()}
                    </p>
                </CardContent>
            </Card>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                {/* Recent Orders */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">{dict.marketplace.supplier.recentOrders}</CardTitle>
                        <Link href={`/${lang}/supplier/orders`}>
                            <Button variant="ghost" size="sm">
                                {dict.marketplace.common.viewAll}
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentOrders.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6">{dict.marketplace.supplier.noRecentOrders}</p>
                        ) : (
                            recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-semibold text-sm">{order.id}</p>
                                            <Badge className="text-xs bg-gold-100 text-gold-800">
                                                {order.status === 'pending_supplier' ? dict.marketplace.common.pending : dict.marketplace.common.confirmed}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{order.buyer}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm">${order.total.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Your Products */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">{dict.marketplace.supplier.yourProducts}</CardTitle>
                        <Link href={`/${lang}/supplier/products`}>
                            <Button variant="ghost" size="sm">
                                {dict.marketplace.common.viewAll}
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {topProducts.map((product) => (
                            <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="h-10 w-10 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Package className="h-5 w-5 text-gold-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm line-clamp-1">{product.name}</p>
                                        <p className="text-xs text-muted-foreground">{product.karat} · {product.weight}g</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm">${product.price.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">{product.stock} {dict.marketplace.common.inStock || 'in stock'}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
