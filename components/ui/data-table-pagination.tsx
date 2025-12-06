import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { getDirection } from '@/libs/utils';
import { Locale } from '@/i18n-config';
import React, { useState } from 'react';
import { useGlobalContext } from '@/contexts/store';
import { LoginModal } from '@/components/login-modal';
import { usePathname } from 'next/navigation';

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    dict: any;
    lang: Locale;
}

export function DataTablePagination<TData>({
    table,
    dict,
    lang,
}: DataTablePaginationProps<TData>) {
    const dir = getDirection(lang);
    const { user } = useGlobalContext();
    const [pageSize, setPageSize] = useState(10);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const path = usePathname();

    return (
        <div className="flex w-full items-center justify-center gap-2.5">
            {table.getCanNextPage() && (
                <Button
                    onClick={() => {
                        if (!user) return setOpenLoginModal(true);
                        table.setPageSize(pageSize + 10);
                        setPageSize((prevVal) => prevVal + 10);
                    }}
                >
                    View More
                </Button>
            )}
            <LoginModal
                lang={lang}
                dict={dict}
                texts={{
                    title: (
                        <>
                            Full access to rankings
                            <br />
                            requires subscription.
                        </>
                    ),
                    description:
                        'By registering on GoldTrade, use all features free for 7 days.',
                    button: 'Activate 7 days free',
                    inputLabel: 'Quick registration',
                    buttonVariant: 'info',
                }}
                open={openLoginModal}
                setOpen={setOpenLoginModal}
                redirectUrl={path}
            />
        </div>
    );
}
