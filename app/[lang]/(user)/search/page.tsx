import { isMobile } from 'react-device-detect';
import { ProductsNavigator } from '@/components/products-navigator';
import React from 'react';
import { getDictionary } from '@/get-dictionary';
import { SearchIcon } from 'lucide-react';
import { Results } from '@/app/[lang]/(user)/search/components/results';
import { Button } from '@/components/ui/button';
import { MostSearched } from '@/app/[lang]/(user)/search/components/most-searched';
import { Metadata } from 'next';
import { SearchHistory } from '@/app/[lang]/(user)/search/components/search-history';

export const metadata: Metadata = {
    title: 'جستجو ارز دیجیتال، نمادهای بورسی و +۱۰۰۰ تریدر | سهمتو',
    description:
        'ارز دیجیتال و سهام های مورد توجه قرار گرفته در امروز، سیگنال های توصیه به خرید و فروش، سیگنال بیت کوین، خرید بیت کوین، تحلیل بیت کوین، سیگنال تلگرام',
};

export default async function SearchPage({ params: { lang }, searchParams }) {
    const dict = await getDictionary(lang);

    return (
        <main className="main">
            <div className="jumbotron">
                {!isMobile && <ProductsNavigator dict={dict} lang={lang} />}
                <div className="w-full">
                    {!searchParams.q && (
                        <SearchHistory
                            dict={dict}
                            lang={lang}
                            className="mt-5"
                        />
                    )}
                    {searchParams.q && (
                        <>
                            <h2 className="flex items-center gap-5 text-lg font-bold leading-relaxed md:text-[22px]">
                                <SearchIcon />
                                نتایج جستجو
                            </h2>
                            <Results dict={dict} lang={lang} className="mt-5" />
                        </>
                    )}
                    <a
                        href="https://t.me/SahmetoSup"
                        target="_blank"
                        className="mt-16 flex scale-100 flex-col items-center justify-center gap-2 rounded-lg bg-neutral-800 px-4 py-3.5 text-white transition-transform md:flex-row md:gap-20 md:hover:-skew-x-3 md:hover:scale-105"
                    >
                        <span className="text-lg font-bold">
                            کانال موردنظرتو در سهمتو پیدا نکردی؟
                        </span>
                        <Button rounded="pill" variant="secondary">
                            به ما معرفی کن
                        </Button>
                    </a>
                    <MostSearched dict={dict} lang={lang} className="mt-16" />
                </div>
            </div>
        </main>
    );
}
