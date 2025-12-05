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
                required_error: dict.marketplace.profile.emailVerifyForm.requiredError,
            })
            .email({
                message: dict.marketplace.profile.emailVerifyForm.formatError,
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
            toast.info(dict.marketplace.profile.emailVerifyForm.alreadyConfirmed);
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
                                    <FormLabel>{dict.marketplace.profile.emailVerifyForm.email}</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full"
                                            placeholder={dict.marketplace.profile.emailVerifyForm.emailPlaceholder}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            name="email"
                        />
                        <Button type="submit" className={cn('w-full')}>
                            {loading ? <Spinner /> : dict.marketplace.profile.emailVerifyForm.confirmEmail}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
