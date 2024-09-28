'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/libs/utils';
import { cva, VariantProps } from 'class-variance-authority';

const progressIndicatorVariants = cva(
    'bg-neutral-300 h-full w-full flex-1 transition-all rounded-full',
    {
        variants: {
            variant: {
                default: 'bg-neutral-300',
                secondary: 'bg-neutral-200',
                warning: 'bg-neutral-500/75',
                destructive: 'bg-neutral-600',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export interface ProgressProps
    extends VariantProps<typeof progressIndicatorVariants> {
    className?: string;
    value?: number;
    length?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ className, variant, value = 0, length = 100, ...props }, ref) => (
        <ProgressPrimitive.Root
            ref={ref}
            className={cn(
                'relative h-3 w-full overflow-hidden rounded-full bg-neutral-100',
                className
            )}
            {...props}
        >
            <ProgressPrimitive.Indicator
                className={cn(
                    progressIndicatorVariants({ variant }),
                    className
                )}
                style={{
                    transform: `translateX(${100 - (value / length) * 100}%)`,
                }}
            />
        </ProgressPrimitive.Root>
    )
);

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
