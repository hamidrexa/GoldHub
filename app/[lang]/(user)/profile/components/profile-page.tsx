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
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { EditIcon } from 'lucide-react';
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
import { cn } from '@/libs/utils';
import { NationalCodeVerificationForm } from './national-code-form';

dayjs.extend(utc);

export function ProfilePage({ dict, lang }) {
    const [verifyOpen, setVerifyOpen] = useState(false);
    const [nameDialogOpen, setNameDialogOpen] = useState(false);
    const [PhoneModalOpen, setPhoneModalOpen] = useState(true);
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [nationalCodeDialogOpen, setNationalCodeDialogOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { user, setUser } = useGlobalContext();
    const [isGetReadyPushNotification, setIsGetReadyPushNotification] =
        useState(false);
    const [userPlans, setUserPlans] = useState(null);
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
            icon: 'https://sahmeto.com/img/logo.png',
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
                    <div className="flex items-center">
                        <Image
                            height={60}
                            width={60}
                            src="/img/user.png"
                            alt="avatar"
                        />
                        <span className="mx-3 text-2xl font-black">
                            {user.first_name || user.last_name
                                ? `${user.first_name || ''} ${user.last_name || ''
                                }`
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
                                            // user.email_confirmed
                                            //     ? 'confirmed'
                                            // : 
                                            'notConfirmed'
                                        }
                                    />
                                </div>
                                <div className="flex h-14 items-center justify-between rounded-md bg-gray-300/60 p-1.5 text-base font-black ltr:pl-5 rtl:pr-5">
                                    <span>
                                        {'شماره ملی تعیین نشده است'}
                                    </span>
                                    <Button
                                        variant="info"
                                        onClick={async () => {
                                            setNationalCodeDialogOpen(
                                                true
                                            );
                                        }}
                                    >
                                        احراز هویت
                                    </Button>
                                    <Dialog
                                        open={nationalCodeDialogOpen}
                                        onOpenChange={setNationalCodeDialogOpen}
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
