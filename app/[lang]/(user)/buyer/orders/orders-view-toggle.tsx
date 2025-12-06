'use client';

import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

interface ViewToggleProps {
    currentView: 'grid' | 'list';
}

export function ViewToggle({ currentView }: ViewToggleProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handleViewChange = useCallback((view: 'grid' | 'list') => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('view', view);
        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    }, [router, searchParams]);

    return (
        <div className={`flex items-center gap-2 ${isPending ? 'opacity-50' : ''}`}>
            <Button
                variant={currentView === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleViewChange('grid')}
            >
                <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
                variant={currentView === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleViewChange('list')}
            >
                <List className="h-4 w-4" />
            </Button>
        </div>
    );
}
