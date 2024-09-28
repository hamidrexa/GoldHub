'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export function AdsBanner() {
    const path = usePathname();

    if (path !== '/leaderboard') return <></>;

    return (
        <div className="bg-[#012f49]">
            <a
                href="https://in.firouzeh.com/moj_sahmeto_brtrnha"
                className="mx-auto block h-full max-h-[80px] w-full max-w-[400px] md:hidden"
            >
                <Image
                    className="h-full w-full object-cover"
                    width={400}
                    height={80}
                    src="/firouzeh-wide.jpg"
                    alt="firouzeh"
                />
            </a>
        </div>
    );
}
