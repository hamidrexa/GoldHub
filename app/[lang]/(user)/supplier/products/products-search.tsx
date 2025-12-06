'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

interface ProductsSearchProps {
    placeholder: string;
    defaultValue?: string;
    lang: string;
}

export function ProductsSearch({ placeholder, defaultValue = '', lang }: ProductsSearchProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handleSearch = useCallback((term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        startTransition(() => {
            router.push(`/${lang}/supplier/products?${params.toString()}`);
        });
    }, [router, searchParams, lang]);

    return (
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                placeholder={placeholder}
                defaultValue={defaultValue}
                onChange={(e) => handleSearch(e.target.value)}
                className={`pl-10 ${isPending ? 'opacity-50' : ''}`}
            />
        </div>
    );
}
