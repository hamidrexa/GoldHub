import {
    ArrowDownIcon,
    ArrowUpIcon,
    CaretSortIcon,
} from '@radix-ui/react-icons';
import { Column } from '@tanstack/react-table';

import { cn, getDirection } from '@/libs/utils';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Locale } from '@/i18n-config';
import { LoginModal } from '@/components/login-modal';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useGlobalContext } from '@/contexts/store';

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    title: string;
    dict: any;
    lang: Locale;
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
    dict,
    lang,
}: DataTableColumnHeaderProps<TData, TValue>) {
    const dir = getDirection(lang);
    const { user } = useGlobalContext();
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const path = usePathname();
    if (!column.getCanSort())
        return <div className={cn(className)}>{title}</div>;

    return (
        <div className={cn('flex items-center space-x-2', className)}>
            <LoginModal
                lang={lang}
                dict={dict}
                texts={{
                    title: (
                        <>
                            دسترسی کامل به رتبه بندی
                            <br />
                            نیاز به اشتراک دارد.
                        </>
                    ),
                    description:
                        'با ثبت نام در طلانو، 7 روز رایگان از تمامی امکانات استفاده کنید.',
                    button: 'فعال سازی 7 روز رایگان',
                    buttonVariant: 'info',
                    inputLabel: 'ثبت نام سریع',
                }}
                open={openLoginModal}
                setOpen={setOpenLoginModal}
                redirectUrl={path}
            />
            <DropdownMenu dir={dir}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="data-[state=open]:bg-accent -ml-3 h-8"
                    >
                        <span>{title}</span>
                        {column.getIsSorted() === 'desc' ? (
                            <ArrowDownIcon className="h-4 w-4 ltr:ml-2 rtl:mr-2" />
                        ) : column.getIsSorted() === 'asc' ? (
                            <ArrowUpIcon className="h-4 w-4 ltr:ml-2 rtl:mr-2" />
                        ) : (
                            <CaretSortIcon className="h-4 w-4 ltr:ml-2 rtl:mr-2" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => {
                            if (!user) return setOpenLoginModal(true);
                            column.toggleSorting(false);
                        }}
                    >
                        <ArrowUpIcon className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
                        {dict.asc}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => {
                            if (!user) return setOpenLoginModal(true);
                            column.toggleSorting(true);
                        }}
                    >
                        <ArrowDownIcon className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
                        {dict.des}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
