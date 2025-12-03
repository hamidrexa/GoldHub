import React from 'react';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export const metadata = {
    title: 'پیدا نشد | طلانو',
};

export default async function UserLayout({
    children,
    params: { lang },
}: {
    children: React.ReactNode;
    params: { lang: Locale };
}) {
    const dict = await getDictionary(lang);

    return (
        <DashboardLayout dict={dict} lang={lang}>
            {children}
        </DashboardLayout>
    );
}
