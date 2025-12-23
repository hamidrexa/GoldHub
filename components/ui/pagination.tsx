import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '@/libs/utils';
import { ButtonProps, buttonVariants } from '@/components/ui/button';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
    <nav
        role="navigation"
        aria-label="pagination"
        className={cn('mx-auto flex w-full justify-center', className)}
        {...props}
    />
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<
    HTMLUListElement,
    React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn('flex flex-row items-center gap-1 sm:gap-2', className)}
        {...props}
    />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<
    HTMLLIElement,
    React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
    <li ref={ref} className={cn('', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
    isActive?: boolean;
    isDisabled?: boolean;
} & Pick<ButtonProps, 'size'> &
    React.ComponentProps<'button'>;

const PaginationLink = ({
    className,
    isActive,
    isDisabled,
    size = 'icon',
    ...props
}: PaginationLinkProps) => (
    <button
        aria-current={isActive ? 'page' : undefined}
        disabled={isDisabled}
        className={cn(
            buttonVariants({
                variant: isActive ? 'default' : 'ghost',
                size,
            }),
            'h-9 w-9 rounded-md transition-all duration-200',
            isActive && 'bg-gold-600 text-white hover:bg-gold-700 shadow-sm',
            !isActive && 'text-muted-foreground hover:bg-gold-50 hover:text-gold-700',
            isDisabled && 'pointer-events-none opacity-40',
            className
        )}
        {...props}
    />
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
    className,
    text,
    isDisabled,
    ...props
}: { text?: string; isDisabled?: boolean } & React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Go to previous page"
        size="default"
        isDisabled={isDisabled}
        className={cn('h-9 w-auto gap-1 px-3', className)}
        {...props}
    >
        <ChevronLeft className="h-4 w-4" />
        {text && <span className="hidden sm:inline">{text}</span>}
    </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({
    className,
    text,
    isDisabled,
    ...props
}: { text?: string; isDisabled?: boolean } & React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Go to next page"
        size="default"
        isDisabled={isDisabled}
        className={cn('h-9 w-auto gap-1 px-3', className)}
        {...props}
    >
        {text && <span className="hidden sm:inline">{text}</span>}
        <ChevronRight className="h-4 w-4" />
    </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({
    className,
    ...props
}: React.ComponentProps<'span'>) => (
    <span
        aria-hidden
        className={cn('flex h-9 w-9 items-center justify-center text-muted-foreground', className)}
        {...props}
    >
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">More pages</span>
    </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export interface SmartPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
    dict?: any;
}

const SmartPagination = ({
    currentPage,
    totalPages,
    onPageChange,
    className,
    dict,
}: SmartPaginationProps) => {
    const pages = React.useMemo(() => {
        const items: (number | 'ellipsis')[] = [];
        const siblingCount = 1;

        if (totalPages <= 5) {
            for (let i = 0; i < totalPages; i++) items.push(i);
        } else {
            items.push(0);

            let start = Math.max(currentPage - siblingCount, 1);
            let end = Math.min(currentPage + siblingCount, totalPages - 2);

            if (start > 1) items.push('ellipsis');

            for (let i = start; i <= end; i++) items.push(i);

            if (end < totalPages - 2) items.push('ellipsis');

            items.push(totalPages - 1);
        }
        return items;
    }, [currentPage, totalPages]);

    if (totalPages <= 1) return null;

    return (
        <Pagination className={className}>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => onPageChange(currentPage - 1)}
                        isDisabled={currentPage === 0}
                        text={dict?.common?.previous || 'Previous'}
                    />
                </PaginationItem>

                {pages.map((page, index) => (
                    <PaginationItem key={index}>
                        {page === 'ellipsis' ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                isActive={currentPage === page}
                                onClick={() => onPageChange(page as number)}
                            >
                                {(page as number) + 1}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        onClick={() => onPageChange(currentPage + 1)}
                        isDisabled={currentPage === totalPages - 1}
                        text={dict?.common?.next || 'Next'}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    SmartPagination,
};

