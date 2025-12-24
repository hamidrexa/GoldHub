import { CheckSquareIcon, XSquareIcon } from 'lucide-react';
import React from 'react';
import { cn } from '@/libs/utils';

export function StatusBadge({
    status,
    confirmedText,
    notConfirmedText,
    pendingText,
    dict,
}) {
    const isConfirmed = status === 'confirmed';
    const isPending = status === 'pending';

    return (
        <div
            className={cn(
                'flex items-center gap-2',
                isConfirmed
                    ? 'text-green-500'
                    : isPending
                      ? 'text-yellow-400'
                      : 'text-red-500',
                'text-sm'
            )}
        >
            {isConfirmed ? (
                <CheckSquareIcon width={16} height={16} strokeWidth={1.5} />
            ) : isPending ? (
                <CheckSquareIcon width={16} height={16} strokeWidth={1.5} />
            ) : (
                <XSquareIcon width={16} height={16} strokeWidth={1.5} />
            )}
            <span>
                {isConfirmed
                    ? confirmedText || dict.auth.confirmedType.confirmed
                    : isPending
                      ? pendingText || dict.auth.confirmedType.pending
                      : notConfirmedText || dict.auth.confirmedType.rejected}
            </span>
        </div>
    );
}
