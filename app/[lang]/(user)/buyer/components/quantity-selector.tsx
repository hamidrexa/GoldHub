'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/libs/utils';

interface QuantitySelectorProps {
    quantity: number;
    setQuantity: (quantity: number) => void;
    maxStock: number;
    minQuantity?: number;
    className?: string;
}

export function QuantitySelector({
    quantity,
    setQuantity,
    maxStock,
    minQuantity = 1,
    className
}: QuantitySelectorProps) {
    const updateQuantity = (delta: number) => {
        const newQuantity = Math.max(minQuantity, Math.min(maxStock, quantity + delta));
        setQuantity(newQuantity);
    };

    const isTrash = quantity === 1 && minQuantity === 0;

    return (
        <div className={cn("flex items-center border rounded-lg bg-white overflow-hidden", className)}>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                    "h-9 w-9 rounded-none hover:bg-gray-100 disabled:opacity-30",
                    isTrash && "text-red-500 hover:text-red-600 hover:bg-red-50"
                )}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateQuantity(-1);
                }}
                disabled={quantity <= minQuantity}
            >
                {isTrash ? <Trash2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
            </Button>
            <Input
                type="number"
                value={quantity}
                readOnly
                className="w-12 h-9 text-center border-0 focus-visible:ring-0 p-0 text-sm font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-none hover:bg-gray-100 disabled:opacity-30"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateQuantity(1);
                }}
                disabled={quantity >= maxStock}
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    );
}
