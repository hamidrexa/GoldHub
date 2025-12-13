import React from 'react';
import { cn } from '@/libs/utils';

interface PercentageDisplayProps {
    percentage: number;
    dict: any;
    className?: string;
    loading?: boolean;
}

const Buy = ({ dict }) => (
    <div className="text-sm font-bold text-green-600">{dict.buy}</div>
);

const Sell = ({ dict }) => (
    <div className="text-sm font-bold text-neutral-600">{dict.sell}</div>
);

export function PercentageDisplay({
    percentage,
    dict,
    className,
    loading = true,
}: PercentageDisplayProps) {
    return (
        <div
            className={cn(
                'flex h-6 w-full items-center justify-between',
                { 'blur-sm': loading },
                className
            )}
            dir="rtl"
        >
            <Buy dict={dict} />
            <div className="relative mx-4 h-full w-full bg-slate-50">
                <span className="absolute right-0 h-full w-1 bg-green-600 shadow-[2px_0px_7px_0px_rgba(7,_187,_97,_1)]" />
                <span className="absolute bottom-0 left-1/2 top-0 inline-block h-full w-px -translate-x-1/2 border-l border-dashed border-l-slate-300" />
                <span className="absolute left-0 h-full w-1 bg-neutral-600 shadow-[-2px_0px_7px_0px_rgba(243,_22,_22,_1)]" />
                <svg
                    className={cn('absolute right-0 mx-auto transition-all', {
                        'translate-x-1/2': percentage < 0,
                    })}
                    style={{
                        left: `${percentage}%`,
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="21"
                    viewBox="0 0 14 20"
                    fill="none"
                >
                    <path
                        d="M11.7041 1.5L7 16.6315L2.29591 1.5H11.7041Z"
                        fill="#10EDC5"
                        stroke="#0C0E3C"
                        strokeWidth="2"
                    />
                </svg>
            </div>
            <Sell dict={dict} />
        </div>
    );
}
