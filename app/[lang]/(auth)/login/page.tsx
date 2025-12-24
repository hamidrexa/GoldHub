import { Metadata, ResolvingMetadata } from 'next';
import React from 'react';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Icons } from '@/components/ui/icons';
import { PhoneAuth } from '@/app/[lang]/(auth)/login/components/phone-auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Google } from '@/app/[lang]/(auth)/login/components/google';
import { getLinksLang } from '@/libs/utils';
import Link from 'next/link';

type Props = {
    params: { id: string; lang: Locale };
    searchParams: { [key: string]: string | string[] | undefined };
};

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function generateMetadata(
    { params: { lang } }: Props,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const seoTitle = dict.auth.loginPageSeoTitle;

    return {
        title: `${seoTitle}`,
        openGraph: {
            title: `${seoTitle}`,
        },
        alternates: {
            canonical: '',
        },
    };
}

export default async function AuthenticationPage({ params: { lang }, searchParams }) {
    const dict = await getDictionary(lang);
    const token = cookies().get('token')?.value;
    const redirectUrl = searchParams.redirect as string || `${getLinksLang(lang)}/profile`;

    if (token) {
        return redirect(redirectUrl);
    }

    return (
        <>
            <div className="relative flex h-[calc(100dvh)] flex-col justify-between p-2.5 md:!grid md:grid-cols-2 md:items-center">
                <div className="relative flex flex-col p-7 text-white md:h-full md:p-10">
                    <div
                        className="absolute inset-0 hidden rounded-lg bg-cover bg-center bg-no-repeat shadow-lg backdrop-blur-xl md:block"
                        style={{
                            backgroundImage: "url('login.png')",
                        }}
                    />
                    <Link
                        href={`${getLinksLang(lang)}/`}
                        className="relative z-20 flex items-center justify-center text-lg font-medium md:justify-start"
                    >
                        <Icons.logo className="h-9 fill-neutral-800 md:fill-white" />
                    </Link>
                    <div className="relative z-20 mt-auto hidden md:block">
                        {/*<blockquote className="space-y-2 text-white">*/}
                        {/*    <p className="text-lg">*/}
                        {/*        &ldquo;{dict.loginStaticUserComment}&rdquo;*/}
                        {/*    </p>*/}
                        {/*    <footer className="text-sm">*/}
                        {/*        {dict.loginStaticUser}*/}
                        {/*    </footer>*/}
                        {/*</blockquote>*/}
                    </div>
                </div>
                <div className="mt-20 flex h-full flex-col justify-between md:mt-0 md:p-8">
                    <div className="hidden md:block" />
                    <div className="relative mx-auto flex w-80 flex-col justify-center space-y-6 sm:w-[350px]">
                        {lang === 'en' ? (
                            <PhoneAuth dict={dict} lang={lang} redirectUrl={redirectUrl} />
                        ) : (
                            <>
                                <div className="flex flex-col space-y-2 text-center">
                                    <h1 className="text-2xl font-semibold tracking-tight">
                                        {dict.auth.loginRegister}
                                    </h1>
                                    <p className="text-sm">
                                        {dict.auth.loginHelper}
                                    </p>
                                </div>
                                <Google lang={lang} dict={dict} redirectUrl={redirectUrl} />
                            </>
                        )}
                    </div>
                    <div className="flex items-center justify-center gap-10 py-4 text-black">
                        <Link
                            href={`${getLinksLang(lang)}/about`}
                            className="text-center"
                        >
                            {dict.aboutUs}
                        </Link>
                        <Link
                            href={`${getLinksLang(lang)}/privacy`}
                            className="text-center"
                        >
                            {dict.rules}
                        </Link>
                        <Link
                            href={`${getLinksLang(lang)}/contact`}
                            className="text-center"
                        >
                            {dict.contactUs}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
