'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { QuantitySelector } from '../components/quantity-selector';

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

    const handleQuantityChange = (newQty: number) => {
        setQuantity(newQty);
        onQuantityChange?.(productId, newQty);
    };

    const handleRemove = () => {
        onRemove?.(productId);
    };

    return (
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <QuantitySelector
                quantity={quantity}
                setQuantity={handleQuantityChange}
                maxStock={maxStock}
                className="w-auto"
            />

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
