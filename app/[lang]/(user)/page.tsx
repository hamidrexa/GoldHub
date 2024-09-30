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
    title: 'طلامی | خرید و فروش طلای آب شده آنلاین بدون اجرت',
    description:
        'طلامی، بستر امن خرید و فروش طلای آب شده آنلاین، بدون مالیات و اجرت، با ارائه فاکتور رسمی تضمینی و گارانتی اصالت با قیمت لحظه‌ای و به‌روز طلای آب شده',
    openGraph: {
        title: 'طلامی | خرید و فروش طلای آب شده آنلاین بدون اجرت',
        description:
            'طلامی، بستر امن خرید و فروش طلای آب شده آنلاین، بدون مالیات و اجرت، با ارائه فاکتور رسمی تضمینی و گارانتی اصالت با قیمت لحظه‌ای و به‌روز طلای آب شده',
    },
};

export default async function HomePage({ params: { lang } }) {
    const dict = await getDictionary(lang);

    return (
        <div className="flex w-full flex-col pt-6">
            <div className="my-32 flex w-full flex-col gap-2 px-4 md:px-48">
                <h2 className="mb-4 flex items-center justify-center gap-1 text-center text-4xl font-black">
                    <QuestionMarkCircledIcon width={25} height={25} />
                    سوالات متداول خریداران طلای آب شده
                </h2>
                <Accordion
                    type="single"
                    collapsible
                    className="mx-auto w-full space-y-3"
                >
                    <AccordionItem value="1" className="rounded-md border">
                        <AccordionTrigger className="px-4 text-lg font-semibold">
                            طلامی چیست؟
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0 text-lg">
                            <p>«طلامی»، پلتفرم و سامانۀ خرید و فروش آنلاین طلا است. در طلامی، پول نقد خودت رو به راحتی به
                                طلا تبدیل کن و هر زمان که اراده کردی، اون رو با قیمت روز به طلامی بفروش یا طلای فیزیکی
                                معادل اون رو از ما تحویل بگیر.</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="2" className="rounded-md border">
                        <AccordionTrigger className="px-4 text-lg font-semibold">
                            کارمزد خرید طلای آب‌شده در طلامی چقدر است؟
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0 text-lg">
                            <p>کارمزد خرید و فروش طلای آب شده در طلامی نیم درصده (۰.۵٪). این کارمزد، در هنگام خرید طلا،
                                به مبلغ خرید شما اضافه می‌شه و در هنگام فروش طلا، از میزان حساب طلای طلامی شما، برداشت
                                میشه.</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="3" className="rounded-md border">
                        <AccordionTrigger className="px-4 text-lg font-semibold">
                            قیمت طلا در طلامی بر چه اساسی تعیین می‌شود؟
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0 text-lg">
                            <p>قیمت طلای آب شده در طلامی، بر اساس معاملات واقعی و در حجم بالای بازار بزرگ تهران به دست
                                میاد.</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="4" className="rounded-md border">
                        <AccordionTrigger className="px-4 text-lg font-semibold">
                            طلای آب شده چه ویژگی‌هایی دارد؟
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0 text-lg">
                            <p>
                                طلای آب‌شده از ذوب شدن شمش طلا یا طلای قیچی خورده و یا دست دوم بدست میاد. این طلا بر
                                اساس
                                میزان خلوصش، عیاردهی می‌شه و در نتیجه دارای ویژگی‌هایی هم‌چون براقیت، پایداری در مقابل
                                تغییر رنگ و زنگار زدگیه. طلای آب شده، جدای سرمایه‌گذاری، به عنوان ماده اصلی ساخت جواهرات
                                در طلاسازی هم استفاده می‌شه.
                            </p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="5" className="rounded-md border">
                        <AccordionTrigger className="px-4 text-lg font-semibold">
                            طلای ۱۸ عیار یعنی چه و چه تفاوتی با سایر عیارهای طلا دارد؟
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0 text-lg">
                            <p>
                                طلای ۱۸ عیار که طلای معیار معاملاتی در کشور ایران محسوب میشه، دارای ۱۸ واحد طلای خالص و
                                ۶
                                واحد آلیاژ فلزات مختلفه که در واقع به اون عیار ۷۵۰ یا ۷۵% نیز می‌گن. در واقع در طلای ۱۸
                                عیار 25% آلیاژ فلزات مختلفی به کار رفته تا سختی و استحکام مشخصی داشته باشه.
                            </p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
