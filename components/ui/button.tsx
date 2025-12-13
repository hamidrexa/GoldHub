import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/libs/utils';

const buttonVariants = cva(
    'inline-flex items-center cursor-pointer justify-center gap-1.5 font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-gold-600 text-black hover:bg-gold-600/50',
                'default-outline':
                    'bg-transparent border border-neutral-800 text-neutral-800 hover:bg-neutral-800 hover:text-white',
                secondary: 'bg-teal-200 text-neutral-800 hover:bg-teal-300',
                info: 'bg-neutral-700 text-white',
                destructive: 'bg-red-500 text-white hover:bg-red-600',
                'outline-destructive':
                    'bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white',
                outline:
                    'border border-neutral-700 text-neutral-700 bg-slate-50/40',
                ghost: 'bg-transparent text-neutral-800 hover:bg-blue-100',
                link: 'bg-transparent text-neutral-800 hover:underline',
                success: 'bg-green-600 text-white hover:bg-green-700',
            },
            size: {
                default: 'h-10 px-5 text-sm',
                sm: 'h-8 px-3 text-xs',
                xl: 'h-14 px-6 text-lg',
                icon: 'h-10 w-10',
            },
            rounded: {
                default: 'rounded-md',
                pill: 'rounded-full',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
            rounded: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, rounded, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(
                    buttonVariants({ variant, size, rounded, className })
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
