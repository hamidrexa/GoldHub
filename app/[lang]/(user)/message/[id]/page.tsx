import React from 'react';
import { Metadata } from 'next';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Message } from '@/components/message';
import stringFormatter from '@/libs/stringFormatter';
import {
    convertDateToHumanTime,
    getImage,
    removeEmojis,
    sliceText,
} from '@/libs/utils';
import { CopyButton } from '@/components/copy-button';
import { notFound } from 'next/navigation';
import { getMessages } from '@/app/[lang]/(user)/(asset)/services/getMessages';

type Props = {
    params: {
        id: string;
        lang: Locale;
    };
};
type PageProps = {
    params: {
        id: string;
        lang: Locale;
    };
};

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

function seoFactory(message: any, id: string, dict: any, lang: Locale) {
    let title: string;
    let description: string;
    const asset_signal = message.assets_signals.filter(
        (asset_signal) => asset_signal.id == id
    )[0];
    const isNeutral = asset_signal.value === 'N' || asset_signal.value === 'E';
    const symbol = asset_signal.asset.symbol;
    if (!isNeutral) {
        if (asset_signal.type === 'F')
            title = stringFormatter(dict.messagePageSeoTitle, {
                bargainType: dict.bargainTypes[asset_signal.value]?.title ?? '',
                symbol,
                analysisType:
                    dict.analysisTypes[asset_signal.type]?.title ?? '',
                publisher: sliceText(message.publisher.name, 11),
                messageText: sliceText(
                    message.translated_message ?? message.text,
                    24
                ),
            });
        else
            title = stringFormatter(dict.messagePageSeoTitle2, {
                bargainType:
                    dict.bargainTypes[asset_signal.value]?.alternativeTitle ??
                    '',
                symbol,
                analysisType:
                    dict.analysisTypes[asset_signal.type]?.title ?? '',
                publisher: sliceText(message.publisher.name, 11),
                messageText: sliceText(
                    message.translated_message ?? message.text,
                    24
                ),
            });
    } else {
        title = `${dict.analytics} ${
            !isNeutral ? dict.bargainTypes[asset_signal.value]?.title : ''
        } ${sliceText(message.publisher.name, 11)} ${
            dict.about
        } ${symbol} (${convertDateToHumanTime(
            dict,
            lang,
            message.date
        )}): ${sliceText(message.translated_message ?? message.text, 24)}`;
    }

    description = isNeutral
        ? stringFormatter(dict.messagePageSeoDescription, {
              symbol,
              publisherName: message.publisher.name,
              publisherRank: message.publisher.rank,
          })
        : stringFormatter(dict.messagePageSeoDescription2, {
              symbol,
              publisherName: message.publisher.name,
              publisherRank: message.publisher.rank,
          });
    return {
        title: removeEmojis(title),
        description: removeEmojis(description),
        canonical: `https://sahmeto.com/message/${asset_signal.id}`,
        images: {
            image: message.photo
                ? `https://cdn.sahmeto.com${message.photo.image}`
                : null,
            thumbnail: message.photo
                ? `https://cdn.sahmeto.com${message.photo.thumbnail}`
                : null,
            publisher: getImage(message.publisher),
            source: dict.messagesSourceType[message.publisher.account_type]
                ?.logo,
        },
    };
}

export async function generateMetadata({
    params: { id, lang },
}: Props): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const messages = await getMessages(
        {
            asset_signal_id: id,
        },
        lang
    );
    const message = messages.results?.[0];
    if (!message) return {};
    const seo = seoFactory(message, id, dict, lang);

    return {
        title: seo.title,
        description: seo.description,
        openGraph: {
            title: seo.title,
            description: seo.description,
            images: [
                seo.images.image,
                seo.images.source,
                seo.images.thumbnail,
                seo.images.publisher,
            ],
            siteName: 'Sahmeto',
            locale: lang,
            type: 'article',
        },
        twitter: {
            title: seo.title,
            description: seo.description,
            images: [
                seo.images.image,
                seo.images.source,
                seo.images.thumbnail,
                seo.images.publisher,
            ],
            card: 'summary_large_image',
            site: '@sahmetocom',
        },
        alternates: {
            canonical: seo.canonical,
        },
        robots: {
            'max-image-preview': 'large',
        },
    };
}

export default async function MessagePage({ params: { id, lang } }: PageProps) {
    const dict = await getDictionary(lang);
    const messages = await getMessages(
        {
            asset_signal_id: id,
        },
        lang
    );
    const message = messages.results?.[0];
    if (!message) notFound();
    const seo = seoFactory(message, id, dict, lang);
    const asset_signal = message.assets_signals.filter(
        (asset_signal) => asset_signal.id == id
    )[0];
    const symbol = asset_signal.asset.symbol;
    const market = asset_signal.asset.type;
    const isNeutral = asset_signal.value === 'N' || asset_signal.value === 'E';
    const link = `https://sahmeto.com/message/${asset_signal.id}`;

    return (
        <>
            <main className="main">
                <div className="mx-auto w-full max-w-xl px-2.5 py-10">
                    <h1 className="mb-4 text-center text-2xl font-bold">
                        {isNeutral
                            ? stringFormatter(dict.messagePageH1, {
                                  analysisType:
                                      dict.analysisTypes[asset_signal.type]
                                          ?.title ?? '',
                                  publisherName: message.publisher.name,
                                  symbol,
                                  market:
                                      market === 'crypto'
                                          ? dict.symbol
                                          : dict.stock,
                                  date: convertDateToHumanTime(
                                      dict,
                                      lang,
                                      message.date
                                  ),
                              })
                            : stringFormatter(dict.messagePageSecondH1, {
                                  analysisType:
                                      dict.analysisTypes[asset_signal.type]
                                          ?.title ?? '',
                                  bargainType:
                                      dict.bargainTypes[asset_signal.value]
                                          ?.title ?? '',
                                  market:
                                      market === 'crypto'
                                          ? dict.symbol
                                          : dict.stock,
                                  publisherName: message.publisher.name,
                                  symbol,
                                  date: convertDateToHumanTime(
                                      dict,
                                      lang,
                                      message.date
                                  ),
                              })}
                    </h1>
                    <div
                        className="mb-12 flex h-10 items-center justify-between rounded-md bg-gray-200 px-2.5"
                        dir="rtl"
                    >
                        <CopyButton value={link} dict={dict} />
                        <span className="font-medium">{link}</span>
                    </div>
                    <div className="mb-8 flex items-center justify-evenly">
                        <a
                            rel="noopener"
                            target="_blank"
                            href={`https://www.instagram.com/direct/inbox/?url=${link}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="40"
                                height="40"
                                viewBox="0 0 50 50"
                            >
                                <path d="M 16 3 C 8.8324839 3 3 8.8324839 3 16 L 3 34 C 3 41.167516 8.8324839 47 16 47 L 34 47 C 41.167516 47 47 41.167516 47 34 L 47 16 C 47 8.8324839 41.167516 3 34 3 L 16 3 z M 16 5 L 34 5 C 40.086484 5 45 9.9135161 45 16 L 45 34 C 45 40.086484 40.086484 45 34 45 L 16 45 C 9.9135161 45 5 40.086484 5 34 L 5 16 C 5 9.9135161 9.9135161 5 16 5 z M 37 11 A 2 2 0 0 0 35 13 A 2 2 0 0 0 37 15 A 2 2 0 0 0 39 13 A 2 2 0 0 0 37 11 z M 25 14 C 18.936712 14 14 18.936712 14 25 C 14 31.063288 18.936712 36 25 36 C 31.063288 36 36 31.063288 36 25 C 36 18.936712 31.063288 14 25 14 z M 25 16 C 29.982407 16 34 20.017593 34 25 C 34 29.982407 29.982407 34 25 34 C 20.017593 34 16 29.982407 16 25 C 16 20.017593 20.017593 16 25 16 z"></path>
                            </svg>
                        </a>
                        <a
                            rel="noopener"
                            target="_blank"
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${link}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="40"
                                height="40"
                                viewBox="0 0 50 50"
                            >
                                <path d="M 9 4 C 6.2504839 4 4 6.2504839 4 9 L 4 41 C 4 43.749516 6.2504839 46 9 46 L 41 46 C 43.749516 46 46 43.749516 46 41 L 46 9 C 46 6.2504839 43.749516 4 41 4 L 9 4 z M 9 6 L 41 6 C 42.668484 6 44 7.3315161 44 9 L 44 41 C 44 42.668484 42.668484 44 41 44 L 9 44 C 7.3315161 44 6 42.668484 6 41 L 6 9 C 6 7.3315161 7.3315161 6 9 6 z M 14 11.011719 C 12.904779 11.011719 11.919219 11.339079 11.189453 11.953125 C 10.459687 12.567171 10.011719 13.484511 10.011719 14.466797 C 10.011719 16.333977 11.631285 17.789609 13.691406 17.933594 A 0.98809878 0.98809878 0 0 0 13.695312 17.935547 A 0.98809878 0.98809878 0 0 0 14 17.988281 C 16.27301 17.988281 17.988281 16.396083 17.988281 14.466797 A 0.98809878 0.98809878 0 0 0 17.986328 14.414062 C 17.884577 12.513831 16.190443 11.011719 14 11.011719 z M 14 12.988281 C 15.392231 12.988281 15.94197 13.610038 16.001953 14.492188 C 15.989803 15.348434 15.460091 16.011719 14 16.011719 C 12.614594 16.011719 11.988281 15.302225 11.988281 14.466797 C 11.988281 14.049083 12.140703 13.734298 12.460938 13.464844 C 12.78117 13.19539 13.295221 12.988281 14 12.988281 z M 11 19 A 1.0001 1.0001 0 0 0 10 20 L 10 39 A 1.0001 1.0001 0 0 0 11 40 L 17 40 A 1.0001 1.0001 0 0 0 18 39 L 18 33.134766 L 18 20 A 1.0001 1.0001 0 0 0 17 19 L 11 19 z M 20 19 A 1.0001 1.0001 0 0 0 19 20 L 19 39 A 1.0001 1.0001 0 0 0 20 40 L 26 40 A 1.0001 1.0001 0 0 0 27 39 L 27 29 C 27 28.170333 27.226394 27.345035 27.625 26.804688 C 28.023606 26.264339 28.526466 25.940057 29.482422 25.957031 C 30.468166 25.973981 30.989999 26.311669 31.384766 26.841797 C 31.779532 27.371924 32 28.166667 32 29 L 32 39 A 1.0001 1.0001 0 0 0 33 40 L 39 40 A 1.0001 1.0001 0 0 0 40 39 L 40 28.261719 C 40 25.300181 39.122788 22.95433 37.619141 21.367188 C 36.115493 19.780044 34.024172 19 31.8125 19 C 29.710483 19 28.110853 19.704889 27 20.423828 L 27 20 A 1.0001 1.0001 0 0 0 26 19 L 20 19 z M 12 21 L 16 21 L 16 33.134766 L 16 38 L 12 38 L 12 21 z M 21 21 L 25 21 L 25 22.560547 A 1.0001 1.0001 0 0 0 26.798828 23.162109 C 26.798828 23.162109 28.369194 21 31.8125 21 C 33.565828 21 35.069366 21.582581 36.167969 22.742188 C 37.266572 23.901794 38 25.688257 38 28.261719 L 38 38 L 34 38 L 34 29 C 34 27.833333 33.720468 26.627107 32.990234 25.646484 C 32.260001 24.665862 31.031834 23.983076 29.517578 23.957031 C 27.995534 23.930001 26.747519 24.626988 26.015625 25.619141 C 25.283731 26.611293 25 27.829667 25 29 L 25 38 L 21 38 L 21 21 z"></path>
                            </svg>
                        </a>
                        <a
                            rel="noopener"
                            target="_blank"
                            href={`https://t.me/share/url?url=${link}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="40"
                                height="40"
                                viewBox="0 0 48 48"
                            >
                                <path d="M39.175,10.016c1.687,0,2.131,1.276,1.632,4.272c-0.571,3.426-2.216,14.769-3.528,21.83 c-0.502,2.702-1.407,3.867-2.724,3.867c-0.724,0-1.572-0.352-2.546-0.995c-1.32-0.872-7.984-5.279-9.431-6.314 c-1.32-0.943-3.141-2.078-0.857-4.312c0.813-0.796,6.14-5.883,10.29-9.842c0.443-0.423,0.072-1.068-0.42-1.068 c-0.112,0-0.231,0.034-0.347,0.111c-5.594,3.71-13.351,8.859-14.338,9.53c-0.987,0.67-1.949,1.1-3.231,1.1 c-0.655,0-1.394-0.112-2.263-0.362c-1.943-0.558-3.84-1.223-4.579-1.477c-2.845-0.976-2.17-2.241,0.593-3.457 c11.078-4.873,25.413-10.815,27.392-11.637C36.746,10.461,38.178,10.016,39.175,10.016 M39.175,7.016L39.175,7.016 c-1.368,0-3.015,0.441-5.506,1.474L33.37,8.614C22.735,13.03,13.092,17.128,6.218,20.152c-1.074,0.473-4.341,1.91-4.214,4.916 c0.054,1.297,0.768,3.065,3.856,4.124l0.228,0.078c0.862,0.297,2.657,0.916,4.497,1.445c1.12,0.322,2.132,0.478,3.091,0.478 c1.664,0,2.953-0.475,3.961-1.028c-0.005,0.168-0.001,0.337,0.012,0.507c0.182,2.312,1.97,3.58,3.038,4.338l0.149,0.106 c1.577,1.128,8.714,5.843,9.522,6.376c1.521,1.004,2.894,1.491,4.199,1.491c2.052,0,4.703-1.096,5.673-6.318 c0.921-4.953,1.985-11.872,2.762-16.924c0.331-2.156,0.603-3.924,0.776-4.961c0.349-2.094,0.509-4.466-0.948-6.185 C42.208,7.875,41.08,7.016,39.175,7.016L39.175,7.016z"></path>
                            </svg>
                        </a>
                        <a
                            rel="noopener"
                            target="_blank"
                            href={`https://twitter.com/intent/tweet?url=${link}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="40"
                                height="40"
                                viewBox="0 0 30 30"
                            >
                                <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z"></path>
                            </svg>
                        </a>
                    </div>
                    <Message
                        key={message.id}
                        publisher={message.publisher}
                        message={message}
                        signal={asset_signal}
                        dict={dict}
                        lang={lang}
                        market={market}
                    />
                </div>
            </main>
            <script
                id="news"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org/',
                        '@type': 'NewsArticle',
                        mainEntityOfPage: {
                            '@type': 'WebPage',
                            '@id': `${link}#webpage`,
                        },
                        datePublished: message.date,
                        headline: seo.title,
                        description: seo.description,
                        keywords: `${symbol}, ${message.publisher.name}`,
                        ...(seo.images.image && {
                            image: [
                                {
                                    '@type': 'ImageObject',
                                    '@id': `${seo.images.image}#primaryimage`,
                                    url: seo.images.image,
                                    width: '2560',
                                    height: '1440',
                                    caption: symbol,
                                },
                                {
                                    '@type': 'ImageObject',
                                    url: seo.images.thumbnail,
                                    width: 1600,
                                    height: 1372,
                                    caption: symbol,
                                },
                            ],
                        }),
                        author: {
                            '@type': 'Person',
                            name: message.publisher.name,
                            url: `https://sahmeto.com/publisher/${message.publisher.primary_username}`,
                            description: `${
                                message.publisher.name
                            } is a reder with Sahmeto rank of ${
                                message.publisher.rank
                            } and win-rate ${
                                message.publisher.power_of_analysis * 5
                            }.`,
                            image: {
                                '@type': 'ImageObject',
                                url: seo.images.publisher,
                                height: 96,
                                width: 96,
                            },
                        },
                        publisher: {
                            '@type': 'Organization',
                            name: message.publisher.account_type,
                            url: message.reference,
                            description: `${message.publisher.account_type} is a platform for publishing financial posts.`,
                            logo: {
                                '@type': 'ImageObject',
                                url: seo.images.source,
                                width: 96,
                                height: 96,
                            },
                        },
                    }),
                }}
            />
        </>
    );
}
