'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function FavoriteHeader({dict,lang,wishlistItems}) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.buyer.favoritesPage.title}</h1>
                <p className="text-muted-foreground">{wishlistItems.length} {dict.marketplace.buyer.favoritesPage.savedItems}</p>
            </div>
            <Link href={`/${lang}/buyer/catalog`}>
                <Button variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {dict.marketplace.buyer.favoritesPage.browseCatalog}
                </Button>
            </Link>
        </div>
    )
}