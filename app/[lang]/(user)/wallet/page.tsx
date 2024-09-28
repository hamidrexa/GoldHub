import { isMobile } from 'react-device-detect';
import { ProductsNavigator } from '@/components/products-navigator';
import React from 'react';
import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import Wallet from '@/components/wallet';

export const metadata: Metadata = {
    title: 'کیف پول | سهمتو',
    description: '',
};

export default async function WalletPage({ params: { lang }, searchParams }) {
    const dict = await getDictionary(lang);

    return (
        <main className="main">
            <div className="jumbotron">
                {!isMobile && <ProductsNavigator dict={dict} lang={lang} />}
                <div className="w-full">
                    <Wallet dict={dict} lang={lang} />
                </div>
            </div>
        </main>
    );
}
