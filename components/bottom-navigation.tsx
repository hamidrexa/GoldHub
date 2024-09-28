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
                className={cn(
                    'flex flex-col items-center justify-center gap-4 leading-none',
                    {
                        'font-black text-neutral-800':
                            pathname === `${getLinksLang(lang)}/signals`,
                    }
                )}
                href={`${getLinksLang(lang)}/signals`}
            >
                <div
                    className={cn(
                        pathname === `${getLinksLang(lang)}/signals`
                            ? 'relative text-white before:absolute before:left-1/2 before:top-1/2 before:z-0 before:h-8 before:w-10 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-md before:bg-neutral-800'
                            : 'text-neutral-800'
                    )}
                >
                    <svg
                        width="15"
                        height="20"
                        viewBox="0 0 15 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="relative z-10"
                    >
                        <path
                            d="M3.81507 12.1053C4.51301 12.1053 5.18236 11.828 5.67588 11.3345C6.16939 10.841 6.44665 10.1716 6.44665 9.47368C6.44665 8.02105 5.92033 7.36842 5.39402 6.31579C4.2656 4.06 5.15823 2.04842 7.49928 0C8.0256 2.63158 9.60454 5.15789 11.7098 6.84211C13.8151 8.52632 14.8677 10.5263 14.8677 12.6316C14.8677 13.5992 14.6771 14.5574 14.3068 15.4514C13.9365 16.3453 13.3938 17.1576 12.7095 17.8418C12.0253 18.5261 11.213 19.0688 10.3191 19.4391C9.42507 19.8094 8.46691 20 7.49928 20C6.53165 20 5.57349 19.8094 4.67951 19.4391C3.78553 19.0688 2.97324 18.5261 2.28902 17.8418C1.6048 17.1576 1.06204 16.3453 0.691747 15.4514C0.321449 14.5574 0.130859 13.5992 0.130859 12.6316C0.130859 11.4179 0.586649 10.2168 1.18349 9.47368C1.18349 10.1716 1.46075 10.841 1.95426 11.3345C2.44778 11.828 3.11713 12.1053 3.81507 12.1053Z"
                            fill="currentColor"
                        />
                    </svg>
                </div>
                {dict.selectedIcons}
            </Link>
            <Link
                href={`${getLinksLang(lang)}/leaderboard`}
                className={cn(
                    'flex flex-col items-center justify-center gap-4 leading-none',
                    {
                        'font-black text-neutral-800':
                            pathname === `${getLinksLang(lang)}/leaderboard`,
                    }
                )}
            >
                <div
                    className={cn(
                        pathname === `${getLinksLang(lang)}/leaderboard`
                            ? 'relative text-white before:absolute before:left-1/2 before:top-1/2 before:z-0 before:h-8 before:w-10 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-md before:bg-neutral-800'
                            : 'text-neutral-800'
                    )}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="18"
                        fill="none"
                        viewBox="0 0 26 18"
                        className="relative z-10"
                    >
                        <g filter="url(#filter0_b_4590_12365)">
                            <path
                                fill="currentColor"
                                d="M5.62 14.94c0-2.449 3.275-3.083 7.157-3.083 3.86 0 7.155.612 7.155 3.061 0 2.447-3.274 3.082-7.155 3.082-3.86 0-7.156-.613-7.156-3.06zm16.31.454c.332-3.114-2.304-4.59-2.986-4.93-.03-.015-.035-.038-.032-.053.002-.01.014-.026.036-.029 1.476-.027 3.063.175 3.649.32 1.241.244 2.058.742 2.398 1.466a2.168 2.168 0 010 1.88c-.519 1.122-2.187 1.484-2.836 1.577a.195.195 0 01-.03.002c-.12 0-.211-.109-.198-.233zm-18.42.23c-.648-.092-2.318-.453-2.835-1.577a2.152 2.152 0 010-1.878c.338-.725 1.154-1.223 2.396-1.468.587-.143 2.172-.345 3.65-.318.021.003.033.02.035.028.003.016-.003.038-.032.054-.683.34-3.319 1.816-2.988 4.928.014.125-.077.234-.197.234-.01 0-.02 0-.03-.002zM8.04 4.763A4.73 4.73 0 0112.777 0a4.732 4.732 0 014.735 4.762 4.733 4.733 0 01-4.735 4.762A4.732 4.732 0 018.04 4.762zm11.05 4.06a3.818 3.818 0 01-.543-.053.179.179 0 01-.12-.275 6.485 6.485 0 001.107-3.646 6.53 6.53 0 00-1.202-3.792c-.024-.034-.041-.086-.018-.125.02-.03.058-.047.093-.055.258-.053.52-.082.797-.082 2.539 0 4.532 2.402 3.853 5.078-.449 1.766-2.053 2.951-3.858 2.951l-.108-.001zM2.61 5.872C1.93 3.196 3.924.794 6.462.794c.275 0 .54.03.798.082a.151.151 0 01.092.055c.023.039.006.09-.018.124a6.535 6.535 0 00-1.202 3.793c0 1.347.402 2.603 1.108 3.646a.18.18 0 01-.12.275 3.69 3.69 0 01-.653.054c-1.804 0-3.408-1.185-3.857-2.95z"
                            />
                        </g>
                        <defs>
                            <filter
                                id="filter0_b_4590_12365"
                                width="44.713"
                                height="37.963"
                                x="-9.522"
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
                                    result="effect1_backgroundBlur_4590_12365"
                                ></feComposite>
                                <feBlend
                                    in="SourceGraphic"
                                    in2="effect1_backgroundBlur_4590_12365"
                                    result="shape"
                                ></feBlend>
                            </filter>
                        </defs>
                    </svg>
                </div>
                {dict.bests}
            </Link>
            <Link
                href={`${getLinksLang(lang)}/feed`}
                className={cn(
                    'flex flex-col items-center justify-center gap-4 leading-none',
                    {
                        'font-black text-neutral-800':
                            pathname === `${getLinksLang(lang)}/feed`,
                    }
                )}
            >
                <div
                    className={cn(
                        pathname === `${getLinksLang(lang)}/feed`
                            ? 'relative text-white before:absolute before:left-1/2 before:top-1/2 before:z-0 before:h-8 before:w-10 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-md before:bg-neutral-800'
                            : 'text-neutral-800'
                    )}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="18"
                        fill="none"
                        viewBox="0 0 20 18"
                        className="relative z-10"
                    >
                        <g filter="url(#filter0_b_4590_12323)">
                            <path
                                fill="currentColor"
                                d="M10.196 18l-.245-.152a36.154 36.154 0 01-6.034-4.7 12.309 12.309 0 01-2.853-4.546c-.54-1.69-.492-3.465.135-4.997A5.764 5.764 0 014.788.255c.274-.094.557-.16.842-.198h.114C6.004.02 6.265 0 6.54 0h.104a5.936 5.936 0 011.734.313h.057A.313.313 0 018.52.37c.245.078.429.155.597.248l.36.16c.087.047.184.117.27.18.054.039.1.073.137.095l.039.023c.084.049.171.1.245.156A5.896 5.896 0 0113.774 0h.042a5.52 5.52 0 011.762.276c1.634.53 2.898 1.714 3.558 3.332.615 1.508.668 3.329.146 4.994a12.11 12.11 0 01-2.85 4.557 36.57 36.57 0 01-5.999 4.699l-.237.142zm4.65-15.046a.766.766 0 00-.717.514.776.776 0 00.473.974 1.588 1.588 0 011.014 1.488v.03a.815.815 0 00.18.587.796.796 0 00.54.274.78.78 0 00.748-.72v-.113a3.127 3.127 0 00-1.999-2.994.738.738 0 00-.24-.04z"
                            />
                        </g>
                        <defs>
                            <filter
                                id="filter0_b_4590_12323"
                                width="38.91"
                                height="37.963"
                                x="-9.29"
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
                                    result="effect1_backgroundBlur_4590_12323"
                                ></feComposite>
                                <feBlend
                                    in="SourceGraphic"
                                    in2="effect1_backgroundBlur_4590_12323"
                                    result="shape"
                                ></feBlend>
                            </filter>
                        </defs>
                    </svg>
                </div>
                {dict.feed}
            </Link>
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
