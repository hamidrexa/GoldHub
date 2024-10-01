'use client';

import { Locale } from '@/i18n-config';
import Exchange from '@/components/exchange';
import { useGlobalContext } from '@/contexts/store';
import { cn } from '@/libs/utils';

type bargainingProps = {
    asset: any;
    dict: any;
    lang: Locale;
    className?: string;
};
export default function Bargain({
    asset,
    dict,
    lang,
    className,
}: bargainingProps) {
    const { user } = useGlobalContext();
    return (
        <div
            className={cn(
                'hidden h-96 items-start rounded-lg border border-neutral-100 bg-white px-4 md:flex md:w-full md:justify-between md:px-10',
                className
            )}
        >
            <div className="flex max-w-fit flex-col gap-12 py-12">
                <h2 className="text-4xl font-black">
                    سرمایه گذاری آسان در بیت کوین
                </h2>
                <p className="max-w-96 text-justify text-base font-normal leading-loose">
                    بیت کوین (Bitcoin)، به عنوان یکی از محبوب‌ترین دارایی‌های
                    دیجیتال، فرصتی بی‌نظیر برای سرمایه‌گذاری در دنیای ارزهای
                    دیجیتال فراهم می‌کند. با استفاده از طلامی، شما می‌توانید به
                    راحتی و در هر لحظه بیت کوین خریداری کنید و از فرصت‌های
                    سرمایه‌گذاری پرسود این بازار بهره‌مند شوید. طلامی با ارائه
                    تحلیل‌های تریدرهای برتر، زمان مناسب خرید و فروش بیت کوین را
                    به کاربران دارای اشتراک اطلاع می‌دهد تا تصمیمات بهتری در
                    بازار ارزهای دیجیتال بگیرند.
                </p>
                {/*{!user && (*/}
                {/*    <Link*/}
                {/*        className={cn(*/}
                {/*            buttonVariants({ variant: 'default' }),*/}
                {/*            'py-6 text-lg'*/}
                {/*        )}*/}
                {/*        href={`${getLinksLang(lang)}/login`}*/}
                {/*    >*/}
                {/*        ثبت نام*/}
                {/*    </Link>*/}
                {/*)}*/}
            </div>
            <Exchange
                ids={{ 0: 'one-million-bargain', 1: 'five-million-bargain' }}
                className="my-auto h-fit min-w-96"
                dict={dict}
                lang={lang}
                asset={asset}
            />
        </div>
    );
}
