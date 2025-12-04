'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, DollarSign, Clock, Heart, TrendingUp, ArrowRight, Eye } from 'lucide-react';
import { mockBuyerOrders } from '@/lib/buyer-mock-data';
import { mockProducts } from '@/lib/mock-data';
import { mockWishlist } from '@/lib/buyer-mock-data';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function BuyerDashboard() {
    const params = useParams();
    const lang = params.lang || 'en';

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

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { label: string; className: string }> = {
            pending_supplier: { label: 'Pending Supplier', className: 'bg-yellow-100 text-yellow-800' },
            confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-800' },
            shipped: { label: 'Shipped', className: 'bg-blue-100 text-blue-800' },
            delivered: { label: 'Delivered', className: 'bg-green-100 text-green-800' },
        };
        const config = badges[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
        return <Badge className={config.className}>{config.label}</Badge>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
                    <p className="text-muted-foreground">Browse the catalog and manage your orders</p>
                </div>
                <Link href={`/${lang}/buyer/catalog`}>
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Browse Catalog
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
                                <p className="text-3xl font-bold mt-2">{activeOrders}</p>
                            </div>
                            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <ShoppingBag className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                                <p className="text-3xl font-bold mt-2">${totalSpent.toLocaleString()}</p>
                            </div>
                            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pending Deliveries</p>
                                <p className="text-3xl font-bold mt-2">{pendingDeliveries}</p>
                            </div>
                            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <Clock className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Saved Items</p>
                                <p className="text-3xl font-bold mt-2">{savedItems}</p>
                            </div>
                            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <Heart className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
                {/* Market Prices */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Market Prices</CardTitle>
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
                        <CardTitle className="text-lg">Recent Orders</CardTitle>
                        <Link href={`/${lang}/buyer/orders`}>
                            <Button variant="ghost" size="sm">
                                View all
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
                                        {getStatusBadge(order.status)}
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
                    <CardTitle className="text-lg">Featured Products</CardTitle>
                    <Link href={`/${lang}/buyer/catalog`}>
                        <Button variant="ghost" size="sm">
                            View catalog
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
