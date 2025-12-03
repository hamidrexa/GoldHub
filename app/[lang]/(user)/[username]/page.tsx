import React from 'react';
import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BrokerPublicPage from './components/broker-public-page';
import { Locale } from '@/i18n-config';
import { supabase } from "@/services/supabase";

type Props = {
    params: {
        lang: Locale;
        username: string;
    };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return {
        title: `${params.username} | طلانو`,
        description: `صفحه کارگزار ${params.username} - مشاهده انواع قراردادهای سرمایه‌گذاری`,
    };
}

export async function generateStaticParams() {
    const { data: brokers } = await supabase
        .from("talanow_brokers")
        .select("username");

    return brokers?.map((broker) => ({ username: broker.username })) || [];
}

const BrokerPage = async ({ params: { username, lang } }: Props) => {

    const { data: broker, error } = await supabase
        .from("talanow_brokers")
        .select("*")
        .eq("username", username)
        .single();

    if (error || !broker) {
        return <div>صفحه مورد نظر یافت نشد.</div>;
    }
    const dictionary = await getDictionary(lang);

    return (
        <BrokerPublicPage broker={broker} dict={dictionary} lang={lang} />
    );
};

export default BrokerPage;
