'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/libs/utils';
import React, { useState } from 'react';
import { useGlobalContext } from '@/contexts/store';
import { toast } from 'sonner';
import { phoneVerification } from '@/app/[lang]/(user)/profile/services/phoneVerification';
import { updateInfo } from '@/app/[lang]/(auth)/user/login/services/updateInfo';
import Spinner from '@/components/spinner';

export function PhoneVerifyForm({ lang, dict, setStep }) {
    const [loading, setLoading] = useState(false);
    const { user, setUser } = useGlobalContext();
    const formSchema = z.object({
        phone_number: z
            .string({
                required_error: 'شماره همراه نمی‌تواند خالی باشد.',
            })
            .min(10),
    });

    type formValue = z.infer<typeof formSchema>;
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
                phone_number: info.phone_number,
                phone_number_confirmed: false,
            });
            await updateInfo({ phone_number: info.phone_number });
            await phoneVerification();
        } catch (e) {
            toast.error('خطایی رخ داده است.');
        }
        setStep(2);
        setLoading(false);
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
                                    <FormLabel>شماره تلفن همراه</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full"
                                            placeholder="شماره تلفن همراه خود را وارد کنید."
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                            name="phone_number"
                        />
                        <Button type="submit" className={cn('w-full')}>
                            {loading ? <Spinner /> : ' تایید شماره همراه'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
