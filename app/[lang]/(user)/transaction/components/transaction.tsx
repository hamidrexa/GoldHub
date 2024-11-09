'use client';

import { Locale } from '@/i18n-config';
import { cn, currency, getDirection, roundNumber } from '@/libs/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import 'swiper/css';
import { Button } from '@/components/ui/button';
import { useExchangePrice } from '@/services/useExchangePrice';
import Spinner from '@/components/spinner';
import { useGlobalContext } from '@/contexts/store';
import { toast } from 'sonner';
import { payment } from '../../services/payment';
import { PaymentMethods } from '@/constants/payment-methods';
import { LoginModal } from '@/components/login-modal';
import { usePathname, useSearchParams } from 'next/navigation';
import { exchange } from '../../services/exchange';


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
    const { price, isLoading: priceIsLoading, isValidating } = useExchangePrice();
    const { user } = useGlobalContext();
    const searchParams = useSearchParams()
    const type = searchParams.get('type')

    const path = usePathname();

    // ** States
    const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
    const [transactionMode, setTransactionMode] = useState<any>(type === 'sell' ? 'sell' : 'buy');
    const [loading, setLoading] = useState<boolean>(false)
    const [checked, setChecked] = useState<boolean>(true)
    const [mGramEq, setMGramEq] = useState(null)
    const [tomanEq, setTomanEq] = useState(null)

    // ** Functions
    const formatWithCommas = (value: string) =>
        value.replace(/\B(?=(\d{3})+(?!\d))/g, '٬');

    const handleRialChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const toman = event.target.value.replace(/\D/g, '');

        if (!!!toman) {
            setMGramEq('');
            setTomanEq('');
            return;
        }

        if (price?.buy_price_irt) {
            setTomanEq(formatWithCommas(toman));
            setMGramEq((parseInt(toman) / (price.buy_price_irt / 1000)).toFixed(0));
        }
    };

    const handleGeramChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const mgram = event.target.value.replace(/\D/g, '');
        setMGramEq(mgram);
        if (price?.buy_price_irt) {
            setTomanEq(
                formatWithCommas(
                    currency(roundNumber(parseInt(mgram) * (price.buy_price_irt / 1000), 0), 'tse', 'fa').toString()
                )
            );
        }
    };

    const handleNumericInput = (event) => {
        if (event.target.value.startsWith('0')) {
            event.target.value = "";
        }
        event.target.value = event.target.value.replace(/\D/g, '');
    }

    const onPaymentClick = async () => {
        const rial = tomanEq.replace(/٬/g, "").replace(/[۰-۹]/g, (digit) =>
            String.fromCharCode(digit.charCodeAt(0) - 1728)
        )
        if (transactionMode === 'buy') {
            if (!user) return setOpenLoginModal(true);
            if (!tomanEq) return toast.error('لطفا مبلغی را وارد کنید')
            if (Number(rial) < 100000) return toast.warning("حداقل مبلغ پرداختی ۱۰۰ هزار تومان میباشد.")
            if (Number(rial) > 50000000) return toast.warning("حداکثر مبلغ پرداختی ۵۰ میلیون تومان میباشد.")
            setLoading(true);
            toast.info('در حال انتقال به درگاه پرداخت');
            try {
                const res = await payment({
                    price: rial,
                    bank_type: PaymentMethods['tala'],
                });
                window.open(
                    `https://talame-api.darkube.app/transaction/payment/${res.id}`
                );
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        } else {
            setLoading(true);
            await exchange(null, {
                amount_rls: Number(rial) * 10,
                type: 'sell',
            }).then(() => {
                toast.success('با موفقیت انجام شد.');
            }).catch((e) => {
                setLoading(false);
                toast.error(
                    e?.error?.params[0] ||
                    e?.error?.params?.detail ||
                    e?.error?.messages?.error?.[0] ||
                    e?.error?.messages
                )
            })
            setLoading(false);
        }
    };

    return (
        <div className='flex w-full justify-center'>
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
                        <Icons.barChart3 stroke="#0C0E3C" />
                        <h2 className='text-[22px] font-bold'>
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
                                خرید طلا
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
                                فروش طلا
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
                <div className={`flex w-full gap-8 ${transactionMode === 'sell' ? 'flex-col-reverse' : ' flex-col'}`}>
                    <div className="flex w-full flex-col justify-center gap-2.5  md:items-center">
                        <div className="flex w-full flex-col gap-[12px]">
                            <div className='w-full flex flex-row justify-between'>
                                <label
                                    className="flex font-medium"
                                >
                                    مبلغ پرداختی به تومان
                                </label>
                            </div>
                            <Input
                                className="w-full text-left"
                                placeholder="تومان خرید/فروش"
                                style={{ direction: 'ltr', textAlign: tomanEq ? 'left' : 'right' }}
                                value={tomanEq}
                                onInput={handleNumericInput}
                                onChange={handleRialChange}
                            />
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-[12px]">
                        <div className='w-full flex flex-row justify-between'>
                            <label
                                className="flex font-medium"
                            >
                                مقدار طلا به میلی گرم
                            </label>
                        </div>
                        <Input
                            className="w-full "
                            placeholder="میلی گرم طلای خرید/فروش"
                            value={mGramEq}
                            style={{ direction: 'ltr', textAlign: mGramEq ? 'left' : 'right' }}
                            onInput={handleNumericInput}
                            onChange={handleGeramChange}
                        />
                        <div
                            style={{ visibility: mGramEq?.length > 0 ? 'visible' : 'hidden' }}
                            className="mt-1.5 text-start text-sm text-neutral-200"
                        >
                            معادل
                            <span className="mx-1"> {Number(JSON.stringify(mGramEq).replace(/\D/g, '')) / 1000}</span>
                            گرم طلای ۱۸ عیار
                        </div>
                    </div>
                </div>
                <div className="flex w-full flex-col gap-[12px]">
                    <div className='flex flex-row gap-3 items-center'>
                        <Icons.arrowUpDown stroke='#000' />
                        <Label>
                            قیمت لحظه ای
                        </Label>
                        <div className="relative flex items-center justify-center">
                            <div className="h-5 w-5 animate-ping rounded-full bg-[#CA8A04]/40"></div>
                            <div className="absolute h-2.5 w-2.5 rounded-full bg-[#CA8A04]" />
                        </div>
                    </div>
                    <div className='flex w-full justify-center items-center'>
                        <div className={`${isValidating ? 'blur-sm' : ''}`}>
                            {`1 گرم طلا`} = {`${currency(transactionMode === 'buy' ? price?.buy_price_irt : price?.sell_price_irt, 'tse', lang)} تومان`}
                        </div>
                        <div className={`${isValidating ? 'opacity-1' : 'opacity-0'}`}>
                            {<Spinner className={`w-[15px] h-[15px] mx-2 opacity-[${isValidating ? '2' : '0'}]`} />}
                        </div>
                    </div>
                </div>
                {/* <div className="flex flex-col items-center justify-center gap-3 ">
                    <div className=' flex w-full  gap-[4px] items-center	'>
                        <div className='text-[#5A5C83]'>
                            برای مبالغ زیر 1 میلیون تومان کارمزد 0.01 درصد می باشد
                        </div>
                    </div>
                </div> */}
                <div>
                    <div className='flex flex-row items-center justify-between'>
                        <Label className='font-black'>
                            کارمزد
                        </Label>
                        <div className='flex flex-row items-center gap-2 text-[#5A5C83] font-black'>
                            {currency(0, 'tse', lang)} {transactionMode === 'buy' ? 'تومان' : 'میلی گرم'} <Icons.info stroke='#2228A9' />
                        </div>
                    </div>
                </div>
                {/* <div>
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
                <Button className='sticky' onClick={onPaymentClick}>
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
