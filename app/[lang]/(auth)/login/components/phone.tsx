import * as React from 'react';
import { Fragment, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { login } from '@/app/[lang]/(auth)/login/services/login';
import { Icons } from '@/components/ui/icons';
import { Google } from '@/app/[lang]/(auth)/login/components/google';
import { StepValues } from '@/app/[lang]/(auth)/login/components/phone-auth';
import { Locale } from '@/i18n-config';
import { toast } from 'sonner';
import { forgetPassword } from '@/app/[lang]/(auth)/login/services/forgetPassword';
import { isMobile } from 'react-device-detect';
import { Label } from '@/components/ui/label';
import { useSearchParams } from 'next/navigation';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
    dict: any;
    lang: Locale;
    setStep: React.Dispatch<React.SetStateAction<StepValues>>;
    setUserId: React.Dispatch<React.SetStateAction<object>>;
    setIsNewUser: React.Dispatch<React.SetStateAction<boolean>>;
    texts: any;
    showGoogle?: boolean;
}

const accountFormSchema = z.object({
    ID: z
        .string({
            required_error: 'تلفن همراه نمی تواند خالی باشد.',
        })
        .regex(/(^0?9[0-9]{9}$)|(^\u06F0\u06F9[\u06F0-\u06F9]{9})$/, {
            message: 'تلفن همراه وارد شده صحیح نیست.',
        }),
});
type AccountFormValues = z.infer<typeof accountFormSchema>;
const defaultValues: Partial<AccountFormValues> = {};

export function Phone({
    dict,
    lang,
    setStep,
    setUserId,
    setIsNewUser,
    texts = {},
    showGoogle = true,
}: UserAuthFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const searchParam = useSearchParams();
    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues,
    });
    const phone = searchParam.get('phone');

    useEffect(() => {
        if (phone) onSubmit({ ID: phone });
    }, [phone]);

    const onSubmit = async (account: AccountFormValues) => {
        setIsLoading(true);
        try {
            const { data, status } = await login(account);
            setUserId({
                ID: data.ID,
                enteredValue: account.ID,
            });
            switch (status) {
                case 200:
                    if (isMobile) {
                        await forgetPassword({
                            ID: data.ID,
                        });
                        setStep('otp');
                    } else setStep('password');
                    break;
                case 201:
                    setStep('otp');
                    setIsNewUser(true);
                    break;
                case 203:
                    setStep('otp');
                    break;
            }
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

    return (
        <>
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {texts.title ?? dict.loginRegister}
                </h1>
                <p className="text-lg text-neutral-800">
                    {texts.description ?? dict.loginHelper}
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
                            name="ID"
                            render={({ field }) => (
                                <FormItem>
                                    {texts.inputLabel && (
                                        <Label className="mb-4 text-base font-bold">
                                            {texts.inputLabel}
                                        </Label>
                                    )}
                                    <FormControl>
                                        <Input
                                            className="w-full tracking-wider rtl:placeholder:text-left"
                                            placeholder="شماره تلفن همراه"
                                            type="tel"
                                            autoComplete="username"
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
                            variant={texts.buttonVariant ?? 'default'}
                            disabled={isLoading}
                        >
                            {isLoading && (
                                <Icons.spinner className="h-5 w-5 animate-spin" />
                            )}
                            {texts.button ?? dict.login}
                        </Button>
                    </form>
                </Form>
            </div>
            {showGoogle && (
                <div className="flex flex-col gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="text-muted-foreground px-2">
                                {dict.orContinueWith}
                            </span>
                        </div>
                    </div>
                    <Google lang={lang} />
                    {/*<p className="px-8 text-center text-sm text-neutral-800">*/}
                    {/*    با ثبت‌نام در سهمتو، شما{' '}*/}
                    {/*    <Link*/}
                    {/*        href={`${getLinksLang(lang)}/privacy`}*/}
                    {/*        className="hover:text-primary underline underline-offset-4"*/}
                    {/*    >*/}
                    {/*        قوانین و حریم خصوصی*/}
                    {/*    </Link>{' '}*/}
                    {/*    را قبول کرده اید.*/}
                    {/*</p>*/}
                </div>
            )}
        </>
    );
}
