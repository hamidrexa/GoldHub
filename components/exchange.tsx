'use client';

import { Locale } from '@/i18n-config';
import { cn, currency, getDirection, roundNumber } from '@/libs/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { payment } from '@/app/[lang]/(user)/services/payment';
import { PaymentMethods } from '@/constants/payment-methods';
import { useExchangePrice } from '@/services/useExchangePrice';
import Spinner from '@/components/spinner';
import { useGlobalContext } from '@/contexts/store';
import { LoginModal } from '@/components/login-modal';
import { usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { usePrice } from '@/app/[lang]/(user)/(asset)/services/usePrice';
import { ReferenceDot } from 'recharts';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type Props = {
    dict: any;
    lang: Locale;
    className?: string;
    ids: Object;
};

export default function Exchange({ dict, lang, className, ids }: Props) {
    const { user } = useGlobalContext();
    const [loading, setLoading] = useState(false);
    const {
        price,
        isLoading: priceIsLoading,
        error: getPriceError,
    } = useExchangePrice();
    const [mGramEq, setMGramEq] = useState(null);
    const [tomanEq, setTomanEq] = useState(null);
    const inputRef = useRef([null,null]);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const path = usePathname();
    const onPaymentClick = async () => {
        if (!user) return setOpenLoginModal(true);
        if (tomanEq.replace(/٬/g, "").replace(/[۰-۹]/g, (digit) =>
            String.fromCharCode(digit.charCodeAt(0) - 1728)
        ) < 100000) return toast.warning("حداقل مبلغ پرداختی ۱۰۰ هزار تومان میباشد.")
        if (tomanEq.replace(/٬/g, "").replace(/[۰-۹]/g, (digit) =>
            String.fromCharCode(digit.charCodeAt(0) - 1728)
        ) > 50000000) return toast.warning("حداکثر مبلغ پرداختی ۵۰ میلیون تومان میباشد.")

        setLoading(true);
        try {
            await payment({
                price: tomanEq.replace(/٬/g, "").replace(/[۰-۹]/g, (digit) =>
                    String.fromCharCode(digit.charCodeAt(0) - 1728)
                ) * 10,
                bank_type: PaymentMethods['tala'],
            }).then((res) => {
                toast.info('در حال انتقال به درگاه پرداخت');
                setLoading(false);
                window.open(
                    `https://talame-api.darkube.app/transaction/payment/${res.id}`,
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
        } catch (error) {
            setLoading(false)
            console.log(error);
        }

    };

    const handleNumericInput = (event) => {

        event.target.value = event.target.value
            .replace(/[۰-۹]/g, (digit) =>
                String.fromCharCode(digit.charCodeAt(0) - 1728)
            )
            .replace(/[^\d]/g, '');

        if (event.target.value.startsWith('0')) {
            event.target.value = '';
        }
    };

    const formatWithCommas = (value: string) =>
        value.replace(/\B(?=(\d{3})+(?!\d))/g, '٬');

    const handleRialChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const toman = event.target.value.replace(/\D/g, '');

        if(!!!toman){
            setMGramEq('');
            setTomanEq('');
            return;
        }

        if (price?.buy_price_irt) {
            setTomanEq(formatWithCommas(toman));
            setMGramEq(formatWithCommas(Math.floor(parseInt(toman) / (price.buy_price_irt /1000)).toString()));
        }
    };

    const handleGeramChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const mgram = event.target.value.replace(/\D/g, '');

        if(!!!mgram){
            setMGramEq('');
            setTomanEq('');
            return;
        }

        setMGramEq(formatWithCommas(mgram));
        if (price?.buy_price_irt) {
            setTomanEq(
                formatWithCommas(
                    currency(roundNumber(parseInt(mgram) * (price.buy_price_irt / 1000), 0), 'tse', 'fa').toString()
                )
            );
        }
    };

    useEffect(() => {
        setMGramEq('1');
        setTomanEq(currency(roundNumber((price?.buy_price_irt / 1000),0),"tse","fa").toString());
    }, [priceIsLoading]);

    return (
        <>
            <div
                className={cn(
                    'relative flex flex-col gap-8 rounded-md border border-gray-400 bg-white px-4 py-6 text-black',
                    className,
                )}
            >
                <div className="w-full space-y-3 text-base font-medium">
                    <label>معادل تومان:</label>
                    {priceIsLoading ? (
                        <Spinner />
                    ) : (
                        <>
                            <Input
                                ref={inputRef[0]}
                                onChange={handleRialChange}
                                onInput={handleNumericInput}
                                value={tomanEq}
                                className="w-full text-base text-left"
                                placeholder="تومان خرید/فروش"
                                style={{ direction: 'ltr', textAlign: tomanEq ? 'left' : 'right' }}
                            />
                            {/*<div className="text-lg font-semibold mt-2">*/}
                            {/*    {currency(parseInt(tomanEq),"tse","fa")}*/}
                            {/*</div>*/}
                        </>
                    )}
                </div>
                <div className="flex items-center justify-center gap-3">
                    <div
                        onClick={() => {
                            const tomanValue = 100000;
                            setTomanEq(currency(tomanValue,"tse","fa").toString());
                            if (price?.buy_price_irt) {
                                setMGramEq(Math.floor(tomanValue / (price.buy_price_irt/1000)).toFixed(0));
                            }
                        }}
                        className="rounded-md border border-neutral-100 p-2.5 text-sm font-light hover:cursor-pointer"
                    >
                        ۱۰۰ هزار تومان
                    </div>
                    <div
                        onClick={() => {
                            const tomanValue = 500000;
                            setTomanEq(currency(tomanValue,"tse","fa").toString());
                            if (price?.buy_price_irt) {
                                setMGramEq(Math.floor(tomanValue / (price.buy_price_irt/1000)).toFixed(0));
                            }
                        }}
                        className="rounded-md border border-neutral-100 p-2.5 text-sm font-light hover:cursor-pointer"
                    >
                        ۵۰۰ هزار تومان
                    </div>
                    <div
                        onClick={() => {
                            const tomanValue = 1000000;
                            setTomanEq(currency(tomanValue,"tse","fa").toString());
                            if (price?.buy_price_irt) {
                                setMGramEq(Math.floor(tomanValue / (price.buy_price_irt/1000)).toFixed(0));
                            }
                        }}
                        className="rounded-md border border-neutral-100 p-2.5 text-sm font-light hover:cursor-pointer"
                    >
                        ۱ میلیون تومان
                    </div>
                </div>
                <div className="space-y-3 text-base font-medium">
                    <label>میلی گرم طلا:</label>
                    {priceIsLoading ? (
                        <Spinner />
                    ) : (
                       <div className="relative">
                           <Input
                               ref={inputRef[1]}
                               onChange={handleGeramChange}
                               onInput={handleNumericInput}
                               className="w-full text-base"
                               value={mGramEq}
                               placeholder="میلی گرم طلای خرید/فروش"
                               style={{ direction: 'ltr', textAlign: mGramEq ? 'left' : 'right' }}
                           />
                           <div style={{visibility :mGramEq?.length > 0 ? 'visible' : 'hidden'}} className="mt-1.5 text-start text-sm text-neutral-200">
                                   معادل
                                   <span className="mx-1"> {mGramEq?.replace(/\D/g, '')/1000}</span>
                                   گرم طلای ۱۸ عیار
                               </div>
                           </div>
                    )}
                </div>
                {/*<div className="flex w-full flex-col justify-center gap-2.5 md:flex-row md:items-center">*/}
                {/*    <RadioGroup*/}
                {/*        defaultValue="1"*/}
                {/*        onValueChange={setEquivalent}*/}
                {/*        dir={getDirection(lang)}*/}
                {/*        className="flex w-full items-center gap-3 rounded-md border border-gray-400 px-3 py-3 md:max-w-sm"*/}
                {/*    >*/}
                {/*        <div className="w-full">*/}
                {/*            <RadioGroupItem*/}
                {/*                value="1"*/}
                {/*                id={ids[0]}*/}
                {/*                className="peer sr-only"*/}
                {/*            />*/}
                {/*            <Label*/}
                {/*                htmlFor={ids[0]}*/}
                {/*                className="flex w-full cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-3 peer-data-[state=checked]:border-gray-400 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"*/}
                {/*            >*/}
                {/*                ۱ میلیون تومان*/}
                {/*            </Label>*/}
                {/*        </div>*/}
                {/*        <div className="w-full">*/}
                {/*            <RadioGroupItem*/}
                {/*                value="5"*/}
                {/*                id={ids[1]}*/}
                {/*                className="peer sr-only"*/}
                {/*            />*/}
                {/*            <Label*/}
                {/*                htmlFor={ids[1]}*/}
                {/*                className="flex w-full cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-3 peer-data-[state=checked]:border-gray-400 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"*/}
                {/*            >*/}
                {/*                ۵ میلیون تومان*/}
                {/*            </Label>*/}
                {/*        </div>*/}
                {/*    </RadioGroup>*/}
                {/*</div>*/}
                <div className="flex flex-col items-center justify-center gap-3 ">
                    {/*<div className="flex items-center gap-3 ">*/}
                    {/*    <div className="min-w-12 text-base font-semibold">*/}
                    {/*        معادل:*/}
                    {/*    </div>*/}
                    {/*    <div className="flex items-center gap-2 text-lg">*/}
                    {/*        <div>*/}
                    {/*            {priceIsLoading ? (*/}
                    {/*                <Spinner width={15} height={15} />*/}
                    {/*            ) : (*/}
                    {/*                transformPrice(price?.buy_price_irt)*/}
                    {/*            )}*/}
                    {/*        </div>*/}
                    {/*        <div className="min-w-10 text-sm font-bold text-neutral-800">*/}
                    {/*            گرم طلا*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <div className="flex items-center w-full gap-1">
                        <Button
                            onClick={onPaymentClick}
                            className="w-full basis-3/4 font-semibold"
                            size="default"
                            variant="success"
                        >
                            خرید سریع
                        </Button>
                        <div className="w-full basis-1/4">
                            <Dialog>
                                <DialogTrigger
                                    className="font-semibold w-full text-white bg-red-600 p-2 rounded"
                                >
                                    فروش
                                </DialogTrigger>
                                <DialogContent className="max-w-xl text-center">
                                    <DialogTitle />
                                    برای برداشت به پشتیبانی تلگرام طلانو با آیدی
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
                    </div>

                </div>
            </div>
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
        </>
    );
}
