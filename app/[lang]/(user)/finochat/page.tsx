import React from 'react';
import { Metadata } from 'next';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/libs/utils';
import ContentCard from '@/app/[lang]/(user)/finochat/components/content-card';
import { Bot, Rocket, UserRoundPlus } from 'lucide-react';
import WordRotate from '@/components/magicui/word-rotate';

export const metadata: Metadata = {
    title: 'ربات هوشمند | سهمتو',
    description:
        'با بهره گیری از هوش مصنوعی، سهمتو قادر به ارائه اظلاعات نمادهای بورسی و ارزدیجیتال بصورت لحظه ای می باشد.',
};

export default function FinoChatPage() {
    const boxesInfo = [
        {
            title: 'ربات تحلیلگر بورس',
            text: (
                <p className="text-center text-base leading-relaxed">
                    {' '}
                    ابزار هوشمند برای تحلیل سریع و دقیق بازار بورس. فقط با ارسال
                    نام نماد، تحلیل تخصصی دریافت کنید.
                </p>
            ),
            icon: <Bot width={54} height={54} className="text-neutral-300" />,
        },
        {
            title: 'ویژگی‌های ربات',
            text: (
                <ul className="flex list-disc flex-col items-center justify-center space-y-3 leading-relaxed">
                    <li>تحلیل روزانه رایگان</li>
                    <li>اشتراک‌های متنوع</li>
                    <li>به‌روزرسانی‌های آنی</li>
                    <li>رابط کاربری ساده</li>
                </ul>
            ),
            icon: (
                <UserRoundPlus
                    width={54}
                    height={54}
                    className="text-neutral-300"
                />
            ),
        },
        {
            title: 'نحوه کار',
            text: (
                <ol className="flex list-decimal flex-col items-center justify-center space-y-3 leading-relaxed">
                    <li>ثبت نام با شماره تلگرام</li>
                    <li>دریافت تحلیل روزانه</li>
                    <li>ارتقا به اشتراک ویژه</li>
                </ol>
            ),
            icon: (
                <Rocket width={54} height={54} className="text-neutral-300" />
            ),
        },
    ];

    return (
        <div className="h-2xl mx-auto my-12 flex max-w-7xl flex-col items-center justify-center gap-24 bg-white p-6">
            <div className="relative flex w-full flex-col items-center justify-center gap-6 py-3">
                <div className=" absolute left-6 top-7 z-30 hidden h-24 w-96 animate-scale-pulse bg-gradient-to-r from-[#ff80b5] to-[#9089fc] blur-3xl md:block"></div>
                <div className=" absolute bottom-7 right-6 z-30 hidden h-24 w-96 animate-scale-pulse bg-gradient-to-r from-[#9089fc] to-[#ff80b5] blur-3xl md:block"></div>
                <h1 className="z-20 text-5xl font-black">بات سهمتو</h1>
                <h2 className="z-20 flex flex-col text-center text-2xl font-normal leading-relaxed text-neutral-200 md:flex-row md:items-center">
                    دستیار{' '}
                    <WordRotate
                        duration={1500}
                        className="flex min-w-24 items-center justify-center text-2xl text-neutral-300"
                        words={['هوشمند', 'سریع', 'دقیق']}
                    />{' '}
                    شما برای اطلاع از آخرین وضعیت بازار بورس و ارزدیجیتال
                </h2>
                <a
                    href="https://t.me/Finochat_bot"
                    className={cn(
                        buttonVariants({
                            variant: 'info',
                            size: 'default',
                        }),
                        'z-20 px-6 py-6 text-lg transition-all duration-500 hover:scale-105 hover:bg-blue-400'
                    )}
                >
                    همین الان شروع کن
                </a>
            </div>
            <div className="flex w-full flex-col justify-between gap-4 p-8 md:flex-row">
                {boxesInfo.map((item, index) => (
                    <ContentCard
                        key={index}
                        title={item.title}
                        text={item.text}
                        icon={item.icon}
                    />
                ))}
            </div>
        </div>
    );
}
