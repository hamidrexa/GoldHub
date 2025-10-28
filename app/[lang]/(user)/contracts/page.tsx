import React from 'react';
import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import CreateContract from '@/app/[lang]/(user)/contracts/components/create-contract';
import ContractsList from '@/app/[lang]/(user)/contracts/components/contracts-list';

export const metadata: Metadata = {
    title: 'قرارداد ها | طلانو',
    description: '',
};

export default async function ContractsPage({ params: { lang }, searchParams }) {
    const dict = await getDictionary(lang);

    return (
        <main className="main">
            <div className="jumbotron">
                <div className="w-full">
                    <CreateContract dict={dict} lang={lang} />
                    <ContractsList dict={dict} lang={lang} />
                </div>
            </div>
        </main>
    );
}
