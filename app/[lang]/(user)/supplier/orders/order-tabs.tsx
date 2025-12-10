'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter, useSearchParams } from 'next/navigation';

interface OrderTabsProps {
    tabs: { value: string; label: string }[];
    defaultValue: string;
}

export function OrderTabs({ tabs, defaultValue }: OrderTabsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const onValueChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', value);
        // Preserve other params like 'q' if needed, or maybe reset page?
        // Usually switching tabs keeps the search context or resets it depending on UX.
        // The previous implementation kept 'q', so we will keep it for now as per plan.

        router.push(`?${params.toString()}`);
    };

    return (
        <Tabs defaultValue={defaultValue} onValueChange={onValueChange} className="w-full">
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
