'use client';

import { Locale } from '@/i18n-config';
import { cn, currency, getDirection } from '@/libs/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import 'swiper/css';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useWalletInfo } from '../../wallet/services/useWalletInfo';
import { useExchangePrice } from '@/services/useExchangePrice';
import Spinner from '@/components/spinner';
import { useGlobalContext } from '@/contexts/store';
import { toast } from 'sonner';
import { payment } from '../../services/payment';
import { PaymentMethods } from '@/constants/payment-methods';
import { LoginModal } from '@/components/login-modal';
import { usePathname } from 'next/navigation';


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

    // ** Hooks
    const { price, isLoading: priceIsLoading } = useExchangePrice();
    const { user } = useGlobalContext();

    const path = usePathname();

    // ** States
    const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
    const [transactionMode, setTransactionMode] = useState<any>('buy');
    const [loading, setLoading] = useState<boolean>(false)
    const [checked, setChecked] = useState<boolean>(true)
    const [gerams, setGrams] = useState<number>(null)
    const [irr, setIrr] = useState<number>(null)

    // ** Functions
    const geramsToRial = (value: number) => {
        const goldValue = transactionMode === 'buy' ? price?.buy_price_irt : price?.sell_price_irt
        const resIRR = (value) * (goldValue * 10) / 1000
        setIrr(resIRR)
    }

    const rialToGerams = (value: number) => {
        const goldValue = transactionMode === 'buy' ? price?.buy_price_irt : price?.sell_price_irt
        const resIRR = (value) / (goldValue * 10) * 1000
        setGrams(resIRR)
    }

    const onPaymentClick = async () => {
        if (!user) return setOpenLoginModal(true);
        if (!irr) return toast.error('لطفا مبلغی را وارد کنید')
        if (irr < 1000000) return toast.error('مبلغ وارد شده نباید کمتر از 100 هزار تومان باشد')
        setLoading(true);
        toast.info('در حال انتقال به درگاه پرداخت');
        try {
            const res = await payment({
                price: parseInt(JSON.stringify(irr)),
                bank_type: PaymentMethods['tala'],
            });
            window.open(
                `https://talame-api.darkube.app/transaction/payment/${res.id}`
            );
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    // ** UseEffects
    useEffect(() => {
        if (transactionMode === 'buy') {
            rialToGerams(irr)
        } else {
            geramsToRial(gerams)
        }
    }, [transactionMode])

    return (
        <div className='flex w-full justify-center py-12'>
            <div
                className={cn(
                    'relative flex w-full md:max-w-2xl flex-col gap-8 rounded-md md:border border-gray-400 bg-white px-4 py-6 text-black',
                    className
                )}
            >
                {(loading || priceIsLoading) && <div className="absolute inset-0 flex items-center justify-center">
                    <div className="z-100000 absolute inset-0 bg-white opacity-50 z-10"></div>
                    <Spinner className='z-20' />
                </div>}
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
                        onValueChange={(e) => {
                            setTransactionMode(e)
                        }}
                        dir={getDirection(lang)}
                        className="flex w-full gap-[0px] items-center border p-1 rounded-lg border-gray-400 w-[70%] max-w-[400px]"
                    >
                        <div className="overflow-hidden w-full">
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
                        <div className="overflow-hidden w-full">
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
                </div>
                <div className="flex w-full flex-col gap-[12px]">
                    <div className='flex flex-row gap-3 items-center'>
                        <Icons.minusSquare stroke='#000' />
                        <Label>
                            قیمت لحظه ای
                        </Label>
                    </div>
                    <div className='flex w-full justify-center '>
                        {`1 گرم طلا`} = {`${currency(transactionMode === 'buy' ? price?.buy_price_irt : price?.sell_price_irt, 'tse', lang)} تومان`}
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
                {/* <div>
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
                </div> */}
                <Button onClick={onPaymentClick}>
                    ادامه
                </Button>
            </div >
            <LoginModal
                lang={lang}
                dict={dict}
                texts={{
                    title: <>برای خرید از طلانو ثبت نام کنید.</>,
                    description:
                        'با ثبت نام در طلانو، بی نهایت سرمایه گذاری کن.',
                    button: 'شروع سرمایه گذاری',
                    buttonVariant: 'default',
                    inputLabel: dict.traderLoginModal.inputLabel,
                }}
                open={openLoginModal}
                setOpen={setOpenLoginModal}
                redirectUrl={path}
            />
        </div>
    );
}
