'use client';

import React, { useEffect } from 'react';
import { Header } from '@/components/header';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Footer } from '@/components/footer';
import faJson from '@/dictionaries/fa.json';
import * as Sentry from '@sentry/nextjs';
import { getLinksLang } from '@/libs/utils';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const lang = 'fa';
    const dict = faJson;

    useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    return (
        <>
            <Header dict={dict} lang={lang} />
            <div className="flex h-[calc(100vh-250px)] w-full flex-col items-center justify-center gap-6 text-center text-neutral-800">
                <h1 className="w-full text-9xl font-black leading-[0.6]">
                    500
                </h1>
                <div>
                    <h2 className="text-4xl font-bold leading-none">
                        مشکلی پیش آمده!
                    </h2>
                    <p className="mt-4 w-full text-xl leading-none">
                        لطفا چند دقیقه دیگر مجدد تلاش کنید.
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
