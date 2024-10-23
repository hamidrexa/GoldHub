import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';

type Props = {
    params: { id: string; lang: Locale };
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
    { params: { lang } }: Props,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const seoTitle = dict.aboutUsTitle;
    const seoDescription = '';

    return {
        title: seoTitle,
        description: seoDescription,
        openGraph: {
            title: seoTitle,
            description: seoDescription,
        },
        alternates: {
            canonical: '',
        },
    };
}

export default function AboutUs() {
    return (
        <div className="mx-6 my-16 max-w-7xl md:mx-auto ">
            <div className="flex flex-col items-center justify-center">
                <div className="flex w-full flex-col items-center justify-between gap-12 md:flex-row md:items-start">
                    <div>
                        <div className="max-w-sm">
                            <h2 className="text-2xl font-black">
                                طلانو برای سرمایه گذاران در بورس :
                            </h2>
                            <h6 className="text-base font-normal">
                                افراد برای سرمایه گذاری در بورس یا وقت کافی برای
                                جمع آوری اطلاعات ندارند یا دانش کافی جهت تحلیل
                                بورس را ندارند.
                            </h6>
                        </div>
                    </div>
                    <div>
                        <div className="max-w-lg">
                            <h2 className="text-2xl font-black">
                                طلانو برای تریدرها در بورس :
                            </h2>
                            <h6 className="text-base font-normal">
                                تریدرها برای سود کردن بیشتر نیاز دارند همه
                                اطلاعات بازار را به موقع داشته باشند ولی قادر
                                دنبال کردن همه کانال ها نیستند و معیاری برای
                                سنجش کانال ها هم ندارند.
                            </h6>
                        </div>
                    </div>
                </div>
                <h4 className="relative z-10 my-24 text-center text-2xl leading-10 md:px-36">
                    طلانو کمک میکند تا هر آنچه نیاز است از اطلاعات بورسی و شبکه
                    اجتماعی برای انتخاب سهم خوب، خرید و فروش و زمان خوب معامله
                    را در اختیار مخاطبان قرار دهد.
                    <span className="absolute left-0 right-0 top-36 -z-10 text-center text-[350px] text-neutral-100">
                        ‘‘
                    </span>
                </h4>
            </div>
            <img
                className="w-full"
                alt="about"
                src="/img/HeroBackground.webp"
            />
            <div className="my-12 flex flex-col items-center justify-center gap-3 text-center">
                <img
                    className="w-7 object-contain"
                    src="/img/sahmeto_send.png"
                    alt="طلانو چه میکند"
                />
                <div className="flex w-full items-center text-center text-[30px] font-black leading-[40px] tracking-[-0.6px] text-neutral-800">
                    <div className="flex-1 border-b border-neutral-100"></div>
                    <h4 className="mx-[20px] max-w-[550px] text-3xl font-black">
                        طلانو چه میکند
                    </h4>
                    <div className="flex-1 border-b border-neutral-100"></div>
                </div>
            </div>
            <div className="mx-12 flex flex-col items-center justify-between md:flex-row md:items-start">
                <div className="flex justify-center">
                    <div className="group relative flex h-[277px] w-[358px] flex-col items-center justify-center p-[51px_65px_57px_66px] text-center transition-all duration-300 hover:bg-white hover:shadow-2xl">
                        <h5 className="max-w-[200px] text-[25px] font-black leading-[1.32] tracking-[-0.5px] text-neutral-800 sm:max-w-fit">
                            جمع آوری پیام های مربوط به بورس
                        </h5>
                        <p className="mt-[17px] max-w-[230px] text-[16px] text-base font-medium leading-7 tracking-[-0.48px] text-neutral-200 sm:max-w-fit">
                            معامله‌­گران بازار بورس بر اساس استراتژی معاملاتی
                            خود می‌توانند تکنیکالیست یا بنیادی‌کار باشند؛
                        </p>
                        <div className="absolute left-[33%] top-0 hidden h-[6px] w-[150px] bg-neutral-300 group-hover:block"></div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="group relative flex h-[277px] w-[358px] flex-col items-center justify-center p-[51px_65px_57px_66px] text-center transition-all duration-300 hover:bg-white hover:shadow-2xl">
                        <h5 className="max-w-[200px] text-[25px] font-black leading-[1.32] tracking-[-0.5px] text-neutral-800 sm:max-w-fit">
                            شخص کردن سیگنال خرید و فروش
                        </h5>
                        <p className="mt-[17px] max-w-[230px] text-[16px] text-base font-medium leading-7 tracking-[-0.48px] text-neutral-200 sm:max-w-fit">
                            معامله‌­گران بازار بورس بر اساس استراتژی معاملاتی
                            خود می‌توانند تکنیکالیست یا بنیادی‌کار باشند؛
                        </p>
                        <div className="absolute left-[33%] top-0 hidden h-[6px] w-[150px] bg-neutral-300 group-hover:block"></div>
                    </div>
                </div>
                <div>
                    <div className="group relative flex h-[277px] w-[358px] flex-col items-center justify-center p-[51px_65px_57px_66px] text-center transition-all duration-300 hover:bg-white hover:shadow-2xl">
                        <h5 className="max-w-[200px] text-[25px] font-black leading-[1.32] tracking-[-0.5px] text-neutral-800 sm:max-w-fit">
                            رتبه بندی و امتیازدهی به کانال ها
                        </h5>
                        <p className="mt-[17px] max-w-[230px] text-[16px] text-base font-medium leading-7 tracking-[-0.48px] text-neutral-200 sm:max-w-fit">
                            معامله‌­گران بازار بورس بر اساس استراتژی معاملاتی
                            خود می‌توانند تکنیکالیست یا بنیادی‌کار باشند؛
                        </p>
                        <div className="absolute left-[33%] top-0 hidden h-[6px] w-[150px] bg-neutral-300 group-hover:block"></div>
                    </div>
                </div>
            </div>
            <section className="relative mt-20 flex w-full flex-col items-center gap-12">
                <div className="flex w-full items-center text-center text-[30px] font-black leading-[40px] tracking-[-0.6px] text-neutral-800">
                    <div className="flex-1 border-b border-neutral-100"></div>
                    <h4 className="mx-[20px] max-w-[550px] text-3xl font-black leading-relaxed">
                        شرکت هوش مالی بینا با برند طلانو فعالیت دارد و از هسته
                        های زیر تشکیل شده است:
                    </h4>
                    <div className="flex-1 border-b border-neutral-100"></div>
                </div>
                {/*<div className="flex items-center justify-center">*/}
                {/*    <div>*/}
                {/*<span>تیم متخصصان بازار سرمایه</span>*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*        <span>تیم هوش مصنوعی</span>*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*        <span>تیم نرم افزار</span>*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*        <span>تیم توسعه کسب و کار</span>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <ul className="flex w-full list-disc flex-col items-center justify-center gap-16 marker:text-2xl marker:text-neutral-300 md:flex-row">
                    <li className="text-xl font-black">
                        تیم متخصصان بازار سرمایه
                    </li>
                    <li className="text-xl font-black">تیم هوش مصنوعی</li>
                    <li className="text-xl font-black">تیم نرم افزار</li>
                    <li className="text-xl font-black">تیم توسعه کسب و کار</li>
                </ul>
            </section>
        </div>
    );
}
