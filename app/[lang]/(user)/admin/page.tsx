import React from 'react';
import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import BrokerList from '@/app/[lang]/(user)/admin/components/broker-list';
import ContractTypes from '@/app/[lang]/(user)/admin/components/contract-types';
import GuaranteeTypes from '@/app/[lang]/(user)/admin/components/guarantee-types';
import { AdminOverviewSection } from '@/app/[lang]/(user)/admin/components/admin-overview';
import { Icons } from '@/components/ui/icons';
import AdminGuard from '@/app/[lang]/(user)/admin/components/guard';

export const metadata: Metadata = {
    title: 'قرارداد ها | طلانو',
    description: '',
};

export default async function AdminPage({ params: { lang } }) {
    const dict = await getDictionary(lang);

    return (
        <main className="main">
            <div className="jumbotron">
                <AdminGuard lang={lang}>
                    <div className="flex w-full justify-center">
                        <div className="relative flex w-full flex-col gap-6 px-0 text-black md:max-w-2xl">
                            <AdminOverviewSection />

                            <div className="relative flex w-full flex-col gap-6 rounded-md border-gray-400 bg-white px-4 py-6 md:border">
                                <div className="flex flex-row items-center justify-between">
                                    <div className="flex flex-row gap-[10px]">
                                        <Icons.barChart3 stroke="#0C0E3C" />
                                        <h2 className="text-[22px] font-bold">مدیریت تضامین</h2>
                                    </div>
                                    <div className="cursor-pointer">
                                        <Icons.question />
                                    </div>
                                </div>
                                <GuaranteeTypes />
                            </div>

                            <div className="relative flex w-full flex-col gap-6 rounded-md border-gray-400 bg-white px-4 py-6 md:border">
                                <div className="flex flex-row items-center justify-between">
                                    <div className="flex flex-row gap-[10px]">
                                        <Icons.barChart3 stroke="#0C0E3C" />
                                        <h2 className="text-[22px] font-bold">لیست بروکرها</h2>
                                    </div>
                                    <div className="cursor-pointer">
                                        <Icons.question />
                                    </div>
                                </div>
                                <BrokerList dict={dict} lang={lang} />
                            </div>

                            <div className="relative flex w-full flex-col gap-6 rounded-md border-gray-400 bg-white px-4 py-6 md:border">
                                <div className="flex flex-row items-center justify-between">
                                    <div className="flex flex-row gap-[10px]">
                                        <Icons.barChart3 stroke="#0C0E3C" />
                                        <h2 className="text-[22px] font-bold">قراردادهای سرمایه‌گذاری</h2>
                                    </div>
                                    <div className="cursor-pointer">
                                        <Icons.question />
                                    </div>
                                </div>
                                <ContractTypes dict={dict} lang={lang} />
                            </div>
                        </div>
                    </div>
                </AdminGuard>
            </div>
        </main>
    );
}
