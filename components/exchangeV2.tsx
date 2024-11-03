'use client';

import { Locale } from '@/i18n-config';
import { cn, currency, getDirection } from '@/libs/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Spinner from './spinner';

type IdsYpe = {
    value: any,
    title: string,
    key: string
}
type Props = {
    dict: any;
    lang: Locale;
    className?: string;
    ids: IdsYpe[];
    headerIcon?: any,
    headerTitle: string,
    yourInventory?: number,
    goldValue?: number,
    loading?: boolean
};

export default function ExchangeV2({
    dict,
    lang,
    className,
    ids,
    headerTitle,
    headerIcon,
    yourInventory,
    goldValue,
    loading
}: Props) {
    const [equivalent, setEquivalent] = useState(null);
    const [irr, setIrr] = useState<number>(null)
    const [gerams, setGrams] = useState<number>(null)

    const geramsToRial = (value: number) => {
        const resIRR = (value) * (goldValue * 10) / 1000
        setIrr(resIRR)
    }

    const rialToGerams = (value: number) => {
        const resIRR = (value) / (goldValue * 10) * 1000
        setGrams(resIRR)
    }

    return (
        <>
            <div
                className={cn(
                    'relative flex flex-col gap-8 rounded-md border border-gray-400 bg-white px-4 py-6 text-black',
                    className
                )}
            >
                {loading && <div className="absolute inset-0 flex items-center justify-center">
                    <div className="z-100000 absolute inset-0 bg-white opacity-50 z-10"></div>
                    <Spinner className='z-20' />
                </div>}
                <div className='flex flex-row justify-between items-center'>
                    <div className='flex flex-row gap-[10px]'>
                        {headerIcon ? headerIcon : <Icons.lineChart stroke="#0C0E3C" />}
                        {headerTitle ? headerTitle : 'خرید و فروش طلا از طلانو'}
                    </div>
                    <div className='cursor-pointer'>
                        <Icons.question />
                    </div>
                </div>
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
                                {dict.yourInventory}: {currency(yourInventory, 'tse', lang)} {dict.toman}
                            </Label>
                        </div>
                        <Input
                            type={'number'}
                            className="w-full "
                            placeholder="از 100 هزار تومان تا 100 میلیون تومان"
                            value={irr}
                            onChange={(e) => {
                                setIrr(Number(e.target.value))
                                rialToGerams(Number(e.target.value))
                            }}
                        />
                    </div>
                    <div className='flex flex-row w-full'>
                        <RadioGroup
                            value={equivalent}
                            onValueChange={(e) => {
                                setEquivalent(e)
                                rialToGerams(Number(e)*10)
                                setIrr(Number(e)*10)
                            }}
                            dir={getDirection(lang)}
                            className="flex w-full items-center"
                        > <Swiper
                            className='md:max-w-lg'
                            spaceBetween={10}
                            slidesPerView={3.5}
                            breakpoints={{
                                0: {
                                    slidesPerView: 1.5,
                                },
                                576: {
                                    slidesPerView: 2.5,
                                },
                                768: {
                                    slidesPerView: 3.5,
                                },
                            }}
                        >
                                {ids?.map((id) => {
                                    return < SwiperSlide >
                                        <div className="w-full overflow-hidden w-auto">
                                            <RadioGroupItem
                                                value={id.value}
                                                id={id.key}
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor={id.key}
                                                className="flex w-full cursor-pointer text-nowrap flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-1 py-2  border-gray-400 peer-data-[state=checked]:bg-gray-400 peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-gray-400 [&:has([data-state=checked])]:font-black"
                                            >
                                                {id.title}
                                            </Label>
                                        </div>
                                    </SwiperSlide>
                                })}
                            </Swiper>
                        </RadioGroup>
                    </div>
                </div>
                <div className="flex w-full flex-col gap-[12px]">
                    <div className='w-full flex flex-row justify-between'>
                        <Label
                            className="flex"
                        >
                            مقدار طلا به میلی گرم
                        </Label>
                    </div>
                    <Input
                        type={'number'}
                        className="w-full "
                        placeholder="مقدار طلا به میلی گرم"
                        value={gerams}
                        onChange={(e) => {
                            setGrams(Number(e.target.value))
                            geramsToRial(Number(e.target.value))
                        }}
                    />
                </div>
                <div className="flex flex-col items-center justify-center gap-3 ">
                    <div className=' flex w-full justify-center gap-[4px] font-black items-center	'>
                        <Icons.info stroke='red' />
                        <div className='text-[red] text-sm'>
                            برای مبالغ زیر 1 میلیون تومان کارمزد 0.01 درصد می باشد
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}
