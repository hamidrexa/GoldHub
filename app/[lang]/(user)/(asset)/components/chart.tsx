'use client';

import { Locale } from '@/i18n-config';
import { cn } from '@/libs/utils';
import { useExchangePrice } from '@/services/useExchangePrice';
import ChartBox from '@/components/chart-box';

type bargainingProps = {
    dict: any;
    lang: Locale;
    className?: string;
};

export default function ChartGold({ dict, lang, className }: bargainingProps) {
    const { price, isLoading: priceIsLoading } = useExchangePrice();

    return (
        <div
            className={cn(
                'flex flex-col items-start gap-6 md:w-full md:flex-row md:justify-between md:gap-20',
                className
            )}
        >
                <ChartBox
                    headerTitle='قیمت لحظه ای طلا'
                    price={price?.buy_price_irt}
                    loading={priceIsLoading}
                    percentage={1.9}
                    measurementTitle='هر گرم'
                    className="w-full"
                    id='1'
                    market="gold"
                    dict={dict}
                    lang={lang}
                />
        </div>
    );
}
