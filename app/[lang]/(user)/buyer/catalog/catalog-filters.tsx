'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface CatalogFiltersProps {
    dict: any;
    lang: string;
    initialCategories?: string[];
    initialKarat?: string;
    initialPriceRange?: [number, number];
    initialWeightRange?: [number, number];
    initialSearch?: string;
}

export function CatalogFilters({
    dict,
    lang,
    initialCategories = [],
    initialKarat = 'all',
    initialPriceRange = [0, 10000],
    initialWeightRange = [0, 200],
    initialSearch = ''
}: CatalogFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
    const [selectedKarat, setSelectedKarat] = useState(initialKarat);
    const [priceRange, setPriceRange] = useState(initialPriceRange);
    const [weightRange, setWeightRange] = useState(initialWeightRange);

    const categories = [
        { value: 'gold_bar', label: dict.marketplace.buyer.catalogPage.categories.goldBar },
        { value: 'gold_coin', label: dict.marketplace.buyer.catalogPage.categories.goldCoin },
        { value: 'jewelry', label: dict.marketplace.buyer.catalogPage.categories.jewelry },
        { value: 'necklace', label: dict.marketplace.buyer.catalogPage.categories.necklace },
        { value: 'bracelet', label: dict.marketplace.buyer.catalogPage.categories.bracelet },
        { value: 'earring', label: dict.marketplace.buyer.catalogPage.categories.earring },
        { value: 'ring', label: dict.marketplace.buyer.catalogPage.categories.ring },
    ];

    const karatOptions = [
        { value: 'all', label: dict.marketplace.buyer.catalogPage.filters.allKarats },
        { value: '24K', label: '24K' },
        { value: '22K', label: '22K' },
        { value: '18K', label: '18K' },
        { value: '14K', label: '14K' },
    ];

    const handleCategoryToggle = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (searchQuery) params.set('q', searchQuery);
        else params.delete('q');

        if (selectedCategories.length) params.set('categories', selectedCategories.join(','));
        else params.delete('categories');

        if (selectedKarat !== 'all') params.set('karat', selectedKarat);
        else params.delete('karat');

        if (priceRange[0] > 0) params.set('minPrice', String(priceRange[0]));
        else params.delete('minPrice');

        if (priceRange[1] < 10000) params.set('maxPrice', String(priceRange[1]));
        else params.delete('maxPrice');

        if (weightRange[0] > 0) params.set('minWeight', String(weightRange[0]));
        else params.delete('minWeight');

        if (weightRange[1] < 200) params.set('maxWeight', String(weightRange[1]));
        else params.delete('maxWeight');

        router.push(`/${lang}/buyer/catalog?${params.toString()}`);
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedKarat('all');
        setPriceRange([0, 10000]);
        setWeightRange([0, 200]);
        setSearchQuery('');
        router.push(`/${lang}/buyer/catalog`);
    };

    return (
        <Card className="w-80 h-fit sticky top-6">
            <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{dict.marketplace.buyer.catalogPage.filters.title}</h3>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                        {dict.marketplace.buyer.catalogPage.filters.clearAll}
                    </Button>
                </div>

                {/* Search */}
                <div className="space-y-2">
                    <Label>{dict.marketplace.buyer.catalogPage.filters.search}</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder={dict.marketplace.buyer.catalogPage.filters.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Category */}
                <div className="space-y-3">
                    <Label>{dict.marketplace.buyer.catalogPage.filters.category}</Label>
                    <div className="space-y-2">
                        {categories.map((cat) => (
                            <div key={cat.value} className="flex items-center space-x-2">
                                <Checkbox
                                    id={cat.value}
                                    checked={selectedCategories.includes(cat.value)}
                                    onCheckedChange={() => handleCategoryToggle(cat.value)}
                                />
                                <Label htmlFor={cat.value} className="font-normal cursor-pointer">
                                    {cat.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Karat */}
                <div className="space-y-3">
                    <Label>{dict.marketplace.buyer.catalogPage.filters.karat}</Label>
                    <RadioGroup value={selectedKarat} onValueChange={setSelectedKarat}>
                        {karatOptions.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={option.value} id={option.value} />
                                <Label htmlFor={option.value} className="font-normal cursor-pointer">
                                    {option.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                    <Label>{dict.marketplace.buyer.catalogPage.filters.priceRange}</Label>
                    <div className="space-y-2">
                        <Slider
                            min={0}
                            max={10000}
                            step={100}
                            value={priceRange}
                            onValueChange={(value) => setPriceRange(value as [number, number])}
                            className="w-full"
                        />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>${priceRange[0].toLocaleString()}</span>
                            <span>${priceRange[1].toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Weight Range */}
                <div className="space-y-3">
                    <Label>{dict.marketplace.buyer.catalogPage.filters.weightRange}</Label>
                    <div className="space-y-2">
                        <Slider
                            min={0}
                            max={200}
                            step={5}
                            value={weightRange}
                            onValueChange={(value) => setWeightRange(value as [number, number])}
                            className="w-full"
                        />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{weightRange[0]}g</span>
                            <span>{weightRange[1]}g</span>
                        </div>
                    </div>
                </div>

                <Button className="w-full" onClick={applyFilters}>
                    {dict.marketplace.buyer.catalogPage.filters.apply}
                </Button>
            </CardContent>
        </Card>
    );
}
