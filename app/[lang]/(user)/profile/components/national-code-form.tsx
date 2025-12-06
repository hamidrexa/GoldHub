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

type formProp = {
    setOpen: any;
    dict: any;
    lang: Locale;
};

export function NationalCodeVerificationForm({ lang, dict, setOpen }: formProp) {
    const { user, setUser } = useGlobalContext();
    const formSchema = z.object({
        national_code: z
            .string({
                required_error: dict.marketplace.profile.nationalCodeForm.requiredError,
            })
            .regex(/^\d{10}$/, dict.marketplace.profile.nationalCodeForm.formatError)
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
                national_code: info.national_code,
                national_code_confirmed: false,
            });
            await updateInfo({ national_code: info.national_code });
            await natiionalCodeVerification().then(() => {
                setUser({
                    ...user,
                    national_code: info.national_code,
                    national_code_confirmed: true,
                })
            })
            setOpen(false)
        } catch (e) {
            window.focus();
            // @ts-ignore
            document.activeElement?.blur();
            toast.info(
                e?.error?.params[0] ||
                dict.marketplace.profile.nationalCodeForm.error
            );
        }
        setLoading(false);
    };
    return (
        <div className="w-full">
            <Form {...form}>
                <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-3">
                        <FormField
                            // defaultValue={user.email}
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{dict.marketplace.profile.nationalCodeForm.nationalCode}</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full"
                                            placeholder={dict.marketplace.profile.nationalCodeForm.placeholder}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            name="national_code"
                        />
                        <Button type="submit" className={cn('w-full')}>
                            {loading ? <Spinner /> : dict.marketplace.profile.nationalCodeForm.confirm}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
