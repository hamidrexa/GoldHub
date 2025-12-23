'use client'

import { Card, CardContent } from '@/components/ui/card';
import {
    BadgeCheck,
    CircleDollarSign,
    Truck,
} from 'lucide-react';
import { useOrdersHistory } from '@/app/[lang]/(user)/supplier/services/orders-history';

export function SupplierStartCards({dict,lang}) {
    const {count:submittedHistory,isLoading:isSubmittedLoading} = useOrdersHistory(null,null,"Submitted",'supplier');
    const {count:paidHistory,isLoading:isPaidLoading} = useOrdersHistory(null,null,"Paid","supplier");
    const {count:deliveredHistory,isLoading:isDeliveredLoading} = useOrdersHistory(null,null,"Delivered",'supplier');


    const deliveredOrders = deliveredHistory;
    const paidOrders = paidHistory;
    const submittedOrders = submittedHistory;


    const stats = {
        deliveredOrders,
        paidOrders,
        submittedOrders,
    };


    const statsCards = [
        {
            title: "Paid Orders",
            value: stats.paidOrders,
            icon: CircleDollarSign ,
            description: "orders with successful payment",
            color: 'text-gold-600',
            bgColor: 'bg-gold-50',
        },
        {
            title: "Submitted Orders",
            value: stats.submittedOrders,
            icon: BadgeCheck ,
            description: "orders pending for supplier",
            color: 'text-navy-500',
            bgColor: 'bg-navy-50',
        },
        {
            title: "Delivered Orders",
            value: stats.deliveredOrders,
            icon: Truck ,
            description: "finished orders",
            color: 'text-amber-800',
            bgColor: 'bg-amber-50',
        },
    ];

    if (isDeliveredLoading || isSubmittedLoading || isPaidLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="h-20 animate-pulse bg-gray-100 rounded-md" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }


    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
                                <div
                                    className={`h-12 w-12 rounded-full flex items-center justify-center ${stat.bgColor}`}>
                                    <Icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    )
}