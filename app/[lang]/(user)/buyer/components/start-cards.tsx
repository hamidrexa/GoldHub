'use client';

import { Card, CardContent } from '@/components/ui/card';
import { BadgeCheck, CircleDollarSign, Heart, ShoppingCart, Truck } from 'lucide-react';
import { useOrdersHistory } from '@/app/[lang]/(user)/supplier/services/orders-history';
import { useCardDetails } from '@/app/[lang]/(user)/buyer/services/cart-details';
import { useProductList } from '@/app/[lang]/(user)/supplier/products/services/useProductList';

export function BuyerStartCards({ dict, lang }) {
    const { count: submittedHistory, isLoading: isSubmittedLoading } =
        useOrdersHistory(null, 'Submitted');
    const { count: shippedHistory, isLoading: isShippedLoading } =
        useOrdersHistory(null, 'Shipped');
    const { details, isLoading: cardLoading} = useCardDetails();
    const {
        count: favoritesCount,
        isLoading: isFavoritesLoading,
        error,
    } = useProductList('', undefined, true);

    const shippedOrders = shippedHistory;
    const submittedOrders = submittedHistory;
    const cartDetails = details?.items?.length;
    const favoritesItemsCount = favoritesCount;

    const stats = {
        cartDetails,
        shippedOrders,
        submittedOrders,
        favoritesItemsCount,
    };

    const statsCards = [
        {
            title: 'Shipped Orders',
            value: stats.shippedOrders,
            icon: Truck,
            description: 'orders which have been shipped',
            color: 'text-gold-600',
            bgColor: 'bg-gold-50',
        },
        {
            title: 'Submitted Orders',
            value: stats.submittedOrders,
            icon: BadgeCheck,
            description: 'orders pending for supplier',
            color: 'text-navy-500',
            bgColor: 'bg-navy-50',
        },
        {
            title: 'Products in Cart',
            value: stats.cartDetails,
            icon: ShoppingCart,
            description: 'number of products in cart',
            color: 'text-amber-800',
            bgColor: 'bg-amber-50',
        },
        {
            title: 'Followed Products',
            value: stats.favoritesItemsCount,
            icon: Heart,
            description: 'number of favorite items',
            color: 'text-amber-800',
            bgColor: 'bg-amber-50',
        },
    ];

    if (cardLoading || isSubmittedLoading || isShippedLoading || isFavoritesLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="h-20 animate-pulse rounded-md bg-gray-100" />
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
                    <Card
                        key={index}
                        className="transition-shadow hover:shadow-lg"
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium">
                                        {stat.title}
                                    </p>
                                    <p className="mt-2 text-3xl font-bold">
                                        {stat.value}
                                    </p>
                                    <p className="text-muted-foreground mt-1 text-xs">
                                        {stat.description}
                                    </p>
                                </div>
                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bgColor}`}
                                >
                                    <Icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
