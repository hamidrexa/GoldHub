import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { mockProducts, Product } from '@/lib/mock-data';
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

    // Filter products server-side
    let filteredProducts = mockProducts.filter(p => p.status === 'active');

    // Search filter
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.specifications?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Category filter
    if (selectedCategories.length > 0) {
        filteredProducts = filteredProducts.filter(p => selectedCategories.includes(p.category));
    }

    // Karat filter
    if (selectedKarat !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.karat === selectedKarat);
    }

    // Price filter
    filteredProducts = filteredProducts.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // Weight filter
    filteredProducts = filteredProducts.filter(p => p.weight >= minWeight && p.weight <= maxWeight);

    // Sort products
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

    const sortedProducts = sortProducts(filteredProducts);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.buyer.catalogPage.title}</h1>
                <p className="text-muted-foreground">{dict.marketplace.buyer.catalogPage.description}</p>
            </div>

            {/* Catalog Content - Client for filter state, products pre-filtered server-side */}
            <CatalogContent
                products={sortedProducts}
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
