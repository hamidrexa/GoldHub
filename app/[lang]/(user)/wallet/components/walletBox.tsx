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
import { PieChart } from '@/components/pie-chart';


type Props = {
    dict: any;
    lang: Locale;
    className?: string
};

export default function WalletBox({
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
        const resIRR = Math.floor((value * (goldValue * 10)) / 1000);
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
                {/* {(loading || priceIsLoading) && <div className="absolute inset-0 flex items-center justify-center">
                    <div className="z-100000 absolute inset-0 bg-white opacity-50 z-10"></div>
                    <Spinner className='z-20' />
                </div>} */}
                <div className='flex flex-row justify-between items-center'>
                    <div className='flex items-center flex-row gap-[10px]'>
                        <Icons.lineChart stroke="#0C0E3C" />
                        <h2>
                            دارایی
                        </h2>
                    </div>
                    <div className='cursor-pointer'>
                        <Icons.question />
                    </div>
                </div>
                <div className='relative '>

                    <PieChart
                        // className="blur-md"
                        width="100%"
                        height={160}
                        data={[
                            {
                                name: 'تومان',
                                count: 2,
                                value: 75,
                            },
                            {
                                name: 'طلا',
                                count: 2,
                                value: 25,
                            },
                            
                        ]}
                        dataKey="value"
                    />
                </div>
                <div className={`flex w-full gap-8 ${transactionMode === 'sell' ? 'flex-col-reverse' : ' flex-col'}`}>

                </div>
                <div className="flex w-full flex-col gap-[12px]">

                </div>
            </div >
        </div>
    );
}
