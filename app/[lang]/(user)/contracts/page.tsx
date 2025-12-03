import React from 'react';
import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import CreateContract from '@/app/[lang]/(user)/contracts/components/create-contract';
import ContractsList from '@/app/[lang]/(user)/contracts/components/contracts-list';
import { Icons } from '@/components/ui/icons';

export const metadata: Metadata = {
    title: 'قرارداد ها | طلانو',
    description: '',
};

export default async function ContractsPage({ params: { lang }, searchParams }) {
    const dict = await getDictionary(lang);

    return (
        <main className="main">
            <div className="jumbotron">
                <div className="flex w-full justify-center">
                    <div className="relative flex w-full flex-col gap-6 px-0 text-black md:max-w-2xl">
                        <div className="relative flex w-full flex-col gap-6 rounded-md border-gray-400 bg-white px-4 py-6 md:border">
                            <div className="flex flex-row items-center justify-between">
                                <div className="flex flex-row gap-[10px]">
                                    <Icons.barChart3 stroke="#0C0E3C" />
                                    <h2 className="text-[22px] font-bold">ایجاد قرارداد</h2>
                                </div>
                                <div className="cursor-pointer">
                                    <Icons.question />
                                </div>
                            </div>
                            <CreateContract dict={dict} lang={lang} />
                        </div>

                        <div className="relative flex w-full flex-col gap-6 rounded-md border-gray-400 bg-white px-4 py-6 md:border">
                            <div className="flex flex-row items-center justify-between">
                                <div className="flex flex-row gap-[10px]">
                                    <Icons.barChart3 stroke="#0C0E3C" />
                                    <h2 className="text-[22px] font-bold">قراردادهای جاری</h2>
                                </div>
                                <div className="cursor-pointer">
                                    <Icons.question />
                                </div>
                            </div>
                            <ContractsList dict={dict} lang={lang} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
