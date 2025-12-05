'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { mockSupplierStats, mockOrders, mockProducts } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface SupplierDashboardProps {
    dict: any;
}

export default function SupplierDashboardPage({ dict }: SupplierDashboardProps) {
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
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.common.dashboard}</h1>
                <p className="text-muted-foreground">{dict.marketplace.supplier.welcomeMessage}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statsCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                    <Icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.description}
                                </p>
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

            <div className="grid gap-4 md:grid-cols-2">
                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>{dict.marketplace.supplier.recentOrders}</CardTitle>
                            <Link href="/supplier/orders">
                                <Button variant="link" size="sm">{dict.marketplace.common.viewAll}</Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentOrders.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">{dict.marketplace.supplier.noRecentOrders}</p>
                            ) : (
                                recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                        <div>
                                            <p className="font-medium text-sm">{order.id}</p>
                                            <p className="text-xs text-muted-foreground">{order.buyer}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-sm">${order.total.toLocaleString()}</p>
                                            <Badge variant="outline-blue" className="text-xs">
                                                {order.status === 'pending_supplier' ? dict.marketplace.common.pending : dict.marketplace.common.confirmed}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Your Products */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>{dict.marketplace.supplier.yourProducts}</CardTitle>
                            <Link href="/supplier/products">
                                <Button variant="link" size="sm">{dict.marketplace.common.viewAll}</Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topProducts.map((product) => (
                                <div key={product.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                                            <Package className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{product.name}</p>
                                            <p className="text-xs text-muted-foreground">{product.karat} · {product.weight}g</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-sm">${product.price.toLocaleString()}</p>
                                        <p className="text-xs text-muted-foreground">{product.stock} in stock</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
