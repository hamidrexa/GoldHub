'use client';

import { useGlobalContext } from '@/contexts/store';
import { useInView } from 'react-intersection-observer';
import useScrollDirection from '@/libs/useScrollDirection';
import { useEffect } from 'react';
import { isMobile } from 'react-device-detect';

export function ReadingMode() {
    const { setIsReadingMode } = useGlobalContext();
    const { ref, inView, entry } = useInView({
        threshold: 0,
        initialInView: true,
    });
    const scrollDirection = useScrollDirection();

    useEffect(() => {
        if (
            !inView &&
            scrollDirection &&
            scrollDirection === 'down' &&
            isMobile &&
            entry?.boundingClientRect.y < 0
        )
            setIsReadingMode(true);
        else setIsReadingMode(false);
    }, [inView, scrollDirection]);

    return <div className="w-full" ref={ref} />;
}
