'use client';

import React from 'react';
import { Icons } from '@/components/ui/icons';

type OverviewStat = {
    label: string;
    value: number | string;
    icon?: React.ReactNode;
};

type AdminOverviewProps = {
    loading: boolean;
    error?: string | null;
    stats: {
        contracts: number;
        contractTypes: number;
        brokers: number;
        members: number;
    };
};

export function AdminOverview({ loading, error, stats }: AdminOverviewProps) {
    const items: OverviewStat[] = [
        {
            label: 'تعداد قراردادها',
            value: stats.contracts,
            icon: <Icons.graph stroke="#0C0E3C" />,
        },
        {
            label: 'انواع قرارداد',
            value: stats.contractTypes,
            icon: <Icons.category stroke="#0C0E3C" />,
        },
        {
            label: 'کارگزاران',
            value: stats.brokers,
            icon: <Icons.barChart3 stroke="#0C0E3C" />,
        },
        {
            label: 'اعضای فعال',
            value: stats.members,
            icon: <Icons.lineChart stroke="#0C0E3C" />,
        },
    ];

    return (
        <div className="flex w-full flex-col gap-4 rounded-md border border-gray-200 bg-white p-4 text-black shadow-sm">
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
                    {items.map((item) => (
                        <div
                            key={item.label}
                            className="flex flex-col gap-2 rounded-md border border-gray-100 bg-gray-50 p-3"
                        >
                            <div className="flex items-center gap-2 text-sm text-[#5A5C83]">
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                            <div className="text-2xl font-bold">{loading ? '—' : item.value}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
