'use client';

import { Locale } from '@/i18n-config';
import Exchange from '@/components/exchange';
import { cn } from '@/libs/utils';

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
                <h2 className="text-4xl font-black">
                    سرمایه گذاری آسان در{' '}
                    <span className="text-neutral-800">طلا</span>
                </h2>
                <p className="text-justify text-base font-normal leading-loose">
                    طلا به عنوان یکی از محبوب‌ترین دارایی‌های با ارزش در جهان،
                    فرصتی بی‌نظیر برای سرمایه‌گذاری مطمئن و پایدار فراهم می‌کند.
                    با استفاده از پلتفرم طلامی، می‌توانید به راحتی و در هر لحظه
                    طلا خریداری کنید و از مزایای این سرمایه‌گذاری با ارزش
                    بهره‌مند شوید. طلامی با ارائه تحلیل‌های کارشناسان برتر
                    بازار، زمان مناسب خرید و فروش طلا را به کاربران دارای اشتراک
                    اطلاع می‌دهد تا تصمیمات بهتری در جهت افزایش سود خود بگیرند.
                </p>
            </div>
            <Exchange
                ids={{ 0: 'one-million-bargain', 1: 'five-million-bargain' }}
                className="w-full"
                dict={dict}
                lang={lang}
            />
        </div>
    );
}
