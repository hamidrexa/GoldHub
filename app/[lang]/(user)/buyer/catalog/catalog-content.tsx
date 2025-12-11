'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Product } from '@/lib/mock-data';
import ProductCard from '../components/product-card';
import { CatalogFilters } from './catalog-filters';
import { CatalogToolbar } from './catalog-toolbar';
import { useProductList } from '@/app/[lang]/(user)/supplier/products/services/useProductList';

interface CatalogContentProps {
    products: Product[];
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
    products,
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
    const {products:list = [],isLoading} = useProductList("")

    if (isLoading) {
        return (
            <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex gap-6">
            {/* Filter Sidebar */}
            {showFilters && (
                <CatalogFilters
                    dict={dict}
                    lang={lang}
                    initialCategories={initialCategories}
                    initialKarat={initialKarat}
                    initialPriceRange={[initialMinPrice, initialMaxPrice]}
                    initialWeightRange={[initialMinWeight, initialMaxWeight]}
                    initialSearch={initialSearch}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 space-y-4">
                {/* Toolbar */}
                <CatalogToolbar
                    dict={dict}
                    lang={lang}
                    productCount={products.length}
                    currentSort={currentSort}
                    showFilters={showFilters}
                    onToggleFilters={() => setShowFilters(!showFilters)}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {list.map((product) => (
                            <ProductCard key={product.id} product={product} dict={dict} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
