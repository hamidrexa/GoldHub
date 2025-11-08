'use client';

import React, { useEffect, useState } from 'react';
import { Icons } from '@/components/ui/icons';

import { cn } from '@/libs/utils';
import { supabase } from '@/services/supabase';
import Cookies from 'js-cookie';

type AdminOverviewProps = {
    className?: string;
    loading?: boolean;
    error?: string | null;
    stats: {
        contracts?: number | null;
        contractTypes?: number | null;
        brokers?: number | null;
        members?: number | null;
    };
};

type OverviewItemProps = {
    label: string;
    value?: number | null;
    icon: React.ReactNode;
    loading?: boolean;
};

const OverviewItem = ({ label, value, icon, loading }: OverviewItemProps) => {
    return (
        <div className="flex flex-col gap-2 rounded-md border border-gray-100 bg-gray-50 p-3">
            <div className="flex items-center gap-2 text-sm text-[#5A5C83]">
                {icon}
                <span>{label}</span>
            </div>
            <div className={cn('text-2xl font-bold', loading && 'text-[#5A5C83]')}>
                {loading ? '—' : value ?? '۰'}
            </div>
        </div>
    );
};

export function AdminOverview({ className, loading = false, error, stats }: AdminOverviewProps) {
    return (
        <div className={cn('flex w-full flex-col gap-4 rounded-md border border-gray-200 bg-white p-4 text-black shadow-sm', className)}>
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2">
                    <Icons.barChart3 stroke="#0C0E3C" />
                    <h2 className="text-lg font-bold">مرور کلی</h2>
                </div>
                {loading && <span className="text-xs text-[#5A5C83]">در حال بروزرسانی اطلاعات...</span>}
            </div>
            {error ? (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                    <OverviewItem
                        label="تعداد قراردادها"
                        value={stats.contracts ?? 0}
                        icon={<Icons.graph stroke="#0C0E3C" />}
                        loading={loading}
                    />
                    <OverviewItem
                        label="انواع قرارداد"
                        value={stats.contractTypes ?? 0}
                        icon={<Icons.category stroke="#0C0E3C" />}
                        loading={loading}
                    />
                    <OverviewItem
                        label="کارگزاران"
                        value={stats.brokers ?? 0}
                        icon={<Icons.barChart3 stroke="#0C0E3C" />}
                        loading={loading}
                    />
                    <OverviewItem
                        label="اعضای فعال"
                        value={stats.members ?? 0}
                        icon={<Icons.lineChart stroke="#0C0E3C" />}
                        loading={loading}
                    />
                </div>
            )}
        </div>
    );
}

type AdminOverviewSectionProps = {
    className?: string;
};

export function AdminOverviewSection({ className }: AdminOverviewSectionProps) {
    const [stats, setStats] = useState({
        contracts: 0,
        contractTypes: 0,
        brokers: 0,
        members: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const controller = new AbortController();

        async function loadStats() {
            setLoading(true);
            setError(null);
            try {
                const [contractsRes, contractTypesRes, membersRes] = await Promise.all([
                    supabase
                        .from('talanow_contracts')
                        .select('*', { count: 'exact', head: true }),
                    supabase
                        .from('talanow_contract_types')
                        .select('*', { count: 'exact', head: true }),
                    supabase
                        .from('talanow_broker_member_link')
                        .select('member_id', { count: 'exact', head: true }),
                ]);

                if (!mounted) return;

                if (contractsRes.error) throw contractsRes.error;
                if (contractTypesRes.error) throw contractTypesRes.error;
                if (membersRes.error) throw membersRes.error;

                const token = Cookies.get('token');
                if (!token) throw new Error('توکن کاربر یافت نشد');

                const brokersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/group_users?group_name=broker`, {
                    signal: controller.signal,
                    credentials: 'include',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!brokersResponse.ok) {
                    throw new Error('خطا در دریافت اطلاعات بروکرها');
                }

                const brokersPayload = await brokersResponse.json();
                const brokersList = Array.isArray(brokersPayload)
                    ? brokersPayload
                    : Array.isArray(brokersPayload?.results)
                        ? brokersPayload.results
                        : [];

                setStats({
                    contracts: contractsRes.count ?? 0,
                    contractTypes: contractTypesRes.count ?? 0,
                    brokers: brokersList.length,
                    members: membersRes.count ?? 0,
                });
            } catch (err: any) {
                if (err?.name === 'AbortError') return;
                setError(err?.message || 'خطا در دریافت اطلاعات مرور کلی');
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadStats();

        return () => {
            mounted = false;
            controller.abort();
        };
    }, []);

    return <AdminOverview className={className} loading={loading} error={error} stats={stats} />;
}
