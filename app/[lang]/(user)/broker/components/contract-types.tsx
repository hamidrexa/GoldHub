'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/app/[lang]/(user)/broker/services/supabase';
import { useGlobalContext } from '@/contexts/store';
import { Locale } from '@/i18n-config';

type Props = {
    dict: any;
    lang: Locale;
};

type BrokerContractType = {
    id: string;
    broker_id: string | number;
    name: string;
    duration_months: number;
    settlement_type: 'آبشده' | 'کیف داریک' | 'ریالی' | 'مصنوع و سکه';
    guarantee_required: boolean;
    created_at?: string;
};

const settlementOptions = ['آبشده', 'کیف داریک', 'ریالی', 'مصنوع و سکه'] as const;

export default function ContractTypes({ dict, lang }: Props) {
    const { user } = useGlobalContext();
    const [items, setItems] = useState<BrokerContractType[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<BrokerContractType | null>(null);

    // form
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('12');
    const [settlementType, setSettlementType] = useState('آبشده');
    const [guaranteeRequired, setGuaranteeRequired] = useState<'yes' | 'no'>('no');
    const submitting = loading; // reuse state to keep minimal

    const monthsOptions = useMemo(() => Array.from({ length: 12 }).map((_, i) => `${i + 1}`), []);

    useEffect(() => {
        let mounted = true;
        async function fetchData() {
            if (!user) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('broker_contract_types')
                .select('*')
                .eq('broker_id', user.id)
                .order('created_at', { ascending: false });
            if (!mounted) return;
            if (error) setItems([]);
            else setItems((data || []) as BrokerContractType[]);
            setLoading(false);
        }
        fetchData();
        return () => {
            mounted = false;
        };
    }, [user]);

    const openCreate = () => {
        setEditing(null);
        setName('');
        setDuration('12');
        setSettlementType('آبشده');
        setGuaranteeRequired('no');
        setOpen(true);
    };

    const openEdit = (row: BrokerContractType) => {
        setEditing(row);
        setName(row.name);
        setDuration(String(row.duration_months));
        setSettlementType(row.settlement_type);
        setGuaranteeRequired(row.guarantee_required ? 'yes' : 'no');
        setOpen(true);
    };

    const handleSubmit = async () => {
        if (!user) return toast.info('ابتدا وارد شوید');
        if (!name?.trim()) return toast.error('عنوان را وارد کنید');
        setLoading(true);
        try {
            if (editing) {
                const { error } = await supabase
                    .from('broker_contract_types')
                    .update({
                        name,
                        duration_months: Number(duration),
                        settlement_type: settlementType,
                        guarantee_required: guaranteeRequired === 'yes',
                    })
                    .eq('id', editing.id)
                    .eq('broker_id', user.id);
                if (error) throw error;
                toast.success('بروزرسانی شد');
            } else {
                const { error } = await supabase.from('broker_contract_types').insert({
                    broker_id: user.id,
                    name,
                    duration_months: Number(duration),
                    settlement_type: settlementType,
                    guarantee_required: guaranteeRequired === 'yes',
                });
                if (error) throw error;
                toast.success('ایجاد شد');
            }
            setOpen(false);
            // refresh list
            const { data } = await supabase
                .from('broker_contract_types')
                .select('*')
                .eq('broker_id', user.id)
                .order('created_at', { ascending: false });
            setItems((data || []) as BrokerContractType[]);
        } catch (e: any) {
            toast.error(e?.message || 'خطا');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="text-sm text-[#5A5C83]">قراردادهای تعریف شده توسط شما</div>
                <Button onClick={openCreate}>قرارداد جدید</Button>
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
                            <Label>مدت (ماه)</Label>
                            <div>{it.duration_months}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>نوع تسویه</Label>
                            <div>{it.settlement_type}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>نیاز به تضمین</Label>
                            <div>{it.guarantee_required ? 'بله' : 'خیر'}</div>
                        </div>
                        <div className="flex justify-end">
                            <Button variant="outline" onClick={() => openEdit(it)}>ویرایش</Button>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-full max-w-lg gap-5 text-black">
                    <div className="text-base font-bold">{editing ? 'ویرایش قرارداد' : 'قرارداد جدید'}</div>

                    <div className="flex flex-col gap-2">
                        <Label>عنوان</Label>
                        <Input placeholder="مثال: سرمایه‌گذاری ۱۲ ماهه" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>مدت (ماه)</Label>
                        <Select value={duration} onValueChange={setDuration}>
                            <SelectTrigger>
                                <SelectValue placeholder="انتخاب کنید" />
                            </SelectTrigger>
                            <SelectContent>
                                {monthsOptions.map((m) => (
                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>نوع تسویه</Label>
                        <Select value={settlementType} onValueChange={setSettlementType}>
                            <SelectTrigger>
                                <SelectValue placeholder="انتخاب کنید" />
                            </SelectTrigger>
                            <SelectContent>
                                {settlementOptions.map((s) => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>نیاز به تضمین</Label>
                        <Select value={guaranteeRequired} onValueChange={(v: 'yes' | 'no') => setGuaranteeRequired(v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="انتخاب کنید" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="yes">بله</SelectItem>
                                <SelectItem value="no">خیر</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="mt-2 flex gap-3">
                        <Button disabled={submitting} onClick={handleSubmit}>{submitting ? 'در حال ثبت...' : 'ثبت'}</Button>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>انصراف</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}


