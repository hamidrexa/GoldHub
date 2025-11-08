'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase, type ContractType } from '@/services/supabase';
import { Locale } from '@/i18n-config';

type Props = {
    dict: any;
    lang: Locale;
};

const guaranteeOptions = ['ملک', 'چک', 'سفته'] as const;
const settlementOptions = ['آبشده', 'کیف داریک', 'ریالی', 'مصنوع و سکه'] as const;

type BrokerAssignment = {
    id: string;
    broker_id: string;
    contract_type_id: string;
};

export default function ContractTypes({ dict, lang }: Props) {
    const [contractTypes, setContractTypes] = useState<ContractType[]>([]);
    const [brokers, setBrokers] = useState<any[]>([]);
    const [brokerAssignments, setBrokerAssignments] = useState<Record<string, BrokerAssignment[]>>({});
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openBrokerModal, setOpenBrokerModal] = useState(false);
    const [selectedContractTypeId, setSelectedContractTypeId] = useState<string | null>(null);
    const [editing, setEditing] = useState<ContractType | null>(null);

    // form fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [minInvestment, setMinInvestment] = useState('');
    const [maxInvestment, setMaxInvestment] = useState('');
    const [guaranteeTypes, setGuaranteeTypes] = useState<string[]>([]);
    const [minDuration, setMinDuration] = useState('1');
    const [maxDuration, setMaxDuration] = useState('12');
    const [settlementTypes, setSettlementTypes] = useState<string[]>([]);
    const [profitShare, setProfitShare] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const monthsOptions = useMemo(() => Array.from({ length: 12 }).map((_, i) => `${i + 1}`), []);

    useEffect(() => {
        let mounted = true;
        async function fetchData() {
            setLoading(true);
            // Fetch contract types
            const { data: contractData, error: contractError } = await supabase
                .from('talanow_contract_types')
                .select('*')
                .order('created_at', { ascending: false });
            
            // Fetch brokers (users with broker group)
            // Since groups is stored as JSONB array, we'll fetch all users and filter client-side
            // Or use a function/getBrokers if available
            const { data: brokerData, error: brokerError } = await supabase
                .from('users')
                .select('id, first_name, last_name, username, phone_number, groups');
            
            // Filter brokers client-side (users with broker group)
            const filteredBrokers = brokerData?.filter((user: any) => 
                user.groups?.some((g: any) => g?.name === 'broker')
            ) || [];
            
            // Fetch broker assignments
            const { data: assignmentData, error: assignmentError } = await supabase
                .from('talanow_broker_contract_types_link')
                .select('*');
            
            if (!mounted) return;
            
            if (contractError) {
                setContractTypes([]);
            } else {
                setContractTypes((contractData || []) as ContractType[]);
            }
            
            if (!brokerError) {
                setBrokers(filteredBrokers);
            }
            
            if (!assignmentError && assignmentData) {
                const assignmentsByContract: Record<string, BrokerAssignment[]> = {};
                assignmentData.forEach((assignment: BrokerAssignment) => {
                    if (!assignmentsByContract[assignment.contract_type_id]) {
                        assignmentsByContract[assignment.contract_type_id] = [];
                    }
                    assignmentsByContract[assignment.contract_type_id].push(assignment);
                });
                setBrokerAssignments(assignmentsByContract);
            }
            
            setLoading(false);
        }
        fetchData();
        return () => {
            mounted = false;
        };
    }, []);

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
        if (!name?.trim()) return toast.error('عنوان را وارد کنید');
        setSubmitting(true);
        try {
            if (editing) {
                const { error } = await supabase
                    .from('talanow_contract_types')
                    .update({
                        name,
                        description,
                        min_investment: minInvestment ? Number(minInvestment) : null,
                        max_investment: maxInvestment ? Number(maxInvestment) : null,
                        guarantee_type: guaranteeTypes,
                        min_duration_months: Number(minDuration),
                        max_duration_months: Number(maxDuration),
                        settlement_type: settlementTypes,
                        profit_share: profitShare ? Number(profitShare) : null,
                    })
                    .eq('id', editing.id);
                if (error) throw error;
                toast.success('بروزرسانی شد');
            } else {
                const { error } = await supabase.from('talanow_contract_types').insert({
                    name,
                    description,
                    min_investment: minInvestment ? Number(minInvestment) : null,
                    max_investment: maxInvestment ? Number(maxInvestment) : null,
                    guarantee_type: guaranteeTypes,
                    min_duration_months: Number(minDuration),
                    max_duration_months: Number(maxDuration),
                    settlement_type: settlementTypes,
                    profit_share: profitShare ? Number(profitShare) : null,
                    active: true,
                });
                if (error) throw error;
                toast.success('ایجاد شد');
            }
            setOpen(false);
            // refresh list
            const { data } = await supabase
                .from('talanow_contract_types')
                .select('*')
                .order('created_at', { ascending: false });
            setContractTypes((data || []) as ContractType[]);
        } catch (e: any) {
            toast.error(e?.message || 'خطا');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="text-sm text-[#5A5C83]">انواع قراردادهای سرمایه‌گذاری</div>
                <Button onClick={openCreate}>{dict.admin.create_contract}</Button>
            </div>

            {loading && <div className="text-sm text-gray-600">در حال بارگذاری...</div>}
            {!loading && contractTypes.length === 0 && (
                <div className="text-sm text-gray-600">موردی یافت نشد.</div>
            )}

            <div className="grid grid-cols-1 gap-3">
                {contractTypes.map((it) => (
                    <div key={it.id} className="flex flex-col gap-2 rounded-md border border-gray-200 bg-white p-3 text-sm">
                        <div className="flex items-center justify-between">
                            <Label>عنوان</Label>
                            <div>{it.name}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>توضیحات</Label>
                            <div>{it.description || '—'}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>حداقل سرمایه‌گذاری</Label>
                            <div>{it.min_investment || '—'}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>حداکثر سرمایه‌گذاری</Label>
                            <div>{it.max_investment || '—'}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>انواع تضامین</Label>
                            <div>{Array.isArray(it.guarantee_type) ? it.guarantee_type.join(', ') : '—'}</div>
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
                            <div>{Array.isArray(it.settlement_type) ? it.settlement_type.join(', ') : '—'}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>درصد سود</Label>
                            <div>{it.profit_share || '—'}</div>
                        </div>
                        <div className="mt-2 flex flex-col gap-2">
                            <Label>بروکرهای اختصاص یافته:</Label>
                            <div className="flex flex-wrap gap-2">
                                {brokerAssignments[it.id]?.map((assignment) => {
                                    const broker = brokers.find(b => String(b.id) === String(assignment.broker_id));
                                    return broker ? (
                                        <div key={assignment.id} className="flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs">
                                            <span>{broker.first_name} {broker.last_name} ({broker.username || broker.phone_number})</span>
                                            <button
                                                onClick={async () => {
                                                    const { error } = await supabase
                                                        .from('talanow_broker_contract_types_link')
                                                        .delete()
                                                        .eq('id', assignment.id);
                                                    if (error) toast.error('خطا در حذف');
                                                    else {
                                                        toast.success('حذف شد');
                                                        const { data } = await supabase
                                                            .from('talanow_broker_contract_types_link')
                                                            .select('*')
                                                            .eq('contract_type_id', it.id);
                                                        setBrokerAssignments(prev => ({
                                                            ...prev,
                                                            [it.id]: data || []
                                                        }));
                                                    }
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : null;
                                })}
                                {(!brokerAssignments[it.id] || brokerAssignments[it.id].length === 0) && (
                                    <span className="text-xs text-gray-400">هیچ بروکری اختصاص نیافته</span>
                                )}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSelectedContractTypeId(it.id);
                                    setOpenBrokerModal(true);
                                }}
                            >
                                {dict.admin.assign_broker || 'افزودن بروکر'}
                            </Button>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => openEdit(it)}>{dict.admin.edit}</Button>
                            <Button variant="destructive" onClick={async () => {
                                const { error } = await supabase.from('talanow_contract_types').update({ active: false }).eq('id', it.id);
                                if (error) toast.error('خطا');
                                else {
                                    toast.success('غیرفعال شد');
                                    const { data } = await supabase.from('talanow_contract_types').select('*').order('created_at', { ascending: false });
                                    setContractTypes((data || []) as ContractType[]);
                                }
                            }}>{dict.admin.deactivate}</Button>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-full max-w-lg gap-5 text-black">
                    <div className="text-base font-bold">{editing ? dict.admin.edit_contract : dict.admin.create_contract}</div>

                    <div className="flex flex-col gap-2">
                        <Label>عنوان *</Label>
                        <Input placeholder="عنوان قرارداد" value={name} onChange={(e) => setName(e.target.value)} />
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
                        <div className="flex flex-wrap gap-2">
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

                    <div className="flex flex-col gap-2">
                        <Label>انواع تسویه</Label>
                        <div className="flex flex-wrap gap-2">
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
                        <Button disabled={submitting} onClick={handleSubmit}>{submitting ? 'در حال ثبت...' : dict.admin.save}</Button>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>{dict.admin.cancel}</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={openBrokerModal} onOpenChange={setOpenBrokerModal}>
                <DialogContent className="w-full max-w-lg gap-5 text-black">
                    <div className="text-base font-bold">{dict.admin.assign_broker || 'افزودن بروکر'}</div>
                    <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                        {brokers
                            .filter(broker => {
                                const assignments = brokerAssignments[selectedContractTypeId || ''] || [];
                                return !assignments.some(a => String(a.broker_id) === String(broker.id));
                            })
                            .map((broker) => (
                                <div key={broker.id} className="flex items-center justify-between rounded-md border border-gray-200 p-2">
                                    <div>
                                        <div className="font-medium">{broker.first_name} {broker.last_name}</div>
                                        <div className="text-xs text-gray-500">{broker.username || broker.phone_number}</div>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={async () => {
                                            if (!selectedContractTypeId) return;
                                            const { error } = await supabase
                                                .from('talanow_broker_contract_types_link')
                                                .insert({
                                                    broker_id: broker.id,
                                                    contract_type_id: selectedContractTypeId,
                                                });
                                            if (error) {
                                                toast.error('خطا در افزودن');
                                            } else {
                                                toast.success('افزوده شد');
                                                const { data } = await supabase
                                                    .from('talanow_broker_contract_types_link')
                                                    .select('*')
                                                    .eq('contract_type_id', selectedContractTypeId);
                                                setBrokerAssignments(prev => ({
                                                    ...prev,
                                                    [selectedContractTypeId]: data || []
                                                }));
                                            }
                                        }}
                                    >
                                        {dict.admin.add || 'افزودن'}
                                    </Button>
                                </div>
                            ))}
                        {brokers.filter(broker => {
                            const assignments = brokerAssignments[selectedContractTypeId || ''] || [];
                            return !assignments.some(a => String(a.broker_id) === String(broker.id));
                        }).length === 0 && (
                            <div className="text-sm text-gray-500">همه بروکرها اختصاص یافته‌اند</div>
                        )}
                    </div>
                    <div className="mt-2">
                        <Button variant="outline" onClick={() => setOpenBrokerModal(false)}>{dict.admin.cancel}</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
