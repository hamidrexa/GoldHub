import React from 'react';
import { Header } from '@/components/header';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';
import FollowSuggestionAlert from '@/components/ui/follow-suggestion-alert';
import { Footer } from '@/components/footer';
import { BottomNavigation } from '@/components/bottom-navigation';

export const metadata = {
    title: 'پیدا نشد | طلامی',
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
            <BottomNavigation dict={dict} lang={lang} />
            <FollowSuggestionAlert dict={dict} lang={lang} />
        </>
    );
}
