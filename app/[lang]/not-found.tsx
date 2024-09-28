import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import React from 'react';
import { getDictionary } from '@/get-dictionary';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { getLinksLang } from '@/libs/utils';

export default async function NotFound() {
    const lang = 'fa';
    const dict = await getDictionary('fa');

    return (
        <>
            <Header dict={dict} lang={lang} />
            <div className="flex h-[calc(100vh-250px)] w-full flex-col items-center justify-center gap-6 text-center text-neutral-800">
                <h1 className="w-full text-9xl font-black leading-[0.6]">
                    404
                </h1>
                <div>
                    <h2 className="text-4xl font-bold leading-none">
                        گم شدید!
                    </h2>
                    <p className="mt-4 w-full text-xl leading-none">
                        صفحه مورد نظر شما پیدا نشد!
                    </p>
                </div>
                <Link
                    href={`${getLinksLang(lang)}/`}
                    className={buttonVariants()}
                >
                    بازگشت به صفحه اصلی
                </Link>
            </div>
            <Footer dict={dict} lang={lang} />
        </>
    );
}
