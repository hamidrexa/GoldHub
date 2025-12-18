'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ShoppingCart,
    Heart,
    Minus,
    Plus,
    Info,
    Scale,
    Gem,
    Package,
    Image as ImageIcon
} from 'lucide-react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { useParams } from 'next/navigation';
import { addToCart } from '@/app/[lang]/(user)/buyer/services/add-to-cart';

interface ProductDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: any;
    dict: any;
}

export default function ProductDetailDialog({
    open,
    onOpenChange,
    product,
    dict,
}: ProductDetailDialogProps) {
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const params = useParams();
    const lang = params.lang || 'en';

    if (!product) return null;

    const handleIncrement = () => {
        if (quantity < product.inventory) {
            setQuantity(prev => prev + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = async () => {
        if (isAddingToCart) return;
        setIsAddingToCart(true);

        try {
            await addToCart({
                product_id: product.id,
                count: quantity,
            });
            onOpenChange(false);
        } catch (error) {
            console.error("Add to cart failed:", error);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const productImages = product.images || [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-xl border-none shadow-2xl bg-white dark:bg-slate-950">
                <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto md:overflow-hidden">
                    {/* Left: Image Carousel Section */}
                    <div className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center p-4 min-h-[300px] md:min-h-0 relative group">
                        {productImages.length > 0 ? (
                            <Carousel className="w-full max-w-sm">
                                <CarouselContent>
                                    {productImages.map((img: any, index: number) => (
                                        <CarouselItem key={index}>
                                            <div className="aspect-square relative flex items-center justify-center">
                                                <img
                                                    src={img.image}
                                                    alt={`${product.title} - image ${index + 1}`}
                                                    className="w-full h-full object-contain rounded-lg"
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                {productImages.length > 1 && (
                                    <>
                                        <CarouselPrevious className="left-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <CarouselNext className="right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </>
                                )}
                            </Carousel>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400">
                                <ImageIcon className="h-20 w-20 mb-2 opacity-20" />
                                <span className="text-sm">No images available</span>
                            </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute top-4 left-4">
                            <Badge variant="outline-blue" className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-primary/20 text-primary capitalize">
                                {product.category?.replace('_', ' ')}
                            </Badge>
                        </div>
                    </div>

                    {/* Right: Product Info Section */}
                    <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="space-y-2">
                                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                                    {product.title}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                    {product.details || "High-quality gold product with authentic crafting and certification."}
                                </p>
                            </div>

                            {/* Price Section */}
                            <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold text-primary">
                                    ${(product.price * quantity).toLocaleString()}
                                </span>
                                <span className="text-sm text-slate-500 line-through decoration-slate-300">
                                    {/* Mock original price if needed */}
                                </span>
                            </div>

                            {/* Specifications Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                    <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-md">
                                        <Gem className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Karat</p>
                                        <p className="text-sm font-semibold">{product.karat}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
                                        <Scale className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Weight</p>
                                        <p className="text-sm font-semibold">{product.weight}g</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md">
                                        <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Available</p>
                                        <p className="text-sm font-semibold">{product.inventory} units</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                    <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                                        <Info className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Quality</p>
                                        <p className="text-sm font-semibold">Certified</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer / Action Section */}
                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center border rounded-lg bg-slate-50 dark:bg-slate-900 p-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-600 hover:bg-white dark:hover:bg-slate-800"
                                        onClick={handleDecrement}
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-10 text-center font-bold">{quantity}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-600 hover:bg-white dark:hover:bg-slate-800"
                                        onClick={handleIncrement}
                                        disabled={quantity >= product.inventory}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full h-10 w-10 border-slate-200 text-slate-600 hover:text-red-500 transition-colors"
                                >
                                    <Heart className="h-5 w-5" />
                                </Button>
                            </div>

                            <Button
                                className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                                onClick={handleAddToCart}
                                disabled={product.inventory === 0 || isAddingToCart}
                            >
                                {isAddingToCart ? (
                                    <span className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        {dict.marketplace.buyer.productCard.adding}
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <ShoppingCart className="h-5 w-5" />
                                        {dict.marketplace.buyer.productCard.addToCart}
                                    </span>
                                )}
                            </Button>

                            {product.inventory < 5 && product.inventory > 0 && (
                                <p className="text-center text-xs font-medium text-amber-600 dark:text-amber-400">
                                    Limited stock! Only {product.inventory} remaining.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

