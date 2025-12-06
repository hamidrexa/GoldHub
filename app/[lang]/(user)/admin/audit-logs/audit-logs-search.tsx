'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

interface AuditLogsSearchProps {
    placeholder: string;
    defaultValue?: string;
}

export function AuditLogsSearch({ placeholder, defaultValue = '' }: AuditLogsSearchProps) {
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
            router.push(`?${params.toString()}`);
        });
    }, [router, searchParams]);

    return (
        <div className="flex items-center gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    className={`pl-10 ${isPending ? 'opacity-50' : ''}`}
                />
            </div>
        </div>
    );
}
