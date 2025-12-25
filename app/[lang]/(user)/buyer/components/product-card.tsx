'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Image as ImageIcon } from 'lucide-react';
import { Product } from '@/lib/mock-data';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { addToCart } from '@/app/[lang]/(user)/buyer/services/add-to-cart';
import { removeFromCart } from '@/app/[lang]/(user)/buyer/services/remove-from-cart';
import { useCardDetails } from '@/app/[lang]/(user)/buyer/services/cart-details';
import { likeProduct } from '@/app/[lang]/(user)/buyer/services/like-product';
import { unlikeProduct } from '@/app/[lang]/(user)/buyer/services/unlike-product';
import { toast } from 'sonner';
import { QuantitySelector } from './quantity-selector';

interface ProductCardProps {
    product: any;
    dict: any;
    onViewDetails?: () => void;
}

export default function ProductCard({
    product,
    dict,
    onViewDetails,
}: ProductCardProps) {
    const [isFavorite, setIsFavorite] = useState(!!product?.bookmarked_by_user);
    const [bookmarkId, setBookMarkId] = useState(
        product?.bookmarked_by_user?.id
    );
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const { details, mutate } = useCardDetails();

    // Find matching item in cart
    const cartItem = details?.items?.find(
        (item: any) => item.product.id === product.id
    );
    const [quantity, setQuantity] = useState(cartItem?.count || 0);

    // Sync quantity when cart details change
    React.useEffect(() => {
        if (details?.items) {
            const item = details.items.find(
                (item: any) => item.product.id === product.id
            );
            setQuantity(item?.count || 0);
        }
    }, [details, product.id]);
    const params = useParams();
    const lang = params.lang || 'en';

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isAddingToCart) return;
        setIsAddingToCart(true);

        try {
            if (quantity === 0) {
                await removeFromCart({
                    product_id: parseInt(product.id),
                });
                toast.success('Product has been removed from cart');
            } else {
                await addToCart({
                    product_id: product.id,
                    count: quantity,
                });
                toast.success('Product has been added to cart successfully!');
            }
            mutate?.();
        } catch (error) {
            toast.error(error?.error?.detail || error?.error.params?.detail);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            if (!isFavorite) {
                let res;
                res = await likeProduct({
                    object_id: product.id,
                    title: 'product',
                    content_type: 132,
                });
                setBookMarkId(res.id);
            } else {
                await unlikeProduct(bookmarkId);
            }
            setIsFavorite(!isFavorite); // optimistic update
        } catch (error) {
            toast.error(error?.error.params.detail)
        }
    };

    return (
        <div>
            <Card
                className="group flex h-full cursor-pointer flex-col transition-all duration-200 hover:shadow-lg"
                onClick={onViewDetails}
            >
                <CardContent className="flex-1 p-4">
                    {/* Image */}
                    <div className="relative mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                        <button
                            onClick={handleToggleFavorite}
                            className="absolute right-2 top-2 z-10 rounded-full bg-white p-2 shadow-md transition-transform hover:scale-110"
                        >
                            <Heart
                                className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                            />
                        </button>
                        {product.images ? (
                            <img
                                src={product.images[0]?.image}
                                alt={product.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <ImageIcon className="h-16 w-16 text-gray-400" />
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="group-hover:text-primary line-clamp-2 text-sm font-semibold transition-colors">
                                {product.title}
                            </h3>
                            {product.inventory < 10 &&
                                product.inventory > 0 && (
                                    <Badge
                                        variant="outline-blue"
                                        className="whitespace-nowrap text-xs"
                                    >
                                        {
                                            dict.marketplace.buyer.productCard
                                                .lowStock
                                        }
                                    </Badge>
                                )}
                        </div>

                        <p className="text-muted-foreground text-xs">
                            {product.supplier.company?.name}
                        </p>

                        <div className="flex items-center justify-between pt-2">
                            <div>
                                <p className="text-xl font-bold">
                                    ${product.unit_price.toLocaleString()}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    {product.inventory > 0
                                        ? `${product.inventory} ${dict.marketplace.buyer.productCard.inStock}`
                                        : product.inventory === null
                                          ? 'unlimited stock'
                                          : dict.marketplace.buyer.productCard
                                                .outOfStock}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex w-full flex-row items-center gap-2 p-4 pt-0">
                    <QuantitySelector
                        quantity={quantity}
                        setQuantity={setQuantity}
                        maxStock={product.inventory ?? 10000}
                        minQuantity={0}
                        className="shrink-0"
                    />

                    <Button
                        className="flex min-w-0 flex-1 items-center justify-center gap-2 p-2"
                        onClick={handleAddToCart}
                        disabled={product.inventory === 0 || isAddingToCart}
                    >
                        {isAddingToCart ? (
                            <span className="truncate">
                                {dict.marketplace.buyer.productCard.adding}
                            </span>
                        ) : (
                            <>
                                <ShoppingCart className="h-4 w-4 shrink-0" />
                                <span className="truncate">
                                    {
                                        dict.marketplace.buyer.productCard
                                            .addToCart
                                    }
                                </span>
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
