import { Locale } from '@/i18n-config';
import { getDirection } from '@/libs/utils';
import { getDictionary } from '@/get-dictionary';
import { Metadata, ResolvingMetadata } from 'next';
import { getPlanList } from '@/app/[lang]/(user)/pricing/services/getPlanList';
import { PlanWrap } from '@/app/[lang]/(user)/pricing/components/plan-wrap';
import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { ChevronDown } from 'lucide-react';
import AnnouncementAlert from '@/components/announcement-alert';

type Props = {
    params: { id: string; lang: Locale };
    searchParams: { [key: string]: string | string[] | undefined };
};
type PageProps = {
    params: { id: string; lang: Locale };
};

export async function generateMetadata(
    { params, searchParams }: Props,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(params.lang);
    const seoTitle = dict.pricingPageTitle;

    return {
        title: seoTitle,
        openGraph: {
            title: dict.pricingPageTitle,
        },
        alternates: {
            canonical: `https://sahmeto.com/pricing`,
        },
    };
}

export default async function PricingPage({ params: { id, lang } }: PageProps) {
    const dir = getDirection(lang);
    const dict = await getDictionary(lang);
    const plans = await getPlanList(lang);

    return (
        <>
            <AnnouncementAlert dict={dict} lang={lang} page="pricing" />
            <main className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
                <div className="mx-auto mb-8 max-w-screen-md text-center lg:mb-12">
                    <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-neutral-800">
                        {dict.accountChoose}
                    </h2>
                    <p className="mb-5 text-gray-600 sm:text-xl">
                        {dict.unboundedAccess}
                    </p>
                </div>
                <PlanWrap purePlans={plans} lang={lang} dict={dict} isShow />
                <h2 className="mb-4 mt-10 text-2xl font-semibold">
                    {dict.questionAsk}
                </h2>
                <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-4"
                >
                    <AccordionItem value="1" className="rounded-md border">
                        <AccordionTrigger className="px-4">
                            {dict.QA.n1.title}
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <p>{dict.QA.n1.text}</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="2" className="rounded-md border">
                        <AccordionTrigger className="px-4">
                            {dict.QA.n2.title}
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <p>{dict.QA.n2.text}</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="3" className="rounded-md border">
                        <AccordionTrigger className="px-4">
                            {dict.QA.n3.title}
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <p>{dict.QA.n3.text}</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="4" className="rounded-md border">
                        <AccordionTrigger className="px-4">
                            {dict.QA.n4.title}
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <p>{dict.QA.n4.text}</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="5" className="rounded-md border">
                        <AccordionTrigger className="px-4">
                            {dict.QA.n5.title}
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <p>{dict.QA.n5.text}</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="6" className="rounded-md border">
                        <AccordionTrigger className="px-4">
                            {dict.QA.n6.title}
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <p>{dict.QA.n6.text}</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="7" className="rounded-md border">
                        <AccordionTrigger className="px-4">
                            {dict.QA.n7.title}
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <p>{dict.QA.n7.text}</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="8" className="rounded-md border">
                        <AccordionTrigger className="px-4">
                            {dict.QA.n8.title}
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <p>{dict.QA.n8.text}</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="9" className="rounded-md border">
                        <AccordionTrigger className="px-4">
                            {dict.QA.n9.title}
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <p>{dict.QA.n9.text}</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="10" className="rounded-md border">
                        <AccordionTrigger className="px-4">
                            {dict.QA.n10.title}
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <p>{dict.QA.n10.text}</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="11" className="rounded-md border">
                        <AccordionTrigger className="px-4">
                            {dict.QA.n11.title}
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <p>{dict.QA.n11.text}</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="12" className="rounded-md border">
                        <AccordionTrigger className="px-4">
                            {dict.QA.n12.title}
                            <ChevronDown width={20} height={20} />
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <p>{dict.QA.n12.text}</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </main>
        </>
    );
}
