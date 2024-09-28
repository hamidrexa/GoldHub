'use client';

import React, { useRef } from 'react';

import { AnimatedBeam } from '@/components/magicui/animated-beam';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function CrawlSources() {
    const containerRef = useRef<HTMLDivElement>(null);
    const div1Ref = useRef<HTMLDivElement>(null);
    const div2Ref = useRef<HTMLDivElement>(null);
    const div3Ref = useRef<HTMLDivElement>(null);
    const div4Ref = useRef<HTMLDivElement>(null);
    const div5Ref = useRef<HTMLDivElement>(null);
    const div6Ref = useRef<HTMLDivElement>(null);
    const div7Ref = useRef<HTMLDivElement>(null);
    const div8Ref = useRef<HTMLDivElement>(null);
    const div9Ref = useRef<HTMLDivElement>(null);

    return (
        <div className="relative" ref={containerRef}>
            <TooltipProvider>
                <div className="flex size-full max-w-lg flex-col items-stretch justify-between gap-10">
                    <div className="flex items-center justify-between">
                        <div className="z-50" ref={div1Ref}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Image
                                        className="z-50 size-12 rounded-full border-2 bg-white shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]"
                                        src="/img/sources/institutional.png"
                                        width={48}
                                        height={48}
                                        alt="institutional"
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    درصدی‌های بورس
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="z-50" ref={div5Ref}>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Image
                                        className="z-50 size-12 rounded-full border-2 bg-white shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]"
                                        src="/img/sources/telegram.png"
                                        width={48}
                                        height={48}
                                        alt="telegram"
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    تلگرام
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="z-50" ref={div2Ref}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Image
                                        className="z-50 size-12 rounded-full border-2 bg-white shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]"
                                        src="/img/sources/rahavard.png"
                                        width={48}
                                        height={48}
                                        alt="rahavard"
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    رهاورد
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="z-50" ref={div4Ref}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Image
                                        className="z-50 size-16 rounded-full border-2 bg-white shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]"
                                        src="/img/logo.png"
                                        width={64}
                                        height={64}
                                        alt="sahmeto"
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    سهمتو
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="z-50" ref={div6Ref}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Image
                                        className="z-50 size-12 rounded-full border-2 bg-white shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]"
                                        src="/img/sources/arzdigital.png"
                                        width={48}
                                        height={48}
                                        alt="arzdigital"
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    ارزدیجیتال
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="z-50" ref={div3Ref}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Image
                                        className="z-50 size-12 rounded-full border-2 bg-white shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]"
                                        src="/img/sources/sahamyab.png"
                                        width={48}
                                        height={48}
                                        alt="sahamyab"
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    سهام‌یاب
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="z-50" ref={div7Ref}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Image
                                        className="z-50 size-12 rounded-full border-2 bg-white object-contain shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]"
                                        src="/img/sources/wallet.png"
                                        width={48}
                                        height={48}
                                        alt="wallet"
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    کیف پول
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="z-50" ref={div8Ref}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Image
                                        className="z-50 size-12 rounded-full border-2 bg-white shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]"
                                        src="/img/sources/bors.png"
                                        width={48}
                                        height={48}
                                        alt="bors"
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    سازمان بورس
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="z-50" ref={div9Ref}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Image
                                        className="z-50 size-12 rounded-full border-2 bg-white shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]"
                                        src="/img/sources/tradingview.png"
                                        width={48}
                                        height={48}
                                        alt="tradingview"
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    تریدینگ ویو
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </div>
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div1Ref}
                    toRef={div4Ref}
                    curvature={-75}
                    endYOffset={-10}
                    reverse
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div2Ref}
                    toRef={div4Ref}
                    reverse
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div3Ref}
                    toRef={div4Ref}
                    curvature={75}
                    endYOffset={10}
                    reverse
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div5Ref}
                    toRef={div4Ref}
                    curvature={-75}
                    endYOffset={-10}
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div6Ref}
                    toRef={div4Ref}
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div7Ref}
                    toRef={div4Ref}
                    curvature={75}
                    endYOffset={10}
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div8Ref}
                    toRef={div4Ref}
                    curvature={140}
                    endYOffset={20}
                    reverse
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div9Ref}
                    toRef={div4Ref}
                    curvature={140}
                    endYOffset={20}
                />
            </TooltipProvider>
        </div>
    );
}
