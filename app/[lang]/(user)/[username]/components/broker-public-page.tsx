'use client';

import React, { useEffect, useState } from 'react';
import { ContractType, supabase } from '@/services/supabase';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type Props = {
    broker: any;
    dict: any;
    lang: string;
};

export default function BrokerPublicPage({ broker, dict, lang }: Props) {
    const router = useRouter();
    const [contractTypes, setContractTypes] = useState<ContractType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function fetchContractTypes() {
            if (!broker?.id) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('talanow_broker_contract_types_link')
                    .select('talanow_contract_types(*)')
                    .eq('broker_id', broker.id);

                if (!mounted) return;

                if (error) {
                    console.error('Error fetching contract types:', error);
                    setContractTypes([]);
                } else {
                    const types = (data?.map(item => item.talanow_contract_types) || []).flat() as ContractType[];
                    // Filter only active contract types
                    setContractTypes(types.filter(t => t.active !== false));
                }
            } catch (err) {
                console.error('Error:', err);
                setContractTypes([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        fetchContractTypes();
        return () => {
            mounted = false;
        };
    }, [broker?.id]);

    const handleStartContract = () => {
        // Redirect to login or contracts page
        router.push(`/${lang}/login`);
    };

    const displayName = broker?.full_name?.trim()
        || `${broker?.first_name ?? ''} ${broker?.last_name ?? ''}`.trim()
        || broker?.username
        || 'کارگزار';

    return (
        <div className="flex w-full justify-center">
            <div className="relative flex w-full flex-col gap-6 px-4 text-black md:max-w-4xl">
                {/* Broker Header */}
                <div className="relative flex w-full flex-col gap-4 rounded-md border-gray-400 bg-white px-6 py-8 md:border">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#0C0E3C] to-[#1a1d5c] text-white text-3xl font-bold">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-[#0C0E3C]">{displayName}</h1>
                            <p className="mt-2 text-lg text-[#5A5C83]">کارگزار معتمد طلانو</p>
                        </div>
                        {broker?.email && (
                            <div className="text-sm text-[#5A5C83]">{broker.email}</div>
                        )}
                    </div>

                    <div className="mt-4 rounded-lg bg-gradient-to-r from-[#0C0E3C]/5 to-[#1a1d5c]/5 p-6 text-center">
                        <p className="text-base leading-relaxed text-[#0C0E3C]">
                            با استفاده از قراردادهای سرمایه‌گذاری ما، می‌توانید در بازار طلا سرمایه‌گذاری امن و سودآوری داشته باشید.
                            انواع قراردادهای سرمایه‌گذاری را مشاهده کنید و با ما همکاری کنید.
                        </p>
                    </div>
                </div>

                {/* Contract Types Section */}
                <div className="relative flex w-full flex-col gap-6 rounded-md border-gray-400 bg-white px-6 py-8 md:border">
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row gap-3">
                            <Icons.barChart3 stroke="#0C0E3C" className="h-6 w-6" />
                            <h2 className="text-2xl font-bold text-[#0C0E3C]">قراردادهای سرمایه‌گذاری</h2>
                        </div>
                    </div>

                    {loading && (
                        <div className="py-8 text-center text-sm text-[#5A5C83]">
                            در حال بارگذاری قراردادها...
                        </div>
                    )}

                    {!loading && contractTypes.length === 0 && (
                        <div className="py-8 text-center text-sm text-[#5A5C83]">
                            در حال حاضر قراردادی موجود نیست.
                        </div>
                    )}

                    {!loading && contractTypes.length > 0 && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {contractTypes.map((contractType) => (
                                <div
                                    key={contractType.id}
                                    className="flex flex-col gap-4 rounded-lg border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm transition-all hover:border-[#0C0E3C]/20 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between">
                                        <h3 className="text-xl font-bold text-[#0C0E3C]">
                                            {contractType.name}
                                        </h3>
                                        {contractType.profit_share && (
                                            <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                                                {contractType.profit_share}% سود
                                            </div>
                                        )}
                                    </div>

                                    {contractType.description && (
                                        <p className="text-sm leading-relaxed text-[#5A5C83]">
                                            {contractType.description}
                                        </p>
                                    )}

                                    <div className="flex flex-col gap-2 text-sm">
                                        {contractType.min_investment && (
                                            <div className="flex items-center justify-between rounded-md bg-white p-2">
                                                <span className="text-[#5A5C83]">حداقل سرمایه‌گذاری:</span>
                                                <span className="font-semibold text-[#0C0E3C]">
                                                    {contractType.min_investment.toLocaleString('fa-IR')} ریال
                                                </span>
                                            </div>
                                        )}

                                        {contractType.max_investment && (
                                            <div className="flex items-center justify-between rounded-md bg-white p-2">
                                                <span className="text-[#5A5C83]">حداکثر سرمایه‌گذاری:</span>
                                                <span className="font-semibold text-[#0C0E3C]">
                                                    {contractType.max_investment.toLocaleString('fa-IR')} ریال
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between rounded-md bg-white p-2">
                                            <span className="text-[#5A5C83]">مدت قرارداد:</span>
                                            <span className="font-semibold text-[#0C0E3C]">
                                                {contractType.min_duration_months} تا {contractType.max_duration_months} ماه
                                            </span>
                                        </div>

                                        {contractType.guarantee_type && contractType.guarantee_type.length > 0 && (
                                            <div className="flex items-center justify-between rounded-md bg-white p-2">
                                                <span className="text-[#5A5C83]">انواع تضامین:</span>
                                                <span className="font-semibold text-[#0C0E3C]">
                                                    {contractType.guarantee_type.join('، ')}
                                                </span>
                                            </div>
                                        )}

                                        {contractType.settlement_type && contractType.settlement_type.length > 0 && (
                                            <div className="flex items-center justify-between rounded-md bg-white p-2">
                                                <span className="text-[#5A5C83]">انواع تسویه:</span>
                                                <span className="font-semibold text-[#0C0E3C]">
                                                    {contractType.settlement_type.join('، ')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Call to Action */}
                    {!loading && contractTypes.length > 0 && (
                        <div className="mt-6 flex flex-col items-center gap-4 rounded-lg bg-gradient-to-r from-[#0C0E3C] to-[#1a1d5c] p-8 text-white">
                            <h3 className="text-xl font-bold">آماده شروع همکاری هستید؟</h3>
                            <p className="text-center text-sm">
                                برای شروع قرارداد سرمایه‌گذاری با {displayName}، وارد حساب کاربری خود شوید یا ثبت‌نام کنید.
                            </p>
                            <Button
                                onClick={handleStartContract}
                                className="bg-white text-[#0C0E3C] hover:bg-gray-100"
                                size="xl"
                            >
                                شروع قرارداد
                            </Button>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="rounded-md bg-gray-50 p-4 text-center text-xs text-[#5A5C83]">
                    این صفحه متعلق به کارگزار {displayName} در پلتفرم طلانو می‌باشد.
                </div>
            </div>
        </div>
    );
}
