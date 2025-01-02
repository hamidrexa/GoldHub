'use client';

import { Locale } from '@/i18n-config';
import { cn, currency, getDirection, roundNumber } from '@/libs/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { useWalletInfo } from '../../wallet/services/useWalletInfo';
import { NewDragSlider } from '@/components/new-range-chart';
import { Slider } from '@/components/ui/slider';
import { NewRangeSlider } from '@/components/new-range-slider';


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
    const { wallet, mutate } = useWalletInfo();
    const { user } = useGlobalContext();
    const searchParams = useSearchParams()
    const type = searchParams.get('type')

    const path = usePathname();

    // ** States
    const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
    const [transactionMode, setTransactionMode] = useState<any>(type === 'sell' ? 'sell' : 'buy');
    const [buyWithWallet, setBuyWithWallet] = useState<boolean>(false)
    const [sliderValue, setSliderValue] = useState<any>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [checked, setChecked] = useState<boolean>(true)
    const [mGramEq, setMGramEq] = useState(null)
    const [tomanEq, setTomanEq] = useState(null)

    // ** Functions
    const formatWithCommas = (value: string) =>
        value?.replace(/\B(?=(\d{3})+(?!\d))/g, '٬');

    const handleRialChange = (event: any) => {
        const toman = event?.target?.value?.replace(/\D/g, '');
        const value = transactionMode === 'buy' ? price?.buy_price_irt : price?.sell_price_irt

        if (!!!toman) {
            setMGramEq('');
            setTomanEq('');
            return;
        }

        if (value) {
            setTomanEq(formatWithCommas(toman));
            setMGramEq((parseInt(toman) / (parseInt(value) / 1000)).toFixed(0));
        }
    };

    const handleGeramChange = (event: any) => {
        const mgram = event?.target?.value?.replace(/\D/g, '');
        const value = transactionMode === 'buy' ? price?.buy_price_irt : price?.sell_price_irt

        setMGramEq(mgram);
        if (value) {
            setTomanEq(
                formatWithCommas(
                    currency(roundNumber(parseInt(mgram) * (parseInt(value) / 1000), 0), 'tse', 'fa').toString()
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
        const rial = tomanEq?.replace(/٬/g, "").replace(/[۰-۹]/g, (digit) =>
            String.fromCharCode(digit.charCodeAt(0) - 1728)
        )
        if (!user) return setOpenLoginModal(true);
        if (buyWithWallet && transactionMode === 'buy') {
            if (!sliderValue) return toast.error('لطفا مبلغی را وارد کنید')
            if (Number(sliderValue) < 100000) return toast.warning("حداقل مبلغ پرداختی ۱۰۰ هزار تومان میباشد.")
            if (Number(sliderValue) > 50000000) return toast.warning("حداکثر مبلغ پرداختی ۵۰ میلیون تومان میباشد.")
            setLoading(true);
            await exchange(null, {
                amount_rls: Number(sliderValue) * 10,
                type: 'buy',
            }).then(() => {
                toast.success('با موفقیت انجام شد.');
                mutate()
                setMGramEq('')
                setTomanEq('')
                setLoading(false);
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
            return
        }
        if (transactionMode === 'buy') {
            if (!tomanEq) return toast.error('لطفا مبلغی را وارد کنید')
            if (Number(rial) < 100000) return toast.warning("حداقل مبلغ پرداختی ۱۰۰ هزار تومان میباشد.")
            if (Number(rial) > 50000000) return toast.warning("حداکثر مبلغ پرداختی ۵۰ میلیون تومان میباشد.")
            setLoading(true);
            try {
                await payment({
                    price: rial*10,
                    bank_type: PaymentMethods['tala'],
                }).then((res) => {
                    toast.info('در حال انتقال به درگاه پرداخت');
                    setLoading(false);
                    window.open(
                        `https://talame-api.darkube.app/transaction/payment/${res.id}`
                    );
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
                mutate()
            } catch (error) {
                setLoading(false);
            }
            return
        } else {
            if (!tomanEq) return toast.error('لطفا مبلغی را وارد کنید')
            setLoading(true);
            await exchange(null, {
                amount_rls: Number(rial) * 10,
                type: 'sell',
            }).then(() => {
                toast.success('با موفقیت انجام شد.');
                setMGramEq('')
                setTomanEq('')
                setLoading(false);
                mutate()
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

    useEffect(() => {
        handleGeramChange({ target: { value: mGramEq } })
        if (buyWithWallet && transactionMode === 'buy') {
            setSliderValue(0)
            setMGramEq('')
            setTomanEq('')
        }
    }, [transactionMode])

    useEffect(() => {
        handleGeramChange({ target: { value: mGramEq } })
    }, [price])

    const handleSliderChange = (value: number) => {
        if (value) {
            const exchange = transactionMode === 'buy' ? price?.buy_price_irt : price?.sell_price_irt
            setSliderValue(value);
            setMGramEq((value / (parseInt(exchange) / 1000)).toFixed(0));
        }
        else {
            setSliderValue(0)
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
                {transactionMode === 'buy' && <div className='flex flex-col w-full justify-center items-end gap-3'>
                    <div className='flex w-full justify-between items-center'>
                        <div>
                            {buyWithWallet && <Label>
                                مبلغ: {formatWithCommas(JSON.stringify(sliderValue))} تومان
                            </Label>}
                        </div>
                        <div className='flex justify-end items-center gap-2'>
                            <Label>
                                خرید از موجودی
                            </Label>
                            <Switch
                                className="relative h-[23px] w-[42px] rounded-full bg-[#0C0E3C] outline-none data-[state=checked]:bg-[#0C0E3C"
                                disabled={!wallet?.balance?.irt_balance}
                                checked={!!buyWithWallet}
                                onCheckedChange={(checked) => {
                                    setBuyWithWallet(checked)
                                }}
                            />
                        </div>
                    </div>
                    {buyWithWallet && <div className="flex w-full flex-col justify-center gap-6  md:items-center">
                        <NewRangeSlider
                            min={0}
                            disabled={Number(wallet?.balance?.irt_balance) <= 0}
                            max={Number(wallet?.balance?.irt_balance) || 1}
                            value={sliderValue}
                            onChange={handleSliderChange}
                        />
                        <div className='w-full flex flex-row justify-end items-center gap-2'>
                            <Label>
                                موجودی کل:
                            </Label>
                            <Label>
                                {currency(Number(wallet?.balance?.irt_balance), 'tse', lang)} تومان
                            </Label>
                        </div>
                    </div>}
                </div>}
                <div className={`flex w-full gap-8 ${transactionMode === 'sell' ? 'flex-col-reverse' : ' flex-col'}`}>
                    {(!buyWithWallet || transactionMode === 'sell') && <div className="flex w-full flex-col justify-center gap-2.5  md:items-center">
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
                                onChange={(e) => {
                                    handleRialChange(e)
                                }}
                            />
                        </div>
                    </div>}
                    <div className="flex w-full flex-col gap-[12px]">
                        <div className='w-full flex flex-row justify-between items-center'>
                            <label
                                className="flex font-medium"
                            >
                                مقدار طلا به میلی گرم
                            </label>
                            {transactionMode === 'sell' && <Label className='text-[#07BB61]'>
                                موجودی طلا: {roundNumber(Number(wallet?.balance?.gold_amount) * 1000, 4)} میلی گرم
                            </Label>}
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
                            <span className="mx-1"> {Number(JSON.stringify(mGramEq)?.replace(/\D/g, '')) / 1000}</span>
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
                <div className='flex w-full'>


                </div>
                <Button className='sticky bottom-[80px] md:bottom-[5px]' onClick={onPaymentClick}>
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