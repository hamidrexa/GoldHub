'use client';

import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/app/[lang]/(user)/contracts/services/supabase';
import { useGlobalContext } from '@/contexts/store';
import { Locale } from '@/i18n-config';

type Props = {
    dict: any;
    lang: Locale;
};

type ContractType = 'type1' | 'type2';

const guaranteeOptions = ['ملک', 'چک', 'سفته'] as const;
const monthsOptions = Array.from({ length: 12 }).map((_, i) => `${i + 1}`);
const settlementOptions = ['آبشده', 'کیف داریک', 'ریالی', 'مصنوع و سکه'] as const;

export default function CreateContract({ dict, lang }: Props) {
    const { user } = useGlobalContext();

    const [open, setOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<ContractType | null>(null);
    const [amount, setAmount] = useState<string>('');
    const [guaranteeType, setGuaranteeType] = useState<string>('');
    const [duration, setDuration] = useState<string>('12');
    const [settlementType, setSettlementType] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);

    const showGuarantee = useMemo(() => selectedType === 'type1', [selectedType]);

    const resetForm = () => {
        setAmount('');
        setGuaranteeType('');
        setDuration('12');
        setSettlementType('');
    };

    const openModalFor = (type: ContractType) => {
        setSelectedType(type);
        setOpen(true);
    };

    const handleSubmit = async () => {
        if (!user) {
            toast.info('برای ایجاد قرارداد وارد شوید.');
            return;
        }
        const amountRls = Number(String(amount).replace(/\D/g, ''));
        if (!amountRls || amountRls <= 0) {
            toast.error('مبلغ سرمایه‌گذاری را به تومان وارد کنید.');
            return;
        }
        if (!settlementType) {
            toast.error('نوع تسویه را انتخاب کنید.');
            return;
        }
        if (showGuarantee && !guaranteeType) {
            toast.error('نوع تضامین را انتخاب کنید.');
            return;
        }
        setSubmitting(true);
        try {
            const { error } = await supabase.from('contracts').insert({
                user_id: user.id,
                type: selectedType,
                amount_rls: amountRls * 10,
                guarantee_type: showGuarantee ? guaranteeType : null,
                duration_months: Number(duration),
                settlement_type: settlementType,
                status: 'pending',
            });
            if (error) throw error;
            toast.success('درخواست قرارداد با موفقیت ثبت شد.');
            setOpen(false);
            resetForm();
        } catch (e: any) {
            toast.error(e?.message || 'خطا در ایجاد قرارداد');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mb-6 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-white p-4">
                <div className="mb-2 text-lg font-bold">قرارداد نوع ۱</div>
                <div className="mb-4 text-sm text-gray-600">
                    سپردن طلا/نقد و دریافت سود سالانه نزدیک ۱۰٪ بر پایه طلا.
                </div>
                <Button onClick={() => openModalFor('type1')}>ایجاد قرارداد</Button>
            </div>
            <div className="rounded-lg border bg-white p-4">
                <div className="mb-2 text-lg font-bold">قرارداد نوع ۲</div>
                <div className="mb-4 text-sm text-gray-600">
                    سرمایه‌گذاری ساده با انتخاب مدت و نوع تسویه.
                </div>
                <Button variant="secondary" onClick={() => openModalFor('type2')}>
                    ایجاد قرارداد
                </Button>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-full max-w-lg gap-5 text-black">
                    <div className="text-base font-bold">
                        تنظیمات قرارداد {selectedType === 'type1' ? 'نوع ۱' : 'نوع ۲'}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>مبلغ سرمایه گذاری (تومان)</Label>
                        <Input
                            inputMode="numeric"
                            placeholder="مبلغ پرداختی به تومان"
                            value={amount}
                            onChange={(e) => {
                                const v = e.target.value.replace(/\D/g, '');
                                setAmount(v);
                            }}
                            style={{ direction: 'ltr', textAlign: amount ? 'left' : 'right' }}
                        />
                        <div className="text-xs text-gray-500">
                            راهنما: از بخش «معامله» مقدار «مبلغ پرداختی به تومان» را الهام بگیرید.
                        </div>
                    </div>

                    {showGuarantee && (
                        <div className="flex flex-col gap-2">
                            <Label>نوع تضامین</Label>
                            <Select value={guaranteeType} onValueChange={setGuaranteeType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="انتخاب کنید" />
                                </SelectTrigger>
                                <SelectContent>
                                    {guaranteeOptions.map((g) => (
                                        <SelectItem key={g} value={g}>
                                            {g}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <Label>مدت سرمایه گذاری (ماه)</Label>
                        <Select value={duration} onValueChange={setDuration}>
                            <SelectTrigger>
                                <SelectValue placeholder="انتخاب کنید" />
                            </SelectTrigger>
                            <SelectContent>
                                {monthsOptions.map((m) => (
                                    <SelectItem key={m} value={m}>
                                        {m}
                                    </SelectItem>
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
                                    <SelectItem key={s} value={s}>
                                        {s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="mt-2 flex gap-3">
                        <Button disabled={submitting} onClick={handleSubmit}>
                            {submitting ? 'در حال ثبت...' : 'ثبت قرارداد'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            انصراف
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}


