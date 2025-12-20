'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { CartItemControls } from './cart-item-controls';

import { useCardDetails } from '@/app/[lang]/(user)/buyer/services/cart-details';
import { addToCart } from '@/app/[lang]/(user)/buyer/services/add-to-cart';
import { removeFromCart } from '@/app/[lang]/(user)/buyer/services/remove-from-cart';
import { submitOrder } from '@/app/[lang]/(user)/buyer/services/submit-order';
import { toast } from 'sonner';

interface CartItem {
    productId: string;
    quantity: number;
    product: {
        name: string;
        price: number;
        specifications: string;
        stock: number;
        image?: string;
    };
}

interface CartContentProps {
    initialItems: CartItem[];
    lang: string;
    dict: any;
}

export function CartContent({ initialItems, lang, dict }: CartContentProps) {
    const [cartItems, setCartItems] = useState(initialItems);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {details,isLoading:cardLoading,mutate} = useCardDetails()

    const handleQuantityChange = async (productId: string, quantity: number) => {
        // Optimistically update UI
        setCartItems(items =>
            items.map(item =>
                item.productId === productId ? { ...item, quantity } : item
            )
        );

        // Try to sync with API
        try {
            await addToCart({
                product_id: parseInt(productId),
                count: quantity,
            });
            await mutate();
            toast.success("Product has been added to card successfully!");
        } catch (err) {
            console.error('Failed to update cart on server:', err);
            // UI already updated, just log the error
        }
    };

    const handleRemove = async (productId: string) => {
        setCartItems(items => items.filter(item => item.productId !== productId));

        try {
             await removeFromCart({
                product_id: parseInt(productId),
            });
            await mutate();
        } catch (err) {
            console.error('Failed to remove item on server:', err);
        }
    };

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        setError(null);

        try {
            await submitOrder();
            // Redirect to orders page on success
            window.location.href = `/${lang}/buyer/orders`;
        } catch (err) {
            toast.error(err.error?.detail);
            console.error('Failed to submit order:', err);
            setError(err.error?.detail ?? 'Failed to submit order. Please try again.');
            setIsCheckingOut(false);
        }
    };

    const subtotal = details?.items?.reduce((sum, item) => sum + (item.product.price * item.count), 0);
    const tax = subtotal * 0.08;
    const shipping = subtotal > 5000 ? 0 : 50;
    const total = subtotal + tax + shipping;

    if (cardLoading) {
        return (
            <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (details.items.length === 0) {
        return (
            <Card className="p-12">
                <div className="text-center space-y-4">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto" />
                    <div>
                        <h3 className="text-lg font-semibold">{dict.marketplace.buyer.cartPage.empty.title}</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                            {dict.marketplace.buyer.cartPage.empty.description}
                        </p>
                    </div>
                    <Link href={`/${lang}/buyer/catalog`}>
                        <Button>{dict.marketplace.buyer.cartPage.empty.browseCatalog}</Button>
                    </Link>
                </div>
            </Card>
        );
    }

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
                {details.items.map((item) => (
                    <Card key={item.product.id}>
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex gap-4">
                                {/* Product Image */}
                                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    {item.product.images ? (
                                        <img
                                            src={item.product.images[0]?.image}
                                            alt={item.product.title}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                                    )}
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{item.product.title}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {item.product.details}
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                ${item.product.price.toLocaleString()} {dict.marketplace.buyer.cartPage.item.each}
                                            </p>
                                        </div>

                                        {/* Price */}
                                        <div className="text-left sm:text-right mt-2 sm:mt-0">
                                            <p className="text-lg font-bold">
                                                ${(item.product.price * item.count).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="mt-4">
                                        <CartItemControls
                                            productId={item.product.id}
                                            initialQuantity={item.count}
                                            maxStock={item.product.inventory}
                                            dict={dict}
                                            onQuantityChange={handleQuantityChange}
                                            onRemove={handleRemove}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
                <Card className="sticky top-6 overflow-hidden">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base sm:text-lg">{dict.marketplace.buyer.cartPage.summary.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                        <div className="space-y-3 bg-gray-50/50 rounded-lg p-3">
                            <div className="flex justify-between text-xs sm:text-sm gap-2">
                                <span className="text-muted-foreground truncate">{dict.marketplace.buyer.cartPage.summary.subtotal}</span>
                                <span className="font-medium whitespace-nowrap">${subtotal?.toLocaleString() || '0'}</span>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm gap-2">
                                <span className="text-muted-foreground truncate">{dict.marketplace.buyer.cartPage.summary.tax}</span>
                                <span className="font-medium whitespace-nowrap">${tax?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="flex justify-between text-xs sm:text-sm gap-2">
                                <span className="text-muted-foreground truncate">{dict.marketplace.buyer.cartPage.summary.shipping}</span>
                                <span className="font-medium whitespace-nowrap">
                                    {shipping === 0 ? dict.marketplace.buyer.cartPage.summary.free : `$${shipping}`}
                                </span>
                            </div>
                            {shipping === 0 && (
                                <p className="text-xs text-green-600 mt-2">
                                    {dict.marketplace.buyer.cartPage.summary.freeShippingMsg}
                                </p>
                            )}
                        </div>

                        <Separator className="my-2" />

                        <div className="flex justify-between font-bold text-base sm:text-lg gap-2 bg-blue-50/50 -mx-6 px-6 py-3">
                            <span className="truncate">{dict.marketplace.buyer.cartPage.summary.total}</span>
                            <span className="whitespace-nowrap">${total?.toLocaleString() || '0'}</span>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-xs sm:text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <Button
                            className="w-full h-10 sm:h-12 text-sm sm:text-base"
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                        >
                            {isCheckingOut ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                dict.marketplace.buyer.cartPage.summary.checkout
                            )}
                        </Button>

                        <p className="text-xs text-center text-muted-foreground">
                            {dict.marketplace.buyer.cartPage.summary.secureCheckout}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
