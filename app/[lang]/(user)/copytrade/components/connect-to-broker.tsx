'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import React, { useState } from 'react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/ui/icons';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { setUserBrokerToken } from '@/app/[lang]/(user)/copytrade/services/setUserBrokerToken';
import { toast } from 'sonner';
import { updateUserBrokerToken } from '@/app/[lang]/(user)/copytrade/services/updateUserBrokerToken';
import { useCopytradeContext } from '@/app/[lang]/(user)/copytrade/contexts/store';
import { LoginModal } from '@/app/[lang]/(user)/leaderboard/components/login-modal';
import { usePathname } from 'next/navigation';
import { useGlobalContext } from '@/contexts/store';
import { Link2Icon } from 'lucide-react';

export function ConnectToBroker({ lang, dict }) {
    const path = usePathname();
    const { user } = useGlobalContext();
    const {
        broker,
        getUserBrokers,
        openBrokerConnect,
        setOpenBrokerConnect,
        setOpenCopytrade,
    } = useCopytradeContext();
    const [isLoading, setIsLoading] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const formSchema = z.object({
        api_key: z.string({
            required_error: 'توکن نمی تواند خالی باشد.',
        }),
    });
    type FormValues = z.infer<typeof formSchema>;
    const defaultValues: Partial<FormValues> = {};
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const handleSubmit = async (data: Required<FormValues>) => {
        setIsLoading(true);
        try {
            if (!broker) await setUserBrokerToken(data);
            else await updateUserBrokerToken({ id: broker.id, ...data });
            getUserBrokers();
            toast.success('سهمتو با موفقیت به حساب نوبیتکس شما وصل شد.', {
                position: 'top-center',
            });
            location.hash = '#trade';
            setOpenBrokerConnect(false);
            setOpenCopytrade(true);
        } catch (e) {
            toast.error('مشکل در ذخیره توکن');
        }
        setIsLoading(false);
    };

    return (
        <>
            <div className="flex items-center gap-4">
                {broker && (
                    <div className="font-bold text-neutral-400">
                        <span className="mx-2 inline-block aspect-square h-2 w-2 animate-ping rounded-full bg-neutral-400" />
                        متصل
                    </div>
                )}
                {broker ? (
                    <Button
                        className="min-w-40 px-12 py-6"
                        variant="default-outline"
                        onClick={() => {
                            if (!user) return setOpenLoginModal(true);
                            setOpenBrokerConnect(true);
                        }}
                    >
                        ویرایش
                    </Button>
                ) : (
                    <Button
                        className="min-w-40 px-12 py-6"
                        onClick={() => {
                            if (!user) return setOpenLoginModal(true);
                            setOpenBrokerConnect(true);
                        }}
                    >
                        <Link2Icon color="#fff" height={24} width={24} />
                        اتصال به نوبیتکس
                    </Button>
                )}
            </div>
            <Dialog
                open={openBrokerConnect}
                onOpenChange={setOpenBrokerConnect}
            >
                <DialogContent className="max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>اتصال حساب نوبیتکس</DialogTitle>
                    </DialogHeader>
                    <Alert variant="warning">
                        <AlertDescription>
                            توکن نوبیتکس هر ماه منقضی می‌شود و باید مجدداً
                            دریافت و در سهمتو بروزرسانی شود.
                        </AlertDescription>
                    </Alert>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="flex gap-2"
                        >
                            <FormField
                                control={form.control}
                                name="api_key"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <Input
                                                className="w-full"
                                                placeholder="توکن نوبیتکس"
                                                type="text"
                                                autoComplete="off"
                                                defaultValue={
                                                    broker
                                                        ? '**********************'
                                                        : ''
                                                }
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && (
                                    <Icons.spinner className="h-5 w-5 animate-spin" />
                                )}
                                {broker ? 'ویرایش' : 'اتصال'}
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
            <LoginModal
                lang={lang}
                dict={dict}
                texts={{
                    title: (
                        <>
                            اتصال به نوبیتکس
                            <br />
                            نیاز به ورود/ثبت‌نام دارد.
                        </>
                    ),
                    description: dict.traderLoginModal.description,
                    button: dict.traderLoginModal.button,
                    buttonVariant: 'info',
                    inputLabel: dict.traderLoginModal.inputLabel,
                }}
                open={openLoginModal}
                setOpen={setOpenLoginModal}
                redirectUrl={path}
            />
        </>
    );
}
