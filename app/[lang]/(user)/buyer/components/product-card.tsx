'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Image as ImageIcon } from 'lucide-react';
import { Product } from '@/lib/mock-data';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const params = useParams();
    const lang = params.lang || 'en';

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        setIsAddingToCart(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsAddingToCart(false);
        // TODO: Add to cart context
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsFavorite(!isFavorite);
        // TODO: Add to wishlist
    };

    return (
        <Link href={`/${lang}/buyer/catalog/${product.id}`}>
            <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full flex flex-col">
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
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
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
                                {product.name}
                            </h3>
                            {product.stock < 10 && product.stock > 0 && (
                                <Badge variant="outline-blue" className="text-xs whitespace-nowrap">
                                    Low Stock
                                </Badge>
                            )}
                        </div>

                        <p className="text-xs text-muted-foreground">
                            {product.specifications || `${product.karat} · ${product.weight}g`}
                        </p>

                        <div className="flex items-center justify-between pt-2">
                            <div>
                                <p className="text-xl font-bold">${product.price.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">
                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                    <Button
                        className="w-full"
                        onClick={handleAddToCart}
                        disabled={product.stock === 0 || isAddingToCart}
                    >
                        {isAddingToCart ? (
                            <>Adding...</>
                        ) : (
                            <>
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </Link>
    );
}
