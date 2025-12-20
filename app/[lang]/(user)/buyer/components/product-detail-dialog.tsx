'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import { addToCart } from '@/app/[lang]/(user)/buyer/services/add-to-cart';
import { cn } from '@/libs/utils';
import { toast } from 'sonner';

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
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isFavorite, setIsFavorite] = useState(!!product?.bookmarked_by_user);
    const [bookmarkId, setBookMarkId] = useState(product?.bookmarked_by_user?.id);
    const params = useParams();
    const lang = params.lang || 'en';

    if (!product) return null;

    const handleAddToCart = async () => {
        if (isAddingToCart) return;
        setIsAddingToCart(true);

        try {
            await addToCart({
                product_id: product.id,
                count: 1, // Default to 1 as per redesigned UI
            });
            onOpenChange(false);
            toast.success("Product has been added to card successfully!");
        } catch (error) {
            console.error("Add to cart failed:", error);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const productImages = product.images || [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[850px] p-0 overflow-hidden rounded-xl border-none shadow-2xl bg-white">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-2">
                    <h2 className="text-xl font-bold text-gray-900">{product.title}</h2>
                </div>

                <div className="flex flex-col md:flex-row p-6 pt-2 gap-8 h-full max-h-[85vh] overflow-y-auto">
                    {/* Left Side: Images */}
                    <div className="w-full md:w-[45%] flex flex-col gap-4">
                        <div className="aspect-square bg-[#f0eee9] rounded-lg overflow-hidden flex items-center justify-center p-8">
                            {productImages.length > 0 ? (
                                <img
                                    src={productImages[activeImageIndex]?.image}
                                    alt={product.title}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="text-gray-400 flex flex-col items-center">
                                    <ShoppingCart className="h-16 w-16 mb-2 opacity-20" />
                                    <span className="text-sm italic">No image</span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {productImages.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {productImages.map((img: any, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImageIndex(index)}
                                        className={cn(
                                            "w-20 h-20 rounded-lg flex-shrink-0 p-1 border-2 transition-all bg-[#f0eee9]",
                                            activeImageIndex === index ? "border-primary" : "border-transparent"
                                        )}
                                    >
                                        <img
                                            src={img.image}
                                            alt={`${product.title} thumb ${index + 1}`}
                                            className="w-full h-full object-contain "
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                        {/* Fallback space for layout if no multiple images */}
                        {productImages.length <= 1 && (
                            <div className="flex gap-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-20 h-20 rounded-lg bg-[#f0eee9]" />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Side: Details & Actions */}
                    <div className="flex-1 flex flex-col gap-6">
                        {/* Price & Supplier */}
                        <div className="space-y-1">
                            <div className="text-[40px] font-bold text-[#d4af37]">
                                ${product.price.toLocaleString()}
                            </div>
                            <div className="text-gray-500 text-sm">
                                by {product.supplier_name || "Premium Gold Co."}
                            </div>
                        </div>

                        {/* Specs Table Box */}
                        <div className="bg-[#fdfaf3] rounded-xl p-6 space-y-3">
                            <div className="flex justify-between items-center text-sm border-b border-[#f0e6d2]/50 pb-2">
                                <span className="text-gray-500">Category:</span>
                                <span className="font-semibold text-gray-900 capitalize">{product.category?.replace('_', ' ')}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-[#f0e6d2]/50 pb-2">
                                <span className="text-gray-500">Karat:</span>
                                <span className="font-semibold text-gray-900">{product.karat}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-[#f0e6d2]/50 pb-2">
                                <span className="text-gray-500">Weight:</span>
                                <span className="font-semibold text-gray-900">{product.weight} gram</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">In Stock:</span>
                                <span className="font-semibold text-gray-900">{product.inventory} units</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <h3 className="font-bold text-gray-900">Description</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {product.details || "Fine gold bar with 99.99% purity. Swiss certified."}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mt-auto">
                            <Button
                                className="flex-1 h-[52px] bg-[#d4af37] hover:bg-[#c4a030] text-black font-bold text-base rounded-lg flex items-center justify-center gap-2"
                                onClick={handleAddToCart}
                                disabled={isAddingToCart || product.inventory === 0}
                            >
                                <ShoppingCart className="h-5 w-5" />
                                Add to Cart
                            </Button>
                            <Button
                                variant="outline"
                                className="w-[52px] h-[52px] p-0 border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-gray-50"
                            >
                                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}/>
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
