'use client';

import { Locale } from '@/i18n-config';
import React, { useState } from 'react';
import { LoginModal } from '@/components/login-modal';
import { usePathname } from 'next/navigation';
import WalletBox from './walletBox';

type Props = {
    dict: any;
    lang: Locale;
};

export default function Wallet({ dict, lang }: Props) {
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const path = usePathname();

    return (
        <>
            <div className="flex flex-col gap-28 text-black">
                    <div>
                        <WalletBox
                            dict={dict}
                            lang={lang}
                        />
                    </div>
            </div>
            <LoginModal
                lang={lang}
                dict={dict}
                texts={{
                    title: <>برای خرید از طلانو ثبت نام کنید.</>,
                    description:
                        'با ثبت نام در طلامی، بی نهایت سرمایه گذاری کن.',
                    button: 'شروع سرمایه گذاری',
                    buttonVariant: 'default',
                    inputLabel: 'شماره تلفن همراه',
                }}
                open={openLoginModal}
                setOpen={setOpenLoginModal}
                redirectUrl={path}
            />
        </>
    );
}
