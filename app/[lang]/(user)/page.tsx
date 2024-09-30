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
        </div>
    );
}
