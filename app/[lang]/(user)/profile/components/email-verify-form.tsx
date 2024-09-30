'use client';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/libs/utils';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Locale } from '@/i18n-config';
import { toast } from 'sonner';
import { useState } from 'react';
import { updateInfo } from '@/app/[lang]/(auth)/login/services/updateInfo';
import { useGlobalContext } from '@/contexts/store';
import { emailVerification } from '@/app/[lang]/(user)/profile/services/emailVerification';
import Spinner from '@/components/spinner';

type formProp = {
    setStep: any;
    dict: any;
    lang: Locale;
};

export function EmailVerificationForm({ lang, dict, setStep }: formProp) {
    const { user, setUser } = useGlobalContext();
    const formSchema = z.object({
        email: z
            .string({
                required_error: 'پر کردن این فیلد الزامی است.',
            })
            .email({
                message: 'لطفا فرمت ایمیل را درست وارد کنید.',
            }),
    });
    type formValue = z.infer<typeof formSchema>;
    const [loading, setLoading] = useState(false);
    const defaultValues: Partial<formValue> = {};
    const form = useForm<formValue>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });
    const onSubmit = async (info) => {
        setLoading(true);
        try {
            setUser({
                ...user,
                email: info.email,
                email_confirmed: false,
            });
            await updateInfo({ email: info.email });
            await emailVerification();
            setStep(2);
        } catch (e) {
            window.focus();
            // @ts-ignore
            document.activeElement?.blur();
            toast.info('ایمیل قبلا تایید شده است.');
        }
        setLoading(false);
    };
    return (
        <div className="w-full">
            <Form {...form}>
                <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-3">
                        <FormField
                            defaultValue={user.email}
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ایمیل</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full"
                                            placeholder="ایمیل جدید خود را وارد کنید"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            name="email"
                        />
                        <Button type="submit" className={cn('w-full')}>
                            {loading ? <Spinner /> : 'تایید ایمیل'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
