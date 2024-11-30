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
import { natiionalCodeVerification } from '../services/natinalCodeVerification';
import { updateUser } from '../services/updateUser';
import { updateCart } from '../services/updateCart';

type formProp = {
    setOpen: any;
    dict: any;
    lang: Locale;
    isEdit?: boolean
    cartData?: any
    submit?: () => {}
};

export function FinantialAccount({ lang, dict, setOpen, isEdit, cartData, submit }: formProp) {
    const { user, setUser } = useGlobalContext();
    const formSchema = z.object({
        cart_number: z
            .string()
            .optional()
            .refine(
                (value) => !value || /^\d{16}$/.test(value),
                { message: 'لطفا شماره کارت را درست وارد کنید.' }
            ),
        shaba_number: z
            .string()
            .optional()
            .refine(
                (value) => !value || /^\d{24}$/.test(value),
                { message: 'لطفا شماره شبا را درست وارد کنید.' }
            ),
    });
    type formValue = z.infer<typeof formSchema>;
    const [loading, setLoading] = useState(false);
    const defaultValues: Partial<formValue> = {};
    const form = useForm<formValue>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });
    const onSubmit = async (info) => {
        if (!info?.cart_number && !info?.shaba_number) {
            return toast.error('برای ادامه دادن لطفا یکی از فیلد ها را پر کنید')
        }
        setLoading(true);
        try {
            await updateCart(info);
            submit()
            setOpen(false)
        } catch (e) {
            setLoading(false);
            window.focus();
            // @ts-ignore
            document.activeElement?.blur();
            toast.info(
                e?.error?.shaba_number?.[0] ||
                e?.error?.non_field_errors?.[0] ||
                e?.error?.params?.[0] ||
                e?.error?.params?.detail ||
                e?.error?.messages?.error?.[0] ||
                e?.error?.params?.non_field_errors?.[0] ||
                e?.error?.params?.email?.[0] ||
                dict?.retry
            );
            submit()
        }
        setLoading(false);
    };
    return (
        <div className="w-full">
            <Form {...form}>
                <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-3">
                        <FormField
                            defaultValue={cartData?.cart_number}
                            control={form.control}
                            rules={{ required: false }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>شماره کارت</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full"
                                            placeholder="شماره کارت خود را وارد کنید"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            name="cart_number"
                        />
                        <FormField
                            defaultValue={cartData?.shaba_number}
                            control={form.control}
                            rules={{ required: false }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>شماره شبا</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full"
                                            placeholder="شماره شبا خود را وارد کنید"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            name="shaba_number"
                        />
                        <Button type="submit" className={cn('w-full')}>
                            {loading ? <Spinner /> : (isEdit ? 'ویرایش' : 'اضافه کردن ')}
                        </Button>
                    </div>
                </form>
            </Form> 
        </div>
    );
}
