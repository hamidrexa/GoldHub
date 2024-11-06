'use client';

import { Locale } from '@/i18n-config';
import Exchange from '@/components/exchange';
import { cn } from '@/libs/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
                    بهره‌مند شوید.
                </p>
                <div className='flex w-full justify-center'>
                    <Link 
                    className='flex w-full justify-center md:justify-start'
                    href={'/app'}>
                        <Button className='text-white w-full max-w-md md:max-w-[150px]' >
                            ورود به اپلیکیشن
                        </Button>
                    </Link>
                </div>
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
