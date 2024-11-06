'use client';

import { Locale } from '@/i18n-config';
import { cn } from '@/libs/utils';
import ExchangeV2 from '@/components/exchangeV2';
import { useWalletInfo } from '../../wallet/services/useWalletInfo';
import { useExchangePrice } from '@/services/useExchangePrice';
import Exchange from '@/components/exchange';

type bargainingProps = {
    dict: any;
    lang: Locale;
    className?: string;
};

export default function Bargain({ dict, lang, className }: bargainingProps) {
    const { wallet, isLoading } = useWalletInfo();
    const { price, isLoading: priceIsLoading } = useExchangePrice();

    return (
        <div
            className={cn(
                'flex flex-col items-start gap-6 md:w-full md:flex-row md:justify-between md:gap-20',
                className
            )}
        >
            <div className="flex max-w-fit flex-col gap-6 text-white">
                <h2 className="text-3xl font-black md:text-4xl">
                    سرمایه گذاری آسان در{' '}
                    <span className="text-neutral-800">طلا</span>
                </h2>
                <p className="text-justify text-xs font-normal leading-loose md:text-base">
                    طلا به عنوان یکی از محبوب‌ترین دارایی‌های با ارزش در جهان،
                    فرصتی بی‌نظیر برای سرمایه‌گذاری مطمئن و پایدار فراهم می‌کند.
                    با استفاده از پلتفرم طلانو، می‌توانید به راحتی و در هر لحظه
                    طلا خریداری کنید و از مزایای این سرمایه‌گذاری با ارزش
                    بهره‌مند شوید.
                </p>
            </div>
            <Exchange
            dict={dict}
            lang={lang}
            ids={[]}
            />
            {/* <ExchangeV2
                headerTitle='خرید و فروش طلا از طلانو'
                yourInventory={Number(wallet?.balance?.irt_balance)}
                loading={isLoading}
                goldValue={price?.buy_price_irt}
                className="w-full"
                dict={dict}
                lang={lang}
                ids={[
                    { key: 'all', value: wallet?.balance?.irt_balance, title: dict.totalInventory },
                    { key: '200', value: '200000', title: `200 ${dict.countingUnit.thousand} ${dict.toman}` },
                    { key: '500', value: '500000', title: `500 ${dict.countingUnit.thousand} ${dict.toman}` },
                    { key: '2000', value: '2000000', title: `2 ${dict.countingUnit.million} ${dict.toman}` },
                ]}
            /> */}

        </div>
    );
}
