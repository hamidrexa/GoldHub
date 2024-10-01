'use client';

import { Plan } from '@/app/[lang]/(user)/pricing/components/plan';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { payment } from '@/app/[lang]/(user)/pricing/services/payment';
import { PaymentMethods } from '@/constants/payment-methods';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { discount } from '@/app/[lang]/(user)/pricing/services/discount';
import { useGlobalContext } from '@/contexts/store';
import { usePathname, useRouter } from 'next/navigation';
import { Icons } from '@/components/ui/icons';
import Link from 'next/link';
import { cn, getLinksLang } from '@/libs/utils';

export function PlanWrap({ purePlans, lang, dict, isShow }) {
    const discountCodeFormSchema = z.object({
        discountCode: z.string({
            required_error: dict.discountMessages.isEmpty,
        }),
    });
    type PasswordFormValue = z.infer<typeof discountCodeFormSchema>;
    const defaultValues: Partial<PasswordFormValue> = {};
    const [plans, setPlans] = useState(purePlans);
    const { user } = useGlobalContext();
    const path = usePathname();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [payMethod, setPayMethod] = useState(lang === 'fa' ? 'irr' : 'usdt');
    const [discountCode, setDiscountCode] = useState(null);
    const form = useForm<PasswordFormValue>({
        resolver: zodResolver(discountCodeFormSchema),
        defaultValues,
    });

    const onPaymentClick = async (plan) => {
        if (!user)
            return toast.info(dict.loginPrompt, {
                action: {
                    label: dict.login,
                    onClick: () =>
                        router.push(`${getLinksLang(lang)}/login?url=${path}`),
                },
            });
        toast.info(dict.payTransfer);
        try {
            const res = await payment({
                plan: plan.id,
                bank_type: PaymentMethods[payMethod],
                ...(discountCode && { discount_code: discountCode }),
            });
            location.replace(
                `${process.env.NEXT_PUBLIC_API_URL_}/transaction/payment/${res.id}`
            );
        } catch (e) {
            toast.error(e?.error?.messages?.discount_code?.[0]);
        }
    };
    const onSubmitDiscount = async ({ discountCode }) => {
        if (!user)
            return toast.info(dict.loginPrompt, {
                action: {
                    label: dict.login,
                    onClick: () =>
                        router.push(`${getLinksLang(lang)}/login?url=${path}`),
                },
            });
        setIsLoading(true);
        try {
            const res = await discount(lang, { discount_code: discountCode });
            if (res === null) toast.error(dict.discountMessages.isWrong);
            else {
                setPlans(res);
                setDiscountCode(discountCode);
            }
        } catch (e) {
            toast.error(e?.error?.messages);
        }
        setIsLoading(false);
    };
    const reorderedPlan = plans.sort((plan1, plan2) => plan2.id - plan1.id);

    return (
        <>
            {lang === 'fa' && (
                <div className="mb-8 flex items-center gap-20">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="payMethod">{dict.unit.Rial}</Label>
                        <Switch
                            id="payMethod"
                            checked={payMethod === 'irr'}
                            onCheckedChange={(checked) => {
                                if (!checked) setPayMethod('usdt');
                                else setPayMethod('irr');
                            }}
                        />
                        <Label
                            className="flex items-center gap-2"
                            htmlFor="payMethod"
                        >
                            {dict.unit.coin}
                            <Badge rounded="md">{dict.discount.sevenPer}</Badge>
                        </Label>
                    </div>
                </div>
            )}
            {isShow && (
                <div className="mb-6 flex flex-col rounded-md border bg-white p-3 xl:p-5">
                    <h2 className="mb-4 text-2xl font-black">
                        {dict.insertDiscountCode}
                    </h2>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmitDiscount)}
                            className="flex w-full gap-4"
                        >
                            <FormField
                                control={form.control}
                                name="discountCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                dir="ltr"
                                                className="w-full"
                                                placeholder={
                                                    dict.discountMessages.insert
                                                }
                                                type="text"
                                                autoCorrect="off"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                className="min-w-20"
                                type="submit"
                                disabled={discountCode}
                            >
                                {isLoading ? (
                                    <Icons.spinner className="h-5 w-5 animate-spin" />
                                ) : discountCode ? (
                                    dict.confirm
                                ) : (
                                    dict.codeConfirm
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            )}
            {!user && (
                <div className="mb-6 flex w-full flex-col items-center justify-between gap-8 rounded-lg border bg-white p-6 text-gray-900 lg:flex-row xl:mb-10 xl:p-8">
                    <div className="w-full">
                        <h3 className="mb-4 text-2xl font-semibold">
                            {dict.gift}
                        </h3>
                        <p className="font-light text-gray-700 sm:text-lg">
                            {dict.useAllFree}
                        </p>
                    </div>
                    {1 && (
                        <ul
                            role="list"
                            className="hidden w-full space-y-4 lg:block"
                        >
                            <li className="flex gap-3">
                                <Icons.tick className="text-green-500" />
                                <span>{dict.services.first}</span>
                            </li>
                            <li className="flex gap-3">
                                <Icons.tick className="text-green-500" />
                                <span>{dict.services.second}</span>
                            </li>
                            <li className="flex gap-3">
                                <Icons.tick className="text-green-500" />
                                <span>{dict.services.third}</span>
                            </li>
                            <li className="flex gap-3">
                                <Icons.tick className="text-green-500" />
                                <span>{dict.services.fourth}</span>
                            </li>
                        </ul>
                    )}
                    <div className="w-full">
                        <h4 className="mb-2 text-center text-3xl font-extrabold">
                            {dict.weekFree}
                        </h4>
                        <Link
                            href={`${getLinksLang(lang)}/login?url=${path}`}
                            className={cn(buttonVariants({}), 'w-full')}
                        >
                            {dict.startNow}
                        </Link>
                    </div>
                </div>
            )}
            <div className="mb-10 space-y-8 sm:gap-6 lg:grid lg:grid-cols-3 lg:space-y-0 xl:gap-10">
                {reorderedPlan
                    .filter((plan) => plan.is_active)
                    .map((plan) => (
                        <Plan
                            dict={dict}
                            key={plan.id}
                            plan={plan}
                            lang={lang}
                            payMethod={payMethod}
                            onClick={onPaymentClick}
                            isShow={isShow}
                        />
                    ))}
            </div>
        </>
    );
}
