'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ContractType, BrokerContractType, supabase } from '@/services/supabase';
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

    // form
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [minInvestment, setMinInvestment] = useState('');
    const [maxInvestment, setMaxInvestment] = useState('');
    const [guaranteeTypes, setGuaranteeTypes] = useState<string[]>([]);
    const [minDuration, setMinDuration] = useState('1');
    const [maxDuration, setMaxDuration] = useState('12');
    const [settlementTypes, setSettlementTypes] = useState<string[]>([]);
    const [profitShare, setProfitShare] = useState('');
    const [submitting, setSubmitting] = useState(false); // reuse state to keep minimal

    // Guarantee options
    const guaranteeOptions = ['ملک', 'چک', 'سفته'];

    const monthsOptions = useMemo(() => Array.from({ length: 12 }).map((_, i) => `${i + 1}`), []);

    useEffect(() => {
        let mounted = true;
        async function fetchData() {
            if (!user) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('talanow_broker_contract_types')
                .select('talanow_contract_types(*)')
                .eq('broker_id', user.id);
            if (!mounted) return;
            if (error) setItems([]);
            else setItems((data.map(item => item.contract_types) || []).flat() as ContractType[]);
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
        setDescription('');
        setMinInvestment('');
        setMaxInvestment('');
        setGuaranteeTypes([]);
        setMinDuration('1');
        setMaxDuration('12');
        setSettlementTypes([]);
        setProfitShare('');
        setOpen(true);
    };

    const openEdit = (row: ContractType) => {
    setEditing(row);
    setName(row.name);
    setDescription(row.description || '');
    setMinInvestment(row.min_investment ? String(row.min_investment) : '');
    setMaxInvestment(row.max_investment ? String(row.max_investment) : '');
    setGuaranteeTypes(row.guarantee_type || []);
    setMinDuration(row.min_duration_months ? String(row.min_duration_months) : '1');
    setMaxDuration(row.max_duration_months ? String(row.max_duration_months) : '12');
    setSettlementTypes(row.settlement_type || []);
    setProfitShare(row.profit_share ? String(row.profit_share) : '');
    setOpen(true);
    };

    const handleSubmit = async () => {
        if (!user) return toast.info('ابتدا وارد شوید');
        if (!name?.trim()) return toast.error('عنوان را وارد کنید');
        setLoading(true);
        try {
            let contract_type_id: string | undefined;
            if (editing) {
                // Update contract_types table
                const { error } = await supabase
                    .from('talanow_contract_types')
                    .update({
                        name,
                        description,
                        min_investment: minInvestment ? Number(minInvestment) : null,
                        max_investment: maxInvestment ? Number(maxInvestment) : null,
                        guarantee_type: guaranteeTypes,
                        min_duration_months: minDuration ? Number(minDuration) : 1,
                        max_duration_months: maxDuration ? Number(maxDuration) : 12,
                        settlement_type: settlementTypes,
                        profit_share: profitShare ? Number(profitShare) : null,
                    })
                    .eq('id', editing.id);
                if (error) throw error;
                contract_type_id = editing.id;
                toast.success('بروزرسانی شد');
            } else {
                // Create in contract_types table
                const { data, error } = await supabase.from('talanow_contract_types').insert({
                    name,
                    description,
                    min_investment: minInvestment ? Number(minInvestment) : null,
                    max_investment: maxInvestment ? Number(maxInvestment) : null,
                    guarantee_type: guaranteeTypes,
                    min_duration_months: minDuration ? Number(minDuration) : 1,
                    max_duration_months: maxDuration ? Number(maxDuration) : 12,
                    settlement_type: settlementTypes,
                    profit_share: profitShare ? Number(profitShare) : null,
                }).select();
                if (error || !data || !data[0]?.id) throw error || new Error('خطا در ایجاد قرارداد');
                contract_type_id = data[0].id;
                toast.success('ایجاد شد');
            }
            // Always create BrokerContractType row (link)
            if (contract_type_id) {
                // Check if link already exists to avoid duplicates
                const { data: existingLink, error: linkCheckError } = await supabase
                    .from('talanow_broker_contract_types')
                    .select('id')
                    .eq('broker_id', String(user.id))
                    .eq('contract_type_id', String(contract_type_id));
                if (!existingLink?.length) {
                    const { error: linkError } = await supabase.from('talanow_broker_contract_types').insert({
                        broker_id: String(user.id),
                        contract_type_id: String(contract_type_id),
                    });
                    if (linkError) throw linkError;
                }
            }
            setOpen(false);
            // refresh list
            const { data } = await supabase
                .from('talanow_broker_contract_types')
                .select('talanow_contract_types(*)')
                .eq('broker_id', user.id);
            setItems((data.map(item => item.contract_types) || []).flat());
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
                        <Label>انواع تضامین</Label>
                        <div className="flex gap-2">
                            {guaranteeOptions.map((g) => (
                                <label key={g} className="flex items-center gap-1">
                                    <input type="checkbox" checked={guaranteeTypes.includes(g)} onChange={e => {
                                        if (e.target.checked) setGuaranteeTypes([...guaranteeTypes, g]);
                                        else setGuaranteeTypes(guaranteeTypes.filter(x => x !== g));
                                    }} />
                                    {g}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>حداقل مدت (ماه)</Label>
                        <Input type="number" min="1" max="12" value={minDuration} onChange={e => setMinDuration(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>حداکثر مدت (ماه)</Label>
                        <Input type="number" min="1" max="12" value={maxDuration} onChange={e => setMaxDuration(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>انواع تسویه</Label>
                        <div className="flex gap-2">
                            {settlementOptions.map((s) => (
                                <label key={s} className="flex items-center gap-1">
                                    <input type="checkbox" checked={settlementTypes.includes(s)} onChange={e => {
                                        if (e.target.checked) setSettlementTypes([...settlementTypes, s]);
                                        else setSettlementTypes(settlementTypes.filter(x => x !== s));
                                    }} />
                                    {s}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>درصد سود</Label>
                        <Input type="number" placeholder="درصد سود" value={profitShare} onChange={e => setProfitShare(e.target.value)} />
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


