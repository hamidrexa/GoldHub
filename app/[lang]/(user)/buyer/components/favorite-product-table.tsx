'use client';

import { Card } from '@/components/ui/card';
import { Heart, Package as PackageIcon, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { unlikeProduct } from '@/app/[lang]/(user)/buyer/services/unlike-product';
import ProductDetailDialog from '@/app/[lang]/(user)/buyer/components/product-detail-dialog';
import { addToCart } from '@/app/[lang]/(user)/buyer/services/add-to-cart';
import { toast } from 'sonner';

export function FavouriteProductTable({ dict, lang ,wishlistItems,isLoading,error,mutate}) {

    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);


    const handleUnfollow = async (item:any) => {
        await unlikeProduct(item.bookmarked_by_user.id);
        mutate();
    }

    const AddToCartHandler = async (e: React.MouseEvent,product) => {
        e.preventDefault();
        e.stopPropagation();

        if (isAddingToCart) return;
        setIsAddingToCart(true);

        try {
            await addToCart({
                product_id: product.id,
                count: 1,
            });
            toast.success("Product has been added to card successfully!");
        } catch (error) {
            toast.error(error?.error.detail)
        } finally {
            setIsAddingToCart(false);
        }
    };

    if (isLoading) return <p className="py-8 text-center">Loading...</p>;

    if (error) {
        return (
            <p className="py-8 text-center text-red-600">
                Error loading users
            </p>
        );
    }

    return wishlistItems.length === 0 ? (
        <Card className="p-12">
            <div className="space-y-4 text-center">
                <Heart className="text-muted-foreground mx-auto h-16 w-16" />
                <div>
                    <h3 className="text-lg font-semibold">
                        {dict.marketplace.buyer.favoritesPage.empty.title}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                        {dict.marketplace.buyer.favoritesPage.empty.description}
                    </p>
                </div>
                <Link href={`/${lang}/buyer/catalog`}>
                    <Button>
                        {
                            dict.marketplace.buyer.favoritesPage.empty
                                .browseProducts
                        }
                    </Button>
                </Link>
            </div>
        </Card>
    ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((item) => (
                <Card
                    onClick={()=>{
                        setSelectedProduct(item);
                        setIsDetailDialogOpen(true);
                    }}
                    key={item.productId}
                    className="group transition-all duration-200 hover:cursor-pointer"
                >
                    <div className="p-4">
                        <div className="relative mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                            {item.images ? (
                                <img
                                    src={item.images[0]?.image}
                                    alt={item.title}
                                    className="h-full w-full rounded-lg object-cover"
                                />
                            ) : (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-yellow-200" />
                                    <PackageIcon className="relative z-10 h-16 w-16 text-yellow-600" />
                                </>
                            )}
                        </div>

                        <div className="space-y-2">
                            <h3 className="line-clamp-2 text-sm font-semibold">
                                {item.title}
                            </h3>
                            <p className="text-muted-foreground text-xs">
                                {item.supplier.company?.name}
                            </p>
                            <p className="text-lg font-bold">
                                ${item.unit_price.toLocaleString()}
                            </p>
                            <p className="text-muted-foreground text-xs">
                                {
                                    dict.marketplace.buyer.favoritesPage.item
                                        .added
                                }{' '}
                                {new Date(
                                    item.bookmarked_by_user.timestamp
                                ).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <Button
                                className="w-full"
                                onClick={(e)=>{AddToCartHandler(e,item)}}
                                disabled={item.inventory === 0 || isAddingToCart}
                            >
                                {isAddingToCart ? (
                                    <>{dict.marketplace.buyer.productCard.adding}</>
                                ) : (
                                    <>
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        {dict.marketplace.buyer.productCard.addToCart}
                                    </>
                                )}
                            </Button>
                            <Button onClick={(event)=>{
                                event.stopPropagation();
                                handleUnfollow(item)}
                            } variant="outline" size="sm">
                                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
            <ProductDetailDialog
                open={isDetailDialogOpen}
                onOpenChange={setIsDetailDialogOpen}
                product={selectedProduct}
                dict={dict}
                mutate={mutate}
            />
        </div>
    );
}
