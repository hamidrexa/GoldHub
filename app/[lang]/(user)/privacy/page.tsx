import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';

type Props = {
    params: { lang: Locale };
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
    { params: { lang } }: Props,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const seoTitle = dict.privacyPage?.title || dict.rules || 'Privacy Policy';
    const seoDescription =
        dict.privacyPage?.intro ||
        'Read the GoldHub privacy policy to understand how we collect, use, and protect your personal information.';

    return {
        title: `${seoTitle}`,
        description: seoDescription,
        openGraph: {
            title: `${seoTitle}`,
            description: seoDescription,
        },
        alternates: {
            canonical: `/${lang}/privacy`,
        },
    };
}

export default async function PrivacyPage({ params: { lang } }: Props) {
    const dict = await getDictionary(lang);
    const privacy = dict.privacyPage;
    const sectionsOrder = ['collection', 'usage', 'sharing', 'security', 'rights'] as const;

    return (
        <div className="mx-auto my-12 flex max-w-4xl flex-col gap-8 px-6 text-neutral-800 md:px-0">
            <header className="border-b border-slate-300 pb-6 text-center md:text-left">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
                    {privacy?.title}
                </p>
                <h1 className="mt-3 text-3xl font-black md:text-4xl">{privacy?.title}</h1>
                <p className="mt-1 text-sm text-neutral-500">
                    {privacy?.lastUpdated}
                </p>
            </header>

            <section className="rounded-3xl bg-neutral-50 p-6 text-base leading-7 text-neutral-700 md:p-8">
                {privacy?.intro}
            </section>

            <div className="flex flex-col gap-10">
                {sectionsOrder.map((key) => {
                    const section = privacy?.sections?.[key];
                    if (!section) return null;
                    return (
                        <article key={key} className="space-y-3">
                            <h2 className="text-2xl font-black text-neutral-900">{section.title}</h2>
                            <p className="text-lg leading-8 text-neutral-600">{section.content}</p>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}
