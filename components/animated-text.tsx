'use client';
import { useEffect, useState } from 'react';
import { cn } from '@/libs/utils';

type Props = {
    words: string[];
    className?: string;
};

export function AnimatedText({ words, className }: Props) {
    const [currentWord, setCurrentWord] = useState(words[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prev) => {
                const nextIndex = (words.indexOf(prev) + 1) % words.length;
                return words[nextIndex];
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <span
            className={cn(
                'flex animate-fadeInOut items-center justify-center',
                className
            )}
        >
            {currentWord}
        </span>
    );
}
