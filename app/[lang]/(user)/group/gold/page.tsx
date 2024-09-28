import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { MessagesWrap } from '@/app/[lang]/(user)/group/components/messages-wrap';
import { isMobile } from 'react-device-detect';
import { ProductsNavigator } from '@/components/products-navigator';

type Props = {
    params: { id: string; lang: Locale };
    searchParams: { [key: string]: string | string[] | undefined };
};
type PageProps = {
    params: {
        id: string;
        lang: Locale;
    };
};

export async function generateMetadata(
    { params: { lang } }: Props,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const seoTitle = dict.feedPageTitleSeo;
    const seoDescription = '';

    return {
        title: seoTitle,
        description: seoDescription,
        openGraph: {
            title: seoTitle,
            description: seoDescription,
        },
        alternates: {
            canonical: '',
        },
    };
}

export default async function PublisherPage({
    params: { id, lang },
}: PageProps) {
    const dict = await getDictionary(lang);

    return (
        <main className="main">
            <div className="jumbotron">
                {!isMobile && <ProductsNavigator dict={dict} lang={lang} />}
                <div className="w-full">
                    <div className="relative z-40 mb-4 flex flex-col items-center justify-start gap-8 overflow-hidden bg-white px-4 pt-4 md:rounded-t-lg">
                        <h1 className="pb-6 pt-4 text-xl font-bold">
                            {dict.groupPageH1}
                        </h1>
                    </div>
                    <MessagesWrap dict={dict} lang={lang} />
                </div>
            </div>
        </main>
    );
}
