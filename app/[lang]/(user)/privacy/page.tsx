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
    const seoTitle = dict.rules || 'قوانین و مقررات | گلد‌هاب';
    const seoDescription =
        'قوانین و مقررات استفاده از پلتفرم مبادلات طلای گلد‌هاب برای تامین‌کنندگان و خریداران.';

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

export default function Privacy() {
    return (
        <div className="mx-auto my-12 flex max-w-5xl flex-col gap-8 px-6 text-justify leading-loose md:px-12">
            {/* Header */}
            <div className="border-b border-neutral-200 pb-6">
                <h1 className="mb-4 text-3xl font-black text-neutral-800 md:text-4xl">
                    قوانین و مقررات گلد‌هاب
                </h1>
                <p className="text-lg text-neutral-500">
                    آخرین بروزرسانی: ۲۰ آذر ۱۴۰۲
                </p>
            </div>

            {/* Intro */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-violet-900">
                    ۱. مقدمه و کلیات
                </h2>
                <p className="text-lg text-neutral-700">
                    به پلتفرم گلد‌هاب خوش آمدید. گلد‌هاب یک بازارگاه (Marketplace)
                    تخصصی B2B برای مبادلات طلا، جواهرات و مصنوعات گرانبها است که
                    ارتباط میان تامین‌کنندگان (بنکداران، کیفی‌ها، کارگاه‌ها) و
                    فروشندگان (مغازه‌داران، گالری‌ها) را تسهیل می‌کند. استفاده
                    از خدمات گلد‌هاب به منزله پذيرش کامل این قوانین است.
                </p>
            </section>

            {/* Definitions */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-violet-900">
                    ۲. تعاریف
                </h2>
                <ul className="list-inside list-disc space-y-2 text-lg text-neutral-700 marker:text-amber-500">
                    <li>
                        <strong>گلد‌هاب:</strong> منظور پلتفرم نرم‌افزاری (وب‌سایت
                        و اپلیکیشن) است که بستر معاملات را فراهم می‌کند.
                    </li>
                    <li>
                        <strong>تامین‌کننده (Supplier):</strong> شخص حقیقی یا
                        حقوقی دارای مجوز کسب و کار معتبر در صنف طلا و جواهر که
                        محصولات خود را برای فروش عمده عرضه می‌کند.
                    </li>
                    <li>
                        <strong>خریدار (Retailer):</strong> شخص حقیقی یا حقوقی
                        دارای پروانه کسب معتبر که اقدام به خرید عمده محصولات
                        برای فروش در واحد صنفی خود می‌نماید.
                    </li>
                    <li>
                        <strong>کاربر:</strong> هر شخصی که در سامانه ثبت نام
                        کرده باشد.
                    </li>
                </ul>
            </section>

            {/* Account & KYC */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-violet-900">
                    ۳. حساب کاربری و احراز هویت
                </h2>
                <p className="text-lg text-neutral-700">
                    فعالیت در گلد‌هاب مستلزم احراز هویت دقیق تجاری است.
                </p>
                <ol className="list-inside list-decimal space-y-3 text-lg text-neutral-700">
                    <li>
                        تمامی کاربران برای فعالیت تجاری ملزم به بارگذاری مدارک
                        هویتی (کارت ملی/شناسنامه) و مدارک شغلی (پروانه کسب معتبر
                        صنف طلا و جواهر) هستند.
                    </li>
                    <li>
                        گلد‌هاب این حق را دارد که صحت مدارک را از مراجع ذی‌صلاح
                        (اتحادیه طلا و جواهر، سامانه جامع تجارت) استعلام نماید.
                    </li>
                    <li>
                        مسئولیت حفظ امنیت نام کاربری و رمز عبور بر عهده کاربر
                        است و هرگونه فعالیت با حساب کاربری، قانونی و به نام صاحب
                        حساب تلقی می‌شود.
                    </li>
                </ol>
            </section>

            {/* Purchase & Sales Rules */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-violet-900">
                    ۴. قوانین خرید و فروش
                </h2>
                <div className="rounded-xl bg-amber-50 p-6 text-lg text-neutral-800">
                    <p className="font-bold">⚠️ توجه مهم:</p>
                    <p className="mt-2">
                        قیمت‌گذاری محصولات در گلد‌هاب بر اساس نرخ لحظه‌ای طلا
                        (مظنه) به علاوه اجرت ساخت و سود تامین‌کننده محاسبه
                        می‌شود. با توجه به نوسانات بازار، قیمت نهایی در زمان
                        تایید سفارش و پیش‌پرداخت قطعی می‌گردد.
                    </p>
                </div>
                <ul className="list-inside list-disc space-y-2 text-lg text-neutral-700 marker:text-amber-500">
                    <li>
                        تامین‌کننده موظف است مشخصات دقیق محصول شامل وزن، عیار
                        (۷۵۰)، کد استاندارد و اجرت را به درستی درج نماید.
                    </li>
                    <li>
                        صدور فاکتور رسمی طبق قوانین نظام صنفی و مالیاتی بر عهده
                        تامین‌کننده می‌باشد.
                    </li>
                    <li>
                        خریدار موظف است تسویه حساب را طبق شرایط توافق شده
                        (نقدی/مدت‌دار) در زمان مقرر انجام دهد.
                    </li>
                </ul>
            </section>

            {/* Logistics */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-violet-900">
                    ۵. حمل و نقل و تحویل
                </h2>
                <p className="text-lg text-neutral-700">
                    ارسال مرسولات طلا تابع قوانین سخت‌گیرانه امنیتی است:
                </p>
                <ul className="list-inside list-disc space-y-2 text-lg text-neutral-700 marker:text-amber-500">
                    <li>
                        حمل مرسولات تنها از طریق روش‌های تایید شده (پست بیمه
                        شده، پیک‌های معتمد طلا، تحویل حضوری در دفتر کیفی) امکان
                        پذیر است.
                    </li>
                    <li>
                        مسئولیت سلامت کالا تا زمان تحویل به خریدار (یا نماینده
                        قانونی وی) و دریافت رسید، بر عهده تامین‌کننده/شرکت حمل
                        است.
                    </li>
                    <li>
                        هنگام دریافت کالا، خریدار موظف است وزن و سلامت ظاهری
                        بسته را در حضور متصدی کنترل نماید.
                    </li>
                </ul>
            </section>

            {/* Fees */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-violet-900">
                    ۶. کارمزدها
                </h2>
                <p className="text-lg text-neutral-700">
                    گلد‌هاب بابت خدمات پلتفرم، درصدی از مبلغ اجرت ساخت یا سود
                    معامله را به عنوان کارمزد دریافت می‌کند. این مبلغ در هنگام
                    ثبت سفارش به خریدار نمایش داده می‌شود. حق اشتراک‌های ویژه
                    برای تامین‌کنندگان نیز تابع تعرفه‌های اعلامی در بخش پنل
                    کاربری است.
                </p>
            </section>

            {/* Privacy */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-violet-900">
                    ۷. حریم خصوصی
                </h2>
                <p className="text-lg text-neutral-700">
                    اطلاعات تجاری کاربران (حجم معاملات، طرفین معامله، لیست
                    مشتریان) محرمانه تلقی شده و گلد‌هاب متعهد به حفظ آن است. این
                    اطلاعات تنها با حکم مراجع قضایی در اختیار اشخاص ثالث قرار
                    خواهد گرفت.
                </p>
            </section>

            {/* Disputes */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-violet-900">
                    ۸. حل اختلاف
                </h2>
                <p className="text-lg text-neutral-700">
                    در صورت بروز اختلاف میان تامین‌کننده و خریدار (مغایرت وزن،
                    عیار، یا کیفیت ساخت)، کارشناسان معتمد گلد‌هاب به عنوان داور
                    مرضی‌الطرفین وارد عمل خواهند شد. رای کارشناسی گلد‌هاب برای
                    طرفین لازم‌الاجراست، مگر آنکه خلاف آن در مراجع قانونی اثبات
                    شود.
                </p>
            </section>

            <div className="mt-12 border-t border-neutral-200 pt-8 text-center">
                <p className="text-neutral-500">
                    سوالات بیشتر؟ با واحد حقوقی گلد‌هاب تماس بگیرید.
                </p>
                <div className="mt-4 text-xl font-bold text-violet-900">
                    ۰۲۱-۱۲۳۴۵۶۷۸
                </div>
            </div>
        </div>
    );
}
