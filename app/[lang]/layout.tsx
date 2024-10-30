import React from 'react';
import localFont from 'next/font/local';
import { Toaster } from '@/components/ui/sonner';
import { Providers } from '@/app/[lang]/providers';
import { getDirection, isRtl } from '@/libs/utils';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';
import { GoogleTagManager } from '@next/third-parties/google';
import Script from 'next/script';
import type { Metadata, Viewport } from 'next';
import { PayWall } from '@/components/pay-wall';
import { GlobalContextProvider } from '@/contexts/store';

const yekanBakh = localFont({
    src: [
        {
            path: '../../fonts/yekan/Yekan Bakh FaNum 04 Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../fonts/yekan/Yekan Bakh FaNum 05 Medium.ttf',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../../fonts/yekan/Yekan Bakh FaNum 06 Bold.ttf',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../../fonts/yekan/Yekan Bakh FaNum 07 Heavy.ttf',
            weight: '900',
            style: 'normal',
        },
    ],
});
const nunito = localFont({
    src: [
        {
            path: '../../fonts/nunito/Nunito-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../fonts/nunito/Nunito-Bold.ttf',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../../fonts/nunito/Nunito-ExtraBold.ttf',
            weight: '900',
            style: 'normal',
        },
    ],
});

export const metadata: Metadata = {
    metadataBase: new URL('https://talanow.ir'),
    ...(process.env.NEXT_PUBLIC_ENVIRONMENT === 'BETA' &&
        process.env.NODE_ENV === 'production' && {
            manifest: '/manifest.json',
        }),
    icons: [
        {
            rel: 'apple-touch-icon',
            url: '/icons/apple-touch-icon.png',
            sizes: '152x152',
        },
        {
            rel: 'apple-touch-icon',
            url: '/icons/apple-touch-icon.png',
            sizes: '180x180',
        },
        {
            rel: 'apple-touch-icon',
            url: '/icons/apple-touch-icon.png',
            sizes: '167x167',
        },
        { rel: 'icon', url: '/favicon.ico', type: 'image/x-icon' },
        { rel: 'shortcut icon', url: '/favicon.ico' },
        {
            rel: 'mask-icon',
            url: '/icons/safari-pinned-tab.svg',
            color: '#5bbad5',
        },
    ],
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'طلانو',
    },
    applicationName: 'طلانو',
    openGraph: {
        siteName: 'طلانو',
        title: 'طلانو | بهترین های بازار ارز دیجیتال و بورس در یک نگاه',
        description:
            'تحلیل سیگنال های خرید و فروش ارز دیجیتال و سهام با استفاده از هوش مصنوعی، معرفی بهترین های بازار بورس و ارز دیجیتال برای سرمایه گذاری، اطلاع رسانی لحظه ای سیگنال های خرید بیت کوین و سایر ارزهای دیجیتال',
        type: 'website',
        images: ['https://talanow.ir/img/talanow.png'],
    },
    twitter: {
        card : 'summary',
        title: 'طلانو | بهترین های بازار ارز دیجیتال و بورس در یک نگاه',
        description:
            'تحلیل سیگنال های خرید و فروش ارز دیجیتال و سهام با استفاده از هوش مصنوعی، معرفی بهترین های بازار بورس و ارز دیجیتال برای سرمایه گذاری، اطلاع رسانی لحظه ای سیگنال های خرید بیت کوین و سایر ارزهای دیجیتال',
        images: ['https://talanow.ir/img/talanow.png'],
    },
    description:
        'تحلیل سیگنال های خرید و فروش ارز دیجیتال و سهام با استفاده از هوش مصنوعی، معرفی بهترین های بازار بورس و ارز دیجیتال برای سرمایه گذاری، اطلاع رسانی لحظه ای سیگنال های خرید بیت کوین و سایر ارزهای دیجیتال',
    formatDetection: {
        telephone: false,
    },
};
export const viewport: Viewport = {
    themeColor: '#fff',
};

export default async function RootLayout({
    children,
    params: { lang },
}: {
    children: React.ReactNode;
    params: { lang: Locale };
}) {
    const dict = await getDictionary(lang);
    const dir = getDirection(lang);
    const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;

    return (
        <html
            lang={lang}
            dir={dir}
            className={isRtl(lang) ? yekanBakh.className : nunito.className}
        >
            <body>
                <GlobalContextProvider>
                    <Providers>
                        {process.env.NEXT_PUBLIC_ENVIRONMENT === 'BETA' && (
                            <PayWall dict={dict} lang={lang} />
                        )}
                        {children}
                        <Toaster
                            position="top-left"
                            offset={16}
                            dir={dir}
                            closeButton
                            richColors
                            toastOptions={{
                                duration: 8000,
                                classNames: {
                                    title: 'text-base',
                                },
                            }}
                        />
                    </Providers>
                </GlobalContextProvider>
                <GoogleTagManager gtmId="GTM-WFRHFRV" />
                <Script
                    id="pushe"
                    strategy="beforeInteractive"
                    src="https://static.pushe.co/pusheweb.js"
                />
                <script
                    id="company"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Organization',
                            '@id': `${websiteUrl}#identity`,
                            alternateName: 'سهم تو',
                            email: 'info@talanow.ir',
                            image: `${websiteUrl}/img/logo.png`,
                            description:
                                'بهترین های بازار ارزدیجیتال و بورس در یک نگاه',
                            awards: [
                                'دانش بنیان',
                                'پارک علم و فناوری',
                                'اینماد',
                            ],
                            disambiguatingDescription:
                                'سامانه هوشمند طلانو پیام‌های تمام کانال‌های بورسی تلگرام را جمع‌آوری می‌کند و با استفاده از هوش مصنوعی سیگنال‌های خرید و فروش هر کانال شناسایی و بازدهی سبد سهامی معرفی شده توسط هر کانال را محاسبه می‌کند',
                            keywords: ['بورس', 'ارزدیجیتال', 'مالی', 'بازار'],
                            legalName: 'هوش مالی بینا',
                            logo: `${websiteUrl}/img/logo.png`,
                            sameAs: [
                                'https://twitter.com/Sahmetocom',
                                'https://t.me/sahmetocom',
                                'https://www.linkedin.com/company/sahmeto',
                                'https://www.instagram.com/sahmeto_com',
                                'https://sahmeto.com',
                            ],
                            slogan: 'بهترین های بازار ارزدیجیتال و بورس در یک نگاه',
                            telephone: '02191304925',
                            url: 'https://sahmeto.com/',
                            name: 'Sahmeto.com | طلانو',
                            mainEntityOfPage: 'https://sahmeto.com/',
                            address: {
                                '@type': 'PostalAddress',
                                streetAddress:
                                    'تهران - امیرآباد- خیابان کارگر شمالی- ساختمان دانشکده فنی دانشگاه تهران، پلاک 1450 طبقه همکف',
                                addressLocality: 'Tehran',
                                postalCode: '1439956172',
                                addressCountry: 'IR',
                            },
                            geo: {
                                '@type': 'GeoCoordinates',
                                latitude: '35.72527762110001',
                                longitude: '51.38626729918842',
                            },
                            openingHoursSpecification: [
                                {
                                    '@type': 'OpeningHoursSpecification',
                                    dayOfWeek: [
                                        'Monday',
                                        'Tuesday',
                                        'Wednesday',
                                        'Thursday',
                                        'Saturday',
                                        'Sunday',
                                    ],
                                    opens: '08:00',
                                    closes: '18:00',
                                },
                            ],
                        }),
                    }}
                />
            </body>
        </html>
    );
}
