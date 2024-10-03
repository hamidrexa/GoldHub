'use client';

import Link from 'next/link';
import { useGlobalContext } from '@/contexts/store';
import { cn, getLinksLang } from '@/libs/utils';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

export function BottomNavigation({ dict, lang }) {
    const { isReadingMode, user } = useGlobalContext();
    const pathname = usePathname();

    return (
        <div
            className={cn(
                'fixed bottom-0 left-0 right-0 z-50 grid h-20 grid-cols-4 items-center gap-5 whitespace-nowrap border-t border-t-neutral-100 bg-white px-4 text-center text-base font-medium text-gray-800 transition-transform md:hidden',
                isReadingMode ? 'translate-y-full' : 'translate-y-0'
            )}
        >
            <Link
                href={`${getLinksLang(lang)}/notifications`}
                className={cn(
                    'flex flex-col items-center justify-center gap-4 leading-none',
                    {
                        'font-black text-neutral-800':
                            pathname === `${getLinksLang(lang)}/notifications`,
                    }
                )}
            >
                <div
                    className={cn(
                        pathname === `${getLinksLang(lang)}/notifications`
                            ? 'relative text-white before:absolute before:left-1/2 before:top-1/2 before:z-0 before:h-8 before:w-10 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-md before:bg-neutral-800'
                            : 'relative text-neutral-800'
                    )}
                >
                    {pathname !== `${getLinksLang(lang)}/notifications` &&
                        user?.unread_message_count > 0 && (
                            <Badge
                                size="sm"
                                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1"
                            />
                        )}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="18"
                        fill="none"
                        viewBox="0 0 16 18"
                        className="relative z-10"
                    >
                        <g filter="url(#filter0_b_4590_12353)">
                            <path
                                fill="currentColor"
                                d="M7.534 17.97a3.257 3.257 0 01-1.542-.66c-.35-.24-.603-.624-.626-1.055 0-.453.415-.66.8-.75.45-.095 3.192-.095 3.642 0 .385.09.8.296.8.75-.022.431-.275.814-.625 1.056a3.271 3.271 0 01-1.541.659c-.155.02-.309.03-.46.03-.151 0-.3-.01-.448-.03zm-3.797-3.797a4.081 4.081 0 01-2.61-1.272 3.253 3.253 0 01-.777-2.14c0-.788.16-1.514.657-2.08.678-.768.957-1.434.957-2.565v-.383c0-1.514.377-2.504 1.155-3.472C4.275.847 6.127 0 7.959 0h.082c1.872 0 3.784.889 4.92 2.362.737.95 1.075 1.898 1.075 3.371v.383c0 1.131.3 1.797.956 2.565.498.566.658 1.292.658 2.08 0 .786-.259 1.533-.777 2.14a4.085 4.085 0 01-2.61 1.272c-1.414.12-2.83.222-4.263.222-1.434 0-2.849-.061-4.263-.222z"
                            />
                        </g>
                        <defs>
                            <filter
                                id="filter0_b_4590_12353"
                                width="35.264"
                                height="37.963"
                                x="-9.632"
                                y="-9.981"
                                colorInterpolationFilters="sRGB"
                                filterUnits="userSpaceOnUse"
                            >
                                <feFlood
                                    floodOpacity="0"
                                    result="BackgroundImageFix"
                                ></feFlood>
                                <feGaussianBlur
                                    in="BackgroundImageFix"
                                    stdDeviation="4.991"
                                ></feGaussianBlur>
                                <feComposite
                                    in2="SourceAlpha"
                                    operator="in"
                                    result="effect1_backgroundBlur_4590_12353"
                                ></feComposite>
                                <feBlend
                                    in="SourceGraphic"
                                    in2="effect1_backgroundBlur_4590_12353"
                                    result="shape"
                                ></feBlend>
                            </filter>
                        </defs>
                    </svg>
                </div>
                {dict.notification}
            </Link>
        </div>
    );
}
