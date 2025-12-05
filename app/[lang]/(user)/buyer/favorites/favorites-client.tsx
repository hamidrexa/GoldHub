'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ArrowLeft, Package as PackageIcon } from 'lucide-react';
import { mockWishlist } from '@/lib/buyer-mock-data';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface FavoritesClientProps {
    dict: any;
}

export default function FavoritesClient({ dict }: FavoritesClientProps) {
    const [wishlistItems, setWishlistItems] = useState(mockWishlist);
    const params = useParams();
    const lang = params.lang || 'en';

    const removeFavorite = (productId: string) => {
        setWishlistItems(items => items.filter(item => item.productId !== productId));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.buyer.favoritesPage.title}</h1>
                    <p className="text-muted-foreground">{wishlistItems.length} {dict.marketplace.buyer.favoritesPage.savedItems}</p>
                </div>
                <Link href={`/${lang}/buyer/catalog`}>
                    <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {dict.marketplace.buyer.favoritesPage.browseCatalog}
                    </Button>
                </Link>
            </div>

            {wishlistItems.length === 0 ? (
                <Card className="p-12">
                    <div className="text-center space-y-4">
                        <Heart className="h-16 w-16 text-muted-foreground mx-auto" />
                        <div>
                            <h3 className="text-lg font-semibold">{dict.marketplace.buyer.favoritesPage.empty.title}</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                {dict.marketplace.buyer.favoritesPage.empty.description}
                            </p>
                        </div>
                        <Link href={`/${lang}/buyer/catalog`}>
                            <Button>{dict.marketplace.buyer.favoritesPage.empty.browseProducts}</Button>
                        </Link>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlistItems.map((item) => (
                        <Card key={item.productId} className="group hover:shadow-lg transition-all duration-200">
                            <div className="p-4">
                                {/* Image */}
                                <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-yellow-200" />
                                    <PackageIcon className="h-16 w-16 text-yellow-600 relative z-10" />
                                </div>

                                {/* Product Info */}
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-sm line-clamp-2">
                                        {item.product.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        {item.product.specifications}
                                    </p>
                                    <p className="text-lg font-bold">
                                        ${item.product.price.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {dict.marketplace.buyer.favoritesPage.item.added} {new Date(item.addedAt).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="mt-4 flex gap-2">
                                    <Button className="flex-1" size="sm">
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        {dict.marketplace.buyer.favoritesPage.item.addToCart}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeFavorite(item.productId)}
                                    >
                                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
