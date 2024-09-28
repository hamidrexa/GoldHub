import React, { useEffect, useRef, useState } from 'react';

interface TimerProps {
    endTime?: number;
    onEnd: () => void;
    countDown?: boolean;
    className?: string;
}

export const Timer: React.FC<TimerProps> = ({
    endTime,
    onEnd,
    countDown = false,
    className,
}) => {
    const [seconds, setSeconds] = useState<number>(countDown ? endTime : 0);
    const intervalIdRef = useRef<number | null>(null);

    useEffect(() => {
        intervalIdRef.current = window.setInterval(() => {
            setSeconds((prevSeconds) => {
                if (countDown) {
                    if (prevSeconds === 0) {
                        clearInterval(intervalIdRef.current!);
                        onEnd();
                        return prevSeconds;
                    }
                    return prevSeconds - 1;
                } else {
                    if (prevSeconds === endTime) {
                        clearInterval(intervalIdRef.current!);
                        onEnd();
                        return prevSeconds;
                    }
                    return prevSeconds + 1;
                }
            });
        }, 1000);

        return () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
        };
    }, [endTime, onEnd, countDown]);

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const remainingSeconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return <span className={className}>{formatTime(seconds)}</span>;
};
