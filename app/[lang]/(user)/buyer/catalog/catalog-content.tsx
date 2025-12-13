'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Product } from '@/lib/mock-data';
import ProductCard from '../components/product-card';
import { CatalogFilters } from './catalog-filters';
import { CatalogToolbar } from './catalog-toolbar';
import { useProductList, ProductListFilters } from '@/app/[lang]/(user)/supplier/products/services/useProductList';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface CatalogContentProps {
    dict: any;
    lang: string;
    currentSort: string;
    initialSearch?: string;
    initialCategories?: string[];
    initialKarat?: string;
    initialMinPrice?: number;
    initialMaxPrice?: number;
    initialMinWeight?: number;
    initialMaxWeight?: number;
}

export function CatalogContent({
    dict,
    lang,
    currentSort,
    initialSearch = '',
    initialCategories = [],
    initialKarat = 'all',
    initialMinPrice = 0,
    initialMaxPrice = 10000,
    initialMinWeight = 0,
    initialMaxWeight = 200,
}: CatalogContentProps) {
    const [showFilters, setShowFilters] = useState(true);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Build filters object from initial props
    const filters = useMemo<ProductListFilters>(() => {
        const filterObj: ProductListFilters = {};

        // Add search query (title filter)
        if (initialSearch) {
            filterObj.title = initialSearch;
        }

        // Add category filter (use first category if multiple selected)
        // Note: API accepts single category, but UI allows multiple - we'll use the first one
        if (initialCategories.length > 0) {
            filterObj.category = initialCategories[0];
        }

        // Add karat filter
        if (initialKarat && initialKarat !== 'all') {
            // Convert karat string like "24K" to number 24
            const karatNumber = parseInt(initialKarat.replace('K', ''));
            if (!isNaN(karatNumber)) {
                filterObj.karat = karatNumber;
            }
        }

        // Add price range filters
        if (initialMinPrice > 0) {
            filterObj.min_price = initialMinPrice;
        }
        if (initialMaxPrice < 10000) {
            filterObj.max_price = initialMaxPrice;
        }

        // Add weight range filters
        if (initialMinWeight > 0) {
            filterObj.min_weight = initialMinWeight;
        }
        if (initialMaxWeight < 200) {
            filterObj.max_weight = initialMaxWeight;
        }

        return filterObj;
    }, [initialSearch, initialCategories, initialKarat, initialMinPrice, initialMaxPrice, initialMinWeight, initialMaxWeight]);

    const { products: list = [], isLoading } = useProductList(undefined, filters);

    if (isLoading) {
        return (
            <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row gap-6">
            {/* Mobile Filter Sheet */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetContent side="left" className="w-[85vw] sm:w-[350px] overflow-y-auto">
                    <CatalogFilters
                        dict={dict}
                        lang={lang}
                        initialCategories={initialCategories}
                        initialKarat={initialKarat}
                        initialPriceRange={[initialMinPrice, initialMaxPrice]}
                        initialWeightRange={[initialMinWeight, initialMaxWeight]}
                        initialSearch={initialSearch}
                    />
                </SheetContent>
            </Sheet>

            {/* Desktop Filter Sidebar */}
            {showFilters && (
                <div className="hidden md:block w-80 sticky top-6 self-start">
                    <CatalogFilters
                        dict={dict}
                        lang={lang}
                        initialCategories={initialCategories}
                        initialKarat={initialKarat}
                        initialPriceRange={[initialMinPrice, initialMaxPrice]}
                        initialWeightRange={[initialMinWeight, initialMaxWeight]}
                        initialSearch={initialSearch}
                    />
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 space-y-4">
                {/* Toolbar */}
                <CatalogToolbar
                    dict={dict}
                    lang={lang}
                    productCount={list.length}
                    currentSort={currentSort}
                    showFilters={showFilters}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                    onOpenMobileFilters={() => setMobileFiltersOpen(true)}
                />

                {/* Product Grid */}
                {list.length === 0 ? (
                    <Card className="p-12">
                        <div className="text-center">
                            <p className="text-lg text-muted-foreground">{dict.marketplace.buyer.catalogPage.noResults.title}</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                {dict.marketplace.buyer.catalogPage.noResults.description}
                            </p>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {list.map((product) => (
                            <ProductCard key={product.id} product={product} dict={dict} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
