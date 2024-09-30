'use client';

import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import * as React from 'react';
import { loginWithGoogle } from '@/app/[lang]/(auth)/login/services/loginWithGoogle';
import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';
import { getLinksLang } from '@/libs/utils';

export function Google({ lang }) {
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('url') || '/';

    const login = async (credential: string) => {
        try {
            const { data, status } = await loginWithGoogle(lang, credential);
            Cookies.set('token', data.access, { expires: 7 });
            Cookies.set('token-refresh', data.refresh, { expires: 365 });
            if (status === 201)
                window.location.href = `${getLinksLang(lang)}/profile`;
            else window.location.href = redirectUrl;
        } catch (e) {
            toast.error(
                e?.error?.params?.detail ||
                    e?.error?.messages?.error?.[0] ||
                    e?.error?.params?.non_field_errors?.[0]
            );
        }
    };

    return (
        <div className="flex justify-center">
            <div className="h-10 w-80">
                <GoogleLogin
                    width={320}
                    theme="outline"
                    login_uri="/"
                    size="large"
                    logo_alignment="center"
                    locale={lang}
                    onSuccess={async (credentialResponse) => {
                        try {
                            login(credentialResponse.credential);
                        } catch (e) {
                            toast.error(e?.messages?.error || e?.status?.text);
                        }
                    }}
                    // @ts-ignore
                    onError={(e) => {
                        toast.error(e.error_description);
                    }}
                    type="standard"
                />
            </div>
        </div>
    );
}
