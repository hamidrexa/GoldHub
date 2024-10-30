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
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LoginModal } from '@/components/login-modal';
import { usePathname } from 'next/navigation';
import { useGlobalContext } from '@/contexts/store';

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
                    <Table className="rounded-md bg-white shadow-box">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-40">نماد</TableHead>
                                <TableHead className="min-w-40">
                                    ارزش تقریبی دارایی ها
                                </TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src="/img/irt.png"
                                            width={44}
                                            height={44}
                                            alt="irt"
                                        />
                                        <div className="text-base font-medium">
                                            IRT
                                            <div className="text-sm text-gray-700">
                                                تومان
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-base font-medium">
                                    {currency(
                                        parseFloat(wallet.balance?.irt_balance),
                                        'tse',
                                        'fa'
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-end gap-2">
                                        <Dialog>
                                            <DialogTrigger className="h-10 px-5 text-sm rounded-md font-medium min-w-20 bg-red-500 text-white hover:bg-red-600">
                                                برداشت
                                            </DialogTrigger>
                                            <DialogContent className="max-w-xl text-center">
                                                <DialogTitle/>
                                                برای برداشت به پشتیبانی تلگرام
                                                طلانو با آیدی
                                                <a
                                                    href="https://t.me/SahmetoSup"
                                                    className="block font-black"
                                                >
                                                    https://t.me/SahmetoSup
                                                </a>
                                                پیام دهید.
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src="/gold.svg"
                                            className="rounded-full"
                                            width={44}
                                            height={44}
                                            alt="gold"
                                        />
                                        <div className="text-base font-medium">
                                            GOLD
                                            <div className="text-sm text-gray-700">
                                                طلا
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-base font-medium">
                                    {currency(
                                        parseFloat(wallet.balance?.gold_amount),
                                        'crypto',
                                        'fa'
                                    ).replace('$', '')}
                                    <div className="text-sm text-gray-700">
                                        ~{' '}
                                        {currency(
                                            parseFloat(
                                                wallet.balance?.gold_balance_irt
                                            ),
                                            'tse',
                                            'fa'
                                        )}
                                        تومان
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            className="min-w-20"
                                            variant="success"
                                            onClick={() => handleClick('buy')}
                                        >
                                            {isWalletLoading ? (
                                                <Spinner
                                                    width={24}
                                                    height={24}
                                                />
                                            ) : (
                                                'خرید'
                                            )}
                                        </Button>
                                        <Button
                                            className="min-w-20"
                                            variant="destructive"
                                            onClick={() => handleClick('sell')}
                                        >
                                            {isWalletLoading ? (
                                                <Spinner
                                                    width={24}
                                                    height={24}
                                                />
                                            ) : (
                                                'فروش'
                                            )}
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
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
