'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface CategoryFilterProps {
    dict: any;
    lang: string;
    currentCategory: string;
}

export function CategoryFilter({ dict, lang, currentCategory }: CategoryFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleCategoryChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value !== 'all') {
            params.set('category', value);
        } else {
            params.delete('category');
        }
        router.push(`/${lang}/supplier/products?${params.toString()}`);
    };

    return (
        <Select value={currentCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={dict.marketplace.supplier.productsPage.category} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">{dict.marketplace.supplier.productsPage.categories.all}</SelectItem>
                <SelectItem value="gold_bar">{dict.marketplace.supplier.productsPage.categories.goldBar}</SelectItem>
                <SelectItem value="gold_coin">{dict.marketplace.supplier.productsPage.categories.goldCoin}</SelectItem>
                <SelectItem value="jewelry">{dict.marketplace.supplier.productsPage.categories.jewelry}</SelectItem>
                <SelectItem value="necklace">{dict.marketplace.supplier.productsPage.categories.necklace}</SelectItem>
                <SelectItem value="bracelet">{dict.marketplace.supplier.productsPage.categories.bracelet}</SelectItem>
                <SelectItem value="earring">{dict.marketplace.supplier.productsPage.categories.earring}</SelectItem>
                <SelectItem value="ring">{dict.marketplace.supplier.productsPage.categories.ring}</SelectItem>
            </SelectContent>
        </Select>
    );
}
