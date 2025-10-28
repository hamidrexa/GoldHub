import React, { useState } from 'react';
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
import { updateInfo } from '@/app/[lang]/(auth)/login/services/updateInfo';
import { PasswordSecurityCheck } from '@/app/[lang]/(auth)/login/components/password-security-check';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

const completeInfoFormSchema = z.object({
    email: z
        .union([
            z.literal(''),
            z.string().email({ message: 'ایمیل وارد شده صحیح نیست' }),
        ])
        .optional(),
    password: z.string({
        required_error: 'رمز عبور نمی تواند خالی باشد',
    }),
});
type CompleteInfoFormValue = z.infer<typeof completeInfoFormSchema>;
const defaultValues: Partial<CompleteInfoFormValue> = {};

export function CompleteInfo({ userId, setStep, dict, lang, redirectUrl }) {
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState(null);
    const form = useForm<CompleteInfoFormValue>({
        resolver: zodResolver(completeInfoFormSchema),
        defaultValues,
    });
    const searchParams = useSearchParams();

    const onSubmit = async (info: CompleteInfoFormValue) => {
        setIsLoading(true);
        try {
            await updateInfo(
                Object.fromEntries(Object.entries(info).filter(([, v]) => v))
            );
            window.location.href =
                redirectUrl || searchParams.get('url') || '/';
        } catch (e) {
            window.focus();
            // @ts-ignore
            document.activeElement?.blur();
            toast.error(
                e?.error?.params[0]||
                e?.error?.params?.detail ||
                e?.error?.messages?.error?.[0] ||
                e?.error?.params?.non_field_errors?.[0] ||
                e?.error?.params?.email?.[0] ||
                dict?.retry
            );
        }
        setIsLoading(false);
    };

    return (
        <>
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    تکمیل اطلاعات
                </h1>
            </div>
            <div className="grid gap-6">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-3"
                        autoComplete="off"
                    >
                        {/* <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            dir="ltr"
                                            className="w-full tracking-wider"
                                            placeholder="ایمیل (اختیاری)"
                                            type="email"
                                            autoComplete="off"
                                            autoCorrect="off"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            dir="ltr"
                                            className="w-full"
                                            placeholder="رمز عبور (اجباری)"
                                            type="password"
                                            autoComplete="off"
                                            autoCorrect="off"
                                            autoFocus
                                            {...field}
                                            onInput={(e: any) =>
                                                setPassword(e.target.value)
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <PasswordSecurityCheck
                            className="!mb-6"
                            password={password}
                        />
                        <Button
                            className="!mt-5 w-full"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading && (
                                <Icons.spinner className="h-5 w-5 animate-spin" />
                            )}
                            ثبت نام
                        </Button>
                    </form>
                </Form>
            </div>
        </>
    );
}
