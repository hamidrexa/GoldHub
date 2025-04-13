import { ChevronDown } from 'lucide-react';
import { Metadata } from 'next';
import { getDictionary } from '@/get-dictionary';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import React from 'react';
import { InvestmentCard } from '@/components/investmentCard';
import Financial from '../(asset)/components/financial';
import ChartGold from '../(asset)/components/chart';
import { LinkBox } from '@/components/link-box';
import { Icons } from '@/components/ui/icons';

export const metadata: Metadata = {
    title: 'طلانو | خرید و فروش طلای آب شده آنلاین بدون اجرت',
    description:
        'طلانو، بستر امن خرید و فروش طلای آب شده آنلاین، بدون مالیات و اجرت، با ارائه فاکتور رسمی تضمینی و گارانتی اصالت با قیمت لحظه‌ای و به‌روز طلای آب شده',
    openGraph: {
        title: 'طلانو | خرید و فروش طلای آب شده آنلاین بدون اجرت',
        description:
            'طلانو، بستر امن خرید و فروش طلای آب شده آنلاین، بدون مالیات و اجرت، با ارائه فاکتور رسمی تضمینی و گارانتی اصالت با قیمت لحظه‌ای و به‌روز طلای آب شده',
    },
};

export default async function HomePage({ params: { lang } }) {
    const dict = await getDictionary(lang);

    return (
        <div className="flex w-full flex-col">
            <section className="w-full px-4 py-10 text-neutral-800 ">
                <Financial
                    lang={lang}
                    dict={dict}
                />
                <div className="flex w-full justify-center mt-10">
                    <InvestmentCard
                        headerTitle='سرمایه گذاری آسان در طلا'
                        dict={dict}
                        lang={lang}
                    />
                </div>
                <div className="mx-auto w-full max-w-7xl mt-10">
                    <ChartGold
                        lang={lang}
                        dict={dict}
                    />
                </div>
                <div className="mx-auto w-full max-w-7xl mt-10 text-black">
                    <LinkBox
                        target='_blank'
                        title='تحلیل طلا'
                        icon={<Icons.fire stroke='#111' fill='none' />}
                        href='https://talanow.ir'
                    />
                </div>
            </section>
            <section className="w-full bg-neutral-700/10 px-4 py-12 md:py-32">
                <div className="mx-auto w-full max-w-7xl">
                    <h2 className="mb-6 flex items-center justify-center gap-1 text-center text-2xl font-black md:mb-12 md:text-4xl">
                        مزایای خرید طلای آب‌شده از طلانو
                    </h2>
                    <div className="flex flex-col gap-10 md:mt-0 md:flex-row md:flex-wrap lg:flex-nowrap">
                        <div className="flex basis-1/3 flex-col items-start justify-start gap-4 rounded-lg bg-white px-5 py-4 md:grow">
                            <div className="flex aspect-square size-16 shrink-0 items-center justify-center rounded-full bg-neutral-700/10">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="40"
                                    height="40"
                                    viewBox="0 0 40 40"
                                    fill="none"
                                >
                                    <path
                                        fill="#FFBD01"
                                        d="M37.758 18.75c0 1.683-2.092 3.008-2.584 4.525-.491 1.517.384 3.867-.566 5.175-.95 1.308-3.433 1.175-4.75 2.142-1.317.966-1.934 3.35-3.5 3.858-1.567.508-3.425-1.067-5.1-1.067-1.675 0-3.584 1.559-5.1 1.067-1.517-.492-2.192-2.908-3.5-3.858-1.308-.95-3.792-.817-4.75-2.142-.959-1.325-.059-3.608-.567-5.175-.508-1.567-2.583-2.842-2.583-4.525 0-1.683 2.091-3.008 2.583-4.525.492-1.517-.383-3.867.567-5.175.95-1.308 3.433-1.175 4.75-2.142 1.317-.966 1.933-3.35 3.5-3.858 1.566-.508 3.425 1.067 5.1 1.067 1.675 0 3.583-1.559 5.1-1.067 1.517.492 2.191 2.908 3.5 3.858 1.308.95 3.792.817 4.75 2.142.958 1.325.058 3.608.567 5.175.508 1.567 2.583 2.842 2.583 4.525"
                                    ></path>
                                    <path
                                        fill="#051061"
                                        d="M14.641 24.842c-.95 0-1.791-.234-2.533-.709s-1.333-1.166-1.767-2.075c-.433-.908-.65-2.008-.65-3.308 0-1.3.217-2.4.65-3.308.434-.909 1.025-1.6 1.767-2.075.742-.475 1.592-.709 2.533-.709.942 0 1.775.234 2.525.709.742.475 1.334 1.166 1.767 2.075.433.908.65 2.008.65 3.308 0 1.3-.217 2.4-.65 3.308-.433.909-1.025 1.6-1.767 2.075-.741.475-1.583.709-2.525.709m0-1.909c.542 0 1.017-.15 1.425-.45.409-.3.725-.758.959-1.375.233-.616.35-1.408.35-2.35 0-.941-.117-1.733-.35-2.35-.234-.616-.55-1.083-.959-1.375-.408-.3-.883-.45-1.425-.45-.541 0-1.016.15-1.433.45-.408.3-.733.759-.975 1.375-.242.617-.358 1.409-.358 2.35 0 .942.116 1.734.358 2.35.233.617.558 1.084.975 1.375.408.3.892.45 1.433.45M22.149 24.6c-.267 0-.533-.1-.733-.308a1.041 1.041 0 0 1 0-1.475l9.65-9.65a1.041 1.041 0 0 1 1.475 0 1.041 1.041 0 0 1 0 1.475l-9.65 9.65c-.2.2-.467.308-.734.308zM30.932 24.192a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"
                                    ></path>
                                    <path
                                        fill="#051061"
                                        d="M30.932 24.192a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"
                                    ></path>
                                    <path
                                        fill="#051061"
                                        d="M30.932 24.192a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M23.023 16.283a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"
                                    ></path>
                                    <path
                                        fill="#051061"
                                        d="M23.023 16.283a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"
                                    ></path>
                                    <path
                                        fill="#051061"
                                        d="M23.023 16.283a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"
                                    ></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold">بدون اجرت</h3>
                            <p className="text-base">
                                خرید از طلانو، دارای کارمزد شفاف و بدون اجرت است.
                            </p>
                        </div>
                        <div className="flex basis-1/3 flex-col items-start justify-start gap-4 rounded-lg bg-neutral-700 px-5 py-4 text-white md:order-3 md:basis-full lg:order-none lg:basis-1/3">
                            <div className="flex aspect-square size-16 shrink-0 items-center justify-center rounded-full bg-white">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="34"
                                    height="34"
                                    viewBox="0 0 34 39"
                                    fill="none"
                                >
                                    <path
                                        d="M2 32.76L10.03 34.18L20.25 34.4V7.13H2.21L2 32.76Z"
                                        fill="#FFBD01"
                                    ></path>
                                    <path
                                        d="M11.12 8.58C16.1568 8.58 20.24 7.10702 20.24 5.29C20.24 3.47298 16.1568 2 11.12 2C6.08316 2 2 3.47298 2 5.29C2 7.10702 6.08316 8.58 11.12 8.58Z"
                                        fill="#FFBD01"
                                        stroke="#051061"
                                        strokeWidth="2.15"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                    <path
                                        d="M20.2498 24.86C20.2498 26.68 16.1698 28.15 11.1298 28.15C6.08977 28.15 2.00977 26.68 2.00977 24.86"
                                        stroke="#051061"
                                        strokeWidth="2.15"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                    <path
                                        d="M20.2498 18.34C20.2498 20.16 16.1698 21.63 11.1298 21.63C6.08977 21.63 2.00977 20.16 2.00977 18.34"
                                        stroke="#051061"
                                        strokeWidth="2.15"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                    <path
                                        d="M2 11.81C2 13.63 6.08 15.1 11.12 15.1C16.16 15.1 20.24 13.63 20.24 11.81"
                                        stroke="#051061"
                                        strokeWidth="2.15"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                    <path
                                        d="M20.2498 5.28998C20.2498 7.10998 16.1698 8.57998 11.1298 8.57998C6.08977 8.57998 2.00977 7.10998 2.00977 5.28998"
                                        stroke="#051061"
                                        strokeWidth="2.15"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                    <path
                                        d="M20.2498 31.45C20.2498 33.27 16.1698 34.74 11.1298 34.74C6.08977 34.74 2.00977 33.27 2.00977 31.45"
                                        stroke="#051061"
                                        strokeWidth="2.15"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                    <path
                                        d="M20.25 5.28998V31.45"
                                        stroke="#051061"
                                        strokeWidth="2.15"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                    <path
                                        d="M2 5.28998V31.45"
                                        stroke="#051061"
                                        strokeWidth="2.15"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                    <path
                                        d="M11.9805 33.1499V18.6599C11.9805 16.6599 16.4705 15.0399 22.0105 15.0399C27.5505 15.0399 32.0405 16.6599 32.0405 18.6599V33.1499C32.0405 35.1499 27.5505 36.7699 22.0105 36.7699C16.4705 36.7699 11.9805 35.1499 11.9805 33.1499Z"
                                        fill="#F9F9FC"
                                        stroke="#F9F9FC"
                                        strokeWidth="2.96"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                    <path
                                        d="M22.4305 22.8699C27.4674 22.8699 31.5505 21.3969 31.5505 19.5799C31.5505 17.7629 27.4674 16.2899 22.4305 16.2899C17.3937 16.2899 13.3105 17.7629 13.3105 19.5799C13.3105 21.3969 17.3937 22.8699 22.4305 22.8699Z"
                                        fill="#FFBD01"
                                        stroke="#051061"
                                        strokeWidth="2.15"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                    <path
                                        d="M31.5505 26.1699C31.5505 27.9899 27.4705 29.4599 22.4305 29.4599C17.3905 29.4599 13.3105 27.9899 13.3105 26.1699"
                                        stroke="#051061"
                                        strokeWidth="2.15"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                    <path
                                        d="M31.5505 32.7599C31.5505 34.5799 27.4705 36.0499 22.4305 36.0499C17.3905 36.0499 13.3105 34.5799 13.3105 32.7599"
                                        stroke="#051061"
                                        strokeWidth="2.15"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                    <path
                                        d="M31.5508 19.5799V32.7599"
                                        stroke="#051061"
                                        strokeWidth="2.15"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                    <path
                                        d="M13.3105 19.5799V32.7599"
                                        stroke="#051061"
                                        strokeWidth="2.15"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold">
                                پس‌انداز طلانو ‌گرمی طلا
                            </h3>
                            <p className="text-base">
                                در طلانو میتونی از صد هزار تومن  طلا تا هر چقدر میخوای طلا بخری و پس انداز کنی.
                            </p>
                        </div>
                        <div className="flex basis-1/3 flex-col items-start justify-start gap-4 rounded-lg bg-white px-5 py-4 md:grow">
                            <div className="flex aspect-square size-16 shrink-0 items-center justify-center rounded-full bg-neutral-700/10">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="40"
                                    height="40"
                                    viewBox="0 0 40 40"
                                    fill="none"
                                >
                                    <path
                                        fill="#FFBD01"
                                        d="M7.516 6.908 20.333 2.2a1.93 1.93 0 0 1 1.333 0l13.292 4.717a1.97 1.97 0 0 1 1.308 1.858v6.492c0 8.258-5.025 17.958-14.383 20.116a1.776 1.776 0 0 1-.783 0c-9.509-2.15-14.875-11.85-14.875-20.116V8.758c0-.825.516-1.566 1.291-1.85"
                                    ></path>
                                    <path
                                        fill="#051061"
                                        d="M19.042 24.675c-.267 0-.533-.1-.733-.308l-5.35-5.35a1.041 1.041 0 0 1 0-1.475 1.041 1.041 0 0 1 1.475 0l4.616 4.616 9.034-9.033a1.041 1.041 0 0 1 1.475 0 1.041 1.041 0 0 1 0 1.475l-9.775 9.775c-.2.2-.467.308-.734.308z"
                                    ></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold">
                                امن و دارای مجوز است
                            </h3>
                            <p className="text-base">
                                طلانو تمامی مجوزهای خرید و فروش طلای آب شده رو داره. پس میتونی با خیال راحت و با امنیت بالا خرید و فروش کنی.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="mx-auto my-12 w-full max-w-7xl px-4 md:my-32">
                <h2 className="mb-6 flex items-center justify-center gap-1 text-center text-2xl font-black md:mb-12 md:text-4xl">
                    سوالات متداول خریداران طلای آب شده
                </h2>
                <Accordion
                    type="single"
                    collapsible
                    className="mx-auto w-full space-y-3 text-base md:text-lg"
                >
                    <AccordionItem value="1" className="rounded-md border">
                        <AccordionTrigger className="px-4 font-semibold">
                            طلانو چیست؟
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <p>
                                «طلانو»، پلتفرم و سامانۀ خرید و فروش آنلاین طلا
                                است. در طلانو، پول نقد خودت رو به راحتی به طلا
                                تبدیل کن و هر زمان که اراده کردی، اون رو با قیمت
                                روز به طلانو بفروش یا طلای فیزیکی معادل اون رو
                                از ما تحویل بگیر.
                            </p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="2" className="rounded-md border">
                        <AccordionTrigger className="px-4 font-semibold">
                            کارمزد خرید طلای آب‌شده در طلانو چقدر است؟
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <p>
                                کارمزد خرید و فروش طلای آب شده در طلانو نیم
                                درصده (۰.۶٪). این کارمزد، در هنگام خرید طلا، به
                                مبلغ خرید شما اضافه می‌شه و در هنگام فروش طلا،
                                از میزان حساب طلای طلانوی شما، برداشت میشه.
                            </p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="3" className="rounded-md border">
                        <AccordionTrigger className="px-4 font-semibold">
                            قیمت طلا در طلانو بر چه اساسی تعیین می‌شود؟
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <p>
                                قیمت طلای آب شده در طلانو، بر اساس معاملات واقعی
                                و در حجم بالای بازار بزرگ تهران به دست میاد.
                            </p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="4" className="rounded-md border">
                        <AccordionTrigger className="px-4 font-semibold">
                            طلای آب شده چه ویژگی‌هایی دارد؟
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <p>
                                طلای آب‌شده از ذوب شدن شمش طلا یا طلای قیچی
                                خورده و یا دست دوم بدست میاد. این طلا بر اساس
                                میزان خلوصش، عیاردهی می‌شه و در نتیجه دارای
                                ویژگی‌هایی هم‌چون براقیت، پایداری در مقابل تغییر
                                رنگ و زنگار زدگیه. طلای آب شده، جدای
                                سرمایه‌گذاری، به عنوان ماده اصلی ساخت جواهرات در
                                طلاسازی هم استفاده می‌شه.
                            </p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="5" className="rounded-md border">
                        <AccordionTrigger className="px-4 font-semibold">
                            طلای ۱۸ عیار یعنی چه و چه تفاوتی با سایر عیارهای طلا
                            دارد؟
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <p>
                                طلای ۱۸ عیار که طلای معیار معاملاتی در کشور
                                ایران محسوب میشه، دارای ۱۸ واحد طلای خالص و ۶
                                واحد آلیاژ فلزات مختلفه که در واقع به اون عیار
                                ۷۵۰ یا ۷۵% نیز می‌گن. در واقع در طلای ۱۸ عیار
                                25% آلیاژ فلزات مختلفی به کار رفته تا سختی و
                                استحکام مشخصی داشته باشه.
                            </p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    );
}
