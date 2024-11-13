'use client';

import { Locale } from '@/i18n-config';
import { cn, currency, roundNumber } from '@/libs/utils';
import React, { useEffect, useState } from 'react';
import { Icons } from '@/components/ui/icons';
import 'swiper/css';
import { useWalletInfo } from '../../wallet/services/useWalletInfo';
import { PieChart } from '@/components/pie-chart';
import { LinkBox } from '@/components/link-box';
import CardHeader from '@/components/card-header';
import { useTransactionHistory } from '../services/useTransactionHistory';
import dayjs from 'dayjs';
import jalaliday from 'jalaliday';
import HistoryItem from './historyItem';
import { useExchangePrice } from '@/services/useExchangePrice';

dayjs.extend(jalaliday);

type Props = {
    dict: any;
    lang: Locale;
    className?: string;
};

export default function WalletBox({ dict, lang, className }: Props) {
    // ** Hooks
    const { wallet, isLoading } = useWalletInfo();
    const {
        price,
        isLoading: priceIsLoading,
        isValidating,
    } = useExchangePrice();
    const { transactions, isLoading: transactionLoading } =
        useTransactionHistory();
    const [selectedFilter, setSelectedFilter] = useState<any>('all');
    const [percentages, setPercentages] = useState({
        goldBalanceIrtPercentage: 0,
        irtBalancePercentage: 0,
    });

    function calculatePercentage(goldBalanceIrt, irtBalance) {
        const goldBalanceIrtNumber = parseFloat(goldBalanceIrt);
        const irtBalanceNumber = parseFloat(irtBalance);

        const totalBalance = goldBalanceIrtNumber + irtBalanceNumber;

        if (totalBalance === 0) {
            return {
                goldBalanceIrtPercentage: 0,
                irtBalancePercentage: 0,
            };
        }

        const goldBalanceIrtPercentage =
            (goldBalanceIrtNumber / totalBalance) * 100;
        const irtBalancePercentage = (irtBalanceNumber / totalBalance) * 100;

        return {
            goldBalanceIrtPercentage: Number(
                goldBalanceIrtPercentage.toFixed(0)
            ),
            irtBalancePercentage: Number(irtBalancePercentage.toFixed(0)),
        };
    }

    useEffect(() => {
        if ((wallet?.balance?.gold_balance_irt, wallet?.balance?.irt_balance)) {
            const result = calculatePercentage(
                wallet?.balance?.gold_balance_irt,
                wallet?.balance?.irt_balance
            );
            setPercentages(result);
        }
    }, [wallet]);

    return (
        <div className="flex w-full flex-col items-center justify-center gap-10">
            <div
                className={cn(
                    'relative flex w-full flex-col gap-8 rounded-md border-gray-400 bg-white px-4 text-black md:max-w-2xl md:border md:p-12',
                    className,
                    isLoading && 'blur-md'
                )}
            >
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-[10px]">
                        <Icons.barChart3 stroke="#0C0E3C" />
                        <h2 className="text-[22px] font-bold">دارایی</h2>
                    </div>
                    <div className="cursor-pointer">
                        <Icons.question />
                    </div>
                </div>
                <div className="relative ">
                    <PieChart
                        mainPercantage={percentages?.goldBalanceIrtPercentage}
                        // className="blur-md"
                        width="100%"
                        height={160}
                        data={[
                            {
                                name: 'تومان',
                                count: 2,
                                value: percentages.irtBalancePercentage,
                            },
                            {
                                name: 'طلا',
                                count: 2,
                                value: percentages?.goldBalanceIrtPercentage,
                            },
                        ]}
                        colors={['#84859C', '#0FB6A3']}
                        dataKey="value"
                    />
                </div>
                <div className={`flex w-full flex-col`}>
                    <div className="flex min-h-[40px] flex-col rounded-lg border bg-[#F8F9FA]">
                        <div className="flex flex-row justify-between p-4">
                            <div className="flex flex-col items-start justify-start gap-3">
                                <div className="flex flex-row items-center justify-center gap-2">
                                    <div className="flex h-[20px] w-[20px] rounded bg-[#0FB6A3]" />
                                    <text className="whitespace-nowrap text-base font-black text-[#0FB6A3]">
                                        طلا
                                    </text>
                                </div>
                                <div className="flex gap-1">
                                    <span className="font-black">
                                        {currency(
                                            Number(
                                                wallet?.balance?.gold_amount
                                            ),
                                            'tse',
                                            lang
                                        )}
                                    </span>
                                    <span>گرم</span>
                                </div>
                                <text className="whitespace-nowrap text-base text-neutral-200 ">
                                    مجموع: معادل{' '}
                                    {currency(
                                        roundNumber(
                                            Number(
                                                wallet?.balance?.gold_amount
                                            ) *
                                                Number(price?.sell_price_irt) +
                                                Number(
                                                    wallet?.balance?.irt_balance
                                                ),
                                            0
                                        ),
                                        'tse',
                                        lang
                                    )}{' '}
                                    تومان
                                </text>
                            </div>
                            <div className="flex flex-col items-end justify-start gap-3">
                                <div className="flex flex-row items-center justify-center gap-2">
                                    <div className="whitespace-nowrap text-base font-black text-neutral-200">
                                        تومان
                                    </div>
                                    <div className="flex h-[20px] w-[20px] rounded bg-[#84859C]" />
                                </div>
                                <div className="flex gap-1">
                                    <span className="font-black">
                                        {currency(
                                            Number(
                                                wallet?.balance?.irt_balance
                                            ),
                                            'tse',
                                            lang
                                        )}
                                    </span>
                                    <span>تومان</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex w-full flex-col gap-[12px]">
                    <LinkBox
                        href="/transaction"
                        icon={<Icons.plus />}
                        title="خرید طلا"
                    />
                    <LinkBox
                        href="/transaction?type=sell"
                        icon={<Icons.plus />}
                        title="تبدیل موجودی به طلا"
                    />
                </div>
            </div>
            <div
                className={`relative flex w-full flex-col gap-8 rounded-md border-gray-400 bg-white px-4 text-black md:max-w-2xl md:border md:p-12 ${transactionLoading && 'blur-md'}`}
            >
                <CardHeader headerTitle="تاریخچه معاملات" />
                <div className="flex w-full">
                    {/* <div className='flex flex-row w-full justify-between'>
                        <div className='flex items-center gap-2'>
                            <Icons.setting stroke='black' />
                            <span className='text-[14px]'>
                                فیلتر
                            </span>
                        </div>
                        <div>
                            <RadioGroup
                                value={selectedFilter}
                                onValueChange={(e) => {
                                    setSelectedFilter(e)
                                }}
                                dir={getDirection(lang)}
                                className="flex w-full gap-[18px] items-center border p-1 rounded-lg border-gray-400 w-[70%] max-w-[400px]"
                            >
                                <div className="overflow-hidden w-full">
                                    <RadioGroupItem
                                        value={'all'}
                                        id={'all'}
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor={'all'}
                                        className="flex w-full cursor-pointer text-[14px] text-nowrap flex-col items-center justify-between rounded-md  bg-transparent px-6 py-2  peer-data-[state=checked]:bg-[#F8F9FA] peer-data-[state=checked]:border peer-data-[state=checked]:text-black [&:has([data-state=checked])]:border-[#E2E6E9] [&:has([data-state=checked])]:bg-[#F8F9FA] "
                                    >
                                        همه
                                    </Label>
                                </div>
                                <div className="overflow-hidden w-full">
                                    <RadioGroupItem
                                        value={'gold'}
                                        id={'gold'}
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor={'gold'}
                                        className="flex w-full cursor-pointer text-[14px] text-nowrap flex-col items-center justify-between rounded-md  bg-transparent px-6 py-2  peer-data-[state=checked]:bg-[#F8F9FA] peer-data-[state=checked]:border peer-data-[state=checked]:text-black [&:has([data-state=checked])]:border-[#E2E6E9] [&:has([data-state=checked])]:bg-[#F8F9FA] "
                                    >
                                        طلا
                                    </Label>
                                </div>
                                <div className="overflow-hidden w-full">
                                    <RadioGroupItem
                                        value={'toman'}
                                        id={'toman'}
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor={'toman'}
                                        className="flex w-full cursor-pointer text-[14px] text-nowrap flex-col items-center justify-between rounded-md  bg-transparent px-6 py-2  peer-data-[state=checked]:bg-[#F8F9FA] peer-data-[state=checked]:border peer-data-[state=checked]:text-black [&:has([data-state=checked])]:border-[#E2E6E9] [&:has([data-state=checked])]:bg-[#F8F9FA] "
                                    >
                                        تومان
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div> */}
                </div>
                <div className="flex w-full justify-between">
                    <h5 className="text-[16px] text-neutral-200">نوع معامله</h5>
                    <h5 className="text-[16px] text-neutral-200">
                        مقدار معامله
                    </h5>
                </div>
                {transactions?.map((item) => {
                    return HistoryItem({ item, lang });
                })}
            </div>
        </div>
    );
}
