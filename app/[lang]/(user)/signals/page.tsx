import { Metadata } from 'next';
import { isMobile } from 'react-device-detect';
import { ProductsNavigator } from '@/components/products-navigator';
import React from 'react';
import { getDictionary } from '@/get-dictionary';
import { getMostRecommendedCrypto } from '@/app/[lang]/(user)/signals/services/get-most-recom-crypto';
import { getMostRecommendedTicker } from '@/app/[lang]/(user)/signals/services/get-most-recom-tickers';
import SuggestedAssetsWrapper from '@/app/[lang]/(user)/signals/components/suggested-assets-wrapper';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { ChevronDown, MoveLeft } from 'lucide-react';
import { Disclaimer } from '@/components/disclaimer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { getLinksLang } from '@/libs/utils';
import AnnouncementAlert from '@/components/announcement-alert';

export const metadata: Metadata = {
    title: 'سیگنال های امروز ارز دیجیتال و بورس | سهمتو',
    description:
        'ارز دیجیتال و سهام های مورد توجه تریدرها در امروز، سیگنال های توصیه به خرید و فروش، سیگنال بیت کوین، خرید بیت کوین، تحلیل بیت کوین، سیگنال تلگرام',
};

export const revalidate = 1800;

export default async function SignalsPage({ params: { lang } }) {
    const dict = await getDictionary(lang);
    const cryptoAssets = await getMostRecommendedCrypto();
    const tickerAssets = await getMostRecommendedTicker();
    const pureAssets = {
        crypto: cryptoAssets,
        ticker: tickerAssets,
    };

    return (
        <>
            <AnnouncementAlert dict={dict} lang={lang} page="signal" />
            <main className="main">
                <div className="jumbotron">
                    {!isMobile && <ProductsNavigator dict={dict} lang={lang} />}
                    <div className="flex w-full flex-col">
                        <Alert
                            className="mb-5 flex flex-col items-start justify-between md:flex-row md:items-center"
                            variant="info"
                        >
                            <div>
                                <AlertTitle>
                                    نسخه آزمایشی صفحه جدید سیگنال در دسترس قرار
                                    گرفت .
                                </AlertTitle>
                                <AlertDescription className="mb-2.5 md:m-0">
                                    ما را در ایجاد و توسعه تجربه های بهتر همراهی
                                    کنید .
                                </AlertDescription>
                            </div>
                            <Link
                                href={`${getLinksLang(lang)}/signals-v2`}
                                className={buttonVariants({
                                    variant: 'info',
                                })}
                                prefetch
                            >
                                انتقال به نسخه جدید
                                <MoveLeft />
                            </Link>
                        </Alert>
                        <SuggestedAssetsWrapper
                            assets={pureAssets}
                            lang={lang}
                            dict={dict}
                        />
                        <div className="mb-5 mt-5 flex w-full flex-col gap-4">
                            <h2 className="text-lg font-bold leading-relaxed md:text-[22px]">
                                سوالات متداول
                            </h2>
                            <Accordion
                                type="single"
                                collapsible
                                className="mx-auto w-full space-y-3"
                            >
                                <AccordionItem
                                    value="1"
                                    className="rounded-md border"
                                >
                                    <AccordionTrigger className="px-4 font-semibold">
                                        این سیگنال ها از کجا میان؟
                                        <ChevronDown width={20} height={20} />
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 pt-0">
                                        <p>
                                            ارزهای دیجیتال و نمادهای بورسی
                                            سیگنال شده، گلچین توصیه به خرید
                                            امروز تریدرها هستن. سهمتو صرفا با
                                            رتبه دهی به تریدرها و الگوریتم
                                            اعتبار سنجی سیگنال ها، بهترین ها رو
                                            از بین تمامی سیگنال ها معرفی می کنه
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem
                                    value="2"
                                    className="rounded-md border"
                                >
                                    <AccordionTrigger className="px-4 font-semibold">
                                        منظور از ظرفیت مشاهده چیه؟
                                        <ChevronDown width={20} height={20} />
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 pt-0">
                                        <p>
                                            باتوجه به ارزش هر سیگنال، ظرفیت
                                            محدودی برای مشاهده عمومی (رایگان) آن
                                            وجود داره. ولی کاربران دارای اشتراک
                                            می‌تونن به همه ی سیگنال ها دسترسی
                                            داشته باشن و توصیه به فروش فقط برای
                                            کاربران دارای اشتراک قابل دسترسیه.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem
                                    value="3"
                                    className="rounded-md border"
                                >
                                    <AccordionTrigger className="px-4 font-semibold">
                                        سیگنال ها چه طوری و کی اپدیت میشن؟
                                        <ChevronDown width={20} height={20} />
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 pt-0">
                                        <p>
                                            سهمتو روزانه پیام های زیادی که در
                                            تلگرام منتشر میشه را تحلیل میکنه و
                                            سیگنال های خرید و فروش رو کشف میکنه.
                                            الگوریتم اختصاصی سهمتو هر لحظه
                                            بهترین سیگنال ها رو مشخص میکنه و هر
                                            2 ساعت جدول رو اپدیت میکنه.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                        <Disclaimer />
                    </div>
                </div>
            </main>
        </>
    );
}
