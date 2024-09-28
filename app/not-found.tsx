'use client';

import React, { useEffect } from 'react';
import { Header } from '@/components/header';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Footer } from '@/components/footer';
import faJson from '@/dictionaries/fa.json';
import Error from 'next/error';
import * as Sentry from '@sentry/nextjs';
import { Providers } from '@/app/[lang]/providers';
import { getLinksLang } from '@/libs/utils';

export default function NotFoundError({
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
        <html>
            <body>
                <Providers>
                    <Header dict={dict} lang={lang} googleLogin={false} />
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
                </Providers>
            </body>
        </html>
    );
}
