'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Users, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { mockDashboardStats } from '@/lib/mock-data';

interface DashboardClientProps {
    dict: any;
}

export function DashboardClient({ dict }: DashboardClientProps) {
    const stats = mockDashboardStats;

    const statsCards = [
        {
            title: dict.marketplace.admin.totalOrders,
            value: stats.totalOrders,
            icon: ShoppingCart,
            description: dict.marketplace.admin.allTimeOrders,
            color: 'text-navy-600',
            bgColor: 'bg-navy-50',
        },
        {
            title: dict.marketplace.admin.pendingOrders,
            value: stats.pendingOrders,
            icon: Clock,
            description: dict.marketplace.admin.awaitingAction,
            color: 'text-gold-600',
            bgColor: 'bg-gold-50',
        },
        {
            title: dict.marketplace.admin.totalRevenue,
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            description: dict.marketplace.admin.thisMonth,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
        },
        {
            title: dict.marketplace.admin.activeUsers,
            value: stats.activeUsers,
            icon: Users,
            description: dict.marketplace.admin.registeredUsers,
            color: 'text-navy-500',
            bgColor: 'bg-navy-50',
        },
        {
            title: dict.marketplace.admin.pendingKyc,
            value: stats.pendingKyc,
            icon: AlertCircle,
            description: dict.marketplace.admin.requiresReview,
            color: 'text-amber-800',
            bgColor: 'bg-amber-50',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.common.dashboard}</h1>
                <p className="text-muted-foreground">{dict.marketplace.admin.welcomeMessage}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>{dict.marketplace.admin.recentActivity}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <p className="font-medium">{dict.marketplace.admin.newOrderReceived}</p>
                                    <p className="text-sm text-muted-foreground">{dict.marketplace.admin.orderFrom}</p>
                                </div>
                                <span className="text-sm text-muted-foreground">2 {dict.marketplace.common.hoursAgo}</span>
                            </div>
                            <div className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <p className="font-medium">{dict.marketplace.admin.kycSubmitted}</p>
                                    <p className="text-sm text-muted-foreground">{dict.marketplace.admin.kycSubmittedDesc}</p>
                                </div>
                                <span className="text-sm text-muted-foreground">5 {dict.marketplace.common.hoursAgo}</span>
                            </div>
                            <div className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <p className="font-medium">{dict.marketplace.admin.paymentReceived}</p>
                                    <p className="text-sm text-muted-foreground">{dict.marketplace.admin.paymentReceivedDesc}</p>
                                </div>
                                <span className="text-sm text-muted-foreground">1 {dict.marketplace.common.daysAgo}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{dict.marketplace.admin.newUserRegistered}</p>
                                    <p className="text-sm text-muted-foreground">{dict.marketplace.admin.newUserRegisteredDesc}</p>
                                </div>
                                <span className="text-sm text-muted-foreground">2 {dict.marketplace.common.daysAgo}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>{dict.marketplace.admin.quickActions}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <button className="w-full text-left px-4 py-3 rounded-lg border hover:bg-gray-50 transition-colors">
                                <div className="font-medium">{dict.marketplace.admin.reviewPendingOrders}</div>
                                <div className="text-sm text-muted-foreground">{stats.pendingOrders} {dict.marketplace.common.ordersWaiting}</div>
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-lg border hover:bg-gray-50 transition-colors">
                                <div className="font-medium">{dict.marketplace.admin.reviewKycRequests}</div>
                                <div className="text-sm text-muted-foreground">{stats.pendingKyc} {dict.marketplace.common.applicationsPending}</div>
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-lg border hover:bg-gray-50 transition-colors">
                                <div className="font-medium">{dict.marketplace.admin.viewAuditLogs}</div>
                                <div className="text-sm text-muted-foreground">{dict.marketplace.admin.monitorSystemActivity}</div>
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-lg border hover:bg-gray-50 transition-colors">
                                <div className="font-medium">{dict.marketplace.admin.manageUsers}</div>
                                <div className="text-sm text-muted-foreground">{stats.activeUsers} {dict.marketplace.common.activeUsers}</div>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
