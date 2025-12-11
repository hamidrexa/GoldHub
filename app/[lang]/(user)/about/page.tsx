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
    const seoTitle = dict.aboutUsTitle || 'درباره ما | گلد‌هاب';
    const seoDescription =
        'گلد‌هاب، پلتفرم پیشرو در مبادلات عمده طلا و جواهرات، تامین‌کنندگان را مستقیماً به فروشندگان متصل می‌کند.';

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
        <div className="flex flex-col items-center justify-center bg-white text-neutral-800">
            {/* Hero Section */}
            <div className="relative w-full">
                <div className="absolute inset-0 z-10 bg-black/50"></div>
                <img
                    className="h-[400px] w-full object-cover md:h-[500px]"
                    alt="GoldHub Hero"
                    src="/img/HeroAbout.png"
                />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 px-4 text-center text-white">
                    <h1 className="text-4xl font-black leading-tight shadow-black drop-shadow-lg md:text-6xl">
                        گلد‌هاب
                        <br />
                        <span className="text-3xl font-bold md:text-4xl">
                            آینده بازار طلای ایران
                        </span>
                    </h1>
                    <p className="max-w-2xl text-lg font-medium leading-8 drop-shadow-md md:text-xl">
                        ما با ایجاد پلی امن و شفاف، تامین‌کنندگان طلا و جواهرات
                        را به بنکداران و فروشندگان سراسر کشور متصل می‌کنیم تا
                        گردش سرمایه سریع‌تر و هوشمندتر شود.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="mx-6 my-16 flex max-w-7xl flex-col items-center justify-center gap-16 md:mx-auto lg:my-24">
                <div className="flex flex-col items-center justify-between gap-12 lg:flex-row lg:items-start">
                    <div className="flex-1 space-y-6">
                        <div className="max-w-xl">
                            <h2 className="mb-4 text-3xl font-black text-violet-900">
                                چرا گلد‌هاب؟
                            </h2>
                            <p className="text-justify text-lg font-normal leading-8 text-neutral-600">
                                بازار سنتی طلا همواره با چالش‌هایی نظیر عدم
                                شفافیت قیمت، محدودیت‌های جغرافیایی در تامین کالا
                                و ریسک‌های امنیتی معاملات فیزیکی روبرو بوده است.
                                گلد‌هاب آمده است تا این موانع را برطرف کند. ما
                                یک اکوسیستم دیجیتال B2B خلق کرده‌ایم که در آن
                                تولیدکنندگان می‌توانند ویترین محصولات خود را به
                                وسعت ایران گسترش دهند و فروشندگان می‌توانند بدون
                                واسطه و با بهترین قیمت، کالای مورد نیاز خود را
                                تامین کنند.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Values / Features - Grid */}
                <div className="relative w-full">
                    <div className="mb-12 flex w-full items-center text-center text-[30px] font-black leading-[40px] tracking-[-0.6px] text-neutral-800">
                        <div className="flex-1 border-b border-neutral-100"></div>
                        <h4 className="mx-[20px] max-w-[550px] text-2xl font-black md:text-3xl">
                            ارزش‌های بنیادین ما
                        </h4>
                        <div className="flex-1 border-b border-neutral-100"></div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {/* Feature 1 */}
                        <div className="group relative flex h-auto flex-col items-center justify-start rounded-2xl border border-neutral-100 bg-white p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="40"
                                    height="40"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <h5 className="mb-4 text-xl font-black text-neutral-800">
                                امنیت و اعتماد
                            </h5>
                            <p className="text-md leading-7 text-neutral-500">
                                تمام کاربران گلد‌هاب اعم از تامین‌کنندگان و
                                خریداران، از طریق فرآیند دقیق احراز هویت (KYC)
                                و اعتبارسنجی تایید می‌شوند تا محیطی امن برای
                                تجارت شکل گیرد.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group relative flex h-auto flex-col items-center justify-start rounded-2xl border border-neutral-100 bg-white p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="40"
                                    height="40"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="12" y1="1" x2="12" y2="23"></line>
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                </svg>
                            </div>
                            <h5 className="mb-4 text-xl font-black text-neutral-800">
                                شفافیت قیمت
                            </h5>
                            <p className="text-md leading-7 text-neutral-500">
                                دسترسی لحظه‌ای به قیمت‌های واقعی بازار و حذف
                                واسطه‌های غیرضروری، به شما کمک می‌کند تا با
                                حاشیه سود مطمئن‌تری معامله کنید.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group relative flex h-auto flex-col items-center justify-start rounded-2xl border border-neutral-100 bg-white p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="40"
                                    height="40"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                                </svg>
                            </div>
                            <h5 className="mb-4 text-xl font-black text-neutral-800">
                                دسترسی همگانی
                            </h5>
                            <p className="text-md leading-7 text-neutral-500">
                                در هر نقطه از ایران که هستید، ویترین بزرگ‌ترین
                                بنکداران تهران و مشهد و اصفهان در جیب شماست.
                                سفارش دهید و در محل خود تحویل بگیرید.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Team / Structure Section */}
                <section className="relative mt-12 flex w-full flex-col items-center gap-12 rounded-3xl bg-neutral-50 px-6 py-16 md:px-24">
                    <div className="flex w-full items-center text-center text-[30px] font-black leading-[40px] tracking-[-0.6px] text-neutral-800">
                        <div className="flex-1 border-b border-neutral-200"></div>
                        <h4 className="mx-[20px] max-w-[550px] text-2xl font-black md:text-3xl">
                            ساختار سازمانی گلد‌هاب
                        </h4>
                        <div className="flex-1 border-b border-neutral-200"></div>
                    </div>

                    <p className="max-w-3xl text-center text-lg leading-relaxed text-neutral-600">
                        گلد‌هاب محصولی از شرکت «هوش تجارت زرین» است که با
                        بهره‌گیری از نخبگان صنعت طلا و متخصصان فناوری اطلاعات،
                        استانداردهای جدیدی را در بازار تعریف می‌کند. تیم‌های ما
                        شامل:
                    </p>

                    <div className="flex w-full flex-wrap justify-center gap-8 md:gap-16">
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                                <span className="text-3xl">💎</span>
                            </div>
                            <span className="text-lg font-bold text-neutral-800">
                                تیم کارشناسی طلا
                            </span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                                <span className="text-3xl">💻</span>
                            </div>
                            <span className="text-lg font-bold text-neutral-800">
                                تیم فنی و توسعه
                            </span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                                <span className="text-3xl">⚖️</span>
                            </div>
                            <span className="text-lg font-bold text-neutral-800">
                                واحد حقوقی و قراردادها
                            </span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                                <span className="text-3xl">🤝</span>
                            </div>
                            <span className="text-lg font-bold text-neutral-800">
                                پشتیبانی و مشتریان
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
