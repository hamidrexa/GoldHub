import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/libs/utils';

const alertVariants = cva(
    'relative w-full rounded-lg border p-4 [&>svg~*]:rtl:pl-10 [&>svg~*]:ltr:pr-10 [&>svg]:absolute [&>svg]:rtl:left-4 [&>svg]:ltr:right-4 [&>svg]:top-[15px]',
    {
        variants: {
            variant: {
                default: 'bg-gray-50 border-gray-700 text-gray-700',
                success: 'bg-emerald-50 border-emerald-700 text-emerald-700',
                warning: 'bg-yellow-50 border-yellow-700 text-yellow-700',
                info: 'bg-sky-50 border-sky-700 text-sky-700',
                danger: 'bg-red-50 border-red-700 text-red-700',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

const Alert = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
    <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
    />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h5
        ref={ref}
        className={cn('mb-1 text-lg font-medium', className)}
        {...props}
    />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-base', className)} {...props} />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
