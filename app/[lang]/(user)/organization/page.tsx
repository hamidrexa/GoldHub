import { isMobile } from 'react-device-detect';
import { ProductsNavigator } from '@/components/products-navigator';
import React from 'react';
import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'راهکار سازمانی | سهمتو',
};

export default async function OrganizationPage({ params: { lang } }) {
    const dict = await getDictionary(lang);

    return (
        <main className="main">
            <div className="jumbotron">
                {!isMobile && <ProductsNavigator dict={dict} lang={lang} />}
                <div className="w-full">
                    <div className="mx-auto w-full max-w-5xl p-6">
                        <h1 className="mb-7 mt-5 text-center text-3xl font-black leading-relaxed lg:mb-12 lg:text-4xl">
                            با دسترسی و تحلیل به موقع اخبار سود سبدت رو تضمین کن
                        </h1>
                        <h2 className="mb-2 text-xl font-bold">
                            چرا مشتریان سهمتو، حساب سازمانی دارند؟
                        </h2>
                        <ul className="list-disc space-y-5 pr-6">
                            <li>
                                <b>جامعیت:</b> سهمتو بیشترین پوشش در حوزه
                                اطلاعات سرمایه گذاری را در شبکه‌های اجتماعی
                                دارد. اطلاعات سرمایه‌گذاران شخصی، کارگزاری‌ها،
                                سبدگردان‌ها، خبرگزاری‌ها از جمله اطلاعاتی است که
                                سهمتو آن‌ها را برایتان جمع‌آوری و تحلیل می‌کند.
                            </li>
                            <li>
                                <b>دقت:</b> هیچ چیز برای سهمتو مهمتر از ارائه
                                داده دقیق به مشتریان نیست. به همین دلیل اخبار
                                شبکه‌های اجتماعی توسط هوش مصنوعی تحلیل و سپس
                                توسط تحلیل‌گران سهمتو ارزیابی و تایید می‌شود.
                            </li>
                            <li>
                                <b>به روزرسانی لحظه‌ای:</b> سهمتو در تلاش است در
                                کمترین زمان ممکن داده‌های منتشره را جمع‌آوری و
                                تحلیل کند و در اختیار مشتریان خود قرار دهد تا
                                بتوانند با سرعت و دقت بالا تصمیمات لازم را
                                بگیرند.
                            </li>
                            <li>
                                <b>پوشش 360 درجه:</b> مشتریان سهمتو می‌توانند در
                                هر لحظه اطلاعات تمام نمادهای بورسی، ETF ها،
                                صندوق‌های درآمد ثابت، دلار و رمزارز‌ها را در یک
                                محیط بررسی نمایند و نیازی به مراجعه به منابع
                                مختلف برای بررسی ندارند.
                            </li>
                        </ul>
                        <h2 className="mt-6 text-xl font-bold">
                            سوالات خود را همین الان از ما بپرسید:
                        </h2>
                    </div>
                    <iframe
                        src="https://www.goftino.com/c/14EQFs"
                        className="z-50 mx-auto h-[550px] w-full max-w-xl"
                    />
                </div>
            </div>
        </main>
    );
}
