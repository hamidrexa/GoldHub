'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { mockCartItems } from '@/lib/buyer-mock-data';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CartPage() {
    const [cartItems, setCartItems] = useState(mockCartItems);
    const params = useParams();
    const lang = params.lang || 'en';

    const updateQuantity = (productId: string, delta: number) => {
        setCartItems(items =>
            items.map(item =>
                item.productId === productId
                    ? { ...item, quantity: Math.max(1, Math.min(item.product.stock, item.quantity + delta)) }
                    : item
            )
        );
    };

    const removeItem = (productId: string) => {
        setCartItems(items => items.filter(item => item.productId !== productId));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 5000 ? 0 : 50; // Free shipping over $5000
    const total = subtotal + tax + shipping;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
                    <p className="text-muted-foreground">{cartItems.length} items in your cart</p>
                </div>
                <Link href={`/${lang}/buyer/catalog`}>
                    <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Continue Shopping
                    </Button>
                </Link>
            </div>

            {cartItems.length === 0 ? (
                <Card className="p-12">
                    <div className="text-center space-y-4">
                        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto" />
                        <div>
                            <h3 className="text-lg font-semibold">Your cart is empty</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                Add products from the catalog to get started
                            </p>
                        </div>
                        <Link href={`/${lang}/buyer/catalog`}>
                            <Button>Browse Catalog</Button>
                        </Link>
                    </div>
                </Card>
            ) : (
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <Card key={item.productId}>
                                <CardContent className="p-6">
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
                                            <div className="flex justify-between gap-4">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold">{item.product.name}</h3>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {item.product.specifications}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        ${item.product.price.toLocaleString()} each
                                                    </p>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <p className="text-lg font-bold">
                                                        ${(item.product.price * item.quantity).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-4 mt-4">
                                                <div className="flex items-center border rounded-lg">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => updateQuantity(item.productId, -1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <Input
                                                        type="number"
                                                        value={item.quantity}
                                                        readOnly
                                                        className="w-16 text-center border-0 focus-visible:ring-0"
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => updateQuantity(item.productId, 1)}
                                                        disabled={item.quantity >= item.product.stock}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeItem(item.productId)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Remove
                                                </Button>
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
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>${subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Tax (8%)</span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span>{shipping === 0 ? 'FREE' : `$${shipping}`}</span>
                                    </div>
                                    {shipping === 0 && (
                                        <p className="text-xs text-green-600">
                                            🎉 You qualify for free shipping!
                                        </p>
                                    )}
                                </div>

                                <Separator />

                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span>${total.toLocaleString()}</span>
                                </div>

                                <Link href={`/${lang}/buyer/orders`}>
                                    <Button className="w-full" size="xl">
                                        Proceed to Checkout
                                    </Button>
                                </Link>

                                <p className="text-xs text-center text-muted-foreground">
                                    Secure checkout · Buyer protection included
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
