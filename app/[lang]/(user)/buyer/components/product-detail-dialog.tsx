'use client';

import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, FileCheck } from 'lucide-react';
import { useParams } from 'next/navigation';
import { addToCart } from '@/app/[lang]/(user)/buyer/services/add-to-cart';
import { cn } from '@/libs/utils';
import { toast } from 'sonner';
import { likeProduct } from '@/app/[lang]/(user)/buyer/services/like-product';
import { unlikeProduct } from '@/app/[lang]/(user)/buyer/services/unlike-product';
import { removeFromCart } from '@/app/[lang]/(user)/buyer/services/remove-from-cart';
import { useCardDetails } from '@/app/[lang]/(user)/buyer/services/cart-details';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { QuantitySelector } from './quantity-selector';

interface ProductDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: any;
    dict: any;
    mutate: any;
}

export default function ProductDetailDialog({
    open,
    onOpenChange,
    product,
    dict,
    mutate,
}: ProductDetailDialogProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState("general");
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const { details } = useCardDetails();
    const cartItem = details?.items?.find((item: any) => item.product.id === product?.id);
    const [quantity, setQuantity] = useState(cartItem?.count || 0);

    const [isFavorite, setIsFavorite] = useState(!!product?.bookmarked_by_user);
    const [bookmarkId, setBookMarkId] = useState(product?.bookmarked_by_user?.id);
    const params = useParams();
    const lang = params.lang || 'en';

    useEffect(() => {
        setIsFavorite(!!product?.bookmarked_by_user);
        setBookMarkId(product?.bookmarked_by_user?.id);
        setActiveTab("general");

        // Sync quantity
        const item = details?.items?.find((item: any) => item.product.id === product?.id);
        setQuantity(item?.count || 0);
    }, [product, details]);

    if (!product) return null;

    const handleAddToCart = async () => {
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
                toast.success(dict.marketplace.buyer.productCard.addToCart);
            }
            mutate();
            onOpenChange(false);
        } catch (error) {
            toast.error(error?.error?.detail || "An error occurred");
        } finally {
            setIsAddingToCart(false);
        }
    };


    const followHandler = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            if (!isFavorite) {
                let res = await likeProduct({
                    object_id: product.id,
                    title: 'product',
                    content_type: 132,
                });
                setBookMarkId(res.id)
            } else {
                await unlikeProduct(bookmarkId);
            }
            setIsFavorite(!isFavorite);
            mutate();
        } catch (error) {
            setIsFavorite(!isFavorite);
            console.error("Bookmark toggle failed:", error);
        }
    };

    const productImages = product.images || [];
    const t = dict.marketplace.supplier.productFormDialogEnhanced || {};
    const buyerDict = dict.marketplace.buyer.productCard || {};

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
                <DialogHeader className="items-start">
                    <DialogTitle>{product.title}</DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="general">{t.tabs?.general || "General"}</TabsTrigger>
                        <TabsTrigger value="specifications">{t.tabs?.specifications || "Specifications"}</TabsTrigger>
                        <TabsTrigger value="b2b">{t.tabs?.b2b || "B2B Details"}</TabsTrigger>
                    </TabsList>

                    {/* GENERAL TAB */}
                    <TabsContent value="general" className="space-y-4 py-4">
                        {/* Images */}
                        <div className="space-y-4">
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
                                        <span className="text-sm italic">{t.fields?.image?.label || "No image"}</span>
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
                                                className="w-full h-full object-contain"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-3">
                            <div className="bg-[#fdfaf3] rounded-xl p-4 space-y-3">
                                <div className="flex justify-between items-center text-sm border-b border-[#f0e6d2]/50 pb-2">
                                    <span className="text-gray-500">{dict.marketplace.common.price}:</span>
                                    <span className="text-2xl font-bold text-[#d4af37]">${product.unit_price?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-[#f0e6d2]/50 pb-2">
                                    <span className="text-gray-500">{dict.marketplace.buyer.orderDetailModal.supplier}:</span>
                                    <span className="font-semibold text-gray-900">{product.supplier?.company?.name || "N/A"}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-[#f0e6d2]/50 pb-2">
                                    <span className="text-gray-500">{t.fields?.category || "Category"}:</span>
                                    <span className="font-semibold text-gray-900 capitalize">{product.category?.replace('_', ' ')}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">{t.fields?.stock || "Stock"}:</span>
                                    <Badge variant={product.inventory > 0 ? "default" : "destructive"}>
                                        {product.inventory ?? 'Unlimited'} {dict.marketplace.common.quantity || "units"}
                                    </Badge>
                                </div>
                            </div>

                            {product.details && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm">{t.fields?.description?.label || "Description"}</h4>
                                    <p className="text-sm text-muted-foreground">{product.details}</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* SPECIFICATIONS TAB */}
                    <TabsContent value="specifications" className="space-y-4 py-4">
                        <div className="bg-muted/20 rounded-lg p-4 space-y-3">
                            <h3 className="font-semibold text-sm">{t.fields?.metalDetails?.title || "Metal Details"}</h3>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-muted-foreground">{t.fields?.karat?.label || "Karat"}:</span>
                                    <p className="font-medium">{product.purity || "N/A"}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">{t.fields?.metalDetails?.type || "Metal Type"}:</span>
                                    <p className="font-medium capitalize">{product.metalType || "Gold"}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">{t.fields?.metalDetails?.color || "Metal Color"}:</span>
                                    <p className="font-medium capitalize">{product.metalColor || "Yellow"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted/20 rounded-lg p-4 space-y-3">
                            <h3 className="font-semibold text-sm">{t.fields?.dimensions?.title || "Dimensions"}</h3>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-muted-foreground">{t.fields?.dimensions?.netWeight || "Net Weight"}:</span>
                                    <p className="font-medium">{product.net_weight || 0} g</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">{t.fields?.dimensions?.grossWeight || "Gross Weight"}:</span>
                                    <p className="font-medium">{product.gross_weight || 0} g</p>
                                </div>
                            </div>
                        </div>

                        {/* Stones */}
                        {product.stones && product.stones.length > 0 && (
                            <div className="bg-muted/20 rounded-lg p-4 space-y-3">
                                <h3 className="font-semibold text-sm">{t.fields?.stones?.title || "Stones"}</h3>
                                <div className="space-y-2">
                                    {product.stones.map((stone: any, index: number) => (
                                        <div key={index} className="bg-background p-3 rounded-md grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                            <div>
                                                <span className="text-muted-foreground">{t.fields?.stones?.type || "Type"}:</span>
                                                <p className="font-medium">{stone.type}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">{t.fields?.stones?.count || "Count"}:</span>
                                                <p className="font-medium">{stone.count}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">{t.fields?.stones?.weight || "Weight"}:</span>
                                                <p className="font-medium">{stone.weight} ct</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">{t.fields?.stones?.clarity || "Clarity"}:</span>
                                                <p className="font-medium">{stone.clarity || "N/A"}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    {/* B2B DETAILS TAB */}
                    <TabsContent value="b2b" className="space-y-4 py-4">
                        <div className="bg-muted/20 rounded-lg p-4 space-y-3">
                            <h3 className="font-semibold text-sm">{t.fields?.pricing?.title || "Pricing"}</h3>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-muted-foreground">{t.fields?.pricing?.basePrice || "Base Price"}:</span>
                                    <p className="font-medium">${product.unit_price?.toLocaleString()}</p>
                                </div>
                                {product.makingCharges && (
                                    <div>
                                        <span className="text-muted-foreground">{dict.marketplace.common.amount || "Making Charges"}:</span>
                                        <p className="font-medium">
                                            ${product.makingCharges}
                                            {product.makingChargesType === 'per_gram' ? ' /g' : ''}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-muted/20 rounded-lg p-4 space-y-3">
                            <h3 className="font-semibold text-sm">{t.fields?.inventory?.title || "Inventory & Logistics"}</h3>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-muted-foreground">{t.fields?.inventory?.moq?.substring(0, 3) || "MOQ"}:</span>
                                    <p className="font-medium">{product.moq || 1} units</p>
                                </div>
                                {product.countryOfOrigin && (
                                    <div>
                                        <span className="text-muted-foreground">{t.fields?.inventory?.countryOfOrigin || "Origin"}:</span>
                                        <p className="font-medium">{product.countryOfOrigin}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Certification */}
                        {product.certificationType && (
                            <div className="bg-muted/20 rounded-lg p-4 space-y-3">
                                <h3 className="font-semibold text-sm flex items-center gap-2">
                                    <FileCheck className="h-4 w-4" />
                                    {t.fields?.inventory?.cert?.title || "Certification"}
                                </h3>
                                <div className="text-sm">
                                    <span className="text-muted-foreground">{t.fields?.inventory?.cert?.type || "Type"}:</span>
                                    <p className="font-medium">{product.certificationType}</p>
                                    {product.certificateFile && (
                                        <Badge variant="default" className="mt-2">{t.fields?.inventory?.cert?.file || "Certificate Available"}</Badge>
                                    )}
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-4 pt-4 border-t sticky bottom-0 bg-white/95 backdrop-blur-sm items-center">
                    <QuantitySelector
                        quantity={quantity ?? 'Unlimited'}
                        setQuantity={setQuantity}
                        maxStock={product.inventory ?? 10000}
                        minQuantity={0}
                        className="h-12 w-32"
                    />
                    <Button
                        className="flex-1 h-12 bg-[#d4af37] hover:bg-[#c4a030] text-black font-bold"
                        onClick={handleAddToCart}
                        disabled={isAddingToCart || product.inventory === 0}
                    >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        {buyerDict.addToCart || "Add to Cart"}
                    </Button>
                    <Button
                        onClick={followHandler}
                        variant="outline"
                        className="w-12 h-12 p-0"
                    >
                        <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
