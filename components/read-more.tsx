import React, { useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/libs/utils';

export interface ReadMoreProps {
    more?: string;
    less?: string;
    lines?: number;
    className?: string;
    dir?: string;
    dict: any;
    text?: any;
    showButton?: boolean;
}

export function ReadMore({
    more,
    less,
    lines = 4,
    className,
    dir = 'auto',
    dict,
    text,
    showButton = true,
}: ReadMoreProps) {
    const [isTruncated, setIsTruncated] = useState(true);
    const [needTruncate, setNeedTruncate] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const parentRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (contentRef.current) {
            if (!parentRef.current) return;

            const tempDiv = document.createElement('p');
            tempDiv.classList.add('absolute');
            tempDiv.classList.add('invisible');
            tempDiv.classList.add('whitespace-pre-line');
            tempDiv.classList.add('rendered-html');
            tempDiv.classList.add('font-medium');
            tempDiv.innerHTML = text;

            parentRef.current.appendChild(tempDiv);

            const contentHeight = tempDiv.clientHeight;
            const lineHeight = parseInt(
                getComputedStyle(tempDiv).lineHeight,
                10
            );
            const maxAllowedHeight = lineHeight * lines;

            setNeedTruncate(contentHeight > maxAllowedHeight);

            parentRef.current.removeChild(tempDiv);
        }
    }, [text, lines, contentRef, parentRef]);

    const toggleTruncate = () => setIsTruncated(!isTruncated);
    const clamps = [
        'line-clamp-1',
        'line-clamp-2',
        'line-clamp-3',
        'line-clamp-4',
    ];

    return (
        <div className="relative" ref={parentRef}>
            <p
                ref={contentRef}
                className={cn(
                    'whitespace-pre-line',
                    { [clamps[lines - 1]]: isTruncated },
                    className
                )}
                style={{ textAlign: 'initial' }}
                dir={dir}
                dangerouslySetInnerHTML={{
                    __html: text,
                }}
            />
            {needTruncate && showButton && (
                <div
                    onClick={toggleTruncate}
                    dir={dir}
                    className={cn(
                        'cursor-pointer font-black underline underline-offset-4'
                    )}
                >
                    {isTruncated
                        ? more || dict.showMore
                        : less || dict.showLess}
                </div>
            )}
        </div>
    );
}
