'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ContractType, GuaranteeType, getGuaranteeTypes, supabase } from '@/services/supabase';
import { useGlobalContext } from '@/contexts/store';
import { Locale } from '@/i18n-config';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Pencil } from 'lucide-react';

type Props = {
    dict: any;
    lang: Locale;
};

type BrokerGuaranteeInput = {
    id?: string;
    name: string;
    profit_share: number;
    description: string;
};

const settlementOptions = ['آبشده', 'کیف داریک', 'ریالی', 'مصنوع و سکه'] as const;

export default function ContractTypes({ dict, lang }: Props) {
    const { user } = useGlobalContext();
    const [items, setItems] = useState<ContractType[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<ContractType | null>(null);
    const [guaranteeTypes, setGuaranteeTypes] = useState<GuaranteeType[]>([]);
    // Broker-specific active guarantees fetched directly from DB
    const [brokerAvailableGuarantees, setBrokerAvailableGuarantees] = useState<GuaranteeType[]>([]);
    const [formLevel, setFormLevel] = useState<1 | 2>(1);

    // form - broker can edit: description, min_investment, max_investment, min_duration_months, max_duration_months
    const [description, setDescription] = useState('');
    const [minInvestment, setMinInvestment] = useState('');
    const [maxInvestment, setMaxInvestment] = useState('');
    const [minDuration, setMinDuration] = useState('1');
    const [maxDuration, setMaxDuration] = useState('12');

    // Broker-added guarantees (selected from existing broker-defined guarantees)
    const [brokerGuarantees, setBrokerGuarantees] = useState<BrokerGuaranteeInput[]>([]);

    const [submitting, setSubmitting] = useState(false);

    const monthsOptions = useMemo(() => Array.from({ length: 12 }).map((_, i) => `${i + 1}`), []);

    // Separate admin and broker guarantees
    const adminGuarantees = useMemo(() => {
        if (!editing || !Array.isArray(editing.guarantee_type_ids)) return [];
        return editing.guarantee_type_ids
            .map(gtId => guaranteeTypes.find(gt => gt.id === gtId && gt.owner !== user?.id))
            .filter(g => g !== undefined) as GuaranteeType[];
    }, [editing, guaranteeTypes, user?.id]);

    // Calculate total profit share
    const totalProfitShare = useMemo(() => {
        let sum = 0;
        // Admin guarantees
        adminGuarantees.forEach(ag => {
            sum += (ag.profit_share || 0);
        });
        // Broker guarantees
        brokerGuarantees.forEach(bg => {
            sum += (bg.profit_share || 0);
        });
        return sum;
    }, [adminGuarantees, brokerGuarantees]);

    const guaranteeMap = useMemo(() => {
        const map: Record<string, GuaranteeType> = {};
        for (const g of guaranteeTypes) map[g.id] = g;
        return map;
    }, [guaranteeTypes]);

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
        // fetch broker-specific guarantees (active only)
        async function fetchBrokerGuarantees() {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('talanow_guarantee_types')
                    .select('*')
                    .eq('owner', user.id)
                    .eq('status', 'active')
                    .order('created_at', { ascending: false });

                if (!mounted) return;
                if (error) {
                    console.error('Error fetching broker guarantee types:', error);
                    setBrokerAvailableGuarantees([]);
                } else {
                    setBrokerAvailableGuarantees(data || []);
                }
            } catch (err) {
                if (!mounted) return;
                console.error('Error fetching broker guarantee types:', err);
                setBrokerAvailableGuarantees([]);
            }
        }
        fetchBrokerGuarantees();
        return () => {
            mounted = false;
        };
    }, []);

    const openEdit = (row: ContractType) => {
        setEditing(row);
        setDescription(row.description || '');
        setMinInvestment(row.min_investment ? String(row.min_investment) : '');
        setMaxInvestment(row.max_investment ? String(row.max_investment) : '');
        setMinDuration(row.min_duration_months ? String(row.min_duration_months) : '1');
        setMaxDuration(row.max_duration_months ? String(row.max_duration_months) : '12');

        // Load broker-specific guarantees already selected for this contract
        const brokerGuaranteesList = Array.isArray(row.guarantee_type_ids)
            ? row.guarantee_type_ids
                .map(gtId => guaranteeTypes.find(gt => gt.id === gtId && gt.owner === user?.id))
                .filter(g => g !== undefined)
                .map(g => ({
                    id: g!.id,
                    name: g!.name,
                    profit_share: g!.profit_share || 0,
                    description: g!.description || ''
                }))
            : [];

        setBrokerGuarantees(brokerGuaranteesList);
        setFormLevel(1);
        setOpen(true);
    };

    const handleSubmit = async () => {
        if (formLevel === 1) {
            if (!minInvestment?.trim() || !maxInvestment?.trim()) {
                toast.error(dict.marketplace.supplier.contractTypes.messages.requiredInvestment);
                return;
            }
            setFormLevel(2);
            return;
        }

        if (!user) return toast.info(dict.marketplace.supplier.contractTypes.messages.loginFirst);
        if (!editing) return toast.error(dict.marketplace.supplier.contractTypes.messages.editError);
        setSubmitting(true);
        try {
            // Broker guarantees are already defined - just collect their IDs
            const brokerGuaranteeIds = brokerGuarantees.map(bg => bg.id);

            // Combine admin guarantees with broker guarantees
            const existingAdminGuaranteeIds = editing.guarantee_type_ids.filter(
                id => guaranteeTypes.find(gt => gt.id === id && gt.owner !== user?.id)
            );
            const allGuaranteeIds = [...existingAdminGuaranteeIds, ...brokerGuaranteeIds];

            // Update contract type with new profit share
            const { error } = await supabase
                .from('talanow_contract_types')
                .update({
                    description,
                    min_investment: minInvestment ? Number(minInvestment) : null,
                    max_investment: maxInvestment ? Number(maxInvestment) : null,
                    min_duration_months: Number(minDuration),
                    max_duration_months: Number(maxDuration),
                    guarantee_type_ids: allGuaranteeIds,
                    profit_share: totalProfitShare,
                    updated_at: new Date().toISOString()
                })
                .eq('id', editing.id);

            if (error) throw error;
            toast.success(dict.marketplace.supplier.contractTypes.messages.updated);
            setOpen(false);

            // refresh list
            const { data } = await supabase
                .from('talanow_broker_contract_types_link')
                .select('talanow_contract_types(*)')
                .eq('broker_id', user.id);
            setItems((data.map(item => item.talanow_contract_types) || []).flat() as ContractType[]);
        } catch (e: any) {
            toast.error(e?.message || dict.marketplace.supplier.contractTypes.messages.error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="text-sm text-[#5A5C83]">{dict.marketplace.supplier.contractTypes.title}</div>
            </div>

            {loading && <div className="text-sm text-gray-600">{dict.marketplace.supplier.contractTypes.loading}</div>}
            {!loading && items.length === 0 && (
                <div className="text-sm text-gray-600">{dict.marketplace.supplier.contractTypes.noItems}</div>
            )}

            <div className="grid grid-cols-1 gap-3">
                {items.map((it) => (
                    <div key={it.id} className="flex flex-col gap-4 rounded-md border border-gray-200 bg-white p-4 text-sm">
                        <div className="flex items-center justify-between">
                            <div className="text-base font-semibold">{it.name}</div>
                            <div className={`rounded-full px-2 py-0.5 text-xs ${it.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {it.status === 'active' ? dict.marketplace.supplier.contractTypes.status.active : dict.marketplace.supplier.contractTypes.status.inactive}
                            </div>
                        </div>

                        <div className="rounded-md border border-gray-100 bg-gray-50 p-3 leading-6">
                            {it.description || '—'}
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div className="flex items-center justify-between rounded-md border border-gray-100 p-3">
                                <Label>{dict.marketplace.supplier.contractTypes.fields.minInvestment}</Label>
                                <div>{it.min_investment ?? '—'}</div>
                            </div>
                            <div className="flex items-center justify-between rounded-md border border-gray-100 p-3">
                                <Label>{dict.marketplace.supplier.contractTypes.fields.maxInvestment}</Label>
                                <div>{it.max_investment ?? '—'}</div>
                            </div>
                            <div className="flex items-center justify-between rounded-md border border-gray-100 p-3">
                                <Label>{dict.marketplace.supplier.contractTypes.fields.minDuration}</Label>
                                <div>{it.min_duration_months}</div>
                            </div>
                            <div className="flex items-center justify-between rounded-md border border-gray-100 p-3">
                                <Label>{dict.marketplace.supplier.contractTypes.fields.maxDuration}</Label>
                                <div>{it.max_duration_months}</div>
                            </div>
                            <div className="md:col-span-2 flex items-center justify-between rounded-md border border-gray-100 p-3">
                                <Label>{dict.marketplace.supplier.contractTypes.fields.settlementTypes}</Label>
                                <div className="text-left">{Array.isArray(it.settlement_type) ? it.settlement_type.join('، ') : '—'}</div>
                            </div>
                            <div className="md:col-span-2 flex items-center justify-between rounded-md border border-gray-100 p-3">
                                <Label>{dict.marketplace.supplier.contractTypes.fields.totalProfitShare}</Label>
                                <div>{it.profit_share ?? '—'}</div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="text-sm font-medium">{dict.marketplace.supplier.contractTypes.fields.guaranteeTypes}</div>
                            <div className="rounded-md border border-gray-200">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-right">{dict.marketplace.supplier.contractTypes.fields.guaranteeName}</TableHead>
                                            <TableHead className="text-right">{dict.marketplace.supplier.contractTypes.fields.defaultProfitShare}</TableHead>
                                            <TableHead className="text-right">{dict.marketplace.supplier.contractTypes.fields.description}</TableHead>
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
                            <Button variant="outline" onClick={() => openEdit(it)}>{dict.marketplace.supplier.contractTypes.actions.edit}</Button>
                            {it.status === 'active' ? (
                                <Button variant="destructive" onClick={async () => {
                                    const { error } = await supabase.from('talanow_contract_types').update({ status: 'inactive', updated_at: new Date().toISOString() }).eq('id', it.id);
                                    if (error) toast.error(dict.marketplace.supplier.contractTypes.messages.error);
                                    else {
                                        toast.success(dict.marketplace.supplier.contractTypes.messages.deactivated);
                                        const { data } = await supabase
                                            .from('talanow_broker_contract_types_link')
                                            .select('talanow_contract_types(*)')
                                            .eq('broker_id', user.id);
                                        setItems((data.map(item => item.talanow_contract_types) || []).flat() as ContractType[]);
                                    }
                                }}>{dict.marketplace.supplier.contractTypes.actions.deactivate}</Button>
                            ) : (
                                <Button variant="success" onClick={async () => {
                                    const { error } = await supabase.from('talanow_contract_types').update({ status: 'active', updated_at: new Date().toISOString() }).eq('id', it.id);
                                    if (error) toast.error(dict.marketplace.supplier.contractTypes.messages.error);
                                    else {
                                        toast.success(dict.marketplace.supplier.contractTypes.messages.activated);
                                        const { data } = await supabase
                                            .from('talanow_broker_contract_types_link')
                                            .select('talanow_contract_types(*)')
                                            .eq('broker_id', user.id);
                                        setItems((data.map(item => item.talanow_contract_types) || []).flat() as ContractType[]);
                                    }
                                }}>{dict.marketplace.supplier.contractTypes.actions.activate}</Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[600px] h-[calc(100vh-2rem)] flex flex-col max-h-screen">
                    <DialogHeader>
                        <DialogTitle>{dict.marketplace.supplier.contractTypes.dialog.editTitle} {editing && `: ${editing.name}`}</DialogTitle>
                    </DialogHeader>

                    {/* Form Level Tabs */}
                    <div className="flex border-b border-gray-200 mb-4">
                        <button
                            type="button"
                            className={`px-4 py-2 text-sm font-medium ${formLevel === 1 ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                            onClick={() => setFormLevel(1)}
                        >
                            {dict.marketplace.supplier.contractTypes.dialog.tabs.basicInfo}
                        </button>
                        <button
                            type="button"
                            className={`px-4 py-2 text-sm font-medium ${formLevel === 2 ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                            onClick={() => setFormLevel(2)}
                        >
                            {dict.marketplace.supplier.contractTypes.dialog.tabs.guaranteeManagement}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {formLevel === 1 ? (
                            <div className="grid gap-4 py-2">
                                {/* Read-only info */}
                                {editing && (
                                    <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm">
                                        <div className="mb-2 font-semibold">{dict.marketplace.supplier.contractTypes.dialog.fixedInfo}</div>
                                        <div className="flex flex-col gap-1 text-xs">
                                            <div>{dict.marketplace.supplier.contractTypes.dialog.title} <span className="font-medium">{editing.name}</span></div>
                                            <div>{dict.marketplace.supplier.contractTypes.fields.settlementTypes}: <span className="font-medium">{Array.isArray(editing.settlement_type) ? editing.settlement_type.join('، ') : '—'}</span></div>
                                        </div>
                                    </div>
                                )}

                                {/* Editable fields */}
                                <div className="flex flex-col gap-2">
                                    <Label>{dict.marketplace.supplier.contractTypes.fields.description}</Label>
                                    <Input placeholder={dict.marketplace.supplier.contractTypes.fields.description} value={description} onChange={(e) => setDescription(e.target.value)} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label>{dict.marketplace.supplier.contractTypes.fields.minInvestment}</Label>
                                        <Input type="number" placeholder={dict.marketplace.supplier.contractTypes.fields.minInvestment} value={minInvestment} onChange={(e) => setMinInvestment(e.target.value)} />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label>{dict.marketplace.supplier.contractTypes.fields.maxInvestment}</Label>
                                        <Input type="number" placeholder={dict.marketplace.supplier.contractTypes.fields.maxInvestment} value={maxInvestment} onChange={(e) => setMaxInvestment(e.target.value)} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label>{dict.marketplace.supplier.contractTypes.fields.minDuration}</Label>
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
                                        <Label>{dict.marketplace.supplier.contractTypes.fields.maxDuration}</Label>
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
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 py-2">
                                {/* Admin Guarantees - Read Only */}
                                <div>
                                    <div className="text-sm font-semibold mb-3">{dict.marketplace.supplier.contractTypes.dialog.adminGuarantees}</div>
                                    {adminGuarantees.length > 0 ? (
                                        <div className="space-y-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                                            {adminGuarantees.map((ag) => (
                                                <div key={ag.id} className="flex items-center justify-between text-sm py-2 px-2 border-b border-gray-100 last:border-b-0">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{ag.name}</div>
                                                        {ag.description && <div className="text-xs text-gray-600 mt-0.5">{ag.description}</div>}
                                                    </div>
                                                    <span className="font-bold text-green-700 whitespace-nowrap ml-2">{ag.profit_share}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            {dict.marketplace.supplier.contractTypes.dialog.noAdminGuarantees}
                                        </div>
                                    )}
                                </div>

                                {/* Broker Guarantees - Selection */}
                                <div className="space-y-3">
                                    <div>
                                        <Label className="text-lg font-semibold text-gray-900">{dict.marketplace.supplier.contractTypes.dialog.availablePersonalGuarantees}</Label>
                                        <p className="text-xs text-gray-500 mt-1">{dict.marketplace.supplier.contractTypes.dialog.clickToAdd}</p>
                                    </div>

                                    {/* Get all broker's guarantee types (created in guarantee management) */}
                                    {(() => {
                                        // use broker-specific active guarantees fetched directly from DB
                                        const brokerDefinedGuarantees = brokerAvailableGuarantees;
                                        const alreadyAddedIds = brokerGuarantees.map(bg => bg.id);

                                        if (brokerDefinedGuarantees.length === 0) {
                                            return (
                                                <div className="text-center py-6 text-gray-500 border border-dashed rounded-lg bg-gray-50">
                                                    <p className="text-sm">{dict.marketplace.supplier.contractTypes.dialog.noPersonalGuaranteesDefined}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{dict.marketplace.supplier.contractTypes.dialog.createFirst}</p>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {brokerDefinedGuarantees.map((type) => {
                                                    const isSelected = alreadyAddedIds.includes(type.id);
                                                    return (
                                                        <button
                                                            key={type.id}
                                                            type="button"
                                                            onClick={() => {
                                                                if (!isSelected) {
                                                                    setBrokerGuarantees([...brokerGuarantees, {
                                                                        id: type.id,
                                                                        name: type.name,
                                                                        profit_share: type.profit_share || 0,
                                                                        description: type.description || ''
                                                                    }]);
                                                                }
                                                            }}
                                                            className={`p-3 rounded-lg border-2 transition text-right ${isSelected
                                                                    ? 'border-green-500 bg-green-50'
                                                                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-between gap-2">
                                                                <div className="flex-1">
                                                                    <div className="font-medium text-sm text-gray-900">{type.name}</div>
                                                                    <div className="text-xs text-gray-500 mt-0.5">{dict.marketplace.supplier.contractTypes.fields.profit}: {type.profit_share}%</div>
                                                                </div>
                                                                {isSelected && (
                                                                    <div className="text-green-600 text-lg">✓</div>
                                                                )}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200"></div>

                                {/* Selected Broker Guarantees Section */}
                                <div className="space-y-3">
                                    <div>
                                        <Label className="text-lg font-semibold text-gray-900">{dict.marketplace.supplier.contractTypes.dialog.selectedPersonalGuarantees}</Label>
                                        <p className="text-xs text-gray-500 mt-1">{dict.marketplace.supplier.contractTypes.dialog.selectedInfo}</p>
                                    </div>

                                    {brokerGuarantees.length === 0 ? (
                                        <div className="text-center py-6 text-gray-500 border-2 border-dashed rounded-lg bg-gray-50">
                                            <p className="font-medium">{dict.marketplace.supplier.contractTypes.dialog.noSelected}</p>
                                            <p className="text-xs text-gray-400 mt-1">{dict.marketplace.supplier.contractTypes.dialog.selectFromAvailable}</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {brokerGuarantees.map((bg, index) => (
                                                <div key={index} className="border border-blue-200 rounded-lg p-4 space-y-3 bg-blue-50 hover:shadow-sm transition">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div className="flex-1">
                                                            <Label className="text-xs text-gray-600 uppercase tracking-wide">{dict.marketplace.supplier.contractTypes.fields.guaranteeType}</Label>
                                                            <div className="mt-1 text-base font-semibold text-gray-900">{bg.name}</div>
                                                        </div>

                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => {
                                                                setBrokerGuarantees(brokerGuarantees.filter((_, i) => i !== index));
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-gray-600">{dict.marketplace.supplier.contractTypes.fields.profitShare}</Label>
                                                        <div className="px-3 py-2 bg-white rounded border border-gray-200 text-right">
                                                            <span className="text-sm font-medium text-gray-900">{bg.profit_share}%</span>
                                                        </div>
                                                    </div>

                                                    {bg.description && (
                                                        <div className="text-xs text-gray-700 bg-white rounded p-3 border border-gray-200">
                                                            <span className="font-medium block mb-1">{dict.marketplace.supplier.contractTypes.fields.description}:</span>
                                                            {bg.description}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {(adminGuarantees.length > 0 || brokerGuarantees.length > 0) && (
                                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white mt-4 shadow-md">
                                            <span className="font-medium">{dict.marketplace.supplier.contractTypes.dialog.totalProfit}</span>
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
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>{dict.marketplace.supplier.contractTypes.actions.cancel}</Button>
                                <Button onClick={() => setFormLevel(2)}>{dict.marketplace.supplier.contractTypes.actions.continue}</Button>
                            </>
                        ) : (
                            <>
                                <Button type="button" variant="outline" onClick={() => setFormLevel(1)}>{dict.marketplace.supplier.contractTypes.actions.back}</Button>
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>{dict.marketplace.supplier.contractTypes.actions.cancel}</Button>
                                <Button disabled={submitting} onClick={handleSubmit}>{submitting ? dict.marketplace.supplier.contractTypes.actions.saving : dict.marketplace.supplier.contractTypes.actions.save}</Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
