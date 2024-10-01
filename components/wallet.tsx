'use client';

import { Locale } from '@/i18n-config';
import React, { useState } from 'react';
import { Box, BoxContent, BoxTitle } from '@/components/box';
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
import { OpenOrders } from '@/app/[lang]/(user)/publisher/components/open-orders';
import { CloseOrders } from '@/app/[lang]/(user)/publisher/components/close-orders';
import { doExchange } from '@/app/[lang]/(user)/wallet/services/doExchange';
import { useGlobalContext } from '@/contexts/store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

type Props = {
    dict: any;
    lang: Locale;
};

export default function Wallet({ dict, lang }: Props) {
    const router = useRouter();
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
        <div className="flex flex-col gap-28">
            <Box>
                <BoxTitle>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <g
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                        >
                            <path d="M21.639 14.396H17.59a2.693 2.693 0 01-2.693-2.691 2.693 2.693 0 012.693-2.692h4.048" />
                            <path d="M18.049 11.643h-.312" />
                            <path
                                fillRule="evenodd"
                                d="M7.748 3h8.643a5.248 5.248 0 015.248 5.248v7.177a5.248 5.248 0 01-5.248 5.247H7.748A5.248 5.248 0 012.5 15.425V8.248A5.248 5.248 0 017.748 3z"
                                clipRule="evenodd"
                            />
                            <path d="M7.036 7.538h5.399" />
                        </g>
                    </svg>
                    کیف پول
                </BoxTitle>
                <BoxContent>
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
                                                wallet.balance.irt_balance
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
                                                src="https://cdn.sahmeto.com/media/cryptocurrencies/BTC/bitcoin.png"
                                                width={44}
                                                height={44}
                                                alt="irt"
                                            />
                                            <div className="text-base font-medium">
                                                BTC
                                                <div className="text-sm text-gray-700">
                                                    بیت کوین
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-base font-medium">
                                        {currency(
                                            parseFloat(
                                                wallet.balance.btc_amount
                                            ),
                                            'crypto',
                                            'fa'
                                        ).replace('$', '')}
                                        <div className="text-sm text-gray-700">
                                            ~{' '}
                                            {currency(
                                                parseFloat(
                                                    wallet.balance
                                                        .btc_balance_irt
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
                </BoxContent>
            </Box>
            <Box className="hidden">
                <BoxTitle>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        fill="none"
                        viewBox="0 0 22 22"
                    >
                        <g clipPath="url(#clip0_2694_13677)">
                            <path
                                fill="#0C0E3C"
                                d="M10.083 1.88v2.768a6.417 6.417 0 104.76 11.491l1.958 1.959a9.166 9.166 0 11-6.718-16.219zM20.12 11.916a9.119 9.119 0 01-2.023 4.884l-1.959-1.958a6.379 6.379 0 001.213-2.926h2.77zM11.918 1.879a9.17 9.17 0 018.204 8.204h-2.77a6.42 6.42 0 00-5.434-5.435v-2.77.001z"
                            ></path>
                        </g>
                        <defs>
                            <clipPath id="clip0_2694_13677">
                                <path fill="#fff" d="M0 0H22V22H0z"></path>
                            </clipPath>
                        </defs>
                    </svg>
                    دارایی ها
                </BoxTitle>
                <BoxContent>
                    <OpenOrders
                        id={wallet.primary_username}
                        dict={dict}
                        lang={lang}
                        publisher={{
                            publisher_type: 'crypto',
                        }}
                        market="crypto"
                    />
                </BoxContent>
            </Box>
            <Box className="hidden">
                <BoxTitle>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="#0C0E3C"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M16 22h2c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3"
                        ></path>
                        <path
                            stroke="#0C0E3C"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M14 2v6h6"
                        ></path>
                        <path
                            stroke="#0C0E3C"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 22a6 6 0 100-12 6 6 0 000 12z"
                        ></path>
                        <path
                            stroke="#0C0E3C"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9.5 17.5L8 16.25V14"
                        ></path>
                    </svg>
                    {dict.buyHistory}
                </BoxTitle>
                <BoxContent>
                    <CloseOrders
                        id={wallet.primary_username}
                        dict={dict}
                        lang={lang}
                        market="crypto"
                    />
                </BoxContent>
            </Box>
        </div>
    );
}
