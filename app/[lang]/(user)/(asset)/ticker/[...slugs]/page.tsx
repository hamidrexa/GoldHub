import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { getAsset } from '@/app/[lang]/(user)/(asset)/services/getAsset';
import { Locale } from '@/i18n-config';
import { AssetPage } from '@/app/[lang]/(user)/(asset)/components/asset-page';
import AnnouncementAlert from '@/components/announcement-alert';
import { getDictionary } from '@/get-dictionary';
import stringFormatter from '@/libs/stringFormatter';

type MetadataProps = {
    params: { slugs: string[]; lang: Locale };
    searchParams: { [key: string]: string | string[] | undefined };
};
type PageProps = {
    params: { slugs: string[]; lang: Locale };
};

export const revalidate = 1800;

export async function generateMetadata(
    { params: { slugs, lang }, searchParams }: MetadataProps,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const id = slugs[0];
    const asset = await getAsset('tse', id, { lang: lang });
    if (!asset) return {};

    const generatePageTitle = (symbolName) => {
        if (symbolName.length === 4) {
            return `${symbolName} | سهمتو`;
        } else if (symbolName.length === 5) {
            return stringFormatter(dict.newestAnalysis, { symbolName });
        } else {
            return stringFormatter(dict.newestTradersAnalysis, { symbolName });
        }
    };

    const symbolName = asset.symbol_fa;
    const seoTitle = generatePageTitle(symbolName);
    const seoDescription = stringFormatter(dict.commonQuestion, { symbolName });

    return {
        title: seoTitle,
        description: seoDescription,
        openGraph: {
            title: seoTitle,
            description: seoDescription,
        },
        alternates: {
            canonical: `https://sahmeto.com/ticker/${
                asset.ticker_index || ''
            }/${stringFormatter(dict.mainResults, { symbolName: symbolName.replace(/ /g, '-') })}`,
        },
    };
}

export default async function TickerPage({
    params: { slugs, lang },
}: PageProps) {
    const dict = await getDictionary(lang);

    return (
        <>
            <AnnouncementAlert dict={dict} lang={lang} page="ticker" />
            <AssetPage
                params={{
                    id: slugs[0],
                    slugs,
                    lang,
                }}
                market="tse"
            />
        </>
    );
}

export async function generateStaticParams() {
    const assets = await fetch(
        `${process.env.NEXT_PUBLIC_HASURA_API_URL}/v1/core/assets`
    ).then((res) => res.json());

    if (process.env.NEXT_PUBLIC_ISR === 'OFF') return [];
    return assets.ticker.map(({ id, ticker_index, symbol_fa }) => ({
        lang: 'fa',
        slugs: [
            ticker_index,
            encodeURI(
                `نتایج-کلی-سیگنال-های-خرید-و-فروش-سهم-${symbol_fa.replace(/ /g, '-')}`
            ),
        ],
    }));
}
