import React from 'react';
import { cn } from '@/libs/utils';

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('w-full', className)} {...props} />
    )
);
Box.displayName = 'Box';

interface BoxTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    className?: string;
}

const BoxTitle = React.forwardRef<HTMLHeadingElement, BoxTitleProps>(
    ({ className, ...props }, ref) => (
        <h2
            ref={ref}
            className={cn(
                'flex items-center gap-5 text-lg font-bold leading-relaxed md:text-[22px]',
                className
            )}
            {...props}
        />
    )
);
BoxTitle.displayName = 'BoxTitle';

interface BoxContentProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

//kofr
const BoxContent = React.forwardRef<HTMLDivElement, BoxContentProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('mx-auto mt-7 max-w-3xl', className)}
            {...props}
        />
    )
);
BoxContent.displayName = 'BoxContent';

export { Box, BoxTitle, BoxContent };
