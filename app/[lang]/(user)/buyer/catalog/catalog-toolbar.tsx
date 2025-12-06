'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SlidersHorizontal } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface CatalogToolbarProps {
    dict: any;
    lang: string;
    productCount: number;
    currentSort: string;
    showFilters: boolean;
    onToggleFilters: () => void;
}

export function CatalogToolbar({
    dict,
    lang,
    productCount,
    currentSort,
    showFilters,
    onToggleFilters
}: CatalogToolbarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value !== 'recommended') {
            params.set('sort', value);
        } else {
            params.delete('sort');
        }
        router.push(`/${lang}/buyer/catalog?${params.toString()}`);
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onToggleFilters}>
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    {showFilters ? dict.marketplace.buyer.catalogPage.filters.hide : dict.marketplace.buyer.catalogPage.filters.show}
                </Button>
                <p className="text-sm text-muted-foreground">
                    {dict.marketplace.buyer.catalogPage.toolbar.showing} {productCount} {dict.marketplace.buyer.catalogPage.toolbar.products}
                </p>
            </div>

            <div className="flex items-center gap-2">
                <Label className="text-sm">{dict.marketplace.buyer.catalogPage.toolbar.sortBy}</Label>
                <Select value={currentSort} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="recommended">{dict.marketplace.buyer.catalogPage.toolbar.sortOptions.recommended}</SelectItem>
                        <SelectItem value="price_low">{dict.marketplace.buyer.catalogPage.toolbar.sortOptions.priceLow}</SelectItem>
                        <SelectItem value="price_high">{dict.marketplace.buyer.catalogPage.toolbar.sortOptions.priceHigh}</SelectItem>
                        <SelectItem value="newest">{dict.marketplace.buyer.catalogPage.toolbar.sortOptions.newest}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
