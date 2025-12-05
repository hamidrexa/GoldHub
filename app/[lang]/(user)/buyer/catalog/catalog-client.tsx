'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';
import { mockProducts, Product } from '@/lib/mock-data';
import ProductCard from '../components/product-card';

type SortOption = 'recommended' | 'price_low' | 'price_high' | 'newest';

interface CatalogClientProps {
    dict: any;
}

export default function CatalogClient({ dict }: CatalogClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedKarat, setSelectedKarat] = useState<string>('all');
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [weightRange, setWeightRange] = useState([0, 200]);
    const [sortBy, setSortBy] = useState<SortOption>('recommended');
    const [showFilters, setShowFilters] = useState(true);

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

    const filterProducts = (products: Product[]) => {
        let filtered = products.filter(p => p.status === 'active');

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.specifications?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(p => selectedCategories.includes(p.category));
        }

        // Karat filter
        if (selectedKarat !== 'all') {
            filtered = filtered.filter(p => p.karat === selectedKarat);
        }

        // Price filter
        filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Weight filter
        filtered = filtered.filter(p => p.weight >= weightRange[0] && p.weight <= weightRange[1]);

        return filtered;
    };

    const sortProducts = (products: Product[]) => {
        const sorted = [...products];
        switch (sortBy) {
            case 'price_low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price_high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'newest':
                return sorted.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
            default:
                return sorted;
        }
    };

    const filteredProducts = sortProducts(filterProducts(mockProducts));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.buyer.catalogPage.title}</h1>
                <p className="text-muted-foreground">{dict.marketplace.buyer.catalogPage.description}</p>
            </div>

            <div className="flex gap-6">
                {/* Filter Sidebar */}
                {showFilters && (
                    <Card className="w-80 h-fit sticky top-6">
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold">{dict.marketplace.buyer.catalogPage.filters.title}</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedCategories([]);
                                        setSelectedKarat('all');
                                        setPriceRange([0, 10000]);
                                        setWeightRange([0, 200]);
                                        setSearchQuery('');
                                    }}
                                >
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
                                        onValueChange={setPriceRange}
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
                                        onValueChange={setWeightRange}
                                        className="w-full"
                                    />
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <span>{weightRange[0]}g</span>
                                        <span>{weightRange[1]}g</span>
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full" onClick={() => { }}>
                                {dict.marketplace.buyer.catalogPage.filters.apply}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Main Content */}
                <div className="flex-1 space-y-4">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <SlidersHorizontal className="h-4 w-4 mr-2" />
                                {showFilters ? dict.marketplace.buyer.catalogPage.filters.hide : dict.marketplace.buyer.catalogPage.filters.show}
                            </Button>
                            <p className="text-sm text-muted-foreground">
                                {dict.marketplace.buyer.catalogPage.toolbar.showing} {filteredProducts.length} {dict.marketplace.buyer.catalogPage.toolbar.products}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Label className="text-sm">{dict.marketplace.buyer.catalogPage.toolbar.sortBy}</Label>
                            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
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

                    {/* Product Grid */}
                    {filteredProducts.length === 0 ? (
                        <Card className="p-12">
                            <div className="text-center">
                                <p className="text-lg text-muted-foreground">{dict.marketplace.buyer.catalogPage.noResults.title}</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    {dict.marketplace.buyer.catalogPage.noResults.description}
                                </p>
                            </div>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} dict={dict} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
