import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { getDirection } from '@/libs/utils';
import { Locale } from '@/i18n-config';
import React, { useState } from 'react';
import { useGlobalContext } from '@/contexts/store';
import { LoginModal } from '@/app/[lang]/(user)/leaderboard/components/login-modal';
import { usePathname } from 'next/navigation';
import { PricingModal } from '@/app/[lang]/(user)/leaderboard/components/pricing-modal';

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
    const [openPricingModal, setOpenPricingModal] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const path = usePathname();

    return (
        <div className="flex w-full items-center justify-center gap-2.5">
            {table.getCanNextPage() && (
                <Button
                    onClick={() => {
                        if (!user) return setOpenLoginModal(true);
                        if (!user.active_plan?.is_active)
                            return setOpenPricingModal(true);
                        table.setPageSize(pageSize + 10);
                        setPageSize((prevVal) => prevVal + 10);
                    }}
                >
                    مشاهده بیشتر
                </Button>
            )}
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
                        'با ثبت نام در سهمتو، 7 روز رایگان از تمامی امکانات استفاده کنید.',
                    button: 'فعال سازی 7 روز رایگان',
                    inputLabel: 'ثبت نام سریع',
                    buttonVariant: 'info',
                }}
                open={openLoginModal}
                setOpen={setOpenLoginModal}
                redirectUrl={path}
            />
            <PricingModal
                dict={dict}
                lang={lang}
                contents={{
                    title: (
                        <>
                            دسترسی کامل به رتبه بندی
                            <br />
                            نیاز به اشتراک دارد.
                        </>
                    ),
                }}
                open={openPricingModal}
                setOpen={setOpenPricingModal}
            />
        </div>
    );
}
