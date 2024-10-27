'use client';

import { Locale } from '@/i18n-config';
import { cn, getDirection, roundNumber } from '@/libs/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react';
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
    } = usePrice({ id: 24376, condition: true });
    const [geramEq, setGeramEq] = useState(null);
    const [rialEq, setRialEq] = useState(null);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const path = usePathname();
    const onPaymentClick = async () => {
        if (!user) return setOpenLoginModal(true);

        setLoading(true);
        toast.info('در حال انتقال به درگاه پرداخت');
        try {
            const res = await payment({
                price: rialEq,
                bank_type: PaymentMethods['tala'],
            });
            location.replace(
                `https://talame-api.darkube.app/transaction/payment/${res.id}`
            );
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleGeramChange = (event) =>{
        const grams = event.target.value;
        setGeramEq(grams);
        if (price?.TOMAN)  setRialEq((grams * price.TOMAN).toString());;
    }

    const handleRialChange = (event) =>{
        const rial = event.target.value;
        setRialEq(rial);
        if (price?.TOMAN) {
            setGeramEq((rial / price.TOMAN).toFixed(4));
        }
    }

    useEffect(() => {
        setGeramEq('1');
        setRialEq(`${price?.TOMAN}`);
    }, [priceIsLoading]);


    return (
        <>
            <div
                className={cn(
                    'relative flex flex-col gap-8 rounded-md border border-gray-400 bg-white px-4 py-6 text-black',
                    className
                )}
            >
                <div className="w-full space-y-3 text-base font-medium">
                    <label>معادل ریالی:</label>
                    {priceIsLoading ? (
                        <Spinner />
                    ) : (
                        <Input
                            onChange={handleRialChange}
                            value={rialEq}
                            className="w-full"
                            placeholder="مقدار ریالی خرید/فروش"
                        />
                    )}
                </div>
                <div className="flex items-center justify-center gap-3">
                    <div
                        onClick={() => {
                            const rialValue = 1000000;
                            setRialEq(rialValue.toString());
                            if (price?.TOMAN) {
                                setGeramEq((rialValue / price.TOMAN).toFixed(4));
                            }
                        }}
                        className="rounded-md border border-neutral-100 p-2.5 text-sm font-light hover:cursor-pointer"
                    >
                        ۱۰۰ هزار تومان
                    </div>
                    <div
                        onClick={() => {
                            const rialValue = 5000000;
                            setRialEq(rialValue.toString());
                            if (price?.TOMAN) {
                                setGeramEq((rialValue / price.TOMAN).toFixed(4));
                            }
                        }}
                        className="rounded-md border border-neutral-100 p-2.5 text-sm font-light hover:cursor-pointer"
                    >
                        ۵۰۰ هزار تومان
                    </div>
                    <div
                        onClick={() => {
                        const rialValue = 10000000;
                        setRialEq(rialValue.toString());
                        if (price?.TOMAN) {
                            setGeramEq((rialValue / price.TOMAN).toFixed(4));
                        }
                    }}
                        className="rounded-md border border-neutral-100 p-2.5 text-sm font-light hover:cursor-pointer"
                    >
                        ۱ میلیون تومان
                    </div>
                </div>
                <div className="space-y-3 text-base font-medium">
                    <label>گرم طلا:</label>
                    {priceIsLoading ? (
                        <Spinner />
                    ) : (
                        <Input
                            onChange={handleGeramChange}
                            className="w-full"
                            value={geramEq}
                            placeholder="گرم طلای خرید/فروش"
                        />
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
                    <div className="flex w-full gap-1">
                        <Button
                            onClick={onPaymentClick}
                            className="w-full basis-2/3 font-semibold"
                            size="default"
                            variant="success"
                        >
                            خرید سریع
                        </Button>
                        <Button
                            className="w-full basis-1/3 font-semibold"
                            size="default"
                            variant="destructive"
                        >
                            فروش
                        </Button>
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
