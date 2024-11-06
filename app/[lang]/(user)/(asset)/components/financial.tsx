'use client';

import { Locale } from '@/i18n-config';
import { cn, currency } from '@/libs/utils';
import { FinantialCard } from '@/components/finantialCard';
import { useWalletInfo } from '../../wallet/services/useWalletInfo';

type bargainingProps = {
    dict: any;
    lang: Locale;
    className?: string;
};

export default function Financial({ dict, lang, className }: bargainingProps) {
    const { wallet, isLoading } = useWalletInfo();

    return (
        <div
            className={cn(
                'flex flex-col items-start gap-6 md:w-full md:flex-row md:justify-between md:gap-20',
                className
            )}
        >
            <div className="mx-auto w-full max-w-7xl">
                <div className='flex flex-wrap w-full gap-5 justify-center'>
                    <FinantialCard
                        loading={isLoading}
                        dict={dict}
                        lang={lang}
                        headerTitle='دارایی طلا'
                        value={`${currency(Number(wallet.balance?.gold_amount), 'tse', lang)} گرم`}
                        equivalent={`معادل ${currency(Number(wallet.balance?.gold_balance_irt), 'tse', lang)} تومان`}
                    />
                </div>
            </div>
        </div>
    );
}
