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
    yourInventory: number
};

export default function ExchangeV2({
    dict,
    lang,
    className,
    ids,
    headerTitle,
    headerIcon,
    yourInventory
}: Props) {
    const [equivalent, setEquivalent] = useState('0');

    return (
        <>
            <div
                className={cn(
                    'relative flex flex-col gap-8 rounded-md border border-gray-400 bg-white px-4 py-6 text-black',
                    className
                )}
            >
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
                            type={'text'}
                            className="w-full "
                            placeholder="از 100 هزار تومان تا 100 میلیون تومان"
                        />
                    </div>
                    <div className='flex flex-row w-full'>
                        <RadioGroup
                            value={equivalent}
                            onValueChange={setEquivalent}
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
                            مقدار طلا
                        </Label>
                    </div>
                    <Input
                        type={'text'}
                        className="w-full "
                        placeholder="مقدار طلا به میلی گرم"
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
