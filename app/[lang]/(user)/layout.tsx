import React from 'react';
import { Header } from '@/components/header';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';
import Script from 'next/script';
import FollowSuggestionAlert from '@/components/ui/follow-suggestion-alert';
import { Footer } from '@/components/footer';
import { BottomNavigation } from '@/components/bottom-navigation';

export const metadata = {
    title: 'پیدا نشد | سهمتو',
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
            <Script
                id="goftino"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `!function(){var i="14EQFs",a=window,d=document;function g(){var g=d.createElement("script"),s="https://www.goftino.com/widget/"+i,l=localStorage.getItem("goftino_"+i);g.async=!0,g.src=l?s+"?o="+l:s;d.getElementsByTagName("head")[0].appendChild(g);}"complete"===d.readyState?g():a.attachEvent?a.attachEvent("onload",g):a.addEventListener("load",g,!1);}();`,
                }}
            />
        </>
    );
}
