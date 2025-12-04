'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Users, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { mockDashboardStats } from '@/lib/mock-data';

export default function DashboardPage() {
    const stats = mockDashboardStats;

    const statsCards = [
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingCart,
            description: 'All time orders',
            color: 'text-navy-600',
            bgColor: 'bg-navy-50',
        },
        {
            title: 'Pending Orders',
            value: stats.pendingOrders,
            icon: Clock,
            description: 'Awaiting action',
            color: 'text-gold-600',
            bgColor: 'bg-gold-50',
        },
        {
            title: 'Total Revenue',
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            description: 'This month',
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
        },
        {
            title: 'Active Users',
            value: stats.activeUsers,
            icon: Users,
            description: 'Registered users',
            color: 'text-navy-500',
            bgColor: 'bg-navy-50',
        },
        {
            title: 'Pending KYC',
            value: stats.pendingKyc,
            icon: AlertCircle,
            description: 'Requires review',
            color: 'text-amber-800',
            bgColor: 'bg-amber-50',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here is an overview of your marketplace</p>
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
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <p className="font-medium">New order received</p>
                                    <p className="text-sm text-muted-foreground">Order #ORD-003 from Eastern Gold Ltd.</p>
                                </div>
                                <span className="text-sm text-muted-foreground">2 hours ago</span>
                            </div>
                            <div className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <p className="font-medium">KYC submitted</p>
                                    <p className="text-sm text-muted-foreground">Sarah Chen submitted KYC documents</p>
                                </div>
                                <span className="text-sm text-muted-foreground">5 hours ago</span>
                            </div>
                            <div className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <p className="font-medium">Payment received</p>
                                    <p className="text-sm text-muted-foreground">$52,300 from Order #ORD-008</p>
                                </div>
                                <span className="text-sm text-muted-foreground">1 day ago</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">New user registered</p>
                                    <p className="text-sm text-muted-foreground">Emma Wilson joined as retailer</p>
                                </div>
                                <span className="text-sm text-muted-foreground">2 days ago</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <button className="w-full text-left px-4 py-3 rounded-lg border hover:bg-gray-50 transition-colors">
                                <div className="font-medium">Review Pending Orders</div>
                                <div className="text-sm text-muted-foreground">{stats.pendingOrders} orders waiting</div>
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-lg border hover:bg-gray-50 transition-colors">
                                <div className="font-medium">Review KYC Requests</div>
                                <div className="text-sm text-muted-foreground">{stats.pendingKyc} applications pending</div>
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-lg border hover:bg-gray-50 transition-colors">
                                <div className="font-medium">View Audit Logs</div>
                                <div className="text-sm text-muted-foreground">Monitor system activity</div>
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-lg border hover:bg-gray-50 transition-colors">
                                <div className="font-medium">Manage Users</div>
                                <div className="text-sm text-muted-foreground">{stats.activeUsers} active users</div>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
