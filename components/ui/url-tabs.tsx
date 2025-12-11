'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface TabItem {
    value: string;
    label: string;
    icon?: React.ElementType;
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

    // Determine if we should switch to dropdown
    const useDropdown = tabs.length > 3;

    const onValueChange = useCallback((value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(paramName, value);

        // Push the new URL with updated search params
        router.push(`?${params.toString()}`);
    }, [router, searchParams, paramName]);

    // Find active tab label/icon for Select display
    const activeTab = tabs.find(t => t.value === defaultValue);

    const TabsContent = (
        <Tabs defaultValue={defaultValue} onValueChange={onValueChange} className={className || "w-full"}>
            <TabsList className="justify-start overflow-x-auto">
                {tabs.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
                        {tab.icon && <tab.icon className="h-4 w-4" />}
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );

    if (!useDropdown) {
        return TabsContent;
    }

    return (
        <div className={className || "w-full"}>
            {/* Mobile Dropdown View */}
            <div className="md:hidden">
                <Select value={defaultValue} onValueChange={onValueChange}>
                    <SelectTrigger className="w-full">
                        <div className="flex items-center gap-2">
                            {activeTab?.icon && <activeTab.icon className="h-4 w-4" />}
                            <SelectValue placeholder={activeTab?.label} />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        {tabs.map((tab) => (
                            <SelectItem key={tab.value} value={tab.value}>
                                <div className="flex items-center gap-2">
                                    {tab.icon && <tab.icon className="h-4 w-4" />}
                                    {tab.label}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Desktop Tabs View */}
            <div className="hidden md:block">
                {TabsContent}
            </div>
        </div>
    );
}
