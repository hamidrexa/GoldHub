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
import { useGlobalContext } from '@/contexts/store';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

type Props = {
    dict: any;
    lang: Locale;
};

export default function Wallet({ dict, lang }: Props) {
    const { user } = useGlobalContext();
    const [isWalletLoading, setIsWalletLoading] = useState(false);
    const { wallet, isLoading, mutate } = useWalletInfo();

    const handleClick = async (type: 'buy' | 'sell') => {
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

    if (!user) return null;

    return (
        <section className="w-full px-4 py-12 text-neutral-800 md:py-32">
            <div className="mx-auto w-full max-w-7xl">
                <h2 className="mb-6 flex items-center justify-center gap-1 text-center text-2xl font-black text-black md:mb-12 md:text-4xl">
                    دارایی های شما
                </h2>
                <div className="flex flex-col gap-28 text-black">
                    {isLoading ? (
                        <div className="flex min-h-40 items-center justify-center">
                            <Spinner />
                        </div>
                    ) : (
                        <Table className="rounded-md bg-white shadow-box">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-40">
                                        نماد
                                    </TableHead>
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
                                            parseFloat(
                                                wallet.balance?.irt_balance
                                            ),
                                            'tse',
                                            'fa'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-2">
                                            <Dialog>
                                                <DialogTrigger>
                                                    <Button
                                                        className="min-w-20"
                                                        variant="destructive"
                                                    >
                                                        برداشت
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-xl text-center">
                                                    برای برداشت به پشتیبانی
                                                    تلگرام طلامی با آیدی
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
                                            parseFloat(
                                                wallet.balance?.gold_amount
                                            ),
                                            'crypto',
                                            'fa'
                                        ).replace('$', '')}
                                        <div className="text-sm text-gray-700">
                                            ~{' '}
                                            {currency(
                                                parseFloat(
                                                    wallet.balance
                                                        ?.gold_balance_irt
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
                                                onClick={() =>
                                                    handleClick('buy')
                                                }
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
                                                onClick={() =>
                                                    handleClick('sell')
                                                }
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
            </div>
        </section>
    );
}
