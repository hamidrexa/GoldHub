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
    const seoTitle = dict.aboutUsTitle || dict.aboutPage?.title || 'About Us';
    const seoDescription =
        dict.aboutPage?.mission?.description ||
        'Learn more about GoldHub, our mission, values, and the team dedicated to bridging the gap between traditional craftsmanship and modern digital commerce.';

    return {
        title: `${seoTitle}`,
        description: seoDescription,
        openGraph: {
            title: `${seoTitle}`,
            description: seoDescription,
        },
        alternates: {
            canonical: `/${lang}/about`,
        },
    };
}

export default async function AboutUs({ params: { lang } }: Props) {
    const dict = await getDictionary(lang);
    const aboutDict = dict.aboutPage;

    const valueEntries = Object.entries(aboutDict?.values ?? {});
    const statsEntries = Object.entries(aboutDict?.stats ?? {});
    const ctaEntries = Object.entries(aboutDict?.cta ?? {});

    return (
        <div className="flex flex-col items-center justify-center bg-white text-neutral-800">
            <div className="relative w-full">
                <div className="absolute inset-0 z-10 bg-black/50" />
                <img
                    className="h-[400px] w-full object-cover md:h-[500px]"
                    alt="GoldHub hero background"
                    src="/img/HeroAbout.png"
                />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 px-6 text-center text-white">
                    <p className="text-base font-semibold uppercase tracking-[0.3em] md:text-lg">
                        {aboutDict?.subtitle}
                    </p>
                    <h1 className="max-w-3xl text-4xl font-black leading-tight shadow-black drop-shadow-lg md:text-6xl">
                        {aboutDict?.title}
                    </h1>
                    <p className="max-w-2xl text-lg font-medium leading-8 drop-shadow-md md:text-xl">
                        {aboutDict?.mission?.description}
                    </p>
                </div>
            </div>

            <div className="mx-6 my-16 flex max-w-6xl flex-col gap-12 md:mx-auto lg:my-24">
                <section className="flex flex-col items-center gap-6 text-center">
                    <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
                        {aboutDict?.mission?.title}
                    </span>
                    <p className="max-w-3xl text-lg leading-8 text-neutral-700">
                        {aboutDict?.mission?.description}
                    </p>
                </section>

                <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {valueEntries.map(([key, value]) => (
                        <div
                            key={key}
                            className="group flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-white p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                        >
                            <div className="flex h-16 w-16 items-center justify-center self-center rounded-full bg-amber-50 text-amber-500">
                                <span className="text-2xl font-bold">✦</span>
                            </div>
                            <h3 className="text-xl font-black text-neutral-900">{value.title}</h3>
                            <p className="text-base leading-7 text-neutral-500">{value.description}</p>
                        </div>
                    ))}
                </section>

                <section className="grid grid-cols-1 gap-6 rounded-3xl bg-neutral-50 p-8 md:grid-cols-3">
                    {statsEntries.map(([key, label]) => (
                        <div
                            key={key}
                            className="flex flex-col items-center gap-2 rounded-2xl border border-neutral-100 bg-white p-6 text-center shadow-sm"
                        >
                            <span className="text-2xl font-black text-amber-500">•</span>
                            <p className="text-lg font-semibold text-neutral-800">{label}</p>
                        </div>
                    ))}
                </section>

                <section className="flex flex-col items-center gap-4 text-center">
                    <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">{aboutDict?.subtitle}</p>
                    <h2 className="text-3xl font-black text-neutral-900 md:text-4xl">{aboutDict?.title}</h2>
                    <div className="mt-6 flex flex-wrap justify-center gap-4">
                        {ctaEntries.map(([key, label]) => (
                            <button
                                key={key}
                                className="rounded-full border border-neutral-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white"
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
