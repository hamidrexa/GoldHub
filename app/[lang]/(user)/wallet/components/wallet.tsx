'use client';

import { Locale } from '@/i18n-config';
import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { currency } from '@/libs/utils';
import { useWalletInfo } from '@/app/[lang]/(user)/wallet/services/useWalletInfo';
import Spinner from '@/components/spinner';
import { doExchange } from '@/app/[lang]/(user)/wallet/services/doExchange';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { LoginModal } from '@/components/login-modal';
import { usePathname } from 'next/navigation';
import { useGlobalContext } from '@/contexts/store';
import WalletBox from './walletBox';

type Props = {
    dict: any;
    lang: Locale;
};

export default function Wallet({ dict, lang }: Props) {
    const { user } = useGlobalContext();
    const [isWalletLoading, setIsWalletLoading] = useState(false);
    const { wallet, isLoading, mutate } = useWalletInfo();
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const path = usePathname();

    const handleClick = async (type: 'buy' | 'sell') => {
        if (!user) return setOpenLoginModal(true);

        setIsWalletLoading(true);
        try {
            const { data } = await doExchange({ type });
            toast.success(data?.message);
        } catch (e) {
            toast.error(e?.error?.messages);
        }
        mutate();
        setIsWalletLoading(false);
    };

    return (
        <>
            <div className="flex flex-col gap-28 text-black">
                {isLoading ? (
                    <div className="flex min-h-40 items-center justify-center">
                        <Spinner />
                    </div>
                ) : (
                    <div>
                        <WalletBox
                            dict={dict}
                            lang={lang}
                        />
                    </div>
                )}
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
