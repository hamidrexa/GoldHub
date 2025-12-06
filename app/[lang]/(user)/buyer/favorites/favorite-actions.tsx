'use client';

import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface FavoriteActionsProps {
    productId: string;
    dict: any;
    onRemove?: () => void;
}

export function FavoriteActions({ productId, dict, onRemove }: FavoriteActionsProps) {
    const [isRemoving, setIsRemoving] = useState(false);

    const handleRemove = () => {
        setIsRemoving(true);
        // In a real app, this would call an API
        // For now, just trigger parent callback
        onRemove?.();
    };

    return (
        <div className="mt-4 flex gap-2">
            <Button className="flex-1" size="sm">
                <ShoppingCart className="h-4 w-4 mr-2" />
                {dict.marketplace.buyer.favoritesPage.item.addToCart}
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={handleRemove}
                disabled={isRemoving}
            >
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            </Button>
        </div>
    );
}
