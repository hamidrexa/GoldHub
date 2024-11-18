import React, { useState } from 'react';
import { forgetPassword } from '@/app/[lang]/(auth)/login/services/forgetPassword';
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
import { token } from '@/app/[lang]/(auth)/login/services/token';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

const passwordFormSchema = z.object({
    password: z.string({
        required_error: 'رمز عبور نمی تواند خالی باشد.',
    }),
});
type PasswordFormValue = z.infer<typeof passwordFormSchema>;
const defaultValues: Partial<PasswordFormValue> = {};

export function ChangePassword({ userId, dict }) {
    const router = useRouter();
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

    return (
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
                                    <Input
                                        dir="ltr"
                                        className="w-full"
                                        placeholder="رمز عبور"
                                        type="password"
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
        </div>
    );
}
