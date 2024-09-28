import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import LeaderboardPage from '@/app/[lang]/(user)/leaderboard/components/leaderboard-page';
import { isMobile } from 'react-device-detect';
import { ProductsNavigator } from '@/components/products-navigator';
import { getTopPublishers } from '@/app/[lang]/(user)/leaderboard/services/getTopPublishers';
import { transformPublishersData } from '@/libs/dataTransformers';
import AnnouncementAlert from '@/components/announcement-alert';
import { Disclaimer } from '@/components/disclaimer';
import { ProfitSimulation } from '@/app/[lang]/(user)/leaderboard/components/profit-simulation';

type Props = {
    params: { id: string; lang: Locale };
    searchParams: { [key: string]: string | string[] | undefined };
};
type PageProps = {
    params: { id: string; lang: Locale };
};

export async function generateMetadata(
    { params: { lang } }: Props,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const seoTitle = dict.leaderboardPageTitleSeo;
    const seoDescription = dict.leaderboardPageDescriptionSeo;

    return {
        title: seoTitle,
        description: seoDescription,
        openGraph: {
            title: seoTitle,
            description: seoDescription,
        },
        alternates: {
            canonical: 'https://sahmeto.com/leaderboard',
        },
    };
}

export const revalidate = 3600;

export default async function LeaderboardPages({
    params: { id, lang },
}: PageProps) {
    const dict = await getDictionary(lang);
    const publishers = transformPublishersData(
        await getTopPublishers({
            type: 'signal',
            limit: 100,
            ...(process.env.NEXT_PUBLIC_ENVIRONMENT === 'BETA' && {
                formula_id: 117,
            }),
        })
    );

    return (
        <>
            <AnnouncementAlert dict={dict} lang={lang} page="leaderboard" />
            <main className="main">
                <div className="jumbotron">
                    {!isMobile && <ProductsNavigator dict={dict} lang={lang} />}
                    <div className="w-full">
                        <h1 className="mb-1 mt-6 text-center text-2xl font-black md:mt-0">
                            {dict.topPublishers}
                        </h1>
                        <h2 className="mb-5 text-center text-lg">
                            با دنبال کردن برترین تریدرها، روی بهترین فرصت‌ها
                            سرمایه‌گذاری کنید.
                        </h2>
                        <ProfitSimulation dict={dict} lang={lang} />
                        <LeaderboardPage
                            purePublishers={publishers}
                            dict={dict}
                            lang={lang}
                        />
                        <Disclaimer className="mt-5" />
                    </div>
                    {/*<div className="hidden h-[245px] w-[245px] min-w-[245px] md:block">*/}
                    {/*    <a*/}
                    {/*        href="https://in.firouzeh.com/moj_sahmeto_sb"*/}
                    {/*        className="block overflow-hidden rounded-md"*/}
                    {/*    >*/}
                    {/*        <img*/}
                    {/*            className="h-full w-full object-cover"*/}
                    {/*            src="/firouzeh.jpg"*/}
                    {/*            alt="firouzeh"*/}
                    {/*        />*/}
                    {/*    </a>*/}
                    {/*</div>*/}
                </div>
            </main>
        </>
    );
}
