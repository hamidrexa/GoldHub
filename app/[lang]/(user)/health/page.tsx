import { isMobile } from 'react-device-detect';
import { ProductsNavigator } from '@/components/products-navigator';
import React from 'react';
import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'سلامت | طلانو',
    description: '',
};

export default async function HealthPage({ params: { lang } }) {
    const dict = await getDictionary(lang);

    return (
        <main className="main">
            <div className="jumbotron">
                {!isMobile && <ProductsNavigator dict={dict} lang={lang} />}
                <div className="w-full">
                    <h1 className="mb-6 text-center text-3xl font-bold">
                        وضعیت سلامت طلانو
                    </h1>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-lg border border-gray-100 bg-white p-6">
                            <h2 className="mb-2 text-xl font-semibold">
                                پایگاه داده
                            </h2>
                            <p className="mb-4 text-base">
                                وضعیت:
                                <span className="mx-1 text-lg font-bold text-green-600">
                                    برخط
                                </span>
                            </p>
                            <p className="text-sm text-gray-600">
                                آخرین بررسی: دو دقیقه پیش
                            </p>
                        </div>
                        <div className="rounded-lg border border-gray-100 bg-white p-6">
                            <h2 className="mb-2 text-xl font-semibold">
                                وبسرویس ها
                            </h2>
                            <p className="mb-4 text-base">
                                وضعیت:
                                <span className="mx-1 text-lg font-bold text-green-600">
                                    برخط
                                </span>
                            </p>
                            <p className="text-sm text-gray-600">
                                آخرین بررسی: دو دقیقه پیش
                            </p>
                        </div>
                        <div className="rounded-lg border border-gray-100 bg-white p-6">
                            <h2 className="mb-2 text-xl font-semibold">
                                احراز هویت
                            </h2>
                            <p className="mb-4 text-base">
                                وضعیت:
                                <span className="mx-1 text-lg font-bold text-green-600">
                                    برخط
                                </span>
                            </p>
                            <p className="text-sm text-gray-600">
                                آخرین بررسی: دو دقیقه پیش
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
