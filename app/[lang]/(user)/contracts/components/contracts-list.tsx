
'use client';

import React, { useEffect, useState } from 'react';
import { supabase, type Contract, type ContractType } from '@/services/supabase';
import { useGlobalContext } from '@/contexts/store';
import { Locale } from '@/i18n-config';
import { Label } from '@/components/ui/label';

type Props = {
    dict: any;
    lang: Locale;
};

export default function ContractsList({ dict, lang }: Props) {
    const { user } = useGlobalContext();
    const [contracts, setContracts] = useState<(Contract & { contract_types?: ContractType })[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        async function fetchContracts() {
            if (!user) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('talanow_contracts')
                .select('*, contract_types(*)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if (!isMounted) return;
            if (error) {
                setContracts([]);
            } else {
                setContracts((data || []) as (Contract & { contract_types?: ContractType })[]);
            }
            setLoading(false);
        }
        fetchContracts();
        return () => {
            isMounted = false;
        };
    }, [user]);

    if (!user) {
        return (
            <div className="rounded-lg border bg-white p-4 text-sm text-gray-600">
                برای مشاهده قراردادها ابتدا وارد حساب خود شوید.
            </div>
        );
    }

    return (
        <div className="mt-2">
            {loading && <div className="text-sm text-gray-600">در حال بارگذاری...</div>}
            {!loading && contracts.length === 0 && (
                <div className="text-sm text-gray-600">قراردادی یافت نشد.</div>
            )}
            <div className="grid grid-cols-1 gap-3">
                {contracts.map((c) => (
                    <div
                        key={c.id}
                        className="flex flex-col gap-2 rounded-md border border-gray-200 bg-white p-3 text-sm"
                    >
                        <div className="flex items-center justify-between">
                            <Label>نوع قرارداد</Label>
                            <div>{c.contract_types?.name || '-'}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>توضیحات</Label>
                            <div>{c.contract_types?.description || '-'}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>مبلغ (ریال)</Label>
                            <div>{c.amount_rls?.toLocaleString('fa-IR')}</div>
                        </div>
                        {c.guarantee_type && (
                            <div className="flex items-center justify-between">
                                <Label>تضامین</Label>
                                <div>{c.guarantee_type}</div>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <Label>مدت (ماه)</Label>
                            <div>{c.duration_months}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>نوع تسویه</Label>
                            <div>{c.settlement_type}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>وضعیت</Label>
                            <div>
                                {c.status === 'pending'
                                    ? 'در انتظار تایید'
                                    : c.status === 'approved'
                                      ? 'تایید شده'
                                      : 'رد شده'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


