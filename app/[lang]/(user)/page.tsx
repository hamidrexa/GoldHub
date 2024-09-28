import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { ChevronDown, CreditCard, EyeIcon } from 'lucide-react';
import { cn, getLinksLang } from '@/libs/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import MessageCount from '@/components/message-count';
import { GroupAvatar } from '@/components/group-avatar';
import { getDictionary } from '@/get-dictionary';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import React from 'react';
import { getPlanList } from '@/app/[lang]/(user)/pricing/services/getPlanList';
import { PlanWrap } from '@/app/[lang]/(user)/pricing/components/plan-wrap';
import TopAssetBox from '@/components/top-asset-box';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import AnnouncementAlert from '@/components/announcement-alert';

export const metadata: Metadata = {
    title: 'سهمتو | بهترین های بازار ارز دیجیتال و بورس در یک نگاه',
    description:
        'تحلیل سیگنال های خرید و فروش ارز دیجیتال و سهام با استفاده از هوش مصنوعی، معرفی بهترین های بازار بورس و ارز دیجیتال برای سرمایه گذاری، اطلاع رسانی لحظه ای سیگنال های خرید بیت کوین و سایر ارزهای دیجیتال',
    openGraph: {
        title: 'سهمتو | بهترین های بازار ارز دیجیتال و بورس در یک نگاه',
        description:
            'تحلیل سیگنال های خرید و فروش ارز دیجیتال و سهام با استفاده از هوش مصنوعی، معرفی بهترین های بازار بورس و ارز دیجیتال برای سرمایه گذاری، اطلاع رسانی لحظه ای سیگنال های خرید بیت کوین و سایر ارزهای دیجیتال',
    },
};

export default async function HomePage({ params: { lang } }) {
    const dict = await getDictionary(lang);
    const plans = await getPlanList(lang);

    return (
        <>
            <AnnouncementAlert dict={dict} lang={lang} page="home" />
            <div className="flex w-full flex-col pt-6">
                <div className="mt-6 flex w-full flex-col md:flex md:flex-row md:justify-around">
                    <div className="px-4 py-2 md:px-9 md:py-4">
                        <div className="flex max-w-3xl flex-col">
                            <div className="my-8 hidden items-center md:mb-24 md:mt-0 md:flex">
                                <h3 className="flex max-w-96 items-center justify-center gap-3 text-sm">
                                    <GroupAvatar />
                                    <div className="flex gap-1 md:gap-1.5">
                                        <Badge
                                            size="sm"
                                            rounded="lg"
                                            variant="default"
                                        >
                                            +23هزار
                                        </Badge>
                                        تریدر در سهمتو{' '}
                                        <Link
                                            href={`${getLinksLang(lang)}/leaderboard`}
                                            className="mx-1 underline underline-offset-2"
                                        >
                                            رتبه بندی
                                        </Link>{' '}
                                        شده اند.
                                    </div>
                                </h3>
                            </div>
                            <div className="flex flex-col gap-8">
                                <h2 className="flex items-center text-2xl text-gray-700">
                                    از بین <MessageCount />
                                    پیام تحلیل شده امروز
                                </h2>
                                <h1 className="mt-8 text-3xl font-black leading-loose text-neutral-800 md:text-5xl md:leading-relaxed">
                                    فرصت سرمایه گذاری
                                    <br />
                                    مناسب خودت را پیدا کن!
                                </h1>
                            </div>
                            <Link
                                href={`${getLinksLang(lang)}/signals`}
                                className={cn(
                                    buttonVariants({
                                        variant: 'info',
                                        rounded: 'pill',
                                        size: 'xl',
                                    }),
                                    'my-16 flex w-full hover:border hover:border-neutral-700 hover:bg-white hover:text-neutral-700'
                                )}
                            >
                                <EyeIcon />
                                <p>مشاهده فرصت ها</p>
                            </Link>
                            <div className="mt-4 flex items-start justify-center ">
                                <TopAssetBox dict={dict} lang={lang} />
                            </div>
                        </div>
                        {/*<div className="mt-10 max-w-3xl flex-col justify-between gap-3 md:flex md:flex-row">*/}
                        {/*    <div>*/}
                        {/*        <div className="flex gap-3 text-gray-700">*/}
                        {/*            <SearchIcon />*/}
                        {/*            <h2 className="font-semibold">*/}
                        {/*                بیشترین جستجوشده ها*/}
                        {/*            </h2>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*    <div>*/}
                        {/*        <div className="flex gap-3 text-gray-700">*/}
                        {/*            <Icons.popular />*/}
                        {/*            <h2 className="font-semibold">محبوب ترین ها</h2>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*    <div>*/}
                        {/*        <div className="flex gap-3 text-gray-700">*/}
                        {/*            <Icons.growChart />*/}
                        {/*            <h2 className="font-semibold">بیشترین رشد قیمت</h2>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                    <div className="hidden h-[calc(100vh-152px)] basis-1/2 justify-end md:flex">
                                            <Image
                            className="h-full w-auto"
                            src="/img/new-pattern.webp"
                            width={800}
                            height={800}
                            alt="pattern"
                            priority
                                            />
                    </div>
                    <div className="mt-16 flex flex-col md:hidden">
                        <Image
                            className="w-full p-3"
                            src="/img/pattern-mobile.webp"
                            width={400}
                            height={80}
                            alt="pattern"
                        />
                        <div className="my-8 items-center md:hidden">
                            <h3 className="flex max-w-96 items-center justify-center gap-3 text-sm">
                                <GroupAvatar />
                                <div className="flex gap-1 md:gap-1.5">
                                    <Badge
                                        size="sm"
                                        rounded="lg"
                                        variant="default"
                                    >
                                        +23هزار
                                    </Badge>
                                    تریدر در سهمتو{' '}
                                    <Link
                                        href={`${getLinksLang(lang)}/leaderboard`}
                                        className="mx-1 underline underline-offset-2"
                                    >
                                        رتبه بندی
                                    </Link>{' '}
                                    شده اند.
                                </div>
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="my-32 flex w-full flex-col gap-2 px-4 md:px-48">
                    <h2 className="mb-4 flex items-center justify-center gap-1 text-center text-4xl font-black">
                        <QuestionMarkCircledIcon width={25} height={25} />
                        سوالات متداول
                    </h2>
                    <Accordion
                        type="single"
                        collapsible
                        className="mx-auto w-full space-y-3"
                    >
                        <AccordionItem value="1" className="rounded-md border">
                            <AccordionTrigger className="px-4 text-lg font-semibold">
                                {dict.QA.n1.title}
                                <ChevronDown width={20} height={20} />
                            </AccordionTrigger>
                            <AccordionContent className="p-4 pt-0 text-lg">
                                <p> {dict.QA.n1.text}</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="2" className="rounded-md border">
                            <AccordionTrigger className="px-4 text-lg font-semibold">
                                {dict.QA.n2.title}
                                <ChevronDown width={20} height={20} />
                            </AccordionTrigger>
                            <AccordionContent className="p-4 pt-0 text-lg">
                                <p>{dict.QA.n2.text}</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="3" className="rounded-md border">
                            <AccordionTrigger className="px-4 text-lg font-semibold">
                                {dict.QA.n3.title}
                                <ChevronDown width={20} height={20} />
                            </AccordionTrigger>
                            <AccordionContent className="p-4 pt-0 text-lg">
                                <p>{dict.QA.n3.text}</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="4" className="rounded-md border">
                            <AccordionTrigger className="px-4 text-lg font-semibold">
                                {dict.QA.n5.title}
                                <ChevronDown width={20} height={20} />
                            </AccordionTrigger>
                            <AccordionContent className="p-4 pt-0 text-lg">
                                <p>{dict.QA.n5.text}</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="5" className="rounded-md border">
                            <AccordionTrigger className="px-4 text-lg font-semibold">
                                {dict.QA.n6.title}
                                <ChevronDown width={20} height={20} />
                            </AccordionTrigger>
                            <AccordionContent className="p-4 pt-0 text-lg">
                                <p>{dict.QA.n6.text}</p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
                <div className="my-8 flex flex-col gap-2 px-4 md:px-48">
                    <h2 className="mb-4 flex items-center justify-center gap-1 text-center text-4xl font-black">
                        <CreditCard width={25} height={25} />
                        خرید اشتراک سهمتو
                    </h2>
                    <PlanWrap
                        dict={dict}
                        lang={lang}
                        purePlans={plans}
                        isShow={false}
                    />
                </div>
            </div>
        </>
    );
}
