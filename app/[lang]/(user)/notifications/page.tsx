import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';

import { isMobile } from 'react-device-detect';
import { ProductsNavigator } from '@/components/products-navigator';
import { Content } from '@/app/[lang]/(user)/notifications/components/content';
import { Metadata, ResolvingMetadata } from 'next';

type PageProps = {
    params: { lang: Locale };
};

export async function generateMetadata(
    { params: { lang } },
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const seoTitle = 'هشدارها | سهمتو';
    const seoDescription = '';

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

export default async function Notifications({ params: { lang } }: PageProps) {
    const dict = await getDictionary(lang);

    return (
        <main className="main">
            <div className="jumbotron">
                {!isMobile && <ProductsNavigator dict={dict} lang={lang} />}
                <div className="w-full">
                    <div className="relative z-40 flex flex-col items-center justify-start gap-8 overflow-hidden border-b border-b-gray-800/40 bg-white px-4 pt-4 md:rounded-t-lg">
                        <h1 className="pb-6 pt-4 text-xl font-bold">
                            هشدار‌ها
                        </h1>
                    </div>
                    <Content dict={dict} lang={lang} />
                </div>
            </div>
        </main>
    );
}
