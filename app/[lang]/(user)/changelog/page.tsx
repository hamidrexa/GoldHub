import { isMobile } from 'react-device-detect';
import { ProductsNavigator } from '@/components/products-navigator';
import React from 'react';
import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import { configureServerSideGrowthBook } from '@/app/growthbookServer';

export const metadata: Metadata = {
    title: 'تغییرات | سهمتو',
    description: '',
};

export const revalidate = 86400;

export default async function ChangelogPage({ params: { lang } }) {
    const dict = await getDictionary(lang);
    const gb = await configureServerSideGrowthBook();
    const changelog = gb.getFeatureValue('changelog', []);

    return (
        <main className="main">
            <div className="jumbotron">
                {!isMobile && <ProductsNavigator dict={dict} lang={lang} />}
                <div className="w-full">
                    <h1 className="mb-6 text-center text-3xl font-bold md:mb-20">
                        تغییرات
                    </h1>
                    <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                        {changelog.map((log) => (
                            <section key={log.version} className="md:flex">
                                <h2 className="pr-7 text-sm leading-6 text-slate-500 md:w-1/4 md:pl-12 md:pr-0 md:text-left">
                                    <a href={`#${log.release_date}`}>
                                        {log.release_date}
                                    </a>
                                </h2>
                                <div className="relative pb-10 pr-7 pt-2 md:w-3/4 md:pr-12 md:pt-0">
                                    <div className="absolute -top-3 bottom-0 right-0 w-px bg-slate-200 md:top-2.5" />
                                    <div className="absolute -right-1 -top-[1.0625rem] h-[0.5625rem] w-[0.5625rem] rounded-full border-2 border-neutral-300 bg-white md:top-[0.4375rem]" />
                                    <div className="max-w-none text-neutral-800 [&>a]:font-semibold [&>a]:text-blue-400 hover:[&>a]:text-blue-500 [&>h3]:mb-4 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:leading-6 [&>p]:mb-2">
                                        <h3>ورژن {log.version} سهمتو</h3>
                                        {log.features.map((feature, index) => (
                                            <p key={index}>{feature}</p>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
