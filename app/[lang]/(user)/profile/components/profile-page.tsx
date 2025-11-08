'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/spinner';
import { useGlobalContext } from '@/contexts/store';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { toast } from 'sonner';
import { isMobile } from 'react-device-detect';
import { ProductsNavigator } from '@/components/products-navigator';
import { getPlans } from '@/app/[lang]/(user)/profile/services/getPlans';
import { supabase } from '@/services/supabase';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { EditIcon, FileClock } from 'lucide-react';
import Cookies from 'js-cookie';
import { googleLogout } from '@react-oauth/google';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { updateUser } from '@/app/[lang]/(user)/profile/services/updateUser';
import { componentFormat } from '@/libs/stringFormatter';
import { LinearProgress } from '@/app/[lang]/(user)/profile/components/linear-progress';
import { StatusBadge } from '@/app/[lang]/(user)/profile/components/status-badge';
import { NameEditForm } from '@/app/[lang]/(user)/profile/components/name-edit-form';
import { EmailEditForm } from '@/app/[lang]/(user)/profile/components/email-edit-form';
import { ActivationForm } from '@/app/[lang]/(user)/profile/components/activation-form';
import { emailVerification } from '@/app/[lang]/(user)/profile/services/emailVerification';
import { PasswordChangeForm } from '@/app/[lang]/(user)/profile/components/change-password-form';
import { PhoneSubmitForm } from '@/app/[lang]/(user)/profile/components/phone-submit-form';
import { useTransactions } from '@/app/[lang]/(user)/profile/services/useTransactions';
import { cn, currency, roundNumber } from '@/libs/utils';
import { NationalCodeVerificationForm } from './national-code-form';
import { Box, BoxContent, BoxTitle } from '@/components/box';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Icons } from '@/components/ui/icons';
import { FinantialAccount } from './finantial-account';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/components/copy-button';
import { useCart } from '../services/getCart';

dayjs.extend(utc);

export function ProfilePage({ dict, lang }) {
    const [verifyOpen, setVerifyOpen] = useState(false);
    const [nameDialogOpen, setNameDialogOpen] = useState(false);
    const [PhoneModalOpen, setPhoneModalOpen] = useState(true);
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [nationalCodeDialogOpen, setNationalCodeDialogOpen] = useState(false);
    const [finantialAccountOpen, setFinantialAccountOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { user, setUser } = useGlobalContext();
    const [isGetReadyPushNotification, setIsGetReadyPushNotification] =
        useState(false);
    const [userPlans, setUserPlans] = useState(null);
    const { data, isLoading: cartIsloding, mutate } = useCart();
    const [memberBrokerId, setMemberBrokerId] = useState<string | null>(null);
    const [isMemberBrokerLoading, setIsMemberBrokerLoading] = useState(false);
    const userGroups = user?.groups ?? [];
    const hasAdmin = userGroups.some((g) => g?.name === 'admin');
    const hasBroker = userGroups.some((g) => g?.name === 'broker');
    const hasExplicitMember = userGroups.some((g) => g?.name === 'member');
    const hasMember = !!user && (userGroups.length === 0 || hasExplicitMember || (!hasAdmin && !hasBroker));

    const [userTransactions, setUserTransactions] = useState(null);
    const completePercentage = useMemo(() => {
        if (!user) return;

        let completePercentage = 0;
        if (user.phone_number_confirmed || lang !== 'fa')
            completePercentage += 25;
        if (user.first_name && user.last_name) completePercentage += 50;
        if (user.email_confirmed) completePercentage += 25;

        return completePercentage;
    }, [user]);
    const activePlan = useMemo(() => {
        if (!userPlans) return null;

        return userPlans.find(({ is_active }) => is_active);
    }, [userPlans]);
    const traderPageRequestStatus = useMemo(() => {
        if (!user) return;

        if (user.trader_page_status === 'not_requested') return null;
        if (user.trader_page_status === 'authorization_failed')
            return {
                status: 'failed',
                text: dict.authorizeFailed,
            };
        if (user.trader_page_status === 'pending_for_authorization')
            return {
                status: 'pending',
                text: dict.confirmedType.pend,
            };
        return {
            status: 'confirmed',
            text: dict.confirmedType.confirmed,
        };
    }, [user?.trader_page_status]);

    useEffect(() => {
        async function getData() {
            const userPlans = await getPlans(lang);
            setUserPlans(
                // @ts-ignore
                userPlans?.user_plan?.filter((plan) => {
                    const today = dayjs.utc();
                    const dateToCheck = dayjs.utc(plan.end_time);
                    return !dateToCheck.isAfter(today) ? false : plan;
                }) ?? []
            );
        }

        getData();
    }, [user]);
    const { transactions, isLoading } = useTransactions();

    const successful = !!transactions
        ? transactions.transactions.filter(
            (item) =>
                dayjs().diff(item.created_at, 'day') <= 2 ||
                item.state == 'Complete'
        )
        : [];

    useEffect(() => {
        setUserTransactions(transactions?.transactions);
    }, [transactions]);

    useEffect(() => {
        let active = true;

        async function fetchMemberBroker() {
            if (!user?.id) return;

            setIsMemberBrokerLoading(true);
            const { data, error } = await supabase
                .from('talanow_broker_member_link')
                .select('broker_id')
                .eq('member_id', user.id)
                .maybeSingle();

            if (!active) return;

            if (error) {
                setMemberBrokerId(null);
            } else {
                setMemberBrokerId(data?.broker_id ?? null);
            }
            setIsMemberBrokerLoading(false);
        }

        if (hasMember && user?.id) {
            fetchMemberBroker();
        } else {
            setMemberBrokerId(null);
            setIsMemberBrokerLoading(false);
        }

        return () => {
            active = false;
        };
    }, [hasMember, user?.id]);

    const setPusheId = async (reset?: any) => {
        if (user.pushe_notification_id && !reset) return;

        const id = reset ? null : await window.Pushe.getDeviceId();
        try {
            const { pushe_notification_id } = await updateUser({
                pushe_notification_id: id,
                email: user.email,
            });
            setUser({ ...user, pushe_notification_id });
        } catch (e) {
            toast.error(dict.notifNotActive);
        }
    };
    const installPushNotification = async () => {
        setIsGetReadyPushNotification(true);
        window.Pushe.subscribe({
            showDialog: false,
            showBell: false,
            icon: 'https://talanow.ir/img/logo.png',
        });
        window.Pushe.addEventListener(
            window.Pushe.EVENTS.SUBSCRIPTION_CHANGE,
            async ({ isSubscribed, state }) => {
                if (isSubscribed && state === 'granted') await setPusheId();
                if (state === 'denied') toast.error(dict.activeBrowserNotif);
                setIsGetReadyPushNotification(false);
            }
        );
        if (Notification.permission === 'granted') {
            await setPusheId();
            setIsGetReadyPushNotification(false);
        }
    };
    const transactionStatus = {
        'Cancel by user': (
            <span className="text-red-500">
                {dict.transactionStatus.cancel}
            </span>
        ),
        Complete: (
            <span className="text-green-500">
                {dict.transactionStatus.success}
            </span>
        ),
    };

    const logout = () => {
        Cookies.remove('token');
        Cookies.remove('token-refresh');
        location.href = `/login`;
        googleLogout();
    };
    
    if (!user)
        return (
            <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center md:h-[calc(100vh-90px)]">
                <Spinner width={40} height={40} />
            </div>
        );
    return (
        <main className="main">
            <div className="jumbotron">
                {/* {!isMobile && <ProductsNavigator dict={dict} lang={lang} />} */}
                <div className="w-full text-black">
                    {completePercentage && completePercentage < 100 && (
                        // @ts-ignore
                        <LinearProgress
                            progress={completePercentage}
                            title={dict.profileComplete.title}
                            description={componentFormat(
                                dict.profileComplete.text,
                                {},
                                <span className="lg:font-bold">
                                    {dict.profileComplete.notif}
                                </span>
                            )}
                        />
                    )}
                    <div className="flex items-center gap-3">
                        <Image
                            height={60}
                            width={60}
                            src="/img/user.png"
                            alt="avatar"
                        />
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-black">
                                    {user.first_name || user.last_name
                                        ? `${user.first_name || ''} ${user.last_name || ''}`
                                        : 'کاربر طلانو'}
                                </span>
                                <Dialog
                                    open={nameDialogOpen}
                                    onOpenChange={setNameDialogOpen}
                                >
                                    <DialogTrigger>
                                        <EditIcon
                                            onClick={() => {
                                                setNameDialogOpen(true);
                                            }}
                                            className="cursor-pointer"
                                        />
                                    </DialogTrigger>
                                    <DialogContent className="max-w-xl">
                                        <DialogHeader>
                                            <DialogTitle>ویرایش اطلاعات</DialogTitle>
                                        </DialogHeader>
                                        <NameEditForm
                                            setOpen={setNameDialogOpen}
                                            lang={lang}
                                            dict={dict}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </div>
                            {(hasAdmin || hasBroker || hasMember) && (
                                <div className="flex flex-wrap items-center gap-2 text-sm">
                                    {hasAdmin && (
                                        <Badge variant="secondary" size="sm">
                                            ادمین
                                        </Badge>
                                    )}
                                    {hasBroker && (
                                        <Badge variant="success" size="sm">
                                            کارگزار
                                        </Badge>
                                    )}
                                    {hasMember && (
                                        <>
                                            <Badge variant="light" size="sm">
                                                عضو
                                            </Badge>
                                            <Badge variant="outline-blue" size="sm">
                                                {isMemberBrokerLoading
                                                    ? 'شناسه کارگزار در حال دریافت...'
                                                    : `شناسه کارگزار: ${memberBrokerId ?? '—'}`}
                                            </Badge>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col-reverse items-start justify-start gap-6 md:flex-row lg:mt-6 lg:w-full">
                        <div className="w-full space-y-7">
                            {lang === 'fa' && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="text-base">
                                            شماره همراه:
                                        </div>
                                        {/*// @ts-ignore*/}
                                        <StatusBadge
                                            dict={dict}
                                            status={
                                                user &&
                                                    user.phone_number_confirmed
                                                    ? 'confirmed'
                                                    : 'notConfirmed'
                                            }
                                        />
                                    </div>
                                    <div className="flex h-14 items-center justify-between rounded-md bg-gray-300/60 p-1.5 text-base font-black ltr:pl-5 rtl:pr-5">
                                        <span>{user.phone_number}</span>
                                        <Dialog
                                            open={
                                                !user?.phone_number_confirmed &&
                                                PhoneModalOpen
                                            }
                                        >
                                            <DialogContent className="h-48 max-w-xl">
                                                <PhoneSubmitForm
                                                    setOpen={setPhoneModalOpen}
                                                    lang={lang}
                                                    dict={dict}
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            )}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-base">
                                        {dict.email}:
                                    </div>
                                    {/*// @ts-ignore*/}
                                    <StatusBadge
                                        dict={dict}
                                        status={
                                            user.email_confirmed
                                                ? 'confirmed'
                                                : 'notConfirmed'
                                        }
                                    />
                                </div>
                                <div className="flex h-14 items-center justify-between rounded-md bg-gray-300/60 p-1.5 text-base font-black ltr:pl-5 rtl:pr-5">
                                    <span>
                                        {user.email ?? 'ایمیلی تعیین نشده'}
                                    </span>
                                    <Dialog
                                        open={emailDialogOpen}
                                        onOpenChange={setEmailDialogOpen}
                                    >
                                        <DialogTrigger asChild>
                                            {user.signup_type !== 'google' && (
                                                <Button
                                                    onClick={() => {
                                                        setEmailDialogOpen(
                                                            true
                                                        );
                                                    }}
                                                    variant="info"
                                                >
                                                    {dict.changeEmail}
                                                </Button>
                                            )}
                                        </DialogTrigger>
                                        <DialogContent className="max-w-xl">
                                            <EmailEditForm
                                                setOpen={setEmailDialogOpen}
                                                lang={lang}
                                                dict={dict}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                {!user.email_confirmed && (
                                    <Dialog
                                        open={verifyOpen}
                                        onOpenChange={setVerifyOpen}
                                    >
                                        <DialogTrigger asChild>
                                            <Button
                                                onClick={async () => {
                                                    setVerifyOpen(true);
                                                    await emailVerification();
                                                }}
                                                className="w-full"
                                                size="xl"
                                            >
                                                {dict.confirmEmail}
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-xl">
                                            <ActivationForm
                                                activated="email"
                                                dict={dict}
                                                lang={lang}
                                                onSubmit={() => {
                                                    setVerifyOpen(false);
                                                }}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-base">
                                        شماره ملی:
                                    </div>
                                    {/*// @ts-ignore*/}
                                    <StatusBadge
                                        dict={dict}
                                        status={
                                            user.national_code_confirmed
                                                ? 'confirmed'
                                                :
                                                'notConfirmed'
                                        }
                                    />
                                </div>
                                <div className="flex h-14 items-center justify-between rounded-md bg-gray-300/60 p-1.5 text-base font-black ltr:pl-5 rtl:pr-5">
                                    <span>
                                        {user.national_code ? user.national_code : 'شماره ملی تعیین نشده است'}
                                    </span>
                                    <Dialog
                                        open={nationalCodeDialogOpen}
                                        onOpenChange={setNationalCodeDialogOpen}
                                    >
                                        <DialogTrigger asChild>
                                            {(!user.national_code || !user.national_code_confirmed) && (
                                                <Button
                                                    onClick={() => {
                                                        setNationalCodeDialogOpen(
                                                            true
                                                        );
                                                    }}
                                                    variant="info"
                                                >
                                                    احراز هویت
                                                </Button>
                                            )}
                                        </DialogTrigger>
                                        <DialogContent className="max-w-xl">
                                            <NationalCodeVerificationForm
                                                setOpen={setNationalCodeDialogOpen}
                                                lang={lang}
                                                dict={dict}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                            {lang === 'fa' && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="text-base">
                                            رمز عبور:
                                        </div>
                                    </div>
                                    <div className="flex h-14 items-center justify-between rounded-md bg-gray-300/60 p-1.5 text-base font-black ltr:pl-5 rtl:pr-5">
                                        <span
                                            className={cn('text-lg', {
                                                'font-sans': user.has_password,
                                            })}
                                        >
                                            {user.has_password
                                                ? '************'
                                                : 'رمز عبور تعیین نشده'}
                                        </span>
                                        <Dialog
                                            open={passwordDialogOpen}
                                            onOpenChange={setPasswordDialogOpen}
                                        >
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="info"
                                                    onClick={async () => {
                                                        setPasswordDialogOpen(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    {user.has_password
                                                        ? 'تغییر رمز عبور'
                                                        : 'تعیین رمز عبور'}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-xl">
                                                <PasswordChangeForm
                                                    dict={dict}
                                                    lang={lang}
                                                    setOpen={
                                                        setPasswordDialogOpen
                                                    }
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            )}
                            <Box className="pt-[50px]">
                                <Box className='flex flex-row justify-between w-full '>
                                    <BoxTitle>
                                        <FileClock />
                                        اطلاعات مالی
                                    </BoxTitle>
                                    {(!data[0]?.cart_number && !data[0]?.shaba_number) && <Dialog
                                        open={finantialAccountOpen}
                                        onOpenChange={setFinantialAccountOpen}
                                    >
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="info"
                                                onClick={async () => {
                                                    setFinantialAccountOpen(
                                                        true
                                                    );
                                                }}
                                            >
                                                حساب جدید
                                                <Icons.plus stroke='#fff' />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-xl">
                                            <FinantialAccount
                                                dict={dict}
                                                lang={lang}
                                                isEdit={false}
                                                setOpen={
                                                    setFinantialAccountOpen
                                                }
                                                submit={mutate}
                                            />
                                        </DialogContent>
                                    </Dialog>}
                                </Box>
                                <BoxContent className="max-w-none">
                                    <Table className="rounded-md border bg-white">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ردیف</TableHead>
                                                <TableHead>شماره شبا</TableHead>
                                                <TableHead>شماره کارت</TableHead>
                                                <TableHead>وضعیت شبا</TableHead>
                                                <TableHead>وضعیت کارت</TableHead>
                                                <TableHead >کارت اصلی</TableHead>
                                                <TableHead align='left' >ویرایش</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data ? (
                                                cartIsloding ? (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={10}
                                                            align="center"
                                                        >
                                                            <Spinner
                                                                height={25}
                                                                width={25}
                                                                className="mt-2"
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    data?.map((cart, index) => (
                                                        (cart.shaba_number || cart.cart_number) && <TableRow
                                                            key={cart.id}
                                                            className="whitespace-nowrap"
                                                        >
                                                            <TableCell>
                                                                {index + 1}
                                                            </TableCell>
                                                            <TableCell>
                                                                {cart?.shaba_number}
                                                            </TableCell>
                                                            <TableCell>
                                                                {cart?.cart_number}
                                                            </TableCell>
                                                            <TableCell>
                                                                {/*// @ts-ignore*/}
                                                                {<StatusBadge
                                                                    dict={dict}
                                                                    status={
                                                                        cart.shaba_number_confirmed
                                                                            ? 'confirmed'
                                                                            :
                                                                            'notConfirmed'
                                                                    }
                                                                />}
                                                            </TableCell>
                                                            <TableCell>
                                                                {/*// @ts-ignore*/}
                                                                {<StatusBadge
                                                                    dict={dict}
                                                                    status={
                                                                        cart.cart_number_confirmed
                                                                            ? 'confirmed'
                                                                            :
                                                                            'notConfirmed'
                                                                    }
                                                                />}
                                                            </TableCell>
                                                            <TableCell>
                                                                {cart.is_default ? <Icons.tick stroke='green' /> : ''}
                                                            </TableCell>
                                                            <TableCell className='w-[40px]'>
                                                                <Dialog
                                                                    open={finantialAccountOpen}
                                                                    onOpenChange={setFinantialAccountOpen}
                                                                >
                                                                    <DialogTrigger asChild>
                                                                        <Button
                                                                            onClick={async () => {
                                                                                setFinantialAccountOpen(
                                                                                    true
                                                                                );
                                                                            }}
                                                                        >
                                                                            ویرایش
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent className="max-w-xl">
                                                                        <FinantialAccount
                                                                            dict={dict}
                                                                            lang={lang}
                                                                            isEdit={true}
                                                                            cartData={cart}
                                                                            submit={mutate}
                                                                            setOpen={setFinantialAccountOpen}
                                                                        />
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )
                                            ) : (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={10}
                                                        align="center"
                                                    >
                                                        <Spinner
                                                            height={25}
                                                            width={25}
                                                            className="mt-2"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </BoxContent>
                            </Box>
                            {/* <Box className='flex justify-center w-full'>
                                <div
                                    className={
                                        'flex w-full flex-col items-center justify-between gap-3 rounded-md border border-yellow-700 bg-yellow-50/80 py-4 text-base font-medium text-yellow-700 duration-200 md:my-6 md:h-14 md:w-1/2  md:flex-row md:gap-0 md:px-3 md:py-8 '
                                    }
                                >
                                    <div className='flex w-full justify-between px-4'>
                                        <Label className='text-[16px]'>
                                            کد معرف:
                                        </Label>
                                        <div className='flex flex-row gap-3 justify-center items-center'>
                                            <Label className='text-[18px]'>
                                                dkcmk
                                            </Label>
                                            <CopyButton value={'dkcmk'} dict={dict} />
                                        </div>
                                    </div>

                                </div>
                            </Box>
                            <Box className='flex flex-col w-full gap-[20px] md:flex-row'>
                                <div
                                    className={
                                        'flex w-full flex-col items-center justify-between gap-3 rounded-md border py-4 text-base font-medium duration-200 md:h-min md:w-1/2  md:flex-row md:gap-0 md:px-3 md:py-8 '
                                    }
                                >
                                    <div className='flex flex-col w-full justify-between gap-[20px]'>
                                        <div className='flex flex-row gap-[8px]'>
                                            <Icons.graph />
                                            <Label className='text-[18px]'>
                                                میزان درآمد
                                            </Label>
                                        </div>
                                        <div className={`flex w-full flex-col`}>
                                            <div className="flex min-h-[40px] flex-col rounded-lg border bg-[#F8F9FA]">
                                                <div className="flex flex-row justify-between p-4  flex-wrap gap-4">
                                                    <div className="flex flex-col items-start justify-start gap-3">
                                                        <div className="flex flex-row items-center justify-center gap-2">
                                                            <div className="flex h-[20px] w-[20px] rounded bg-[#0FB6A3]" />
                                                            <text className="whitespace-nowrap text-base font-black text-[#0FB6A3]">
                                                                تعداد دعوت شدگان
                                                            </text>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <span className="font-black">
                                                                {currency(
                                                                    50,
                                                                    'tse',
                                                                    lang
                                                                )}
                                                            </span>
                                                            <span>نفر</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end justify-start gap-3">
                                                        <div className="flex flex-row items-center justify-center gap-2">
                                                            <div className="whitespace-nowrap text-base font-black text-neutral-200">
                                                                درآمد به ازای هر فرد
                                                            </div>
                                                            <div className="flex h-[20px] w-[20px] rounded bg-[#84859C]" />
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <span className="font-black">
                                                                {currency(
                                                                    50000,
                                                                    'tse',
                                                                    lang
                                                                )}
                                                            </span>
                                                            <span>تومان</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className='flex w-[full%] justify-center '>
                                                        <hr className='flex w-[85%]' />
                                                    </div>
                                                </div>
                                                <div className='flex w-full justify-center py-2'>
                                                    <text className="whitespace-nowrap text-base text-neutral-200 ">
                                                        مجموع: معادل{' '}
                                                        {currency(
                                                            150000,
                                                            'tse',
                                                            lang
                                                        )}{' '}
                                                        تومان
                                                    </text>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div
                                    className={
                                        'flex w-full flex-col items-center justify-between gap-3 rounded-md border py-4 text-base font-medium duration-200  md:w-1/2  md:flex-col md:gap-0 md:px-3 md:py-8 '
                                    }
                                >
                                    <div className='flex flex-col w-full justify-between gap-[20px]'>
                                        <div className='flex flex-row gap-[8px]'>
                                            <Icons.popular stroke='#111' />
                                            <Label className='text-[18px]'>
                                                دعوت شدگان
                                            </Label>
                                        </div>
                                        <Table className="rounded-md border bg-white">
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>ردیف</TableHead>
                                                    <TableHead>نام و نام خانوادگی</TableHead>
                                                    <TableHead>تاریخ دعوت</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {successful ? (
                                                    !successful.length ? (
                                                        <TableRow>
                                                            <TableCell
                                                                colSpan={10}
                                                                align="center"
                                                            >
                                                                <Spinner
                                                                    height={25}
                                                                    width={25}
                                                                    className="mt-2"
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        successful.map((transaction) => (
                                                            <TableRow
                                                                key={transaction.id}
                                                                className="whitespace-nowrap"
                                                            >
                                                                <TableCell>
                                                                    {new Date(
                                                                        transaction.created_at
                                                                    ).toLocaleDateString(
                                                                        lang
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {transactionStatus[
                                                                        transaction.state
                                                                    ] || (
                                                                            <span className="text-blue-500">
                                                                                {
                                                                                    dict
                                                                                        .transactionStatus
                                                                                        .inProgress
                                                                                }
                                                                            </span>
                                                                        )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {
                                                                        dict.planType[
                                                                        transaction
                                                                            .plan_id
                                                                        ]
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    {transaction.plan_id !==
                                                                        4
                                                                        ? dict.bankType[
                                                                        transaction
                                                                            .bank
                                                                        ]
                                                                        : ''}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {transaction.track_code}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    )
                                                ) : (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={10}
                                                            align="center"
                                                        >
                                                            <Spinner
                                                                height={25}
                                                                width={25}
                                                                className="mt-2"
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>

                                </div>
                            </Box> */}

                            <Button
                                variant="outline-destructive"
                                className="w-full"
                                size="xl"
                                onClick={logout}
                            >
                                {dict.exitAccount}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
