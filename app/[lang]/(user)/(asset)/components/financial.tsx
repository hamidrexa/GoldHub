'use client';

import { Locale } from '@/i18n-config';
import { cn, currency } from '@/libs/utils';
import { FinantialCard } from '@/components/finantialCard';
import { useWalletInfo } from '../../wallet/services/useWalletInfo';
import { useExchangePrice } from '@/services/useExchangePrice';

type bargainingProps = {
    dict: any;
    lang: Locale;
    className?: string;
};

export default function Financial({ dict, lang, className }: bargainingProps) {
    const { wallet, isLoading } = useWalletInfo();
    const { price, isLoading: priceIsLoading } = useExchangePrice();

    // ** exchange irt to gold 
    const irtToGold = (irt: number, goldValue: number) => {
        return irt / goldValue
    }

    return (
        <div
            className={cn(
                'flex flex-col items-start gap-6 md:w-full md:flex-row md:justify-between md:gap-20',
                className
            )}
        >
            <div className="mx-auto w-full max-w-7xl">
                <h2 className="mb-6 flex items-center justify-center gap-1 text-center text-2xl font-black text-black md:mb-12 md:text-4xl">
                    دارایی های شما
                </h2>
                <div className='flex flex-wrap w-full gap-5 justify-center'>
                    <FinantialCard
                        loading={isLoading}
                        dict={dict}
                        lang={lang}
                        headerTitle='دارایی طلا'
                        value={`${currency(Number(wallet.balance?.gold_amount), 'tse', lang)} گرم`}
                        equivalent={`معادل ${currency(Number(wallet.balance?.gold_balance_irt), 'tse', lang)} تومان`}
                    />
                    <FinantialCard
                        loading={isLoading}
                        dict={dict}
                        lang={lang}
                        headerTitle='دارایی ریالی'
                        value={`${currency(Number(wallet.balance?.irt_balance), 'tse', lang)} تومان`}
                        equivalent={`معادل ${currency(Number(irtToGold(Number(wallet.balance?.irt_balance), Number(price?.sell_price_irt))), 'tse', lang)} گرم طلا`}
                    />
                </div>
            </div>
        </div>
    );
}
