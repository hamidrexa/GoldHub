'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { cn } from '@/libs/utils';
import { Locale } from '@/i18n-config';
import OtpInput from 'react-otp-input';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useReadOTP } from 'react-read-otp';
import { emailActivation } from '@/app/[lang]/(user)/profile/services/emailActivation';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { RotateCw } from 'lucide-react';
import { Timer } from '@/components/timer';
import { useGlobalContext } from '@/contexts/store';
import { emailVerification } from '@/app/[lang]/(user)/profile/services/emailVerification';
import { forgetPassword } from '@/app/[lang]/(auth)/login/services/forgetPassword';
import { phoneActivation } from '@/app/[lang]/(user)/profile/services/phoneActivation';

type formProp = {
    onSubmit: any;
    dict: any;
    lang: Locale;
    activated: string;
    setStep?: any;
    setOpen?: any;
};

export function ActivationForm({
    onSubmit,
    lang,
    dict,
    activated,
    setStep,
    setOpen,
}: formProp) {
    const { user, setUser } = useGlobalContext();
    const [otp, setOTP] = useState(null);
    const [isLoadingOtpRetry, setIsLoadingOtpRetry] = useState(false);
    const [isCounterEnd, setIsCounterEnd] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    useReadOTP((otp) => {
        setOTP(otp);
        if (otp?.length === 4) getToken(Number(otp));
    });
    const formSchema = z.object({
        code: z
            .string({ required_error: 'وارد کردن کد تایید الزامی است.' })
            .length(4)
            .regex(/^\d{4}$/, 'کد وارد شده نادرست است.'),
    });
    type formValue = z.infer<typeof formSchema>;
    const defaultValues: Partial<formValue> = {};
    const form = useForm<formValue>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const getToken = async (code: number) => {
        setIsLoading(true);
        try {
            if (activated === 'email') {
                const res = await emailActivation({ code });
                if (res) {
                    setUser({
                        ...user,
                        email_confirmed: true,
                    });
                    setOpen(false);
                }
            } else if (activated === 'password') {
                await forgetPassword({ ID: user.username });
            } else {
                const res = await phoneActivation({ code });
                if (res) {
                    setUser({
                        ...user,
                        phone_number_confirmed: true,
                    });
                    setOpen(false);
                }
            }
        } catch (e) {
            window.focus();
            // @ts-ignore
            document.activeElement?.blur();
            toast.error('کد وارد شده نامعتبرست.');
        }
        activated === 'password' && setStep(2);
        setIsLoading(false);
    };

    const handleOtpRetry = async () => {
        setIsLoadingOtpRetry(true);
        try {
            await emailVerification();
            setOTP(null);
            setIsCounterEnd(false);
        } catch (e) {
            window.focus();
            // @ts-ignore
            document.activeElement?.blur();
            toast.error('خطایی در ارسال کد رخ داده است.');
        }
        setIsLoadingOtpRetry(false);
    };

    return (
        <div className="w-full">
            <Form {...form}>
                <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-3">
                        <FormField
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>تایید کد</FormLabel>
                                    <FormControl>
                                        <div
                                            dir="ltr"
                                            className="flex flex-col gap-3"
                                        >
                                            <OtpInput
                                                shouldAutoFocus
                                                skipDefaultStyles
                                                numInputs={4}
                                                containerStyle={cn(
                                                    'w-full flex justify-center items-center gap-2',
                                                    {
                                                        'pointer-events-none opacity-50':
                                                            isLoading,
                                                        'animate-pulse':
                                                            isLoading,
                                                    }
                                                )}
                                                inputType="tel"
                                                renderSeparator={<span></span>}
                                                inputStyle="w-12 h-12 bg-white border border-gray-400 rounded-md text-center leading-none font-bold text-2xl"
                                                value={otp}
                                                onChange={(otp) => {
                                                    setOTP(Number(otp));
                                                    if (otp?.length === 4)
                                                        getToken(Number(otp));
                                                }}
                                                renderInput={(props) => (
                                                    <input {...props} />
                                                )}
                                            />
                                            {isCounterEnd ? (
                                                <Button
                                                    onClick={handleOtpRetry}
                                                    disabled={isLoadingOtpRetry}
                                                >
                                                    {isLoadingOtpRetry ? (
                                                        <Icons.spinner className="h-5 w-5 animate-spin" />
                                                    ) : (
                                                        <RotateCw
                                                            className="inline ltr:ml-2 rtl:mr-2"
                                                            stroke="#fff"
                                                            strokeWidth={1.2}
                                                            width={20}
                                                            height={20}
                                                        />
                                                    )}
                                                    دریافت مجدد کد
                                                </Button>
                                            ) : (
                                                <p className="text-center text-sm text-neutral-800">
                                                    در صورت عدم دریافت کد یا
                                                    تغییر شماره می‌توانید تا{' '}
                                                    <Timer
                                                        className="inline-block w-9 font-bold"
                                                        endTime={120}
                                                        onEnd={() =>
                                                            setIsCounterEnd(
                                                                true
                                                            )
                                                        }
                                                        countDown
                                                    />{' '}
                                                    دقیقه دیگر مجدد تلاش کنید.
                                                </p>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            name="code"
                        />
                    </div>
                </form>
            </Form>
        </div>
    );
}
