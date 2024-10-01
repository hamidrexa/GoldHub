'use client';

import { Locale } from '@/i18n-config';
import Image from 'next/image';
import { cn, getDirection, roundNumber } from '@/libs/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { payment } from '@/app/[lang]/(user)/pricing/services/payment';
import { PaymentMethods } from '@/constants/payment-methods';
import { useExchangePrice } from '@/services/useExchangePrice';
import { Badge } from '@/components/ui/badge';
import Spinner from '@/components/spinner';
import { useGlobalContext } from '@/contexts/store';
import { LoginModal } from '@/components/login-modal';
import { usePathname } from 'next/navigation';

type Props = {
    dict: any;
    lang: Locale;
    asset: any;
    className?: string;
    ids: Object;
};

export default function Exchange({ dict, lang, asset, className, ids }: Props) {
    const { user } = useGlobalContext();
    const [equivalent, setEquivalent] = useState('1');
    const [loading, setLoading] = useState(false);
    const {
        price,
        isLoading: priceIsLoading,
        error: getPriceError,
    } = useExchangePrice();
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const path = usePathname();
    const transformPrice = (assetIrtPrice) => {
        const unit = parseInt(equivalent) * 1000000;
        return roundNumber(unit / assetIrtPrice, 6);
    };
    const onPaymentClick = async () => {
        if (!user) return setOpenLoginModal(true);

        setLoading(true);
        toast.info('در حال انتقال به درگاه پرداخت');
        try {
            const res = await payment({
                plan: equivalent === '1' ? 43 : 44,
                bank_type: PaymentMethods['irr'],
            });
            location.replace(
                `https://api-gateway.sahmeto.com/transaction/payment/${res.id}`
            );
        } catch (error) {
            // console.log(error);
        }
        setLoading(false);
    };

    return (
        <>
            <div
                className={cn(
                    'relative flex flex-col gap-8 rounded-md border border-gray-400 bg-white px-4 py-6',
                    className
                )}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image
                            width={25}
                            height={25}
                            src={asset?.image}
                            alt={`${asset.symbol}-logo`}
                        />
                        <div className="text-base font-medium">
                            خرید{asset.name}
                        </div>
                    </div>
                    <Badge className="absolute -top-3 left-4" size="default">
                        جدید
                    </Badge>
                </div>
                <div className="flex w-full flex-col justify-center gap-2.5 md:flex-row md:items-center">
                    <RadioGroup
                        defaultValue="1"
                        onValueChange={setEquivalent}
                        dir={getDirection(lang)}
                        className="flex w-full items-center gap-3 rounded-md border border-gray-400 px-3 py-3 md:max-w-sm"
                    >
                        <div className="w-full">
                            <RadioGroupItem
                                value="1"
                                id={ids[0]}
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor={ids[0]}
                                className="flex w-full cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-3 peer-data-[state=checked]:border-gray-400 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                            >
                                ۱ میلیون تومان
                            </Label>
                        </div>
                        <div className="w-full">
                            <RadioGroupItem
                                value="5"
                                id={ids[1]}
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor={ids[1]}
                                className="flex w-full cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-3 peer-data-[state=checked]:border-gray-400 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                            >
                                ۵ میلیون تومان
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
                <div className="flex flex-col items-center justify-center gap-3 ">
                    <div className="flex items-center gap-3 ">
                        <div className="min-w-12 text-base font-semibold">
                            معادل:
                        </div>
                        <div className="flex flex-row-reverse items-center gap-2 text-lg">
                            <div>
                                {priceIsLoading ? (
                                    <Spinner width={10} height={10} />
                                ) : (
                                    transformPrice(price?.buy_price_irt)
                                )}
                            </div>
                            <div className="min-w-10">BTC</div>
                        </div>
                    </div>
                    <Button
                        onClick={onPaymentClick}
                        className="w-full font-semibold"
                        size="default"
                        variant="success"
                    >
                        خرید سریع
                    </Button>
                </div>
            </div>
            <LoginModal
                lang={lang}
                dict={dict}
                texts={{
                    title: <>برای خرید از صرافی ثبت نام کنید.</>,
                    description:
                        'با ثبت نام در طلامی، 7 روز اشتراک رایگان هدیه بگیرید.',
                    button: dict.traderLoginModal.button,
                    buttonVariant: 'info',
                    inputLabel: dict.traderLoginModal.inputLabel,
                }}
                open={openLoginModal}
                setOpen={setOpenLoginModal}
                redirectUrl={path}
            />
        </>
    );
}
