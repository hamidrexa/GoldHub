import React from 'react';
import { Metadata } from 'next';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/libs/utils';
import { Content } from '@/app/[lang]/(user)/copytrade/components/content';
import { getDictionary } from '@/get-dictionary';
import Image from 'next/image';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Bot, ChevronDown, Clock, UserRoundPlus } from 'lucide-react';
import ContentCard from '@/app/[lang]/(user)/finochat/components/content-card';
import Particles from '@/components/magicui/particles';
import WordRotate from '@/components/magicui/word-rotate';
import { ConnectToBroker } from '@/app/[lang]/(user)/copytrade/components/connect-to-broker';
import { CopytradeContextProvider } from '@/app/[lang]/(user)/copytrade/contexts/store';
import ShineBorder from '@/components/magicui/shine-border';
import Link from 'next/link';
import { isMobileDevice } from '@/libs/isMobile';

export const metadata: Metadata = {
    title: 'کپی ترید | سهمتو',
    description:
        'کپی تریدینگ سهمتو راهی ساده برای سرمایه گذاری در بازار ارزدیجیتال است. بدون صرف زمان و دانش بازار و به صورت کاملا اتوماتیک مثل برترین تریدرهای سهمتو سود کنید.',
};

export default async function CopytradePage({ params: { lang } }) {
    const dict = await getDictionary(lang);
    const isMobile = await isMobileDevice();
    const boxesInfo = [
        {
            title: 'اتصال به صرافی',
            icon: (
                <div className="bg-gradient-to-r from-neutral-300 to-neutral-800 bg-clip-text text-8xl font-extrabold text-transparent">
                    1
                </div>
            ),
        },
        {
            title: 'اختصاص دادن مقدار سرمایه',
            icon: (
                <div className="bg-gradient-to-r from-neutral-300 to-neutral-800 bg-clip-text text-8xl font-extrabold text-transparent">
                    2
                </div>
            ),
        },
        {
            title: 'انتخاب و کپی کردن تریدر',
            icon: (
                <div className="bg-gradient-to-r from-neutral-300 to-neutral-800 bg-clip-text text-8xl font-extrabold text-transparent">
                    3
                </div>
            ),
        },
    ];
    const boxesInfo2 = [
        {
            title: 'ذخیره زمان',
            text: (
                <p className="text-center text-base leading-relaxed">
                    حذف بار زمانی و درگیری های جانبی ترید از شما
                </p>
            ),
            icon: <Clock width={54} height={54} className="text-neutral-300" />,
        },
        {
            title: 'بهره برداری از دانش حرفه ای ها',
            text: (
                <p className="text-center text-base leading-relaxed">
                    دسترسی به دانش و تجربه بالای تریدرها در معامله گری
                </p>
            ),
            icon: (
                <UserRoundPlus
                    width={54}
                    height={54}
                    className="text-neutral-300"
                />
            ),
        },
        {
            title: 'ترید اتوماتیک',
            text: (
                <p className="text-center text-base leading-relaxed">
                    انجام امن معاملات به صورت اتوماتیک در حساب صرافی شما
                </p>
            ),
            icon: <Bot width={54} height={54} className="text-neutral-300" />,
        },
    ];

    return (
        <CopytradeContextProvider>
            <div className="p-2.5 md:p-8">
                <div className="relative flex w-full flex-col items-center justify-center gap-6 rounded-3xl bg-neutral-800 px-4 py-14 text-white md:h-[91vh] md:pt-48">
                    <Particles
                        className="absolute inset-0"
                        quantity={500}
                        ease={80}
                        color="#ddd"
                        refresh
                    />
                    <h1 className="z-20 gap-1 text-2xl font-black leading-relaxed md:flex md:items-center md:text-5xl">
                        کپی ترید؛
                        <br className="md:hidden" />
                        <div className="flex items-center gap-1">
                            فرصت سرمایه‌گذاری بدون
                            <WordRotate
                                className="min-w-14 text-center text-2xl text-neutral-300 md:min-w-28 md:text-5xl"
                                words={['دانش', 'زمان', 'دردسر']}
                            />
                            !
                        </div>
                    </h1>
                    <div className="mb-4 flex flex-wrap items-center justify-center gap-5">
                        <div className="flex items-center gap-2">
                            <Clock className="text-neutral-300" />
                            صرفه جویی در زمان
                        </div>
                        <div className="flex items-center gap-2">
                            <Bot className="text-neutral-300" />
                            معامله اتوماتیک
                        </div>
                        <div className="flex items-center gap-2">
                            <UserRoundPlus className="text-neutral-300" />
                            بهره برداری از حرفه ای ها
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 md:flex-row">
                        <a
                            href="#trade"
                            className={cn(
                                buttonVariants({
                                    variant: 'link',
                                    size: 'default',
                                }),
                                'z-20 border bg-white px-16 py-6 text-xl font-bold !no-underline transition-all duration-500 hover:scale-105'
                            )}
                        >
                            رایگان کپی کن
                        </a>
                        <a
                            href="#connect"
                            className={cn(
                                buttonVariants({
                                    variant: 'link',
                                    size: 'default',
                                }),
                                'z-20 border border-white bg-transparent px-8 py-6 text-xl text-white !no-underline transition-all duration-500 hover:scale-105'
                            )}
                        >
                            اتصال به صرافی
                        </a>
                    </div>
                    {!isMobile && (
                        <section
                            className="relative top-44 hidden w-full px-36 text-black md:block"
                            id="trade"
                        >
                            <Content dict={dict} lang={lang} />
                        </section>
                    )}
                </div>
                <div className="mx-auto my-12 flex max-w-7xl flex-col p-2.5 md:mt-60 md:p-6">
                    <div className="flex flex-col gap-14 md:gap-24">
                        {isMobile && (
                            <section
                                className="block w-full md:hidden"
                                id="trade"
                            >
                                <h2 className="mb-4 text-center text-2xl font-bold md:mb-8 md:text-4xl">
                                    برترین تریدر‌ها
                                </h2>
                                <Content dict={dict} lang={lang} />
                            </section>
                        )}
                        <ShineBorder
                            className="flex flex-col rounded-md border bg-white p-4 md:flex-row"
                            color={['#A07CFE', '#FE8FB5', '#FFBE7B']}
                        >
                            <div className="z-10">
                                <h2 className="mb-2 text-2xl font-bold md:text-3xl">
                                    ثبت نام به عنوان تریدر سهمتو
                                </h2>
                                <p className="mb-4 font-medium md:mb-0">
                                    با پیوستن به تریدرهای قابل کپی سهمتو، سود و
                                    جایگاه خود را ارتقا دهید.
                                </p>
                            </div>
                            <Link
                                href="https://shmto.ir/3hf"
                                className={cn(
                                    'z-10 min-w-40 px-12 py-6',
                                    buttonVariants()
                                )}
                            >
                                ارسال درخواست
                            </Link>
                        </ShineBorder>
                        <section>
                            <h2 className="mb-2 text-center text-2xl font-bold md:mb-4 md:text-4xl">
                                کپی ترید سهمتو چگونه کار می کند؟
                            </h2>
                            <p className="mb-4 text-center md:mb-8">
                                برای استفاده از کپی ترید سهمتو لازم به انتقال
                                سرمایه به سهمتو یا جای دیگری نیست.
                            </p>
                            <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
                                {boxesInfo.map((item, index) => (
                                    <ContentCard
                                        key={index}
                                        title={item.title}
                                        icon={item.icon}
                                    />
                                ))}
                            </div>
                        </section>
                        <section
                            className="flex flex-col items-center justify-between rounded-md border bg-white p-4 md:flex-row"
                            id="connect"
                        >
                            <div>
                                <h2 className="mb-2 text-2xl font-bold md:text-3xl">
                                    اتصال سهمتو به
                                    <Image
                                        src="/img/nobitex.svg"
                                        alt="nobitex"
                                        width={157}
                                        height={26}
                                        className="inline-block h-5 w-fit md:h-6 ltr:ml-2 rtl:mr-2"
                                    />
                                </h2>
                                <p className="mb-4 font-medium md:mb-0">
                                    لطفاً برای اتصال، API KEY خود را از حساب
                                    نوبیتکس کپی کرده و در این قسمت وارد نمایید.
                                </p>
                            </div>
                            <ConnectToBroker dict={dict} lang={lang} />
                        </section>
                        <section>
                            <h2 className="mb-4 text-center text-2xl font-bold md:mb-8 md:text-4xl">
                                تریدرهای کپی شده
                            </h2>
                            <Content dict={dict} lang={lang} onlyCopied />
                        </section>
                        <section>
                            <h2 className="mb-4 text-center text-2xl font-bold md:mb-8 md:text-4xl">
                                چرا باید از کپی ترید استفاده کنم؟
                            </h2>
                            <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
                                {boxesInfo2.map((item, index) => (
                                    <ContentCard
                                        key={index}
                                        title={item.title}
                                        text={item.text}
                                        icon={item.icon}
                                    />
                                ))}
                            </div>
                        </section>
                        <section>
                            <h2 className="mb-4 text-center text-2xl font-bold md:mb-8 md:text-4xl">
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
                                    <AccordionTrigger className="px-4 text-lg font-semibold">
                                        کپی ترید چیست؟
                                        <ChevronDown width={20} height={20} />
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 pt-0 text-lg">
                                        <p>
                                            کپی ترید این امکان را به شما می‌دهد
                                            تا بدون داشتن هیچ نوع دانش تخصصی،
                                            معاملات یک معامله‌گر حرفه‌ای را
                                            عیننا در حسابتان کپی کنید. در این
                                            روش، همه فعالیت‌های تریدر حرفه‌ای
                                            اعم از باز کردن پوزیشن، تعیین حد سود
                                            و ضرر در حساب معاملاتی شما ثبت
                                            می‌شود.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem
                                    value="2"
                                    className="rounded-md border"
                                >
                                    <AccordionTrigger className="px-4 text-lg font-semibold">
                                        چطور میتوانم به سهمتو اعتماد کنم؟
                                        <ChevronDown width={20} height={20} />
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 pt-0 text-lg">
                                        <p>
                                            برای استفاده از کپی ترید نیازی به
                                            انتقال سرمایه تون به سهمتو نیست و
                                            تمام معاملات در حساب معاملاتی خودتان
                                            انجام خواهد شد. تریدرهای انتخاب شده
                                            برای کپی ترید در بین 20 هزار تریدر
                                            ارز دیجیتال، توانستند جزو رتبه‌های
                                            برگزیده باشند.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem
                                    value="3"
                                    className="rounded-md border"
                                >
                                    <AccordionTrigger className="px-4 text-lg font-semibold">
                                        سود و ضرر تریدرها چقدر است؟
                                        <ChevronDown width={20} height={20} />
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 pt-0 text-lg">
                                        <p>
                                            بازدهی و سابقه گذشته تمامی تریدرها
                                            کاملا واضح و مشخص است و شما
                                            می‌توانید تریدر متناسب با استراتژی و
                                            میزان ریسکی که میتوانید تحمل کنید
                                            یکی از تریدرها را برای کپی کردن
                                            انتخاب کنید. همچنین حد ضرری برای هر
                                            تریدر تعیین میکنید که ما تضمین
                                            می‌کنیم سرمایه شما از این حد ضرر
                                            پایین تر نخواهد آمد.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem
                                    value="4"
                                    className="rounded-md border"
                                >
                                    <AccordionTrigger className="px-4 text-lg font-semibold">
                                        هزینه‌ی کپی ترید چقدر است؟
                                        <ChevronDown width={20} height={20} />
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 pt-0 text-lg">
                                        <p>
                                            هزینه ‌ی کپی ترید برای ماه اول
                                            رایگان است و در صورت کسب سود،
                                            می‌توانید حق اشتراک را پرداخت
                                            نمایید.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </section>
                    </div>
                </div>
            </div>
        </CopytradeContextProvider>
    );
}
