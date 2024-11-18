'use client';

import * as React from 'react';
import { cn } from '@/libs/utils';
import { useCopyToClipboard } from 'react-use';
import { CheckIcon, CopyIcon } from 'lucide-react';

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    value: string;
    src?: string;
    dict: any;
}

export function CopyButton({
    value,
    className,
    src,
    dict,
    ...props
}: CopyButtonProps) {
    const [hasCopied, setHasCopied] = React.useState(false);
    const [state, copyToClipboard] = useCopyToClipboard();

    React.useEffect(() => {
        setTimeout(() => {
            setHasCopied(false);
        }, 2000);
    }, [hasCopied]);

    return (
        <button
            className={cn(
                'flex items-center justify-center gap-2 rounded-md  font-medium',
                className
            )}
            onClick={() => {
                copyToClipboard(value);
                setHasCopied(true);
            }}
            {...props}
        >
            {hasCopied ? (
                <CheckIcon className="h-5 w-5" />
            ) : (
                <CopyIcon className="h-5 w-5" />
            )}
            {hasCopied ? dict.copied : dict.copy}
        </button>
    );
}
