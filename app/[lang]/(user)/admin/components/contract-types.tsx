'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase, type ContractType, type GuaranteeType } from '@/services/supabase';
import { Locale } from '@/i18n-config';
import Cookies from 'js-cookie';

type Props = {
    dict: any;
    lang: Locale;
};

const settlementOptions = ['آبشده', 'کیف داریک', 'ریالی', 'مصنوع و سکه'] as const;

type BrokerAssignment = {
    id: string;
    broker_id: string;
    contract_type_id: string;
};

type GuaranteeTypeInput = {
    id: string;
    name: string;
    profit_share: number;
    description: string;
};

export default function ContractTypes({ dict, lang }: Props) {
    const [contractTypes, setContractTypes] = useState<ContractType[]>([]);
    const [brokers, setBrokers] = useState<any[]>([]);
    const [brokerAssignments, setBrokerAssignments] = useState<Record<string, BrokerAssignment | null>>({});
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openBrokerModal, setOpenBrokerModal] = useState(false);
    const [selectedContractTypeId, setSelectedContractTypeId] = useState<string | null>(null);
    const [editing, setEditing] = useState<ContractType | null>(null);
    const [selectedBrokerId, setSelectedBrokerId] = useState<string | null>(null);
    const [assigningBroker, setAssigningBroker] = useState(false);

    // form fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [minInvestment, setMinInvestment] = useState('');
    const [maxInvestment, setMaxInvestment] = useState('');
    const [guaranteeTypes, setGuaranteeTypes] = useState<GuaranteeTypeInput[]>([]);
    const [availableGuaranteeTypes, setAvailableGuaranteeTypes] = useState<GuaranteeType[]>([]);
    const [minDuration, setMinDuration] = useState('1');
    const [maxDuration, setMaxDuration] = useState('12');
    const [settlementTypes, setSettlementTypes] = useState<string[]>([]);
    const [profitShare, setProfitShare] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [formLevel, setFormLevel] = useState<1 | 2>(1);

    const monthsOptions = useMemo(() => Array.from({ length: 12 }).map((_, i) => `${i + 1}`), []);

    // Calculate total profit share
    const totalProfitShare = useMemo(() => {
        return guaranteeTypes.reduce((sum, gt) => sum + (gt.profit_share || 0), 0);
    }, [guaranteeTypes]);

    // Filter only active guarantee types for form level 2
    const activeGuaranteeTypes = useMemo(() => {
        return availableGuaranteeTypes.filter(gt => gt.status === 'active');
    }, [availableGuaranteeTypes]);

    useEffect(() => {
        const fetchGuaranteeTypes = async () => {
            const { data, error } = await supabase
                .from('talanow_guarantee_types')
                .select('*')
                .eq('status', 'active');

            if (!error && data) {
                setAvailableGuaranteeTypes(data);
            }
        };

        fetchGuaranteeTypes();
    }, []);

    useEffect(() => {
        let mounted = true;
        const controller = new AbortController();

        async function fetchData() {
            setLoading(true);
            try {
                const [
                    { data: contractData, error: contractError },
                    { data: assignmentData, error: assignmentError },
                    { data: guaranteeTypesData, error: guaranteeTypesError }
                ] = await Promise.all([
                    supabase
                        .from('talanow_contract_types')
                        .select('*')
                        .order('created_at', { ascending: false }),
                    supabase.from('talanow_broker_contract_types_link').select('*'),
                    supabase.from('talanow_guarantee_types').select('*').eq('status', 'active')
                ]);

                if (guaranteeTypesData && !guaranteeTypesError) {
                    setAvailableGuaranteeTypes(guaranteeTypesData);
                }

                if (!mounted) return;

                if (contractError) {
                    setContractTypes([]);
                } else {
                    setContractTypes((contractData || []) as ContractType[]);
                }

                if (!assignmentError && assignmentData) {
                    const assignmentsByContract: Record<string, BrokerAssignment | null> = {};
                    assignmentData.forEach((assignment: BrokerAssignment) => {
                        if (!assignmentsByContract[assignment.contract_type_id]) {
                            assignmentsByContract[assignment.contract_type_id] = assignment;
                        }
                    });
                    setBrokerAssignments(assignmentsByContract);
                }

                const token = Cookies.get('token');
                if (!token) {
                    setBrokers([]);
                    return;
                }

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/v1/users/group_users?group_name=broker`,
                    {
                        signal: controller.signal,
                        credentials: 'include',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!mounted) return;

                if (!response.ok) {
                    throw new Error(`Failed to fetch brokers (${response.status})`);
                }

                const payload = await response.json();
                const list = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payload?.results)
                        ? payload.results
                        : [];

                setBrokers(list);
            } catch (error: any) {
                if (error?.name === 'AbortError') return;
                if (mounted) {
                    setBrokers([]);
                    console.error('Error loading contract types/brokers', error);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        fetchData();

        return () => {
            mounted = false;
            controller.abort();
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
        setFormLevel(1);
        setOpen(true);
    };

    const openEdit = async (row: ContractType) => {
        setEditing(row);
        setName(row.name);
        setDescription(row.description || '');
        setMinInvestment(row.min_investment ? String(row.min_investment) : '');
        setMaxInvestment(row.max_investment ? String(row.max_investment) : '');
        setMinDuration(row.min_duration_months ? String(row.min_duration_months) : '1');
        setMaxDuration(row.max_duration_months ? String(row.max_duration_months) : '12');
        setSettlementTypes(row.settlement_type || []);
        setProfitShare(row.profit_share ? String(row.profit_share) : '');
        
        // Convert guarantee_type_ids array to guaranteeTypes format
        if (row.guarantee_type_ids && row.guarantee_type_ids.length > 0) {
            const formattedGuarantees = row.guarantee_type_ids
                .map(gtId => {
                    // Find the guarantee type in available types
                    const foundType = availableGuaranteeTypes.find(gt => gt.id === gtId);
                    if (foundType) {
                        return {
                            id: foundType.id,
                            name: foundType.name,
                            profit_share: foundType.profit_share || 0,
                            description: foundType.description || ''
                        };
                    }
                    return null;
                })
                .filter((gt) => gt !== null);
            
            setGuaranteeTypes(formattedGuarantees as GuaranteeTypeInput[]);
        } else {
            setGuaranteeTypes([]);
        }
        
        setFormLevel(1);
        setOpen(true);
    };

    const fetchContractTypes = async () => {
        try {
            const { data, error } = await supabase
                .from('talanow_contract_types')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                toast.error('خطا در بارگذاری انواع قراردادها');
                return;
            }

            setContractTypes((data || []) as ContractType[]);
        } catch (error) {
            console.error('Error fetching contract types:', error);
            toast.error('خطا در بارگذاری انواع قراردادها');
        }
    };

    const handleSubmit = async () => {
        if (formLevel === 1) {
            if (!name?.trim()) {
                toast.error('عنوان را وارد کنید');
                return;
            }
            setFormLevel(2);
            return;
        }

        // Level 2 validation
        if (guaranteeTypes.length === 0) {
            toast.error('حداقل یک نوع تضمین باید انتخاب شود');
            return;
        }

        setSubmitting(true);
        try {
            // Prepare guarantee type IDs array
            const guaranteeTypeIds = guaranteeTypes.map(gt => gt.id);

            if (editing) {
                // Update existing contract type
                const { error: updateError } = await supabase
                    .from('talanow_contract_types')
                    .update({
                        name,
                        description,
                        min_investment: minInvestment ? Number(minInvestment) : null,
                        max_investment: maxInvestment ? Number(maxInvestment) : null,
                        min_duration_months: Number(minDuration),
                        max_duration_months: Number(maxDuration),
                        settlement_type: settlementTypes,
                        guarantee_type_ids: guaranteeTypeIds,
                        profit_share: totalProfitShare,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', editing.id);

                if (updateError) throw updateError;
                toast.success('نوع قرارداد با موفقیت به‌روزرسانی شد');
            } else {
                // Create new contract type
                const { error: insertError } = await supabase
                    .from('talanow_contract_types')
                    .insert({
                        name,
                        description,
                        min_investment: minInvestment ? Number(minInvestment) : null,
                        max_investment: maxInvestment ? Number(maxInvestment) : null,
                        min_duration_months: Number(minDuration),
                        max_duration_months: Number(maxDuration),
                        settlement_type: settlementTypes,
                        guarantee_type_ids: guaranteeTypeIds,
                        profit_share: totalProfitShare,
                        status: 'active'
                    });

                if (insertError) throw insertError;
                toast.success('نوع قرارداد جدید با موفقیت ایجاد شد');
            }

            fetchContractTypes();
            setOpen(false);
        } catch (error) {
            console.error('Error saving contract type:', error);
            toast.error('خطا در ذخیره‌سازی نوع قرارداد');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-[#0C0E3C]">انواع قراردادهای سرمایه‌گذاری</div>
                <Button onClick={openCreate} className="gap-2">{dict.admin.create_contract}</Button>
            </div>

            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="text-sm text-gray-500">در حال بارگذاری...</div>
                </div>
            )}
            {!loading && contractTypes.length === 0 && (
                <div className="flex justify-center items-center py-12 rounded-lg border border-dashed border-gray-300 bg-gray-50">
                    <div className="text-center">
                        <div className="text-sm text-gray-500">موردی یافت نشد</div>
                        <Button onClick={openCreate} variant="outline" className="mt-4">اولین قرارداد را ایجاد کنید</Button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {contractTypes.map((it) => (
                    <div key={it.id} className="flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                        {/* Header */}
                        <div className="flex items-start justify-between bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-[#0C0E3C]">{it.name}</h3>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{it.description || 'بدون توضیح'}</p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                    it.status === 'active' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-gray-100 text-gray-700'
                                }`}>
                                    {it.status === 'active' ? 'فعال' : 'غیرفعال'}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 space-y-4">
                            {/* Investment Range */}
                            <div>
                                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">محدوده سرمایه‌گذاری</div>
                                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                                    <span className="text-sm text-gray-600">حداقل</span>
                                    <span className="text-sm font-medium text-[#0C0E3C]">{(it.min_investment || 0).toLocaleString('fa-IR')} ریال</span>
                                </div>
                                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 mt-2">
                                    <span className="text-sm text-gray-600">حداکثر</span>
                                    <span className="text-sm font-medium text-[#0C0E3C]">{(it.max_investment || 0).toLocaleString('fa-IR')} ریال</span>
                                </div>
                            </div>

                            {/* Duration */}
                            <div>
                                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">مدت قرارداد</div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">{it.min_duration_months} - {it.max_duration_months}</span>
                                    <span className="text-gray-600">ماه</span>
                                </div>
                            </div>

                            {/* Settlement Types */}
                            <div>
                                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">انواع تسویه</div>
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(it.settlement_type) && it.settlement_type.length > 0 ? (
                                        it.settlement_type.map((st, idx) => (
                                            <span key={idx} className="inline-block bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full">
                                                {st}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-500">—</span>
                                    )}
                                </div>
                            </div>

                            {/* Guarantee Types */}
                            <div>
                                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">انواع تضامین و سود</div>
                                <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                                    {it.guarantee_type_ids && it.guarantee_type_ids.length > 0 ? (
                                        <>
                                            {it.guarantee_type_ids.map((gtId, idx) => {
                                                const gtData = availableGuaranteeTypes.find(gt => gt.id === gtId);
                                                return (
                                                    <div key={idx} className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-700">{gtData?.name || gtId}</span>
                                                        <span className="font-medium text-green-600">{gtData?.profit_share || 0}%</span>
                                                    </div>
                                                );
                                            })}
                                            <div className="pt-2 mt-2 border-t border-gray-200 flex items-center justify-between">
                                                <span className="font-medium text-gray-900">مجموع</span>
                                                <span className="font-bold text-lg text-green-700">{it.profit_share || 0}%</span>
                                            </div>
                                        </>
                                    ) : (
                                        <span className="text-sm text-gray-500">تضمینی تعریف نشده</span>
                                    )}
                                </div>
                            </div>

                            {/* Broker Assignment */}
                            <div>
                                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">بروکر اختصاص یافته</div>
                                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                    {(() => {
                                        const assignment = brokerAssignments[it.id];
                                        if (!assignment) {
                                            return <span className="text-sm text-gray-500">هیچ بروکری اختصاص نیافته</span>;
                                        }
                                        const broker = brokers.find(b => String(b.id) === String(assignment.broker_id));
                                        if (!broker) {
                                            return <span className="text-sm text-gray-500">اطلاعات بروکر موجود نیست</span>;
                                        }
                                        return (
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium text-gray-900">{broker.first_name} {broker.last_name}</div>
                                                    <div className="text-xs text-gray-600 mt-0.5">{broker.username || broker.phone_number}</div>
                                                </div>
                                                <button
                                                    onClick={async () => {
                                                        const { error } = await supabase
                                                            .from('talanow_broker_contract_types_link')
                                                            .delete()
                                                            .eq('id', assignment.id);
                                                        if (error) {
                                                            toast.error('خطا در حذف');
                                                        } else {
                                                            toast.success('حذف شد');
                                                            setBrokerAssignments(prev => ({
                                                                ...prev,
                                                                [it.id]: null,
                                                            }));
                                                        }
                                                    }}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                                                    title="حذف"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center gap-2 border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-lg">
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openEdit(it)}
                                className="flex-1"
                            >
                                ویرایش
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                    setSelectedContractTypeId(it.id);
                                    const currentAssignment = brokerAssignments[it.id];
                                    setSelectedBrokerId(currentAssignment ? String(currentAssignment.broker_id) : null);
                                    setOpenBrokerModal(true);
                                }}
                                className="flex-1"
                            >
                                اختصاص بروکر
                            </Button>
                            {it.status === 'active' ? (
                                <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={async () => {
                                        const { error } = await supabase.from('talanow_contract_types').update({ status: 'inactive', updated_at: new Date().toISOString() }).eq('id', it.id);
                                        if (error) toast.error('خطا');
                                        else {
                                            toast.success('غیرفعال شد');
                                            const { data } = await supabase.from('talanow_contract_types').select('*').order('created_at', { ascending: false });
                                            setContractTypes((data || []) as ContractType[]);
                                        }
                                    }}
                                    className="flex-1"
                                >
                                    غیرفعال
                                </Button>
                            ) : (
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={async () => {
                                        const { error } = await supabase.from('talanow_contract_types').update({ status: 'active', updated_at: new Date().toISOString() }).eq('id', it.id);
                                        if (error) toast.error('خطا');
                                        else {
                                            toast.success('فعال شد');
                                            const { data } = await supabase.from('talanow_contract_types').select('*').order('created_at', { ascending: false });
                                            setContractTypes((data || []) as ContractType[]);
                                        }
                                    }}
                                    className="flex-1 text-green-600 border-green-300 hover:bg-green-50"
                                >
                                    فعال
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[600px] h-[calc(100vh-2rem)] flex flex-col max-h-screen">
                    <DialogHeader>
                        <DialogTitle>{editing ? 'ویرایش نوع قرارداد' : 'افزودن نوع قرارداد جدید'}</DialogTitle>
                    </DialogHeader>

                    {/* Form Level Tabs */}
                    <div className="flex border-b border-gray-200 mb-4">
                        <button
                            type="button"
                            className={`px-4 py-2 text-sm font-medium ${formLevel === 1 ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                            onClick={() => setFormLevel(1)}
                        >
                            اطلاعات پایه
                        </button>
                        <button
                            type="button"
                            className={`px-4 py-2 text-sm font-medium ${formLevel === 2 ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                            onClick={async () => {
                                setFormLevel(2);
                                // Refresh guarantee types when moving to level 2
                                const { data, error } = await supabase
                                    .from('talanow_guarantee_types')
                                    .select('*')
                                    .eq('status', 'active');
                                if (!error && data) {
                                    setAvailableGuaranteeTypes(data);
                                }
                            }}
                            disabled={!name.trim()}
                        >
                            تنظیمات تضامین
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {formLevel === 1 ? (
                            <div className="grid gap-4 py-2">
                                <div className="flex flex-col gap-2">
                                    <Label>عنوان *</Label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="عنوان را وارد کنید"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>توضیحات</Label>
                                    <Textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="توضیحات اختیاری"
                                        rows={3}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>حداقل سرمایه‌گذاری (به گرم طلا)</Label>
                                    <Input
                                        type="number"
                                        placeholder="حداقل"
                                        value={minInvestment}
                                        onChange={(e) => setMinInvestment(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>حداکثر سرمایه‌گذاری (به گرم طلا)</Label>
                                    <Input
                                        type="number"
                                        placeholder="حداکثر"
                                        value={maxInvestment}
                                        onChange={(e) => setMaxInvestment(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>حداقل مدت (ماه)</Label>
                                    <Select value={minDuration} onValueChange={setMinDuration}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {monthsOptions.map((m) => (
                                                <SelectItem key={m} value={m}>
                                                    {m} ماه
                                                </SelectItem>
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
                                                <SelectItem key={m} value={m}>
                                                    {m} ماه
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 py-2">
                                {/* Available Guarantee Types Section */}
                                <div className="space-y-3">
                                    <div>
                                        <Label className="text-lg font-semibold text-gray-900">انواع تضامین دسترس پذیر</Label>
                                        <p className="text-xs text-gray-500 mt-1">برای افزودن تضمین به قرارداد، روی تضمین مورد نظر کلیک کنید</p>
                                    </div>

                                    {availableGuaranteeTypes.length === 0 ? (
                                        <div className="text-center py-6 text-gray-500 border border-dashed rounded-lg bg-gray-50">
                                            <p className="text-sm">هیچ نوع تضمینی موجود نیست</p>
                                            <p className="text-xs text-gray-400 mt-1">ابتدا در بخش "مدیریت تضامین" تضمین جدید ایجاد کنید</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {activeGuaranteeTypes.map((type) => {
                                                const isSelected = guaranteeTypes.some(gt => gt.id === type.id);
                                                return (
                                                    <button
                                                        key={type.id}
                                                        type="button"
                                                        onClick={() => {
                                                            if (!isSelected) {
                                                                setGuaranteeTypes([...guaranteeTypes, {
                                                                    id: type.id,
                                                                    name: type.name,
                                                                    profit_share: type.profit_share || 0,
                                                                    description: type.description || ''
                                                                }]);
                                                            }
                                                        }}
                                                        className={`p-3 rounded-lg border-2 transition text-right ${
                                                            isSelected
                                                                ? 'border-green-500 bg-green-50'
                                                                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between gap-2">
                                                            <div className="flex-1">
                                                                <div className="font-medium text-sm text-gray-900">{type.name}</div>
                                                                <div className="text-xs text-gray-500 mt-0.5">سود: {type.profit_share}%</div>
                                                            </div>
                                                            {isSelected && (
                                                                <div className="text-green-600 text-lg">✓</div>
                                                            )}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200"></div>

                                {/* Selected Guarantee Types Section */}
                                <div className="space-y-3">
                                    <div>
                                        <Label className="text-lg font-semibold text-gray-900">تضامین انتخاب شده</Label>
                                        <p className="text-xs text-gray-500 mt-1">اطلاعات تضامین انتخاب شده</p>
                                    </div>

                                    {guaranteeTypes.length === 0 ? (
                                        <div className="text-center py-6 text-gray-500 border-2 border-dashed rounded-lg bg-gray-50">
                                            <p className="font-medium">هیچ تضمینی انتخاب نشده است</p>
                                            <p className="text-xs text-gray-400 mt-1">از بخش "انواع تضامین دسترس پذیر" تضمین انتخاب کنید</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {guaranteeTypes.map((gt, index) => (
                                                <div key={index} className="border border-blue-200 rounded-lg p-4 space-y-3 bg-blue-50 hover:shadow-sm transition">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div className="flex-1">
                                                            <Label className="text-xs text-gray-600 uppercase tracking-wide">نوع تضمین</Label>
                                                            <div className="mt-1 text-base font-semibold text-gray-900">{gt.name}</div>
                                                        </div>
                                                        
                                                        <Button 
                                                            type="button" 
                                                            variant="ghost" 
                                                            size="sm"
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => {
                                                                setGuaranteeTypes(guaranteeTypes.filter((_, i) => i !== index));
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-gray-600">درصد سود پیش‌فرض</Label>
                                                        <div className="px-3 py-2 bg-white rounded border border-gray-200 text-right">
                                                            <span className="text-sm font-medium text-gray-900">{gt.profit_share}%</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {gt.description && (
                                                        <div className="text-xs text-gray-700 bg-white rounded p-3 border border-gray-200">
                                                            <span className="font-medium block mb-1">توضیحات:</span>
                                                            {gt.description}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {guaranteeTypes.length > 0 && (
                                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white mt-4 shadow-md">
                                            <span className="font-medium">جمع درصد سود:</span>
                                            <span className="text-2xl font-bold">{totalProfitShare.toFixed(1)}%</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="border-t pt-4">
                        {formLevel === 1 ? (
                            <>
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                    انصراف
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setFormLevel(2)}
                                    disabled={!name.trim()}
                                >
                                    مرحله بعد
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setFormLevel(1)}
                                >
                                    مرحله قبل
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                >
                                    {submitting ? 'در حال ذخیره...' : 'ذخیره'}
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={openBrokerModal} onOpenChange={(value) => {
                setOpenBrokerModal(value);
                if (!value) {
                    setSelectedBrokerId(null);
                    setSelectedContractTypeId(null);
                }
            }}>
                <DialogContent className="w-full max-w-lg gap-5 text-black">
                    <div className="text-base font-bold">{dict.admin.assign_broker}</div>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <Label>انتخاب بروکر</Label>
                            <Select value={selectedBrokerId ?? undefined} onValueChange={(value) => setSelectedBrokerId(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="یکی از بروکرها را انتخاب کنید" />
                                </SelectTrigger>
                                <SelectContent>
                                    {brokers.map((broker) => (
                                        <SelectItem key={broker.id} value={String(broker.id)}>
                                            {broker.first_name} {broker.last_name}{' '}
                                            {broker.username || broker.phone_number ? `(${broker.username || broker.phone_number})` : ''}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                disabled={assigningBroker}
                                onClick={async () => {
                                    if (!selectedContractTypeId) {
                                        toast.error('نوع قرارداد مشخص نیست');
                                        return;
                                    }
                                    if (!selectedBrokerId) {
                                        toast.error('بروکر را انتخاب کنید');
                                        return;
                                    }
                                    setAssigningBroker(true);
                                    try {
                                        const currentAssignment = brokerAssignments[selectedContractTypeId] ?? null;
                                        if (currentAssignment && String(currentAssignment.broker_id) === selectedBrokerId) {
                                            toast.info('بروکر بدون تغییر است');
                                            setAssigningBroker(false);
                                            return;
                                        }

                                        if (currentAssignment) {
                                            const { error } = await supabase
                                                .from('talanow_broker_contract_types_link')
                                                .update({
                                                    broker_id: selectedBrokerId,
                                                })
                                                .eq('id', currentAssignment.id);
                                            if (error) throw error;
                                        } else {
                                            const { error } = await supabase
                                                .from('talanow_broker_contract_types_link')
                                                .insert({
                                                    broker_id: selectedBrokerId,
                                                    contract_type_id: selectedContractTypeId,
                                                });
                                            if (error) throw error;
                                        }

                                        const { data, error: fetchError } = await supabase
                                            .from('talanow_broker_contract_types_link')
                                            .select('*')
                                            .eq('contract_type_id', selectedContractTypeId)
                                            .order('created_at', { ascending: false })
                                            .limit(1);
                                        if (fetchError) throw fetchError;

                                        const latestAssignment: BrokerAssignment | null = data?.[0] ?? null;
                                        setBrokerAssignments((prev) => ({
                                            ...prev,
                                            [selectedContractTypeId]: latestAssignment,
                                        }));
                                        toast.success(currentAssignment ? 'بروکر بروزرسانی شد' : 'بروکر اختصاص داده شد');
                                        setOpenBrokerModal(false);
                                        setSelectedBrokerId(null);
                                        setSelectedContractTypeId(null);
                                    } catch (error: any) {
                                        toast.error(error?.message || 'خطا در اختصاص بروکر');
                                    } finally {
                                        setAssigningBroker(false);
                                    }
                                }}
                            >
                                {assigningBroker ? 'در حال ذخیره...' : 'ثبت اختصاص'}
                            </Button>
                            <Button variant="outline" onClick={() => {
                                setOpenBrokerModal(false);
                                setSelectedBrokerId(null);
                                setSelectedContractTypeId(null);
                            }}>
                                {dict.admin.cancel}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
