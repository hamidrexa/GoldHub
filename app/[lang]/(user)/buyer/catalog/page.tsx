import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { getProducts } from '@/lib/api-client';
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

// Display product type for compatibility
interface DisplayProduct {
    id: string;
    name: string;
    category: string;
    karat: '18K' | '22K' | '24K';
    weight: number;
    price: number;
    stock: number;
    image?: string;
    status: 'active' | 'inactive' | 'draft';
    createdDate: string;
    specifications?: string;
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

    // Fetch products from API with filters, fallback to mock data
    let products: DisplayProduct[] = [];
    try {
        // Build API params from search params
        const apiParams: Record<string, any> = {};
        if (searchQuery) apiParams.title = searchQuery;
        if (selectedCategories.length === 1) apiParams.category = selectedCategories[0];
        if (selectedKarat !== 'all') apiParams.karat = parseInt(selectedKarat.replace('K', ''));
        if (minPrice > 0) apiParams.min_price = minPrice;
        if (maxPrice < 10000) apiParams.max_price = maxPrice;
        if (minWeight > 0) apiParams.min_weight = minWeight;
        if (maxWeight < 200) apiParams.max_weight = maxWeight;

        const apiProducts = await getProducts(apiParams);
        products = apiProducts.map(product => ({
            id: String(product.id),
            name: product.title,
            category: product.category?.toLowerCase().replace(' ', '_') || 'jewelry',
            karat: `${product.karat}K` as '18K' | '22K' | '24K',
            weight: product.weight,
            price: product.price,
            stock: product.inventory,
            image: product.images?.[0],
            status: 'active' as const,
            createdDate: new Date().toISOString().split('T')[0],
            specifications: product.details || `${product.category} · ${product.karat}K · ${product.weight}gram`,
        }));
    } catch (error) {
        console.error('Failed to fetch products from API, using mock data:', error);

        // Use mock data with client-side filtering
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

        products = filteredProducts.map(product => ({
            id: product.id,
            name: product.name,
            category: product.category,
            karat: product.karat,
            weight: product.weight,
            price: product.price,
            stock: product.stock,
            image: product.image,
            status: product.status,
            createdDate: product.createdDate,
            specifications: product.specifications,
        }));
    }

    // Sort products (done on client or server depending on data source)
    const sortProducts = (productsToSort: DisplayProduct[]) => {
        const sorted = [...productsToSort];
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

    const sortedProducts = sortProducts(products);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.buyer.catalogPage.title}</h1>
                <p className="text-muted-foreground">{dict.marketplace.buyer.catalogPage.description}</p>
            </div>

            {/* Catalog Content - Client for filter state, products pre-filtered server-side */}
            <CatalogContent
                products={sortedProducts as any}
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
