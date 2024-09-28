import { cn } from '@/libs/utils';

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('bg-neutral-100 animate-pulse rounded-md', className)}
            {...props}
        />
    );
}

export { Skeleton };
