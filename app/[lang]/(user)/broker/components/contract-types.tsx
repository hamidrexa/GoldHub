'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ContractType, supabase } from '@/services/supabase';
import { useGlobalContext } from '@/contexts/store';
import { Locale } from '@/i18n-config';

type Props = {
    dict: any;
    lang: Locale;
};

const settlementOptions = ['آبشده', 'کیف داریک', 'ریالی', 'مصنوع و سکه'] as const;

export default function ContractTypes({ dict, lang }: Props) {
    const { user } = useGlobalContext();
    const [items, setItems] = useState<ContractType[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<ContractType | null>(null);

    // form - broker can only edit: description, min_investment, max_investment, min_duration_months, max_duration_months
    const [description, setDescription] = useState('');
    const [minInvestment, setMinInvestment] = useState('');
    const [maxInvestment, setMaxInvestment] = useState('');
    const [minDuration, setMinDuration] = useState('1');
    const [maxDuration, setMaxDuration] = useState('12');
    const [submitting, setSubmitting] = useState(false);

    const monthsOptions = useMemo(() => Array.from({ length: 12 }).map((_, i) => `${i + 1}`), []);

    useEffect(() => {
        let mounted = true;
        async function fetchData() {
            if (!user) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('talanow_broker_contract_types_link')
                .select('talanow_contract_types(*)')
                .eq('broker_id', user.id);
            if (!mounted) return;
            if (error) setItems([]);
            else setItems((data.map(item => item.talanow_contract_types) || []).flat() as ContractType[]);
            setLoading(false);
        }
        fetchData();
        return () => {
            mounted = false;
        };
    }, [user]);

    const openEdit = (row: ContractType) => {
        setEditing(row);
        setDescription(row.description || '');
        setMinInvestment(row.min_investment ? String(row.min_investment) : '');
        setMaxInvestment(row.max_investment ? String(row.max_investment) : '');
        setMinDuration(row.min_duration_months ? String(row.min_duration_months) : '1');
        setMaxDuration(row.max_duration_months ? String(row.max_duration_months) : '12');
        setOpen(true);
    };

    const handleSubmit = async () => {
        if (!user) return toast.info('ابتدا وارد شوید');
        if (!editing) return toast.error('خطا در ویرایش');
        setSubmitting(true);
        try {
            // Broker can only update: description, min_investment, max_investment, min_duration_months, max_duration_months
            const { error } = await supabase
                .from('talanow_contract_types')
                .update({
                    description,
                    min_investment: minInvestment ? Number(minInvestment) : null,
                    max_investment: maxInvestment ? Number(maxInvestment) : null,
                    min_duration_months: Number(minDuration),
                    max_duration_months: Number(maxDuration),
                })
                .eq('id', editing.id);
            if (error) throw error;
            toast.success('بروزرسانی شد');
            setOpen(false);
            // refresh list
            const { data } = await supabase
                .from('talanow_broker_contract_types_link')
                .select('talanow_contract_types(*)')
                .eq('broker_id', user.id);
            setItems((data.map(item => item.talanow_contract_types) || []).flat() as ContractType[]);
        } catch (e: any) {
            toast.error(e?.message || 'خطا');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="text-sm text-[#5A5C83]">قراردادهای اختصاص یافته به شما</div>
            </div>

            {loading && <div className="text-sm text-gray-600">در حال بارگذاری...</div>}
            {!loading && items.length === 0 && (
                <div className="text-sm text-gray-600">موردی یافت نشد.</div>
            )}

            <div className="grid grid-cols-1 gap-3">
                {items.map((it) => (
                    <div key={it.id} className="flex flex-col gap-2 rounded-md border border-gray-200 bg-white p-3 text-sm">
                        <div className="flex items-center justify-between">
                            <Label>عنوان</Label>
                            <div>{it.name}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>توضیحات</Label>
                            <div>{it.description}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>حداقل سرمایه‌گذاری</Label>
                            <div>{it.min_investment}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>حداکثر سرمایه‌گذاری</Label>
                            <div>{it.max_investment}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>انواع تضامین</Label>
                            <div>{Array.isArray(it.guarantee_type) ? it.guarantee_type.join(', ') : ''}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>حداقل مدت (ماه)</Label>
                            <div>{it.min_duration_months}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>حداکثر مدت (ماه)</Label>
                            <div>{it.max_duration_months}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>انواع تسویه</Label>
                            <div>{Array.isArray(it.settlement_type) ? it.settlement_type.join(', ') : ''}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>درصد سود</Label>
                            <div>{it.profit_share}</div>
                        </div>
                        <div className="flex justify-end">
                            <Button variant="outline" onClick={() => openEdit(it)}>ویرایش</Button>
                            {it.status === 'active' ? (
                                <Button variant="destructive" onClick={async () => {
                                    const { error } = await supabase.from('talanow_contract_types').update({ status: 'inactive' }).eq('id', it.id);
                                    if (error) toast.error('خطا');
                                    else {
                                        toast.success('غیرفعال شد');
                                        // refresh list
                                        const { data } = await supabase
                                            .from('talanow_broker_contract_types_link')
                                            .select('talanow_contract_types(*)')
                                            .eq('broker_id', user.id);
                                        setItems((data.map(item => item.talanow_contract_types) || []).flat() as ContractType[]);
                                    }
                                }}>{dict.admin.deactivate}</Button>
                            ) : (
                                <Button variant="success" onClick={async () => {
                                    const { error } = await supabase.from('talanow_contract_types').update({ status: 'active' }).eq('id', it.id);
                                    if (error) toast.error('خطا');
                                    else {
                                        toast.success('فعال شد');
                                        // refresh list
                                        const { data } = await supabase
                                            .from('talanow_broker_contract_types_link')
                                            .select('talanow_contract_types(*)')
                                            .eq('broker_id', user.id);
                                        setItems((data.map(item => item.talanow_contract_types) || []).flat() as ContractType[]);
                                    }
                                }}>{dict.admin.activate}</Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-full max-w-lg gap-5 text-black">
                    <div className="text-base font-bold">ویرایش قرارداد{editing && `: ${editing.name}`}</div>

                    {editing && (
                        <>
                            <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm">
                                <div className="mb-2 font-semibold">اطلاعات غیرقابل ویرایش:</div>
                                <div className="flex flex-col gap-1 text-xs">
                                    <div>عنوان: {editing.name}</div>
                                    <div>انواع تضامین: {Array.isArray(editing.guarantee_type) ? editing.guarantee_type.join(', ') : '—'}</div>
                                    <div>انواع تسویه: {Array.isArray(editing.settlement_type) ? editing.settlement_type.join(', ') : '—'}</div>
                                    <div>درصد سود: {editing.profit_share || '—'}</div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex flex-col gap-2">
                        <Label>توضیحات</Label>
                        <Input placeholder="توضیحات" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>حداقل سرمایه‌گذاری</Label>
                        <Input type="number" placeholder="حداقل" value={minInvestment} onChange={(e) => setMinInvestment(e.target.value)} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>حداکثر سرمایه‌گذاری</Label>
                        <Input type="number" placeholder="حداکثر" value={maxInvestment} onChange={(e) => setMaxInvestment(e.target.value)} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>حداقل مدت (ماه)</Label>
                        <Select value={minDuration} onValueChange={setMinDuration}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {monthsOptions.map((m) => (
                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>حداکثر مدت (ماه)</Label>
                        <Select value={maxDuration} onValueChange={setMaxDuration}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {monthsOptions.map((m) => (
                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="mt-2 flex gap-3">
                        <Button disabled={submitting} onClick={handleSubmit}>{submitting ? 'در حال ثبت...' : 'ذخیره'}</Button>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>انصراف</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}


