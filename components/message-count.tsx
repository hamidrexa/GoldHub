'use client';
import { useMessageCount } from '@/services/useMessageCount';
import { Skeleton } from '@/components/ui/skeleton';
import CountUp from 'react-countup';

export default function MessageCount() {
    const { msgCount, isLoading } = useMessageCount();

    return isLoading ? (
        <Skeleton className="mx-1 inline-block h-8 w-16" />
    ) : (
        <span className="mx-1 flex min-w-16 items-center justify-center text-2xl text-neutral-400">
            <CountUp
                easingFn={(
                    t: number,
                    b: number,
                    c: number,
                    d: number
                ): number => {
                    return t === d
                        ? b + c
                        : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
                }}
                end={msgCount?.count ?? 0}
                duration={7}
            />
        </span>
    );
}
