import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
    { params: { lang } }: PageProps,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const seoTitle = dict.marketplace.supplier.productsPage.title || 'Your Products';
    const seoDescription = dict.marketplace.supplier.productsPage.description || 'Manage your product listings, inventory, and details on GoldHub.';

    return {
        title: `${seoTitle}`,
        description: seoDescription,
        openGraph: {
            title: `${seoTitle}`,
            description: seoDescription,
        },
        alternates: {
            canonical: `/${lang}/supplier/products`,
        },
    };
}
import { getProducts, mapApiProductToUi } from '@/lib/api-client';
import { mockProducts, Product } from '@/lib/mock-data';
import { ProductsSearch } from './products-search';
import { CategoryFilter } from './category-filter';
import { ProductActions } from './product-actions';
import { ProductsGrid } from './products-grid';

interface PageProps {
    params: { lang: Locale };
    searchParams: { q?: string; category?: string };
}

// Convert API product to UI product format
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

export default async function SupplierProductsPage({ params: { lang }, searchParams }: PageProps) {
    const dict = await getDictionary(lang);
    const searchQuery = searchParams.q || '';
    const categoryFilter = searchParams.category || 'all';

    // Fetch products from API, fallback to mock data
    let products: DisplayProduct[] = [];
    try {
        const apiProducts = await getProducts();
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
        products = mockProducts.map(product => ({
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

    // Filter products server-side
    let filteredProducts = [...products];

    // Search filter
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.specifications?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Category filter
    if (categoryFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.supplier.productsPage.title}</h1>
                    <p className="text-muted-foreground">{dict.marketplace.supplier.productsPage.description}</p>
                </div>
                <ProductActions dict={dict} products={filteredProducts as any} />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <ProductsSearch
                    placeholder={dict.marketplace.supplier.productsPage.searchPlaceholder}
                    defaultValue={searchQuery}
                    lang={lang}
                />
                <CategoryFilter
                    dict={dict}
                    lang={lang}
                    currentCategory={categoryFilter}
                />
            </div>

            {/* Products Grid */}
            <div className="w-full flex flex-col justify-center">
                <ProductsGrid dict={dict} />
            </div>
        </div>
    );
}
