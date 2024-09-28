'use client';

import { cn, getDirection, getLinksLang } from '@/libs/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useGlobalContext } from '@/contexts/store';
import { NotificationsWrap } from '@/app/[lang]/(user)/notifications/components/notifications-wrap';
import { LoginModal } from '@/app/[lang]/(user)/leaderboard/components/login-modal';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { updateUser } from '@/app/[lang]/(user)/profile/services/updateUser';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

type tabProp = {
    lang: any;
    dict: any;
};

export function Content({ lang, dict }: tabProp) {
    const [isLoading, setIsLoading] = useState(false);
    const { user, setUser } = useGlobalContext();
    const router = useRouter();
    const params = useSearchParams();
    const [isGetReadyPushNotification, setIsGetReadyPushNotification] =
        useState(true);
    const [smsIsOpen, setSmsIsOpen] = useState(false);
    const [emailIsOpen, setEmailIsOpen] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        if (Notification.permission === 'granted') setHasPermission(true);
    }, []);

    const updateNotificationSetting = async (
        notificationChannel?: {
            telegram?: boolean;
            push?: boolean;
            sms?: boolean;
            email?: boolean;
        },
        options?: {
            pusheId?: string;
        }
    ) => {
        setIsLoading(true);
        try {
            const { pushe_notification_id, notification_channel } =
                await updateUser({
                    pushe_notification_id: options?.pusheId,
                    email: user.email,
                    notification_channel: {
                        telegram:
                            notificationChannel.telegram ??
                            user.notification_channel.telegram,
                        push:
                            notificationChannel.push ??
                            user.notification_channel.push,
                        sms:
                            notificationChannel.sms ??
                            user.notification_channel.sms,
                        email:
                            notificationChannel.email ??
                            user.notification_channel.email,
                    },
                });
            setUser({ ...user, pushe_notification_id, notification_channel });
            toast.success('تغییرات شما ذخیره شد');
        } catch (e) {
            toast.error('تنظیمات فعال نشد');
        }
        setIsLoading(false);
    };
    const installPushNotification = async () => {
        window.Pushe.subscribe({
            showDialog: false,
            showBell: false,
            icon: 'https://sahmeto.com/img/logo.png',
        }).then((permission) => {
            if (permission) return;

            toast.error(dict.activeBrowserNotif);
            setHasPermission(false);
        });
        window.Pushe.addEventListener(
            window.Pushe.EVENTS.SUBSCRIPTION_CHANGE,
            async ({ isSubscribed, state }) => {
                if (isSubscribed && state === 'granted') {
                    updateNotificationSetting(
                        {
                            push: true,
                        },
                        { pusheId: await window.Pushe.getDeviceId() }
                    );
                    window.Pushe.removeAllEventListeners();
                    setHasPermission(true);
                }
            }
        );
    };
    const notificationHandler = async (
        notificationChannel?: {
            telegram?: boolean;
            push?: boolean;
            sms?: boolean;
            email?: boolean;
        },
        options?: {
            pusheId?: string;
        }
    ) => {
        if (notificationChannel.push) return installPushNotification();
        if (notificationChannel.push === false) {
            window.Pushe.unsubscribe();
            return updateNotificationSetting(
                { push: false },
                { pusheId: null }
            );
        }
        if (notificationChannel.sms && !user?.phone_number_confirmed)
            return setSmsIsOpen(true);
        if (notificationChannel.email && !user?.email_confirmed)
            return setEmailIsOpen(true);

        await updateNotificationSetting(notificationChannel);

        if (notificationChannel.telegram)
            window.open(user.telegram_bot_url, '_blank');
    };

    if (!user)
        return (
            <LoginModal
                open={!user && !Cookies.get('token')}
                setOpen={(open) => {
                    if (!open) router.back();
                }}
                lang={lang}
                dict={dict}
                texts={{
                    description: (
                        <div className="text-[#84859C]">
                            با ثبت نام در سهمتو، <b>7 روز رایگان </b>از تمامی
                            امکانات استفاده کنید.
                        </div>
                    ),
                    title: (
                        <div className="leading-relaxed">
                            دسترسی به هشدار
                            <br />
                            نیاز به ورود/ثبت نام دارد.
                        </div>
                    ),
                    button: 'فعال سازی 7 روز رایگان',
                    buttonVariant: 'info',
                }}
                redirectUrl={`${getLinksLang(lang)}/notifications`}
            />
        );

    return (
        <>
            <Dialog open={smsIsOpen} onOpenChange={setSmsIsOpen}>
                <DialogContent>
                    <DialogTitle>
                        نیاز به فعال سازی شماره تلفن همراه
                    </DialogTitle>
                    <p>
                        برای فعال سازی هشدار پیامکی، از طریق صفحه پروفایل شماره
                        تلفن همراه خود را تایید کنید.
                    </p>
                    <Link
                        target="_blank"
                        href={`${getLinksLang(lang)}/profile`}
                        className={cn(
                            buttonVariants({ variant: 'secondary' }),
                            'font-bold'
                        )}
                    >
                        رفتن به پروفایل
                    </Link>{' '}
                </DialogContent>
            </Dialog>
            <Dialog open={emailIsOpen} onOpenChange={setEmailIsOpen}>
                <DialogContent>
                    <DialogTitle>نیاز به فعال سازی ایمیل</DialogTitle>
                    <p>
                        برای فعال سازی ارسال ایمیل، از طریق صفحه پروفایل آدرس
                        ایمیل خود را تایید کنید.
                    </p>
                    <Link
                        target="_blank"
                        href={`${getLinksLang(lang)}/profile`}
                        className={cn(
                            buttonVariants({ variant: 'secondary' }),
                            'font-bold'
                        )}
                    >
                        رفتن به پروفایل
                    </Link>{' '}
                </DialogContent>
            </Dialog>
            <Tabs
                defaultValue={params.get('tab') || 'notifications'}
                dir={getDirection(lang)}
            >
                <div className="sticky top-20 z-30 -mt-1.5 rounded-lg bg-white pt-1 shadow-[0_3px_8px_3px_rgba(132,_133,_156,_0.15)] md:top-24">
                    <TabsList>
                        <TabsTrigger value="notifications">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <g>
                                    <g
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12 17.848c5.64 0 8.248-.724 8.5-3.627 0-2.902-1.819-2.716-1.819-6.276C18.681 5.165 16.045 2 12 2S5.319 5.164 5.319 7.945c0 3.56-1.819 3.374-1.819 6.276.253 2.914 2.862 3.627 8.5 3.627z"
                                            clipRule="evenodd"
                                        />
                                        <path d="M14.389 20.857c-1.364 1.515-3.492 1.533-4.87 0" />
                                    </g>
                                </g>
                            </svg>
                            هشدارها
                        </TabsTrigger>
                        <TabsTrigger value="setting">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <g>
                                    <g
                                        fillRule="evenodd"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        clipRule="evenodd"
                                    >
                                        <path d="M12 9.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5z"></path>
                                        <path d="M20.168 7.25v0a2.464 2.464 0 00-3.38-.911c-1.028.597-2.314-.15-2.314-1.347A2.484 2.484 0 0012 2.5v0a2.484 2.484 0 00-2.475 2.492c0 1.197-1.285 1.944-2.313 1.347a2.465 2.465 0 00-3.38.911 2.502 2.502 0 00.906 3.404c1.027.599 1.027 2.093 0 2.692a2.502 2.502 0 00-.906 3.404 2.465 2.465 0 003.379.913h.001c1.028-.599 2.313.149 2.313 1.345v0A2.484 2.484 0 0012 21.5v0a2.484 2.484 0 002.474-2.492v0c0-1.196 1.286-1.944 2.314-1.345a2.465 2.465 0 003.38-.913 2.502 2.502 0 00-.905-3.404h-.001c-1.028-.599-1.028-2.093 0-2.692a2.502 2.502 0 00.906-3.404z"></path>
                                    </g>
                                </g>
                            </svg>
                            تنظیمات
                        </TabsTrigger>
                    </TabsList>
                </div>
                <div className="px-2.5">
                    <TabsContent value="notifications">
                        <NotificationsWrap dict={dict} lang={lang} />
                    </TabsContent>
                    <TabsContent value="setting">
                        <div className="mt-10 max-w-md">
                            <div className="mt-6 grid gap-6">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="telegram"
                                        className="flex flex-col space-y-1"
                                    >
                                        <span>تلگرام</span>
                                        <span className="text-muted-foreground text-xs font-normal leading-snug">
                                            نوتیف های خرید و فروش و ... از طریق
                                            تلگرام برای شما ارسال خواهند شد.
                                        </span>
                                    </Label>
                                    <Switch
                                        id="telegram"
                                        disabled={isLoading}
                                        defaultChecked={
                                            user.notification_channel
                                                .telegram &&
                                            !!user.telegram_chat_id
                                        }
                                        onCheckedChange={(checked) =>
                                            notificationHandler({
                                                telegram: checked,
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="pushNotif"
                                        className="flex flex-col space-y-1"
                                    >
                                        <span>پوش نوتیفیکیشن</span>
                                        <span className="text-muted-foreground text-xs font-normal leading-snug">
                                            نوتیف های خرید و فروش و ... از طریق
                                            کروم برای شما ارسال خواهند شد.
                                        </span>
                                    </Label>
                                    <Switch
                                        id="pushNotif"
                                        disabled={isLoading}
                                        defaultChecked={
                                            hasPermission &&
                                            user.notification_channel.push &&
                                            !!user.pushe_notification_id
                                        }
                                        checked={
                                            hasPermission &&
                                            user.notification_channel.push
                                        }
                                        onCheckedChange={(checked) =>
                                            notificationHandler({
                                                push: checked,
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="sms"
                                        className="flex flex-col space-y-1"
                                    >
                                        <span>پیامک</span>
                                        <span className="text-muted-foreground text-xs font-normal leading-snug">
                                            نوتیف های خرید و فروش و ... از طریق
                                            پیامک برای شما ارسال خواهند شد.
                                        </span>
                                    </Label>
                                    <Switch
                                        id="sms"
                                        disabled={isLoading}
                                        defaultChecked={
                                            user.notification_channel.sms &&
                                            user.phone_number_confirmed
                                        }
                                        checked={
                                            user.notification_channel.sms &&
                                            user.phone_number_confirmed
                                        }
                                        onCheckedChange={(checked) =>
                                            notificationHandler({
                                                sms: checked,
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="email"
                                        className="flex flex-col space-y-1"
                                    >
                                        <span>ایمیل</span>
                                        <span className="text-muted-foreground text-xs font-normal leading-snug">
                                            نوتیف های خرید و فروش و ... از طریق
                                            ایمیل برای شما ارسال خواهند شد.
                                        </span>
                                    </Label>
                                    <Switch
                                        id="email"
                                        disabled={isLoading}
                                        defaultChecked={
                                            user.notification_channel.email &&
                                            user.email_confirmed
                                        }
                                        checked={
                                            user.notification_channel.email &&
                                            user.email_confirmed
                                        }
                                        onCheckedChange={(checked) =>
                                            notificationHandler({
                                                email: checked,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </>
    );
}
