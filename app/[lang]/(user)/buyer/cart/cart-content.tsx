'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { CartItemControls } from './cart-item-controls';

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

    const handleQuantityChange = (productId: string, quantity: number) => {
        setCartItems(items =>
            items.map(item =>
                item.productId === productId ? { ...item, quantity } : item
            )
        );
    };

    const handleRemove = (productId: string) => {
        setCartItems(items => items.filter(item => item.productId !== productId));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const shipping = subtotal > 5000 ? 0 : 50;
    const total = subtotal + tax + shipping;

    if (cartItems.length === 0) {
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
                {cartItems.map((item) => (
                    <Card key={item.productId}>
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex gap-4">
                                {/* Product Image */}
                                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    {item.product.image ? (
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
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
                                            <h3 className="font-semibold">{item.product.name}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {item.product.specifications}
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                ${item.product.price.toLocaleString()} {dict.marketplace.buyer.cartPage.item.each}
                                            </p>
                                        </div>

                                        {/* Price */}
                                        <div className="text-left sm:text-right mt-2 sm:mt-0">
                                            <p className="text-lg font-bold">
                                                ${(item.product.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="mt-4">
                                        <CartItemControls
                                            productId={item.productId}
                                            initialQuantity={item.quantity}
                                            maxStock={item.product.stock}
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
                <Card className="sticky top-6">
                    <CardHeader>
                        <CardTitle>{dict.marketplace.buyer.cartPage.summary.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{dict.marketplace.buyer.cartPage.summary.subtotal}</span>
                                <span>${subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{dict.marketplace.buyer.cartPage.summary.tax}</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{dict.marketplace.buyer.cartPage.summary.shipping}</span>
                                <span>{shipping === 0 ? dict.marketplace.buyer.cartPage.summary.free : `$${shipping}`}</span>
                            </div>
                            {shipping === 0 && (
                                <p className="text-xs text-green-600">
                                    {dict.marketplace.buyer.cartPage.summary.freeShippingMsg}
                                </p>
                            )}
                        </div>

                        <Separator />

                        <div className="flex justify-between font-semibold text-lg">
                            <span>{dict.marketplace.buyer.cartPage.summary.total}</span>
                            <span>${total.toLocaleString()}</span>
                        </div>

                        <Link href={`/${lang}/buyer/orders`}>
                            <Button className="w-full" size="xl">
                                {dict.marketplace.buyer.cartPage.summary.checkout}
                            </Button>
                        </Link>

                        <p className="text-xs text-center text-muted-foreground">
                            {dict.marketplace.buyer.cartPage.summary.secureCheckout}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
