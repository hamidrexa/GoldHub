import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/libs/utils';

export interface ServerTab {
    value: string;
    label: string;
    icon?: LucideIcon;
    href: string;
}

interface ServerTabsProps {
    tabs: ServerTab[];
    activeTab: string;
    className?: string;
}

/**
 * Server-side tabs component with responsive design.
 * Uses Link components for server-side navigation with URL params.
 * Styled similar to shadcn tabs-03 with rounded pill design.
 */
export function ServerTabs({ tabs, activeTab, className }: ServerTabsProps) {
    return (
        <div
            className={cn(
                'flex items-center gap-1 p-1 rounded-lg bg-muted/50 border w-fit max-w-full overflow-x-auto scrollbar-hide',
                className
            )}
        >
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.value;

                return (
                    <Link
                        key={tab.value}
                        href={tab.href}
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                            isActive
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                        )}
                    >
                        {Icon && <Icon className="h-4 w-4" />}
                        <span className="hidden sm:inline">{tab.label}</span>
                        {/* Show only icon on very small screens if icon exists */}
                        {Icon && <span className="sm:hidden">{tab.label.match(/\((\d+)\)$/)?.[0] || ''}</span>}
                        {/* Show full label if no icon */}
                        {!Icon && <span className="sm:hidden">{tab.label}</span>}
                    </Link>
                );
            })}
        </div>
    );
}

/**
 * Alternative server tabs with underline style (current design upgraded).
 * Better for pages with many tabs.
 */
export function ServerTabsUnderline({ tabs, activeTab, className }: ServerTabsProps) {
    return (
        <div
            className={cn(
                'flex items-center gap-1 border-b w-full overflow-x-auto scrollbar-hide',
                className
            )}
        >
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.value;

                return (
                    <Link
                        key={tab.value}
                        href={tab.href}
                        className={cn(
                            'flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            isActive
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                        )}
                    >
                        {Icon && <Icon className="h-4 w-4" />}
                        {tab.label}
                    </Link>
                );
            })}
        </div>
    );
}
