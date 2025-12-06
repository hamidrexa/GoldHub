import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getCartDetails } from '@/lib/api-client';
import { mockCartItems } from '@/lib/buyer-mock-data';
import Link from 'next/link';
import { CartContent } from './cart-content';

interface PageProps {
    params: { lang: Locale };
}

export default async function CartPage({ params: { lang } }: PageProps) {
    const dict = await getDictionary(lang);

    // Fetch cart from API, fallback to mock data
    let cartItems: {
        productId: string;
        quantity: number;
        product: {
            name: string;
            price: number;
            specifications: string;
            stock: number;
            image?: string;
        };
    }[] = [];

    try {
        const cartData = await getCartDetails();
        cartItems = cartData.items.map(item => ({
            productId: String(item.product_id),
            quantity: item.count,
            product: {
                name: item.product.title,
                price: item.product.price,
                specifications: item.product.details || `${item.product.category} · ${item.product.karat}K · ${item.product.weight}gram`,
                stock: item.product.inventory,
                image: item.product.images?.[0],
            }
        }));
    } catch (error) {
        console.error('Failed to fetch cart from API, using mock data:', error);
        // Transform mock data for client component
        cartItems = mockCartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            product: {
                name: item.product.name,
                price: item.product.price,
                specifications: item.product.specifications || '',
                stock: item.product.stock,
                image: item.product.image,
            }
        }));
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.buyer.cartPage.title}</h1>
                    <p className="text-muted-foreground">{cartItems.length} {dict.marketplace.buyer.cartPage.itemsInCart}</p>
                </div>
                <Link href={`/${lang}/buyer/catalog`}>
                    <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {dict.marketplace.buyer.cartPage.continueShopping}
                    </Button>
                </Link>
            </div>

            {/* Cart Content - Client Component for state management */}
            <CartContent initialItems={cartItems} lang={lang} dict={dict} />
        </div>
    );
}
