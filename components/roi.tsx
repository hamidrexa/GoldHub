import { cn, roundNumber } from '@/libs/utils';

export const getStringRoa = (string: string, options?: any) => {
    if (string === 'S') return options?.colors?.loss ?? 'text-neutral-600';
    if (string === 'B') return options?.colors?.profit ?? 'text-green-600';

    return options?.colors?.neutral ?? 'text-slate-300';
};

export const getNumberRoa = (number: number, options?: any) => {
    if (number < 0)
        return { color: options?.colors?.loss ?? 'text-neutral-600', sign: '' };
    if (number > 0)
        return {
            color: options?.colors?.profit ?? 'text-green-600',
            sign: '+',
        };

    return { color: options?.colors?.neutral ?? 'text-slate-300', sign: '' };
};

export function Roi({
    number,
    sign,
    className,
}: {
    number: number;
    sign?: string;
    className?: string;
}) {
    return (
        <span
            className={cn(
                className,
                getNumberRoa(number).color,
                'ltr:text-left rtl:text-right'
            )}
            dir="ltr"
        >
            {getNumberRoa(number).sign}
            {roundNumber(number)}
            {sign}
        </span>
    );
}
