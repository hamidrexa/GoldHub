'use client';

import { User } from '@sentry/types';
import { FavoriteHeader } from '@/app/[lang]/(user)/buyer/components/favorite-header';
import { FavouriteProductTable } from '@/app/[lang]/(user)/buyer/components/favorite-product-table';
import { useProductList } from '@/app/[lang]/(user)/supplier/products/services/useProductList';

export function FavoriteWrapper({ dict, lang }) {
    const {
        products: favouriteList = [],
        isLoading,
        error,
        mutate,
    } = useProductList('', undefined, true);
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
        </div>
    );
}
