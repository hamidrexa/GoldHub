'use client';

import { FavoriteHeader } from '@/app/[lang]/(user)/buyer/components/favorite-header';
import { FavouriteProductTable } from '@/app/[lang]/(user)/buyer/components/favorite-product-table';
import { useProductList } from '@/app/[lang]/(user)/supplier/products/services/useProductList';
import {
    Pagination,
    PaginationContent,
    PaginationItem, PaginationNext, PaginationPrevious,
} from '@/components/ui/pagination';
import React from 'react';

export function FavoriteWrapper({ dict, lang }) {
    const [page, setPage] = React.useState(0);
    const {
        products: favouriteList = [],
        isLoading,
        previous,
        next,
        error,
        mutate,
    } = useProductList(page,'', undefined, true);
    const wishlistItems = [...favouriteList];

    return (
        <div className="flex flex-col gap-6">
            <FavoriteHeader
                dict={dict}
                lang={lang}
                wishlistItems={wishlistItems}
            />
            <FavouriteProductTable
                dict={dict}
                lang={lang}
                wishlistItems={wishlistItems}
                mutate={mutate}
                error={error}
                isLoading={isLoading}
            />
            <Pagination className="mt-8">
                <PaginationContent>
                    {!!next && (
                        <PaginationItem>
                            <PaginationPrevious
                                text="previous"
                                onClick={() => {
                                    setPage(page + 1);
                                }}
                                isActive
                            />
                        </PaginationItem>
                    )}
                    {!!previous && (
                        <PaginationItem>
                            <PaginationNext
                                text="next"
                                onClick={() => {
                                    setPage(page - 1);
                                }}
                                isActive
                            />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
        </div>
    );
}
