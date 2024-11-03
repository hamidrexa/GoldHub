'use client';

import { Locale } from '@/i18n-config';
import { cn, currency, getDirection } from '@/libs/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';


type Props = {
    dict: any;
    lang: Locale;
    className?: string
};

export default function TransactionBox({
    dict,
    lang,
    className
}: Props) {
    const [transactionMode, setTransactionMode] = useState('buy');
    const [checked, setChecked] = useState(true)
    return (
        <div className='flex w-full justify-center py-12'>
            <div
                className={cn(
                    'relative flex w-full md:max-w-2xl flex-col gap-8 rounded-md md:border border-gray-400 bg-white px-4 py-6 text-black',
                    className
                )}
            >
                <div className='flex flex-row justify-between items-center'>
                    <div className='flex flex-row gap-[10px]'>
                        <Icons.lineChart stroke="#0C0E3C" />
                        <h2>
                            معامله
                        </h2>
                    </div>
                    <div className='cursor-pointer'>
                        <Icons.question />
                    </div>
                </div>
                <div className='flex flex-row w-full justify-center'>
                    <RadioGroup
                        value={transactionMode}
                        onValueChange={setTransactionMode}
                        dir={getDirection(lang)}
                        className="flex w-full gap-[0px] items-center border p-1 rounded-lg border-gray-400 w-[70%] max-w-[400px]"
                    >
                        <div className="w-[50%] overflow-hidden w-auto">
                            <RadioGroupItem
                                value={'buy'}
                                id={'buy'}
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor={'buy'}
                                className="flex w-full cursor-pointer text-nowrap flex-col items-center justify-between rounded-md border-transparent bg-transparent px-1 py-2  peer-data-[state=checked]:bg-[#CA8A04] peer-data-[state=checked]:font-black peer-data-[state=checked]:text-white [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-[#CA8A04] [&:has([data-state=checked])]:font-black"
                            >
                                خرید
                            </Label>
                        </div>
                        <div className="w-[50%] overflow-hidden w-auto">
                            <RadioGroupItem
                                value={'sell'}
                                id={'sell'}
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor={'sell'}
                                className="flex w-full cursor-pointer text-nowrap flex-col items-center justify-between rounded-md border-transparent bg-transparent px-1 py-2  peer-data-[state=checked]:bg-[#CA8A04] peer-data-[state=checked]:font-black peer-data-[state=checked]:text-white [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-[#CA8A04] [&:has([data-state=checked])]:font-black"
                            >
                                فروش
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
                <div className={`flex w-full gap-8 ${transactionMode === 'sell' ? 'flex-col-reverse' : ' flex-col'}`}>
                    <div className="flex w-full flex-col justify-center gap-2.5  md:items-center">
                        <div className="flex w-full flex-col gap-[12px]">
                            <div className='w-full flex flex-row justify-between'>
                                <Label
                                    className="flex"
                                >
                                    مبلغ پرداختی به ریال
                                </Label>
                                <Label
                                    className="flex text-[green]"
                                >
                                </Label>
                            </div>
                            <Input
                                type={'text'}
                                className="w-full "
                                placeholder="از 100 هزار تومان تا 100 میلیون تومان"
                            />
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-[12px]">
                        <div className='w-full flex flex-row justify-between'>
                            <Label
                                className="flex"
                            >
                                مقدار طلا
                            </Label>
                        </div>
                        <Input
                            type={'text'}
                            className="w-full "
                            placeholder="مقدار طلا به میلی گرم"
                        />
                    </div>
                </div>
                <div className="flex w-full flex-col gap-[12px]">
                    <div className='flex flex-row gap-3 items-center'>
                        <Icons.minusSquare stroke='#000' />
                        <Label>
                            قیمت لحظه ای
                        </Label>
                    </div>
                    <div className='flex w-full justify-center '>
                        {`${currency(1, 'tse', lang)} گرم طلا`} = {`${currency(45184158, 'tse', lang)} تومان`}
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-3 ">
                    <div className=' flex w-full  gap-[4px] items-center	'>
                        {/* <Icons.info stroke='#000' /> */}
                        <div className='text-[#5A5C83]'>
                            برای مبالغ زیر 1 میلیون تومان کارمزد 0.01 درصد می باشد
                        </div>
                    </div>
                </div>
                <div>
                    <div className='flex flex-row items-center justify-between'>
                        <Label className='font-black'>
                            کارمزد
                        </Label>
                        <div className='flex flex-row items-center gap-2 text-[#5A5C83] font-black'>
                            {currency(2450, 'tse', lang)} تومان <Icons.info stroke='#2228A9' />
                        </div>
                    </div>
                </div>
                <div>
                    <div className='flex flex-row items-center justify-between'>
                        <Label className='font-black'>
                            خرید دوره ای طلا
                        </Label>
                        <div className='flex flex-row items-center gap-2 text-[#5A5C83] font-black'>
                            <Switch
                                color='#0C0E3C'
                                className='text-[#0C0E3C]'
                                checked={checked}
                                onCheckedChange={(value) => {
                                    setChecked(value)
                                }}

                            />
                        </div>
                    </div>
                </div>
                <Button>
                    ادامه
                </Button>
            </div >
        </div>
    );
}
