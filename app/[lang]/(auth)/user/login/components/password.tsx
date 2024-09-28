import React, { useState } from 'react';
import { forgetPassword } from '@/app/[lang]/(auth)/user/login/services/forgetPassword';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { token } from '@/app/[lang]/(auth)/user/login/services/token';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { ChevronRight, EyeIcon, EyeOff } from 'lucide-react';

const passwordFormSchema = z.object({
    password: z.string({
        required_error: 'رمز عبور نمی تواند خالی باشد.',
    }),
});
type PasswordFormValue = z.infer<typeof passwordFormSchema>;
const defaultValues: Partial<PasswordFormValue> = {};

export function Password({ userId, setStep, dict, redirectUrl }) {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingForgotPassword, setIsLoadingForgotPassword] =
        useState(false);
    const form = useForm<PasswordFormValue>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues,
    });
    const searchParams = useSearchParams();

    const onSubmit = async ({ password }: PasswordFormValue) => {
        setIsLoading(true);
        try {
            const { access, refresh } = await token({
                identity: userId.ID,
                password,
            });
            Cookies.set('token', access, { expires: 7 });
            Cookies.set('token-refresh', refresh, { expires: 365 });
            window.location.href =
                redirectUrl || searchParams.get('url') || '/feed';
        } catch (e) {
            window.focus();
            // @ts-ignore
            document.activeElement?.blur();
            toast.error(
                e?.error?.params?.detail ||
                    e?.error?.messages?.error?.[0] ||
                    e?.error?.params?.non_field_errors?.[0] ||
                    e?.error?.params?.email?.[0]
            );
        }
        setIsLoading(false);
    };
    const handleForgetPassword = async () => {
        setIsLoadingForgotPassword(true);
        try {
            await forgetPassword({
                ID: userId.ID,
            });
            setStep('otp');
        } catch (e) {
            window.focus();
            // @ts-ignore
            document.activeElement?.blur();
            toast.error(
                e?.error?.params?.detail ||
                    e?.error?.messages?.error?.[0] ||
                    e?.error?.params?.non_field_errors?.[0] ||
                    e?.error?.params?.email?.[0]
            );
        }
        setIsLoadingForgotPassword(false);
    };

    const Eye = (value, color, setShow) => {
        return (
            <>
                {value ? (
                    <EyeIcon
                        width={20}
                        height={20}
                        onClick={() => {
                            setShow(false);
                        }}
                        style={{ color: color }}
                        className="absolute left-4 top-2 hover:cursor-pointer"
                    />
                ) : (
                    <EyeOff
                        width={20}
                        height={20}
                        onClick={() => {
                            setShow(true);
                        }}
                        style={{ color: color }}
                        className="absolute left-4 top-2 hover:cursor-pointer"
                    />
                )}
            </>
        );
    };

    return (
        <>
            <Button
                variant="link"
                className="absolute -top-10 px-0 underline underline-offset-2"
                onClick={() => setStep('phone')}
            >
                <ChevronRight strokeWidth={1.25} />
                بازگشت
            </Button>
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    رمز عبور
                </h1>
                <p className="text-sm text-neutral-800">
                    رمز عبور خود را جهت ورود به {userId?.enteredValue} وارد
                    کنید.
                </p>
            </div>
            <div className="grid gap-6">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-3"
                    >
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                dir="rtl"
                                                className="w-full"
                                                placeholder="رمز عبور"
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                autoComplete="password"
                                                autoFocus
                                                onFocus={(e) => {
                                                    e.target.scrollIntoView({
                                                        behavior: 'smooth',
                                                        block: 'end',
                                                        inline: 'nearest',
                                                    });
                                                }}
                                                {...field}
                                            />
                                            {Eye(
                                                showPassword,
                                                '#C5C8D2',
                                                setShowPassword
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            className="w-full"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading && (
                                <Icons.spinner className="h-5 w-5 animate-spin" />
                            )}
                            {dict.login}
                        </Button>
                    </form>
                </Form>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="text-muted-foreground px-2">یا</span>
                    </div>
                </div>
                <button
                    className="flex cursor-pointer items-center justify-center gap-2 text-center text-sm font-medium text-neutral-800 underline underline-offset-2"
                    disabled={isLoadingForgotPassword}
                    onClick={handleForgetPassword}
                >
                    {isLoadingForgotPassword ? (
                        <Icons.spinner className="h-5 w-5 animate-spin" />
                    ) : (
                        'ورود با رمز پیامکی'
                    )}
                </button>
            </div>
        </>
    );
}
