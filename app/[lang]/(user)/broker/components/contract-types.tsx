'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ContractType, GuaranteeType, getGuaranteeTypes, supabase } from '@/services/supabase';
import { useGlobalContext } from '@/contexts/store';
import { Locale } from '@/i18n-config';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
    const [guaranteeTypes, setGuaranteeTypes] = useState<GuaranteeType[]>([]);

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
            try {
                const { data, error } = await supabase
                    .from('talanow_broker_contract_types_link')
                    .select('talanow_contract_types(*)')
                    .eq('broker_id', user.id);

                if (!mounted) return;

                if (error) {
                    setItems([]);
                } else {
                    setItems((data?.map(item => item.talanow_contract_types) || []).flat() as ContractType[]);
                }
            } catch (error) {
                console.error('Error fetching contract types:', error);
                setItems([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        fetchData();
        return () => {
            mounted = false;
        };
    }, [user]);

    useEffect(() => {
        let mounted = true;
        async function fetchGuaranteeTypes() {
            try {
                const list = await getGuaranteeTypes();
                if (!mounted) return;
                setGuaranteeTypes(list as GuaranteeType[]);
            } catch (e) {
                if (!mounted) return;
                setGuaranteeTypes([]);
            }
        }
        fetchGuaranteeTypes();
        return () => {
            mounted = false;
        };
    }, []);

    const guaranteeMap = useMemo(() => {
        const map: Record<string, GuaranteeType> = {};
        for (const g of guaranteeTypes) map[g.id] = g;
        return map;
    }, [guaranteeTypes]);

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
                    <div key={it.id} className="flex flex-col gap-4 rounded-md border border-gray-200 bg-white p-4 text-sm">
                        <div className="flex items-center justify-between">
                            <div className="text-base font-semibold">{it.name}</div>
                            <div className={`rounded-full px-2 py-0.5 text-xs ${it.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{it.status === 'active' ? 'فعال' : 'غیرفعال'}</div>
                        </div>

                        <div className="rounded-md border border-gray-100 bg-gray-50 p-3 leading-6">
                            {it.description || '—'}
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div className="flex items-center justify-between rounded-md border border-gray-100 p-3">
                                <Label>حداقل سرمایه‌گذاری</Label>
                                <div>{it.min_investment ?? '—'}</div>
                            </div>
                            <div className="flex items-center justify-between rounded-md border border-gray-100 p-3">
                                <Label>حداکثر سرمایه‌گذاری</Label>
                                <div>{it.max_investment ?? '—'}</div>
                            </div>
                            <div className="flex items-center justify-between rounded-md border border-gray-100 p-3">
                                <Label>حداقل مدت (ماه)</Label>
                                <div>{it.min_duration_months}</div>
                            </div>
                            <div className="flex items-center justify-between rounded-md border border-gray-100 p-3">
                                <Label>حداکثر مدت (ماه)</Label>
                                <div>{it.max_duration_months}</div>
                            </div>
                            <div className="md:col-span-2 flex items-center justify-between rounded-md border border-gray-100 p-3">
                                <Label>انواع تسویه</Label>
                                <div className="text-left">{Array.isArray(it.settlement_type) ? it.settlement_type.join('، ') : '—'}</div>
                            </div>
                            <div className="md:col-span-2 flex items-center justify-between rounded-md border border-gray-100 p-3">
                                <Label>درصد سود کل</Label>
                                <div>{it.profit_share ?? '—'}</div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="text-sm font-medium">انواع تضامین</div>
                            <div className="rounded-md border border-gray-200">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-right">نام تضمین</TableHead>
                                            <TableHead className="text-right">درصد سود پیش‌فرض</TableHead>
                                            <TableHead className="text-right">توضیحات</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Array.isArray(it.guarantee_type_ids) && it.guarantee_type_ids.length > 0 ? (
                                            it.guarantee_type_ids.map((gid) => {
                                                const g = guaranteeMap[gid];
                                                return (
                                                    <TableRow key={gid}>
                                                        <TableCell className="font-medium">{g?.name || gid}</TableCell>
                                                        <TableCell>{g?.profit_share ?? '—'}%</TableCell>
                                                        <TableCell className="max-w-[28rem] truncate md:whitespace-normal">{g?.description || '—'}</TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center text-gray-500">—</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => openEdit(it)}>ویرایش</Button>
                            {it.status === 'active' ? (
                                <Button variant="destructive" onClick={async () => {
                                    const { error } = await supabase.from('talanow_contract_types').update({ status: 'inactive', updated_at: new Date().toISOString() }).eq('id', it.id);
                                    if (error) toast.error('خطا');
                                    else {
                                        toast.success('غیرفعال شد');
                                        const { data } = await supabase
                                            .from('talanow_broker_contract_types_link')
                                            .select('talanow_contract_types(*)')
                                            .eq('broker_id', user.id);
                                        setItems((data.map(item => item.talanow_contract_types) || []).flat() as ContractType[]);
                                    }
                                }}>{dict.admin.deactivate}</Button>
                            ) : (
                                <Button variant="success" onClick={async () => {
                                    const { error } = await supabase.from('talanow_contract_types').update({ status: 'active', updated_at: new Date().toISOString() }).eq('id', it.id);
                                    if (error) toast.error('خطا');
                                    else {
                                        toast.success('فعال شد');
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
                                    <div>انواع تضامین: {Array.isArray(editing.guarantee_type_ids) ? editing.guarantee_type_ids.map(id => guaranteeMap[id]?.name || id).join('، ') : '—'}</div>
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


