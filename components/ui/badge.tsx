import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/libs/utils';

const badgeVariants = cva(
    'inline-flex items-center font-bold !leading-none transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none',
    {
        variants: {
            variant: {
                'no-color': '',
                default: 'bg-emerald-400 text-blue-700',
                secondary: 'bg-neutral-800 text-white',
                success: 'bg-green-700/20 text-green-700',
                light: 'bg-slate-50/30 text-neutral-800',
                destructive: 'bg-neutral-600 text-white',
                warning: 'bg-neutral-500/75 text-blue-700',
                'outline-blue':
                    'border border-solid border-neutral-700/50 bg-slate-50/50 text-neutral-700',
                'text-blue': 'text-neutral-700',
                error: 'bg-amber-600 text-white',
            },
            size: {
                ssm: 'text-xs px-1 py-1',
                sm: 'px-1.5 py-1 text-sm',
                default: 'px-3 py-2 text-sm',
                md: 'px-3 py-1.5 text-sm md:px-5 md:py-2 md:text-base',
            },
            rounded: {
                sm: 'rounded-sm',
                md: 'rounded-md',
                lg: 'rounded-lg',
                default: 'rounded-full',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
            rounded: 'default',
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, rounded, ...props }: BadgeProps) {
    return (
        <div
            className={cn(badgeVariants({ variant, size, rounded }), className)}
            {...props}
        />
    );
}

export { Badge, badgeVariants };
