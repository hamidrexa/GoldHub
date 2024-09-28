'use client';

import { cn } from '@/libs/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@coingecko/cryptoformat';
import React, { useState } from 'react';
import { Icons } from '@/components/ui/icons';

export function Plan({ plan, payMethod, onClick, lang, dict, isShow }) {
    const [isLoading, setIsLoading] = useState(false);
    const displayPlan = {
        ...plan,
        discounted_price:
            payMethod === 'irr'
                ? plan.discounted_price / 10
                : plan.discounted_price_usdt,
        discounted_price_final:
            payMethod === 'irr'
                ? (plan.discounted_price / 10) * (plan.days / 30)
                : plan.discounted_price_usdt * (plan.days / 30),
    };

    return (
        <div
            className={cn(
                'mx-auto flex h-fit w-full max-w-lg flex-col rounded-lg border bg-white p-6 text-gray-900 xl:p-8',
                plan.id === 2 ? 'border-neutral-800' : 'border-gray-100'
            )}
        >
            {plan.id === 2 && (
                <div className="mb-1 text-center">
                    <Badge variant="light" rounded="md">
                        {dict.bestSell}
                    </Badge>
                </div>
            )}
            <h3 className="mb-4 flex items-center justify-center gap-2 text-2xl font-semibold">
                {plan.name}
                {!!plan.off && (
                    <Badge size="sm" rounded="md">
                        {plan.off}٪ {dict.discount.discount}
                    </Badge>
                )}
            </h3>
            <p className="text-center font-light text-gray-700 sm:text-lg">
                {plan.days / 30} {dict.monthly}
            </p>
            <div className="mt-8 flex items-baseline justify-center">
                <span className="mr-2 text-5xl font-extrabold">
                    {formatCurrency(
                        displayPlan.discounted_price,
                        payMethod === 'irr' ? 'ت' : 'USD',
                        lang,
                        false,
                        {
                            decimalPlaces:
                                displayPlan.discounted_price >= 1 ? 2 : 15,
                            significantFigures:
                                displayPlan.discounted_price >= 1 ? 10 : 5,
                        }
                    )}
                </span>
                <span className="text-gray-700 dark:text-gray-400">
                    /{dict.monthly}
                </span>
            </div>
            <div className="mb-8 text-center font-medium text-gray-700">
                {dict.amountToPay}:{' '}
                <span className="text-xl font-black text-neutral-800">
                    {formatCurrency(
                        displayPlan.discounted_price_final,
                        payMethod === 'irr' ? 'ت' : 'USD',
                        lang,
                        false,
                        {
                            decimalPlaces:
                                displayPlan.discounted_price_final >= 1
                                    ? 2
                                    : 15,
                            significantFigures:
                                displayPlan.discounted_price_final >= 1
                                    ? 10
                                    : 5,
                        }
                    )}
                </span>
            </div>
            <Button
                className="mb-8"
                onClick={async () => {
                    setIsLoading(true);
                    await onClick(plan);
                    setIsLoading(false);
                }}
                disabled={isLoading}
            >
                {isLoading ? (
                    <Icons.spinner className="h-5 w-5 animate-spin" />
                ) : (
                    dict.pay
                )}
            </Button>
            {isShow && (
                <ul role="list" className="space-y-4">
                    <li className="flex gap-3">
                        <Icons.tick className="text-green-500" />
                        <span>{dict.accountServices.first}</span>
                    </li>
                    <li className="flex gap-3">
                        <Icons.tick className="text-green-500" />
                        <span>{dict.accountServices.second}</span>
                    </li>
                    <li className="flex gap-3">
                        <Icons.tick className="text-green-500" />
                        <span>{dict.accountServices.third}</span>
                    </li>
                    <li className="flex gap-3">
                        <Icons.tick className="text-green-500" />
                        <span>{dict.accountServices.fourth}</span>
                    </li>
                    <li className="flex gap-3">
                        <Icons.tick className="text-green-500" />
                        <span>{dict.accountServices.fifth}</span>
                    </li>
                    <li className="flex gap-3">
                        <Icons.tick className="text-green-500" />
                        <span>{dict.accountServices.sixth}</span>
                    </li>
                </ul>
            )}
        </div>
    );
}
