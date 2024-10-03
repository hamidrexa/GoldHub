'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import React from 'react';
import { PhoneAuth } from '@/app/[lang]/(auth)/login/components/phone-auth';
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
                className="w-full max-w-md gap-6 overflow-hidden pb-14 pt-12 text-sm text-black"
            >
                <PhoneAuth
                    lang={lang}
                    dict={dict}
                    redirectUrl={redirectUrl}
                    texts={texts}
                />
            </DialogContent>
        </Dialog>
    );
}
