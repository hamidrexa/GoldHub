import { ChevronDown, ArrowLeft, ShieldCheck, Zap, Coins, Calculator, TrendingUp, Phone, Users } from 'lucide-react';
import { Metadata, ResolvingMetadata } from 'next';
import { getDictionary } from '@/get-dictionary';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import React from 'react';
import { LinkBox } from '@/components/link-box';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { getLinksLang } from '@/libs/utils';
import { Locale } from '@/i18n-config';

interface PageProps {
    params: { lang: Locale };
}

export async function generateMetadata(
    { params: { lang } }: PageProps,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const seoTitle = dict.homePageSeoTitle || 'GoldHub';
    const seoDescription = dict.homePageDescription || 'GoldHub Platform';

    return {
        title: seoTitle,
        description: seoDescription,
        openGraph: {
            title: seoTitle,
            description: seoDescription,
        },
        alternates: {
            canonical: `/${lang}`,
        },
    };
}

export default async function HomePage({ params: { lang } }: PageProps) {
    const dict = await getDictionary(lang);
    const links = getLinksLang(lang);
    const home = dict.homepage;

    // Fallback if dictionary is missing (during transition or if keys are missing)
    if (!home) {
        return <div>Loading...</div>; // Or render the old version as fallback
    }

    return (
        <div className="flex w-full flex-col font-sans">
            {/* Hero Section */}
            <section className="relative w-full overflow-hidden bg-navy-900 px-4 py-16 text-white md:py-32 lg:py-40">
                <div className="absolute inset-0 bg-[url('/img/hero-bg-pattern.svg')] opacity-10"></div>
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-navy-900/90 pointer-events-none"></div>

                <div className="container relative z-10 mx-auto flex flex-col items-center gap-8 text-center md:gap-12">
                    <div className="inline-flex items-center rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-sm font-medium text-yellow-500 backdrop-blur-sm">
                        <span className="flex h-2 w-2 rounded-full bg-yellow-500 mr-2 animate-pulse"></span>
                        {home.hero.tagline}
                    </div>

                    <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight md:text-6xl lg:text-7xl">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600">
                            {dict.appName}
                        </span>
                        ، {home.hero.title}
                    </h1>

                    <p className="max-w-2xl text-lg text-gray-300 md:text-xl leading-relaxed">
                        {home.hero.description}
                    </p>

                    <div className="flex flex-col w-full max-w-sm gap-4 sm:flex-row sm:justify-center">
                        <Button asChild size="xl" className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-navy-900 font-bold text-lg h-12">
                            <Link href={`${links}/login`}>
                                {home.hero.ctaPrimary}
                                <ArrowLeft className="mr-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="xl" className="w-full sm:w-auto border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white h-12 bg-transparent">
                            <Link href={`${links}/about`}>
                                {home.hero.ctaSecondary}
                            </Link>
                        </Button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-8 flex items-center justify-center gap-8 text-gray-400 grayscale transition-all hover:grayscale-0">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-6 w-6" />
                            <span className="text-sm">{home.hero.trust.license}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-6 w-6" />
                            <span className="text-sm">{home.hero.trust.users}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Stats / Live Ticker (Mock) */}
            <section className="w-full -mt-10 px-4 z-20 container mx-auto mb-20">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {[
                        { title: home.liveTicker.gold18, price: '$4,317.20', change: '+1.2٪', icon: Coins, color: 'text-yellow-500' },
                        // { title: home.liveTicker.coin, price: '۳۹,۸۰۰,۰۰۰', change: '+۰.۵٪', icon: TrendingUp, color: 'text-green-500' },
                        // { title: home.liveTicker.dollar, price: '۶۲,۵۰۰', change: '-۰.۱٪', icon: Calculator, color: 'text-gray-400' },
                    ].map((item, i) => (
                        <Card key={i} className="border-none shadow-xl bg-white/95 backdrop-blur">
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl bg-gray-50 ${item.color.replace('text', 'bg')}/10`}>
                                        <item.icon className={`h-6 w-6 ${item.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{item.title}</p>
                                        <p className="text-xl font-bold text-navy-900">{item.price} <span className="text-xs font-normal text-gray-400"></span></p>
                                    </div>
                                </div>
                                <span className={`text-sm font-bold ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`} dir="ltr">
                                    {item.change}
                                </span>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="w-full py-16 px-4 bg-gray-50">
                <div className="mx-auto w-full max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-navy-900 mb-4">{home.features.title}</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{home.features.subtitle}</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Feature 1 */}
                        <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-600 transition-colors group-hover:bg-yellow-500 group-hover:text-white">
                                <Zap className="h-7 w-7" />
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-navy-900">{home.features.items.noFees.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {home.features.items.noFees.description}
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                <Coins className="h-7 w-7" />
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-navy-900">{home.features.items.microSavings.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {home.features.items.microSavings.description}
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white">
                                <ShieldCheck className="h-7 w-7" />
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-navy-900">{home.features.items.secure.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {home.features.items.secure.description}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Link Box Section */}
            <section className="w-full px-4 py-8 bg-white">
                <div className="mx-auto w-full max-w-3xl">
                    <LinkBox
                        target='_blank'
                        title={dict.newestTradersAnalysis?.replace('{symbolName} | ', '') || 'تحلیل تکنیکال طلا'}
                        icon={<TrendingUp stroke='currentColor' className="w-6 h-6 text-yellow-600" />}
                        href='https://sahmeto.com/ticker/IRG0000/%D9%86%D8%AA%D8%A7%DB%8C%D8%AC-%DA%A9%D9%84%DB%8C-%D8%B3%DB%8C%DA%AF%D9%86%D8%A7%D9%84-%D9%87%D8%A7%DB%8C-%D8%AE%D8%B1%DB%8C%D8%AF-%D9%88-%D9%81%D8%B1%D9%88%D8%B4-%D8%B3%D9%87%D9%85-%D8%B7%D9%84%D8%A7-%DB%B1%DB%B8-%D8%B9%DB%8C%D8%A7%D8%B1'
                    />
                </div>
            </section>

            {/* FAQ Section */}
            <section className="mx-auto w-full max-w-4xl px-4 py-16 md:py-24">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-4xl font-black text-navy-900 mb-4">{home.faq.title}</h2>
                    <p className="text-gray-500">{home.faq.subtitle}</p>
                </div>

                <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-4"
                >
                    <AccordionItem value="1" className="border rounded-xl px-2 shadow-sm bg-white">
                        <AccordionTrigger className="px-4 text-base font-bold hover:no-underline text-navy-900 py-4">
                            {home.faq.items.whatIs.q}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 text-gray-600 leading-7">
                            {home.faq.items.whatIs.a}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="2" className="border rounded-xl px-2 shadow-sm bg-white">
                        <AccordionTrigger className="px-4 text-base font-bold hover:no-underline text-navy-900 py-4">
                            {home.faq.items.fees.q}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 text-gray-600 leading-7">
                            {home.faq.items.fees.a}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="3" className="border rounded-xl px-2 shadow-sm bg-white">
                        <AccordionTrigger className="px-4 text-base font-bold hover:no-underline text-navy-900 py-4">
                            {home.faq.items.pricing.q}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 text-gray-600 leading-7">
                            {home.faq.items.pricing.a}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="4" className="border rounded-xl px-2 shadow-sm bg-white">
                        <AccordionTrigger className="px-4 text-base font-bold hover:no-underline text-navy-900 py-4">
                            {home.faq.items.attributes.q}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 text-gray-600 leading-7">
                            {home.faq.items.attributes.a}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="5" className="border rounded-xl px-2 shadow-sm bg-white">
                        <AccordionTrigger className="px-4 text-base font-bold hover:no-underline text-navy-900 py-4">
                            {home.faq.items.karat.q}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 text-gray-600 leading-7">
                            {home.faq.items.karat.a}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>

            {/* CTA Section */}
            <section className="bg-navy-900 py-20 px-4 text-center text-white">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="mb-6 text-3xl font-black md:text-5xl text-yellow-500">
                        {home.cta.title}
                    </h2>
                    <p className="mb-10 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                        {home.cta.description}
                    </p>
                    <Button asChild size="xl" className="bg-white text-navy-900 hover:bg-gray-100 font-bold px-10 py-6 text-lg rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-transform hover:scale-105">
                        <Link href={`${links}/login`}>
                            {home.cta.button}
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
