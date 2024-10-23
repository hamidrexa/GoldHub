import React from 'react';
import { Header } from '@/components/header';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';
import { Footer } from '@/components/footer';

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
        <>
            <Header dict={dict} lang={lang} />
            {children}
            <Footer dict={dict} lang={lang} />
        </>
    );
}
