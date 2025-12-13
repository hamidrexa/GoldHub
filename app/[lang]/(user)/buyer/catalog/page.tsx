import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
    { params: { lang } }: PageProps,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const seoTitle = dict.marketplace.buyer.catalogPage.title || 'Product Catalog';
    const seoDescription = dict.marketplace.buyer.catalogPage.description || 'Browse our extensive catalog of fine jewelry and gold products.';

    return {
        title: `${seoTitle}`,
        description: seoDescription,
        openGraph: {
            title: `${seoTitle}`,
            description: seoDescription,
        },
        alternates: {
            canonical: `/${lang}/buyer/catalog`,
        },
    };
}

import { CatalogContent } from './catalog-content';

interface PageProps {
    params: { lang: Locale };
    searchParams: {
        q?: string;
        categories?: string;
        karat?: string;
        minPrice?: string;
        maxPrice?: string;
        minWeight?: string;
        maxWeight?: string;
        sort?: string;
    };
}

export default async function CatalogPage({ params: { lang }, searchParams }: PageProps) {
    const dict = await getDictionary(lang);

    // Parse search params
    const searchQuery = searchParams.q || '';
    const selectedCategories = searchParams.categories?.split(',').filter(Boolean) || [];
    const selectedKarat = searchParams.karat || 'all';
    const minPrice = parseInt(searchParams.minPrice || '0');
    const maxPrice = parseInt(searchParams.maxPrice || '10000');
    const minWeight = parseInt(searchParams.minWeight || '0');
    const maxWeight = parseInt(searchParams.maxWeight || '200');
    const sortBy = searchParams.sort || 'recommended';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.buyer.catalogPage.title}</h1>
                <p className="text-muted-foreground">{dict.marketplace.buyer.catalogPage.description}</p>
            </div>

            {/* Catalog Content - Client component handles API fetching with filters */}
            <CatalogContent
                dict={dict}
                lang={lang}
                currentSort={sortBy}
                initialSearch={searchQuery}
                initialCategories={selectedCategories}
                initialKarat={selectedKarat}
                initialMinPrice={minPrice}
                initialMaxPrice={maxPrice}
                initialMinWeight={minWeight}
                initialMaxWeight={maxWeight}
            />
        </div>
    );
}
