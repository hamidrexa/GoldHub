'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import {
    ContractType,
    createContract,
    getBrokerMembershipForUser,
    linkMemberToBroker,
    supabase,
} from '@/services/supabase';

interface BrokerContractTypeLink {
    talanow_contract_types: ContractType;
}

import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useGlobalContext } from '@/contexts/store';

type Props = {
    broker: any;
    dict: any;
    lang: string;
};

type BrokerMembership = {
    broker_id: string;
    member_id: string;
};

const BROKER_COOKIE_KEY = 'tala_broker_ref';
const CONTRACT_QUERY_KEY = 'contract';

export default function BrokerPublicPage({ broker, dict, lang }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user, isUserLoading } = useGlobalContext();

    const [contractTypes, setContractTypes] = useState<ContractType[]>([]);
    const [loading, setLoading] = useState(true);
    const [membership, setMembership] = useState<BrokerMembership | null>(null);
    const [membershipLoading, setMembershipLoading] = useState(false);
    const [contractDialogOpen, setContractDialogOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState<ContractType | null>(null);
    const [amount, setAmount] = useState('');
    const [duration, setDuration] = useState('');
    const [settlementType, setSettlementType] = useState<'آبشده' | 'کیف داریک' | 'ریالی' | 'مصنوع و سکه' | ''>('');
    const [guaranteeType, setGuaranteeType] = useState<'ملک' | 'چک' | 'سفته' | ''>('');
    const [submitting, setSubmitting] = useState(false);
    const [amountError, setAmountError] = useState('');
    const [durationError, setDurationError] = useState('');

    const autoFlowTriggeredRef = useRef(false);

    const monthsOptions = useMemo(() =>
        Array.from({ length: 12 }).map((_, index) => `${index + 1}`),
    []);
    const settlementOptions = useMemo(() =>
        ['آبشده', 'کیف داریک', 'ریالی', 'مصنوع و سکه'] as const,
    []);

    const isAuthenticated = Boolean(user?.id);
    const isMemberOfAnotherBroker = useMemo(() =>
        membership && membership.broker_id && membership.broker_id !== broker?.id,
    [membership, broker?.id]);

    // Set broker cookie when page loads
    useEffect(() => {
        if (broker?.broker_id) {
            Cookies.set(BROKER_COOKIE_KEY, broker.broker_id, { expires: 30 }); // 30 days
        }
    }, [broker?.broker_id]);

    // Check user's broker membership
    useEffect(() => {
        async function checkMembership() {
            if (!user?.id) return;
            
            const { data } = await getBrokerMembershipForUser(String(user.id));
            if (data) {
                setMembership(data);
            }
        }
        
        if (!isUserLoading) {
            checkMembership();
        }
    }, [user?.id, isUserLoading]);

    useEffect(() => {
        let mounted = true;
        async function fetchContractTypes() {
            if (!broker?.broker_id) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('talanow_broker_contract_types_link')
                    .select('talanow_contract_types!inner(*)')
                    .eq('broker_id', broker.broker_id)
                    .eq('talanow_contract_types.status', 'active');

                if (!mounted) return;

                if (error) {
                    console.error('Error fetching contract types:', error);
                    setContractTypes([]);
                } else if (data) {
                    // Type assertion for the response data
                    const responseData = data as unknown as BrokerContractTypeLink[];
                    // Map the response to ContractType array
                    const types = responseData.map(item => item.talanow_contract_types);
                    console.log('Fetched contract types:', types);
                    setContractTypes(types);
                }
            } catch (err) {
                console.error('Error:', err);
                setContractTypes([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        fetchContractTypes();
        return () => {
            mounted = false;
        };
    }, [broker?.id]);

    const handleStartContract = async (contractType: ContractType) => {
        if (!isAuthenticated) {
            // Save the contract type ID in URL for after login
            const returnUrl = `${pathname}?${CONTRACT_QUERY_KEY}=${contractType.id}`;
            router.push(`/${lang}/login?returnUrl=${encodeURIComponent(returnUrl)}`);
            return;
        }

        // Check if user is already a member of another broker
        if (isMemberOfAnotherBroker) {
            toast.error('شما قبلاً عضو کارگزار دیگری هستید و نمی‌توانید به کارگزار جدید بپیوندید.');
            return;
        }

        // Check if user is already a member of this broker
        if (!membership || membership.broker_id !== broker?.broker_id) {
            // Link user to broker
            setMembershipLoading(true);
            const { error } = await linkMemberToBroker(String(user.id), broker.broker_id);
            setMembershipLoading(false);

            if (error) {
                toast.error('خطا در ثبت عضویت. لطفاً دوباره تلاش کنید.');
                return;
            }

            // Update membership state
            setMembership({ member_id: String(user.id), broker_id: broker.broker_id });
            toast.success(`شما با موفقیت به عنوان عضو ${displayName} ثبت شدید!`);
        }

        // Open contract dialog
        setSelectedContract(contractType);
        setAmount('');
        setDuration('');
        setSettlementType('');
        setGuaranteeType('');
        setAmountError('');
        setDurationError('');
        setContractDialogOpen(true);
    };

    const validateContractForm = (): boolean => {
        let isValid = true;
        setAmountError('');
        setDurationError('');

        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setAmountError('لطفاً مبلغ معتبر وارد کنید');
            isValid = false;
        }

        if (selectedContract?.min_investment && Number(amount) < selectedContract.min_investment) {
            setAmountError(`حداقل سرمایه‌گذاری ${selectedContract.min_investment.toLocaleString('fa-IR')} ریال است`);
            isValid = false;
        }

        if (selectedContract?.max_investment && Number(amount) > selectedContract.max_investment) {
            setAmountError(`حداکثر سرمایه‌گذاری ${selectedContract.max_investment.toLocaleString('fa-IR')} ریال است`);
            isValid = false;
        }

        if (!duration || isNaN(Number(duration)) || Number(duration) <= 0) {
            setDurationError('لطفاً مدت قرارداد را انتخاب کنید');
            isValid = false;
        }

        if (selectedContract && (Number(duration) < selectedContract.min_duration_months || Number(duration) > selectedContract.max_duration_months)) {
            setDurationError(`مدت قرارداد باید بین ${selectedContract.min_duration_months} تا ${selectedContract.max_duration_months} ماه باشد`);
            isValid = false;
        }

        if (!settlementType) {
            toast.error('لطفاً نوع تسویه را انتخاب کنید');
            isValid = false;
        }

        if (!guaranteeType) {
            toast.error('لطفاً نوع تضمین را انتخاب کنید');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmitContract = async () => {
        if (!validateContractForm() || !selectedContract || !user?.id) return;

        setSubmitting(true);
        try {
            const contractData = {
                user_id: String(user.id),
                broker_id: broker.broker_id,
                contract_type_id: selectedContract.id,
                amount_rls: Number(amount),
                guarantee_type: guaranteeType as 'ملک' | 'چک' | 'سفته',
                duration_months: Number(duration),
                settlement_type: settlementType as 'آبشده' | 'کیف داریک' | 'ریالی' | 'مصنوع و سکه',
                status: 'pending',
            };

            const result = await createContract(contractData);

            if (result) {
                toast.success('قرارداد شما با موفقیت ثبت شد و در انتظار تایید کارگزار است.');
                setContractDialogOpen(false);
                setSelectedContract(null);
                // Clear form
                setAmount('');
                setDuration('');
                setSettlementType('');
                setGuaranteeType('');
            } else {
                toast.error('خطا در ثبت قرارداد. لطفاً دوباره تلاش کنید.');
            }
        } catch (error) {
            console.error('Error creating contract:', error);
            toast.error('خطا در ثبت قرارداد. لطفاً دوباره تلاش کنید.');
        } finally {
            setSubmitting(false);
        }
    };

    const displayName = broker?.full_name?.trim()
        || `${broker?.first_name ?? ''} ${broker?.last_name ?? ''}`.trim()
        || broker?.username
        || 'کارگزار';

    return (
        <div className="flex w-full justify-center">
            <div className="relative flex w-full flex-col gap-6 px-4 text-black md:max-w-4xl">
                {/* Broker Header */}
                <div className="relative flex w-full flex-col gap-4 rounded-md border-gray-400 bg-white px-6 py-8 md:border">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#0C0E3C] to-[#1a1d5c] text-white text-3xl font-bold">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-[#0C0E3C]">{displayName}</h1>
                            <p className="mt-2 text-lg text-[#5A5C83]">کارگزار معتمد طلانو</p>
                        </div>
                        {broker?.email && (
                            <div className="text-sm text-[#5A5C83]">{broker.email}</div>
                        )}
                    </div>

                    <div className="mt-4 rounded-lg bg-gradient-to-r from-[#0C0E3C]/5 to-[#1a1d5c]/5 p-6 text-center">
                        <p className="text-base leading-relaxed text-[#0C0E3C]">
                            با استفاده از قراردادهای سرمایه‌گذاری ما، می‌توانید در بازار طلا سرمایه‌گذاری امن و سودآوری داشته باشید.
                            انواع قراردادهای سرمایه‌گذاری را مشاهده کنید و با ما همکاری کنید.
                        </p>
                    </div>
                </div>

                {/* Contract Types Section */}
                <div className="relative flex w-full flex-col gap-6 rounded-md border-gray-400 bg-white px-6 py-8 md:border">
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row gap-3">
                            <Icons.barChart3 stroke="#0C0E3C" className="h-6 w-6" />
                            <h2 className="text-2xl font-bold text-[#0C0E3C]">قراردادهای سرمایه‌گذاری</h2>
                        </div>
                    </div>

                    {loading && (
                        <div className="py-8 text-center text-sm text-[#5A5C83]">
                            در حال بارگذاری قراردادها...
                        </div>
                    )}

                    {!loading && contractTypes.length === 0 && (
                        <div className="py-8 text-center text-sm text-[#5A5C83]">
                            در حال حاضر قراردادی موجود نیست.
                        </div>
                    )}

                    {!loading && contractTypes.length > 0 && (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {contractTypes.map((contractType) => (
                                <div
                                    key={contractType.id}
                                    className="group relative flex flex-col gap-4 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-white via-gray-50 to-white p-6 shadow-lg transition-all duration-300 hover:border-[#0C0E3C]/30 hover:shadow-2xl hover:-translate-y-1"
                                >
                                    {/* Decorative gradient overlay */}
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#0C0E3C]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    
                                    <div className="relative z-10 flex flex-col gap-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#0C0E3C] to-[#1a1d5c] shadow-lg">
                                                    <Icons.trendingUp className="h-6 w-6 text-white" />
                                                </div>
                                                <h3 className="text-xl font-bold text-[#0C0E3C]">
                                                    {contractType.name}
                                                </h3>
                                            </div>
                                            {contractType.profit_share && (
                                                <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-md">
                                                    <Icons.sparkles className="h-4 w-4" />
                                                    <span>{contractType.profit_share}% سود</span>
                                                </div>
                                            )}
                                        </div>

                                        {contractType.description && (
                                            <p className="text-sm leading-relaxed text-[#5A5C83]">
                                                {contractType.description}
                                            </p>
                                        )}

                                        <div className="flex flex-col gap-2 text-sm">
                                            {contractType.min_investment && (
                                                <div className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
                                                    <span className="flex items-center gap-2 text-[#5A5C83]">
                                                        <Icons.arrowDown className="h-4 w-4 text-blue-500" />
                                                        حداقل سرمایه‌گذاری:
                                                    </span>
                                                    <span className="font-bold text-[#0C0E3C]">
                                                        {contractType.min_investment.toLocaleString('fa-IR')} ریال
                                                    </span>
                                                </div>
                                            )}

                                            {contractType.max_investment && (
                                                <div className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
                                                    <span className="flex items-center gap-2 text-[#5A5C83]">
                                                        <Icons.arrowUp className="h-4 w-4 text-purple-500" />
                                                        حداکثر سرمایه‌گذاری:
                                                    </span>
                                                    <span className="font-bold text-[#0C0E3C]">
                                                        {contractType.max_investment.toLocaleString('fa-IR')} ریال
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
                                                <span className="flex items-center gap-2 text-[#5A5C83]">
                                                    <Icons.calendar className="h-4 w-4 text-orange-500" />
                                                    مدت قرارداد:
                                                </span>
                                                <span className="font-bold text-[#0C0E3C]">
                                                    {contractType.min_duration_months} تا {contractType.max_duration_months} ماه
                                                </span>
                                            </div>

                                            {contractType.guarantee_type && contractType.guarantee_type.length > 0 && (
                                                <div className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
                                                    <span className="flex items-center gap-2 text-[#5A5C83]">
                                                        <Icons.shield className="h-4 w-4 text-green-500" />
                                                        انواع تضامین:
                                                    </span>
                                                    <span className="font-bold text-[#0C0E3C]">
                                                        {contractType.guarantee_type.join('، ')}
                                                    </span>
                                                </div>
                                            )}

                                            {contractType.settlement_type && contractType.settlement_type.length > 0 && (
                                                <div className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
                                                    <span className="flex items-center gap-2 text-[#5A5C83]">
                                                        <Icons.coins className="h-4 w-4 text-yellow-500" />
                                                        انواع تسویه:
                                                    </span>
                                                    <span className="font-bold text-[#0C0E3C]">
                                                        {contractType.settlement_type.join('، ')}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* CTA Button for each contract type */}
                                        <Button
                                            onClick={() => handleStartContract(contractType)}
                                            disabled={membershipLoading}
                                            className="mt-4 w-full bg-gradient-to-r from-[#0C0E3C] to-[#1a1d5c] text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-50"
                                            size="xl"
                                        >
                                            <Icons.rocket className="ml-2 h-5 w-5" />
                                            {isAuthenticated ? 'شروع این قرارداد' : 'ثبت‌نام و شروع قرارداد'}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Trust Indicators */}
                    {!loading && contractTypes.length > 0 && (
                        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="flex flex-col items-center gap-2 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-center">
                                <Icons.shield className="h-10 w-10 text-blue-600" />
                                <h4 className="font-bold text-[#0C0E3C]">امنیت بالا</h4>
                                <p className="text-xs text-[#5A5C83]">سرمایه‌گذاری با تضمین کامل</p>
                            </div>
                            <div className="flex flex-col items-center gap-2 rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-6 text-center">
                                <Icons.trendingUp className="h-10 w-10 text-green-600" />
                                <h4 className="font-bold text-[#0C0E3C]">سود تضمینی</h4>
                                <p className="text-xs text-[#5A5C83]">بازدهی مطمئن و شفاف</p>
                            </div>
                            <div className="flex flex-col items-center gap-2 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-6 text-center">
                                <Icons.users className="h-10 w-10 text-purple-600" />
                                <h4 className="font-bold text-[#0C0E3C]">پشتیبانی حرفه‌ای</h4>
                                <p className="text-xs text-[#5A5C83]">همراهی در تمام مراحل</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="rounded-md bg-gray-50 p-4 text-center text-xs text-[#5A5C83]">
                    این صفحه متعلق به کارگزار {displayName} در پلتفرم طلانو می‌باشد.
                </div>

                {/* Contract Creation Dialog */}
                <Dialog open={contractDialogOpen} onOpenChange={setContractDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-[#0C0E3C]">
                                ثبت قرارداد سرمایه‌گذاری
                            </DialogTitle>
                            <DialogDescription className="text-[#5A5C83]">
                                {selectedContract?.name} - لطفاً اطلاعات قرارداد را تکمیل کنید
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-6 py-4">
                            {/* Amount Input */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="amount" className="text-[#0C0E3C] font-semibold">
                                    مبلغ سرمایه‌گذاری (ریال)
                                </Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="مثال: 10000000"
                                    value={amount}
                                    onChange={(e) => {
                                        setAmount(e.target.value);
                                        setAmountError('');
                                    }}
                                    className="text-lg"
                                />
                                {amountError && (
                                    <p className="text-sm text-red-500">{amountError}</p>
                                )}
                                {selectedContract?.min_investment && selectedContract?.max_investment && (
                                    <p className="text-xs text-[#5A5C83]">
                                        محدوده: {selectedContract.min_investment.toLocaleString('fa-IR')} تا {selectedContract.max_investment.toLocaleString('fa-IR')} ریال
                                    </p>
                                )}
                            </div>

                            {/* Duration Select */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="duration" className="text-[#0C0E3C] font-semibold">
                                    مدت قرارداد (ماه)
                                </Label>
                                <Select value={duration} onValueChange={(value) => {
                                    setDuration(value);
                                    setDurationError('');
                                }}>
                                    <SelectTrigger className="text-lg">
                                        <SelectValue placeholder="انتخاب مدت قرارداد" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {monthsOptions
                                            .filter(m => {
                                                const month = Number(m);
                                                return selectedContract && 
                                                    month >= selectedContract.min_duration_months && 
                                                    month <= selectedContract.max_duration_months;
                                            })
                                            .map((month) => (
                                                <SelectItem key={month} value={month}>
                                                    {month} ماه
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                                {durationError && (
                                    <p className="text-sm text-red-500">{durationError}</p>
                                )}
                            </div>

                            {/* Settlement Type Select */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="settlement" className="text-[#0C0E3C] font-semibold">
                                    نوع تسویه
                                </Label>
                                <Select value={settlementType} onValueChange={(value) => setSettlementType(value as typeof settlementType)}>
                                    <SelectTrigger className="text-lg">
                                        <SelectValue placeholder="انتخاب نوع تسویه" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectedContract?.settlement_type?.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Guarantee Type Select */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="guarantee" className="text-[#0C0E3C] font-semibold">
                                    نوع تضمین
                                </Label>
                                <Select value={guaranteeType} onValueChange={(value) => setGuaranteeType(value as typeof guaranteeType)}>
                                    <SelectTrigger className="text-lg">
                                        <SelectValue placeholder="انتخاب نوع تضمین" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectedContract?.guarantee_type?.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Summary Box */}
                            {amount && duration && selectedContract?.profit_share && (
                                <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-4 border-2 border-green-200">
                                    <h4 className="font-bold text-[#0C0E3C] mb-2">پیش‌بینی سود</h4>
                                    <p className="text-2xl font-bold text-green-600">
                                        {(Number(amount) * (selectedContract.profit_share / 100) * (Number(duration) / 12)).toLocaleString('fa-IR')} ریال
                                    </p>
                                    <p className="text-xs text-[#5A5C83] mt-1">
                                        سود تقریبی برای {duration} ماه با نرخ {selectedContract.profit_share}%
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setContractDialogOpen(false)}
                                disabled={submitting}
                            >
                                انصراف
                            </Button>
                            <Button
                                onClick={handleSubmitContract}
                                disabled={submitting}
                                className="bg-gradient-to-r from-[#0C0E3C] to-[#1a1d5c] text-white"
                            >
                                {submitting ? 'در حال ثبت...' : 'ثبت قرارداد'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
