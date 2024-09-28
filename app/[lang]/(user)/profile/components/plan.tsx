import { Button } from '@/components/ui/button';
import React from 'react';
import { PlanDays } from '@/app/[lang]/(user)/profile/components/plan-days';
import { cn } from '@/libs/utils';

export function Plan({
    dict,
    plan,
    btnTitle,
    showBtn,
    onBtnClick,
    helpText,
    isReserve = false,
    progress = true,
    dayPostfix = true,
}) {
    if (!plan) return <></>;

    return (
        <div
            className={cn(
                'relative space-y-6 p-5 text-lg text-white',
                isReserve
                    ? 'z-0 -mt-3 rounded-b-lg bg-gray-700 pt-8'
                    : 'z-10 rounded-lg bg-neutral-800'
            )}
        >
            <div className="flex !items-center !justify-between font-medium">
                <span className="font-black">
                    {isReserve
                        ? `${dict.plans.reserve}:`
                        : `${dict.plans.activated}:`}
                </span>
                <span>{plan.plan?.name || dict.plans.noPlan}</span>
            </div>
            <div className="space-y-4">
                {plan && plan.start_time && (
                    <PlanDays
                        dict={dict}
                        progress={progress}
                        dayPostfix={dayPostfix}
                        endDate={plan.end_time}
                        startDate={plan.start_time}
                        isRemain={!isReserve}
                    />
                )}
                {showBtn && (
                    <Button
                        variant="secondary"
                        className="w-full"
                        size="xl"
                        onClick={onBtnClick}
                    >
                        {btnTitle}
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={cn('mr-1 ltr:rotate-180')}
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M14.5303 5.46967C14.8232 5.76256 14.8232 6.23744 14.5303 6.53033L9.06066 12L14.5303 17.4697C14.8232 17.7626 14.8232 18.2374 14.5303 18.5303C14.2374 18.8232 13.7626 18.8232 13.4697 18.5303L7.46967 12.5303C7.17678 12.2374 7.17678 11.7626 7.46967 11.4697L13.4697 5.46967C13.7626 5.17678 14.2374 5.17678 14.5303 5.46967Z"
                                fill="currentColor"
                            />
                        </svg>
                    </Button>
                )}
            </div>
            {helpText && (
                <p className="max-w-3/4 mx-auto mt-10 text-center text-base font-medium text-yellow-400">
                    {helpText}
                </p>
            )}
        </div>
    );
}
