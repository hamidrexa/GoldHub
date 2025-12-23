'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Product } from '@/lib/mock-data';
import ProductCard from '../components/product-card';
import { CatalogFilters } from './catalog-filters';
import { CatalogToolbar } from './catalog-toolbar';
import {
    useProductList,
    ProductListFilters,
} from '@/app/[lang]/(user)/supplier/products/services/useProductList';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ProductDetailDialog from '../components/product-detail-dialog';
import { SmartPagination } from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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
    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(12);
    const [showFilters, setShowFilters] = useState(true);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

    const handleViewDetails = (product: any) => {
        setSelectedProduct(product);
        setIsDetailDialogOpen(true);
    };

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
    }, [
        initialSearch,
        initialCategories,
        initialKarat,
        initialMinPrice,
        initialMaxPrice,
        initialMinWeight,
        initialMaxWeight,
    ]);

    const {
        products: list = [],
        count,
        isLoading,
        mutate,
    } = useProductList(page, '', filters, false, pageSize);

    const totalPages = Math.ceil((count || 0) / pageSize);

    if (isLoading) {
        return (
            <div className="col-span-full py-12 text-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-6 md:flex-row">
                {/* Mobile Filter Sheet */}
                <Sheet
                    open={mobileFiltersOpen}
                    onOpenChange={setMobileFiltersOpen}
                >
                    <SheetContent
                        side="left"
                        className="w-[85vw] overflow-y-auto sm:w-[350px]"
                    >
                        <CatalogFilters
                            dict={dict}
                            lang={lang}
                            initialCategories={initialCategories}
                            initialKarat={initialKarat}
                            initialPriceRange={[
                                initialMinPrice,
                                initialMaxPrice,
                            ]}
                            initialWeightRange={[
                                initialMinWeight,
                                initialMaxWeight,
                            ]}
                            initialSearch={initialSearch}
                        />
                    </SheetContent>
                </Sheet>

                {/* Desktop Filter Sidebar */}
                {showFilters && (
                    <div className="sticky top-6 hidden w-80 self-start md:block">
                        <CatalogFilters
                            dict={dict}
                            lang={lang}
                            initialCategories={initialCategories}
                            initialKarat={initialKarat}
                            initialPriceRange={[
                                initialMinPrice,
                                initialMaxPrice,
                            ]}
                            initialWeightRange={[
                                initialMinWeight,
                                initialMaxWeight,
                            ]}
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
                                <p className="text-muted-foreground text-lg">
                                    {
                                        dict.marketplace.buyer.catalogPage
                                            .noResults.title
                                    }
                                </p>
                                <p className="text-muted-foreground mt-2 text-sm">
                                    {
                                        dict.marketplace.buyer.catalogPage
                                            .noResults.description
                                    }
                                </p>
                            </div>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {list.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    dict={dict}
                                    onViewDetails={() =>
                                        handleViewDetails(product)
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>

                <ProductDetailDialog
                    open={isDetailDialogOpen}
                    onOpenChange={setIsDetailDialogOpen}
                    product={selectedProduct}
                    dict={dict}
                    mutate={mutate}
                />
            </div>
            <div className="flex flex-col items-center justify-between gap-4 border-t px-4 py-8 sm:flex-row">
                <div className="flex items-center gap-2">
                    <p className="text-muted-foreground text-sm whitespace-nowrap">
                        {dict?.common?.rowsPerPage || 'Rows per page'}
                    </p>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => {
                            setPageSize(Number(value));
                            setPage(0);
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[6, 12, 18, 36].map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex-1">
                    <SmartPagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        dict={dict}
                    />
                </div>

                <div className="hidden text-sm text-muted-foreground sm:block">
                    {dict?.common?.pageOf
                        ?.replace('{current}', String(page + 1))
                        .replace('{total}', String(totalPages)) ||
                        `Page ${page + 1} of ${totalPages}`}
                </div>
            </div>
        </>
    );
}
