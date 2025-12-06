import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { mockProducts } from '@/lib/mock-data';
import { ProductsSearch } from './products-search';
import { CategoryFilter } from './category-filter';
import { ProductActions } from './product-actions';
import { ProductsGrid } from './products-grid';

interface PageProps {
    params: { lang: Locale };
    searchParams: { q?: string; category?: string };
}

export default async function SupplierProductsPage({ params: { lang }, searchParams }: PageProps) {
    const dict = await getDictionary(lang);
    const searchQuery = searchParams.q || '';
    const categoryFilter = searchParams.category || 'all';

    // Filter products server-side
    let filteredProducts = [...mockProducts];

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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.supplier.productsPage.title}</h1>
                    <p className="text-muted-foreground">{dict.marketplace.supplier.productsPage.description}</p>
                </div>
                <ProductActions dict={dict} products={filteredProducts} />
            </div>

            <div className="flex items-center gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <ProductsGrid dict={dict} products={filteredProducts} />
            </div>
        </div>
    );
}
