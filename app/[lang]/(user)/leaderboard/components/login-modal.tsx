'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import React from 'react';
import { PhoneAuth } from '@/app/[lang]/(auth)/user/login/components/phone-auth';
import Image from 'next/image';
import { Locale } from '@/i18n-config';

export function LoginModal({
    dict,
    lang,
    texts,
    open,
    setOpen,
    redirectUrl,
    closeable = true,
}: {
    dict: any;
    lang: Locale;
    texts: any;
    open: any;
    redirectUrl?: string;
    setOpen?: any;
    closeable?: boolean;
}) {
    return (
        <Dialog open={open} onOpenChange={setOpen || undefined}>
            <DialogContent
                closeable={closeable}
                className="w-full max-w-md gap-6 overflow-hidden pb-14 pt-12 text-sm text-neutral-800"
            >
                <PhoneAuth
                    lang={lang}
                    dict={dict}
                    redirectUrl={redirectUrl}
                    texts={texts}
                />
                <Image
                    className="absolute bottom-0 left-0 right-0 w-full"
                    src="/img/gift.png"
                    width={375}
                    height={35}
                    alt="gift"
                />
            </DialogContent>
        </Dialog>
    );
}
