import { isMobile } from 'react-device-detect';
import { ProductsNavigator } from '@/components/products-navigator';
import React from 'react';
import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import Exchange from '@/components/exchange';
import { Box, BoxContent, BoxTitle } from '@/components/box';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { ChevronDown } from 'lucide-react';
import { Disclaimer } from '@/components/disclaimer';
import Wallet from '@/components/wallet';
import { QuestionMarkIcon } from '@radix-ui/react-icons';
import Bargain from '@/app/[lang]/(user)/(asset)/components/bargain';

export const metadata: Metadata = {
    title: 'خرید سریع و آسان ارزدیجیتال | طلامی',
    description:
        'فروش و خرید آسان ارزدیجیتال با تومان در طلامی، در سریعترین زمان ممکن، بدون وقفه و با احراز هویت فوری خرید.',
};

export default async function InvestPage({ params: { lang }, searchParams }) {
    const dict = await getDictionary(lang);
    const asset = {
        symbol: 'BTC',
        image: 'https://cdn.sahmeto.com/media/cryptocurrencies/BTC/bitcoin.png',
        name: 'بیت کوین',
    };

    return (
        <main className="main">
            <div className="jumbotron">
                {!isMobile && <ProductsNavigator dict={dict} lang={lang} />}
                <div className="w-full">
                    <Exchange
                        ids={{
                            0: 'one-million-swap',
                            1: 'five-million-swap',
                        }}
                        className="my-7 flex w-full md:hidden"
                        asset={{
                            image: 'https://cdn.sahmeto.com/media/cryptocurrencies/BTC/bitcoin.png',
                            symbol: 'BTC',
                            name: 'بیت کوین',
                        }}
                        dict={dict}
                        lang={lang}
                    />
                    <Bargain asset={asset} dict={dict} lang={lang} />
                    <Wallet dict={dict} lang={lang} />
                    <Box className="mt-5">
                        <BoxTitle>
                            <QuestionMarkIcon strokeWidth={1.5} />
                            سوالات متداول
                        </BoxTitle>
                        <BoxContent>
                            <Accordion
                                type="single"
                                collapsible
                                className="mx-auto mb-10 w-full space-y-4"
                            >
                                <AccordionItem
                                    className="rounded-md border"
                                    value="1"
                                >
                                    <AccordionTrigger className="px-4 font-semibold [&[data-state=open]>svg]:rotate-180">
                                        آیا خرید آسان برای من مناسب است؟
                                        <ChevronDown width={20} height={20} />
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 pt-0">
                                        <p>
                                            خرید آسان مناسب افرادی است که قصد
                                            دارند در حجم پایین به خرید و فروش
                                            ارزهای دیجیتال بپردازند و یا به
                                            دنبال سهولت در معاملات خود هستند.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem
                                    className="rounded-md border"
                                    value="2"
                                >
                                    <AccordionTrigger className="px-4 font-semibold [&[data-state=open]>svg]:rotate-180">
                                        کارمزد خرید آسان چقدر است؟
                                        <ChevronDown width={20} height={20} />
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 pt-0">
                                        <p>
                                            خرید آسان در صرافی طلامی بدون هزینه
                                            کارمزد انجام می‌شود. در نظر داشته
                                            باشید، بهای تمام‌شده خرید آسان به
                                            دلیل تنوع تامین‌کننده ممکن است با
                                            قیمت خرید و فروش در بازارهای
                                            معاملاتی متفاوت باشد.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </BoxContent>
                    </Box>
                    <Disclaimer />
                </div>
            </div>
        </main>
    );
}
