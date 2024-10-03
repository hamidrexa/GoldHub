'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/libs/utils';

export function PasswordSecurityCheck({
    className,
    password,
}: {
    className?: string;
    password: string;
}) {
    const [strength, setStrength] = useState(0);

    useEffect(() => {
        checkPassword();
    }, [password]);

    const checkPassword = () => {
        let score = 0;

        if (!password) {
            setStrength(0);
            return;
        }

        if (password.length >= 8) {
            score += 1;
        }
        if (/[A-Z]/.test(password)) {
            score += 1;
        }
        if (/[a-z]/.test(password)) {
            score += 1;
        }
        if (/\d/.test(password)) {
            score += 1;
        }
        if (/[^a-zA-Z\d]/.test(password)) {
            score += 1;
        }

        setStrength(score);
    };
    const colors = [
        '',
        'bg-red-500',
        'bg-yellow-500',
        'bg-lime-400',
        'bg-green-500',
        'bg-emerald-600',
    ];

    return (
        <div className={cn('relative', className)}>
            <div className="mb-1 flex items-center justify-between">
                <div className="text-xs font-semibold">استحکام رمز</div>
            </div>
            <div className="flex h-2 overflow-hidden rounded bg-gray-300 text-xs">
                <div
                    style={{ width: `${(strength / 5) * 100}%` }}
                    className={cn(
                        'flex flex-col justify-center whitespace-nowrap text-center text-white shadow-none',
                        colors[strength]
                    )}
                />
            </div>
        </div>
    );
}
