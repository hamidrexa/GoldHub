import dayjs from 'dayjs';
import { floor } from 'lodash';
import React from 'react';

export function PlanDays({
    endDate,
    startDate,
    progress = true,
    dayPostfix,
    isRemain,
    dict,
}) {
    const remainDays = dayjs(endDate).diff(dayjs(), 'day');
    const remainHours = dayjs(endDate).diff(dayjs(), 'hour');
    const planPeriod = dayjs(endDate).diff(dayjs(startDate), 'day');
    const width = floor((remainDays / planPeriod) * 100);

    return (
        <div className="space-y-2">
            <span>
                {isRemain ? (
                    <>
                        {remainDays
                            ? `${remainDays} ${dict.day}`
                            : `${remainHours} ${dict.hour}`}
                    </>
                ) : (
                    <>
                        {planPeriod} {dict.day}
                    </>
                )}
                {dayPostfix && ` ${dict.remain}`}
            </span>
            {progress && (
                <div className="h-3 overflow-hidden rounded-full bg-gray-800">
                    <div
                        className="h-3 rounded-full !bg-emerald-400 transition-all"
                        style={{ width: `${width}%` }}
                    />
                </div>
            )}
        </div>
    );
}
