import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
    { params: { lang } }: PageProps,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const seoTitle = dict.marketplace?.buyer?.favoritesPage?.title || 'Your Favorites';
    const seoDescription = dict.marketplace?.buyer?.favoritesPage?.empty?.description || 'View and manage your saved items and favorites on GoldHub.';

    return {
        title: `${seoTitle}`,
        description: seoDescription,
        openGraph: {
            title: `${seoTitle}`,
            description: seoDescription,
        },
        alternates: {
            canonical: `/${lang}/buyer/favorites`,
        },
    };
}
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ArrowLeft, Package as PackageIcon } from 'lucide-react';
import { mockWishlist } from '@/lib/buyer-mock-data';
import Link from 'next/link';
import { FavouriteProductTable } from '@/app/[lang]/(user)/buyer/components/favorite-product-table';
import { FavoriteWrapper } from '@/app/[lang]/(user)/buyer/components/favorite-wrapper';

interface PageProps {
    params: { lang: Locale };
}

export default async function FavoritesPage({ params: { lang } }: PageProps) {
    const dict = await getDictionary(lang);

    return (
        <div className="space-y-6">
            {/* Header */}
            <FavoriteWrapper dict={dict} lang={lang}/>
        </div>
    );
}
