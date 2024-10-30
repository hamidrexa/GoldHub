'use client';

import { Locale } from '@/i18n-config';
import Exchange from '@/components/exchange';
import { cn } from '@/libs/utils';
import ExchangeV2 from '@/components/exchangeV2';
import ChartBox from '@/components/chart-box';

type bargainingProps = {
    dict: any;
    lang: Locale;
    className?: string;
};

export default function Bargain({ dict, lang, className }: bargainingProps) {
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
                    بهره‌مند شوید. طلانو با ارائه تحلیل‌های کارشناسان برتر
                    بازار، زمان مناسب خرید و فروش طلا را به کاربران دارای اشتراک
                    اطلاع می‌دهد تا تصمیمات بهتری در جهت افزایش سود خود بگیرند.
                </p>
            </div>
            {/* <Exchange
                ids={{ 0: 'one-million-bargain', 1: 'five-million-bargain' }}
                className="w-full"
                dict={dict}
                lang={lang}
            /> */}
            <ExchangeV2
                headerTitle='خرید و فروش طلا از طلانو'
                yourInventory={25000000}
                className="w-full"
                dict={dict}
                lang={lang}
                ids={[
                    { key: 'all', value: 'all', title: dict.totalInventory },
                    { key: '200', value: '200000', title: `200 ${dict.countingUnit.thousand} ${dict.toman}` },
                    { key: '500', value: '500000', title: `200 ${dict.countingUnit.thousand} ${dict.toman}` },
                    { key: '2000', value: '2000000', title: `200 ${dict.countingUnit.million} ${dict.toman}` },
                ]}
            />
              <ChartBox
                headerTitle='قیمت لحظه ای طلا'
                price={40900586}
                percentage={1.9}
                measurementTitle='هر گرم'
                className="w-full"
                dict={dict}
                lang={lang}
                ids={[
                    { key: 'all', value: 'all', title: dict.totalInventory },
                    { key: '200', value: '200000', title: `200 ${dict.countingUnit.thousand} ${dict.toman}` },
                    { key: '500', value: '500000', title: `200 ${dict.countingUnit.thousand} ${dict.toman}` },
                    { key: '2000', value: '2000000', title: `200 ${dict.countingUnit.million} ${dict.toman}` },
                ]}
            />
        </div>
    );
}
