'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItemControlsProps {
    productId: string;
    initialQuantity: number;
    maxStock: number;
    dict: any;
    onQuantityChange?: (productId: string, quantity: number) => void;
    onRemove?: (productId: string) => void;
}

export function CartItemControls({
    productId,
    initialQuantity,
    maxStock,
    dict,
    onQuantityChange,
    onRemove
}: CartItemControlsProps) {
    const [quantity, setQuantity] = useState(initialQuantity);

    const updateQuantity = (delta: number) => {
        const newQuantity = Math.max(1, Math.min(maxStock, quantity + delta));
        setQuantity(newQuantity);
        onQuantityChange?.(productId, newQuantity);
    };

    const handleRemove = () => {
        onRemove?.(productId);
    };

    return (
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center border rounded-lg">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateQuantity(-1)}
                    disabled={quantity <= 1}
                >
                    <Minus className="h-4 w-4" />
                </Button>
                <Input
                    type="number"
                    value={quantity}
                    readOnly
                    className="w-16 text-center border-0 focus-visible:ring-0"
                />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateQuantity(1)}
                    disabled={quantity >= maxStock}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
                <Trash2 className="h-4 w-4 mr-2" />
                {dict.marketplace.buyer.cartPage.item.remove}
            </Button>
        </div>
    );
}
