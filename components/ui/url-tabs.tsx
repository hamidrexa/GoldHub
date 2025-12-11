'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface TabItem {
    value: string;
    label: string;
}

interface URLTabsProps {
    tabs: TabItem[];
    defaultValue: string;
    paramName?: string;
    className?: string; // Allow minimal styling override if needed
}

export function URLTabs({ tabs, defaultValue, paramName = 'tab', className }: URLTabsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const onValueChange = useCallback((value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(paramName, value);

        // Push the new URL with updated search params
        router.push(`?${params.toString()}`);
    }, [router, searchParams, paramName]);

    return (
        <Tabs defaultValue={defaultValue} onValueChange={onValueChange} className={className || "w-full"}>
            <TabsList>
                {tabs.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
}
