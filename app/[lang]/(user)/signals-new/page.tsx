import React, { Fragment } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { getDictionary } from '@/get-dictionary';
import { componentFormat } from '@/libs/stringFormatter';
import { isMobile } from 'react-device-detect';
import { ProductsNavigator } from '@/components/products-navigator';
import { getSignals } from '@/app/[lang]/(user)/signals-new/services/getSignals';
import { Locale } from '@/i18n-config';
import { MessageCompact } from '@/components/message-compact';
import { FiltersWrap } from '@/app/[lang]/(user)/signals-new/components/filters-wrap';
import { Empty } from '@/components/empty';
import AnnouncementAlert from '@/components/announcement-alert';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

type Props = {
    params: { id: string; lang: Locale };
    searchParams: { [key: string]: string | string[] | undefined };
};

export const revalidate = 1800;

export async function generateMetadata(
    { params: { lang } }: Props,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const seoTitle = dict.loginPageSeoTitle;
    const seoDescription = 'www.sahmeto.com/signals';

    return {
        title: dict.signalsPageTitle,
        description: dict.signalsPageDescription,
        openGraph: {
            title: dict.signalsPageTitle,
            description: dict.signalsPageDescription,
        },
        alternates: {
            canonical: '',
        },
    };
}

export default async function SignalsPage({ searchParams, params: { lang } }) {
    const dict = await getDictionary(lang);
    const signals = await getSignals(searchParams);
    const testAsset = [
        {
            name: 'Ali',
            asset: 'BTC',
            value: 'B',
        },
        {
            name: 'Mamad',
            asset: 'BTC',
            value: 'B',
        },
        {
            name: 'Borna',
            asset: 'ETH',
            value: 'S',
        },
        {
            name: 'Hamid',
            asset: 'SOL',
            value: 'S',
        },
        {
            name: 'Ahmad',
            asset: 'NOT',
            value: 'S',
        },
    ];

    return (
        <>
            <AnnouncementAlert dict={dict} lang={lang} page="signal" />
            <main className="main">
                <div className="jumbotron">
                    {!isMobile && <ProductsNavigator dict={dict} lang={lang} />}
                    <div className="w-full">
                        <h1 className="z-30 mb-5 rounded-lg border border-gray-100 bg-white py-10 text-center text-lg">
                            {componentFormat(
                                dict.signalPageSlogan,
                                {},
                                <span className="inline-block font-black">
                                    {dict.signalPageSloganComponent1}
                                </span>
                            )}
                        </h1>
                        <div className="flex flex-col px-2.5 md:flex-row md:gap-16">
                            <div className="w-full md:sticky md:top-32 md:h-fit md:max-w-[375px]">
                                <FiltersWrap dict={dict} lang={lang} />
                            </div>
                            <div className="mt-5 flex w-full flex-col gap-4">
                                {!signals.length && (
                                    <div className="flex w-full items-center justify-center">
                                        <Empty>سیگنالی پیدا نشد</Empty>
                                    </div>
                                )}
                                {signals.map((signal) => (
                                    <MessageCompact
                                        key={signal.signals[0].id}
                                        publisher={signal.signals[0].publisher}
                                        message={{
                                            ...signal.signals[0],
                                            ...signal,
                                        }}
                                        signal={
                                            signal.signals[0].assets_signals[0]
                                        }
                                        dict={dict}
                                        lang={lang}
                                        market={signal.market}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {/*<div className="mx-auto flex max-w-fit items-center justify-center">*/}
                {/*    <Table>*/}
                {/*        <TableCaption>Signals Table</TableCaption>*/}
                {/*        <TableHeader>*/}
                {/*            <TableRow>*/}
                {/*                <TableHead className="min-w-48  text-base">*/}
                {/*                    تریدر*/}
                {/*                </TableHead>*/}
                {/*                <TableHead className="min-w-48 text-base">*/}
                {/*                    نماد*/}
                {/*                </TableHead>*/}
                {/*                <TableHead className="min-w-48 text-base">*/}
                {/*                    نوع سیگنال*/}
                {/*                </TableHead>*/}
                {/*            </TableRow>*/}
                {/*        </TableHeader>*/}
                {/*        <TableBody>*/}
                {/*            {testAsset.map((item, index) => (*/}
                {/*                <TableRow key={index}>*/}
                {/*                    <TableCell>{item.name}</TableCell>*/}
                {/*                    <TableCell>{item.asset}</TableCell>*/}
                {/*                    <TableCell>*/}
                {/*                        {item.value === 'B' ? 'خرید' : 'فروش'}*/}
                {/*                    </TableCell>*/}
                {/*                </TableRow>*/}
                {/*            ))}*/}
                {/*        </TableBody>*/}
                {/*    </Table>*/}
                {/*</div>*/}
            </main>
        </>
    );
}
