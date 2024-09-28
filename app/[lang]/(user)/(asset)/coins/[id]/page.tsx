import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { i18n, Locale } from '@/i18n-config';
import { AssetPage } from '@/app/[lang]/(user)/(asset)/components/asset-page';
import { transformAssetData } from '@/libs/dataTransformers';
import stringFormatter from '@/libs/stringFormatter';
import { getDictionary } from '@/get-dictionary';
import AnnouncementAlert from '@/components/announcement-alert';
import { getLinksLang } from '@/libs/utils';
import { getAsset } from '@/app/[lang]/(user)/(asset)/services/getAsset';

type MetadataProps = {
    params: { id: string; lang: Locale; dict: any };
    searchParams: { [key: string]: string | string[] | undefined };
};
type PageProps = {
    params: { id: string; lang: Locale; dict: any };
};

export const revalidate = 1800;

export async function generateMetadata(
    { params: { id, lang } }: MetadataProps,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const asset = transformAssetData(
        await getAsset('crypto', id, { lang: lang })
    );
    if (!asset) return {};

    const generatePageTitle = () => {
        return stringFormatter(dict.assetPageTitle1, {
            symbolName: `${asset.name} (${asset.symbol})`,
        });
    };
    const seoTitle = generatePageTitle();
    const seoDescription = stringFormatter(dict.assetPageDescription2, {
        symbolName: asset.symbol,
        name: asset.name,
    });

    return {
        title: seoTitle,
        description: seoDescription,
        openGraph: {
            title: seoTitle,
            description: seoDescription,
        },
        alternates: {
            canonical: `https://sahmeto.com${getLinksLang(
                lang
            )}/coins/${asset.symbol}`,
        },
    };
}

export default async function CryptoPage({ params }: PageProps) {
    const dict = await getDictionary(params.lang);

    return (
        <>
            <AnnouncementAlert dict={dict} lang={params.lang} page="coin" />
            <AssetPage params={params} market="crypto" />
        </>
    );
}

export async function generateStaticParams() {
    const assets = await fetch(
        `${process.env.NEXT_PUBLIC_HASURA_API_URL}/v1/core/assets`
    ).then((res) => res.json());

    if (process.env.NEXT_PUBLIC_ISR === 'OFF') return [];
    return i18n.locales.flatMap((lang) =>
        assets.crypto.map(({ symbol }) => ({ lang, id: symbol }))
    );
}
