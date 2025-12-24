'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Loader2, ArrowLeft } from 'lucide-react';
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
            toast.error(err?.error.detail)
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
            <div className="col-span-full py-12 text-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (details.items.length === 0) {
        return (
            <>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {dict.marketplace.buyer.cartPage.title}
                        </h1>
                        <p className="text-muted-foreground">
                            {details.items.length}{' '}
                            {dict.marketplace.buyer.cartPage.itemsInCart}
                        </p>
                    </div>
                    <Link href={`/${lang}/buyer/catalog`}>
                        <Button variant="outline" className="w-full sm:w-auto">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {dict.marketplace.buyer.cartPage.continueShopping}
                        </Button>
                    </Link>
                </div>
                <Card className="p-12">
                    <div className="space-y-4 text-center">
                        <ShoppingBag className="text-muted-foreground mx-auto h-16 w-16" />
                        <div>
                            <h3 className="text-lg font-semibold">
                                {dict.marketplace.buyer.cartPage.empty.title}
                            </h3>
                            <p className="text-muted-foreground mt-2 text-sm">
                                {
                                    dict.marketplace.buyer.cartPage.empty
                                        .description
                                }
                            </p>
                        </div>
                        <Link href={`/${lang}/buyer/catalog`}>
                            <Button>
                                {
                                    dict.marketplace.buyer.cartPage.empty
                                        .browseCatalog
                                }
                            </Button>
                        </Link>
                    </div>
                </Card>
            </>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Cart Items */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {dict.marketplace.buyer.cartPage.title}
                    </h1>
                    <p className="text-muted-foreground">
                        {details.items.length}{' '}
                        {dict.marketplace.buyer.cartPage.itemsInCart}
                    </p>
                </div>
                <Link href={`/${lang}/buyer/catalog`}>
                    <Button variant="outline" className="w-full sm:w-auto">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {dict.marketplace.buyer.cartPage.continueShopping}
                    </Button>
                </Link>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    {details.items.map((item) => (
                        <Card key={item.product.id}>
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex gap-4">
                                    {/* Product Image */}
                                    <div
                                        className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                                        {item.product.images ? (
                                            <img
                                                src={
                                                    item.product.images[0]
                                                        ?.image
                                                }
                                                alt={item.product.title}
                                                className="h-full w-full rounded-lg object-cover"
                                            />
                                        ) : (
                                            <ShoppingBag className="h-8 w-8 text-gray-400" />
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:gap-4">
                                            <div className="flex-1">
                                                <h3 className="font-semibold">
                                                    {item.product.title}
                                                </h3>
                                                <p className="text-muted-foreground mt-1 text-sm">
                                                    {item.product.details}
                                                </p>
                                                <p className="text-muted-foreground mt-1 text-sm">
                                                    $
                                                    {item.product.unit_price.toLocaleString()}{' '}
                                                    {
                                                        dict.marketplace.buyer
                                                            .cartPage.item.each
                                                    }
                                                </p>
                                            </div>

                                            {/* Price */}
                                            <div className="mt-2 text-left sm:mt-0 sm:text-right">
                                                <p className="text-lg font-bold">
                                                    $
                                                    {(
                                                        item.product.unit_price *
                                                        item.count
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="mt-4">
                                            <CartItemControls
                                                productId={item.product.id}
                                                initialQuantity={item.count}
                                                maxStock={
                                                    item.product.inventory
                                                }
                                                dict={dict}
                                                onQuantityChange={
                                                    handleQuantityChange
                                                }
                                                onRemove={handleRemove}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="lg:col-span-1">
                    <Card className="sticky top-6 overflow-hidden">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base sm:text-lg">
                                {dict.marketplace.buyer.cartPage.summary.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col justify-center space-y-4 pt-0">
                            <div className="space-y-3 rounded-lg bg-gray-50/50 p-3">
                                <div className="flex justify-between gap-2 text-xs sm:text-sm">
                                <span className="text-muted-foreground truncate">
                                    {
                                        dict.marketplace.buyer.cartPage.summary
                                            .subtotal
                                    }
                                </span>
                                    <span className="whitespace-nowrap font-medium">
                                    ${subtotal?.toLocaleString() || '0'}
                                </span>
                                </div>
                                <div className="flex justify-between gap-2 text-xs sm:text-sm">
                                <span className="text-muted-foreground truncate">
                                    {
                                        dict.marketplace.buyer.cartPage.summary
                                            .tax
                                    }
                                </span>
                                    <span className="whitespace-nowrap font-medium">
                                    ${tax?.toFixed(2) || '0.00'}
                                </span>
                                </div>
                                <div className="flex justify-between gap-2 text-xs sm:text-sm">
                                <span className="text-muted-foreground truncate">
                                    {
                                        dict.marketplace.buyer.cartPage.summary
                                            .shipping
                                    }
                                </span>
                                    <span className="whitespace-nowrap font-medium">
                                    {shipping === 0
                                        ? dict.marketplace.buyer.cartPage
                                            .summary.free
                                        : `$${shipping}`}
                                </span>
                                </div>
                                {shipping === 0 && (
                                    <p className="mt-2 text-xs text-green-600">
                                        {
                                            dict.marketplace.buyer.cartPage.summary
                                                .freeShippingMsg
                                        }
                                    </p>
                                )}
                            </div>

                            <Separator className="my-2" />

                            <div
                                className="mx-3 flex justify-between gap-2 bg-blue-50/50 px-6 py-3 text-base font-bold sm:text-lg">
                            <span className="truncate">
                                {dict.marketplace.buyer.cartPage.summary.total}
                            </span>
                                <span className="whitespace-nowrap">
                                ${total?.toLocaleString() || '0'}
                            </span>
                            </div>

                            {error && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                                    <p className="text-xs text-red-700 sm:text-sm">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <Button
                                className="mx-3 h-10 text-sm sm:h-12 sm:text-base"
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                            >
                                {isCheckingOut ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    dict.marketplace.buyer.cartPage.summary.checkout
                                )}
                            </Button>

                            <p className="text-muted-foreground text-center text-xs">
                                {
                                    dict.marketplace.buyer.cartPage.summary
                                        .secureCheckout
                                }
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
            {/* Order Summary */}
        </div>
    );
}
