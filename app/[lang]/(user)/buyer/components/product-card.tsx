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

export default function ProductCard({ product, dict, onViewDetails }: ProductCardProps) {
    const [isFavorite, setIsFavorite] = useState(!!product?.bookmarked_by_user);
    const [bookmarkId, setBookMarkId] = useState(product?.bookmarked_by_user?.id);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const { details, mutate } = useCardDetails();

    // Find matching item in cart
    const cartItem = details?.items?.find((item: any) => item.product.id === product.id);
    const [quantity, setQuantity] = useState(cartItem?.count || 0);

    // Sync quantity when cart details change
    React.useEffect(() => {
        if (details?.items) {
            const item = details.items.find((item: any) => item.product.id === product.id);
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
                toast.success("Product has been removed from cart");
            } else {
                await addToCart({
                    product_id: product.id,
                    count: quantity,
                });
                toast.success("Product has been added to cart successfully!");
            }
            mutate?.();
        } catch (error) {
            toast.error(error?.error?.detail || "An error occurred");
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            if (!isFavorite) {
                let res
                res = await likeProduct({
                    object_id: product.id,
                    title: 'product',
                    content_type: 132,
                });
                setBookMarkId(res.id)
            } else {
                await unlikeProduct(bookmarkId);
            }
            setIsFavorite(!isFavorite); // optimistic update
        } catch (error) {
            // rollback on failure
            setIsFavorite(!isFavorite);
            console.error("Bookmark toggle failed:", error);
        }
    };


    return (
        <div>
            <Card
                className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full flex flex-col"
                onClick={onViewDetails}
            >
                <CardContent className="p-4 flex-1">
                    {/* Image */}
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                        <button
                            onClick={handleToggleFavorite}
                            className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
                        >
                            <Heart
                                className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                            />
                        </button>
                        {product.images ? (
                            <img
                                src={product.images[0]?.image}
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <ImageIcon className="h-16 w-16 text-gray-400" />
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                {product.title}
                            </h3>
                            {product.inventory < 10 && product.inventory > 0 && (
                                <Badge variant="outline-blue" className="text-xs whitespace-nowrap">
                                    {dict.marketplace.buyer.productCard.lowStock}
                                </Badge>
                            )}
                        </div>

                        <p className="text-xs text-muted-foreground">
                            {product.supplier.company?.name}
                        </p>

                        <div className="flex items-center justify-between pt-2">
                            <div>
                                <p className="text-xl font-bold">${product.unit_price.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">
                                    {product.inventory > 0 ? `${product.inventory} ${dict.marketplace.buyer.productCard.inStock}` : dict.marketplace.buyer.productCard.outOfStock}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 gap-2">
                    <QuantitySelector
                        quantity={quantity}
                        setQuantity={setQuantity}
                        maxStock={product.inventory}
                        minQuantity={0}
                        className="w-auto"
                    />
                    <Button
                        className="flex-1"
                        onClick={handleAddToCart}
                        disabled={product.inventory === 0 || isAddingToCart}
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
                </CardFooter>
            </Card>
        </div>
    );
}
