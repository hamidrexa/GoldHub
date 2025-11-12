import React from 'react';
import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import ContractTypes from '@/app/[lang]/(user)/broker/components/contract-types';
import GuaranteeTypes from '@/app/[lang]/(user)/broker/components/guarantee-types';
import MemberList from '@/app/[lang]/(user)/broker/components/member-list';
import { Icons } from '@/components/ui/icons';
import BrokerGuard from '@/app/[lang]/(user)/broker/components/guard';

export const metadata: Metadata = {
    title: 'قرارداد ها | طلانو',
    description: '',
};

export default async function ContractsPage({ params: { lang } }) {
    const dict = await getDictionary(lang);

    return (
        <main className="main">
            <div className="jumbotron">
                <BrokerGuard lang={lang}>
                    <div className="flex w-full justify-center">
                        <div className="relative flex w-full flex-col gap-6 px-0 text-black md:max-w-2xl">
                            <div className="relative flex w-full flex-col gap-6 rounded-md border-gray-400 bg-white px-4 py-6 md:border">
                                <div className="flex flex-row items-center justify-between">
                                    <div className="flex flex-row gap-[10px]">
                                        <Icons.barChart3 stroke="#0C0E3C" />
                                        <h2 className="text-[22px] font-bold">تعریف قرارداد سرمایه‌گذاری</h2>
                                    </div>
                                    <div className="cursor-pointer">
                                        <Icons.question />
                                    </div>
                                </div>
                                <ContractTypes dict={dict} lang={lang} />
                            </div>

                            <div className="relative flex w-full flex-col gap-6 rounded-md border-gray-400 bg-white px-4 py-6 md:border">
                                <div className="flex flex-row items-center justify-between">
                                    <div className="flex flex-row gap-[10px]">
                                        <Icons.shield stroke="#0C0E3C" />
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
                                        <h2 className="text-[22px] font-bold">لیست اعضا</h2>
                                    </div>
                                    <div className="cursor-pointer">
                                        <Icons.question />
                                    </div>
                                </div>
                                <MemberList dict={dict} lang={lang} />
                            </div>
                        </div>
                    </div>
                </BrokerGuard>
            </div>
        </main>
    );
}
