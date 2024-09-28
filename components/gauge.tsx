import { cn } from '@/libs/utils';

export function Gauge({ percentage, loading, dict }) {
    return (
        <div
            className={cn('pt-7', {
                'blur-sm': loading,
            })}
            dir="ltr"
        >
            <div className="h-[100px]">
                <div className="relative flex h-full items-end justify-center">
                    <div className="relative">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="55"
                            height="83"
                            fill="none"
                            viewBox="0 0 55 83"
                        >
                            <mask id="path-1-inside-1_3567_9496" fill="#fff">
                                <path d="M8.316 83C3.723 83-.036 79.27.349 74.692A99 99 0 0142.498 1.707c3.771-2.622 8.88-1.23 11.176 2.748 2.296 3.978.902 9.031-2.824 11.716A82.37 82.37 0 0017.05 74.697C16.59 79.268 12.91 83 8.316 83z"></path>
                            </mask>
                            <path
                                fill={percentage <= -30 ? '#DB2777' : '#E2E6E9'}
                                stroke="#fff"
                                strokeWidth="8"
                                d="M8.316 83C3.723 83-.036 79.27.349 74.692A99 99 0 0142.498 1.707c3.771-2.622 8.88-1.23 11.176 2.748v0c2.296 3.978.902 9.031-2.824 11.716A82.37 82.37 0 0017.05 74.697C16.59 79.268 12.91 83 8.316 83v0z"
                                mask="url(#path-1-inside-1_3567_9496)"
                            />
                        </svg>
                        <span
                            className={cn(
                                'absolute -left-4 top-4 z-10 rotate-[-55deg]',
                                percentage <= -30
                                    ? 'text-pink-600'
                                    : 'text-gray-700'
                            )}
                        >
                            {dict.sell}
                        </span>
                    </div>
                    <div className="flex h-full flex-col items-center justify-between">
                        <div className="relative">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="93"
                                height="25"
                                fill="none"
                                viewBox="0 0 93 25"
                            >
                                <mask
                                    id="path-1-inside-1_3567_9493"
                                    fill="#fff"
                                >
                                    <path d="M1.369 20.436c-2.278-3.965-.935-9.06 3.2-11.015A98.085 98.085 0 0146.497.002c14.53 0 28.844 3.23 41.93 9.417 4.134 1.955 5.477 7.05 3.2 11.015-2.292 3.99-7.377 5.314-11.571 3.422a81.601 81.601 0 00-33.559-7.222 81.602 81.602 0 00-33.558 7.224c-4.194 1.892-9.28.568-11.571-3.422z"></path>
                                </mask>
                                <path
                                    fill={
                                        percentage > -30 && percentage < 30
                                            ? percentage !== null
                                                ? '#84859C'
                                                : '#E2E6E9'
                                            : '#E2E6E9'
                                    }
                                    stroke="#fff"
                                    strokeWidth="8"
                                    d="M1.369 20.436c-2.278-3.965-.935-9.06 3.2-11.015A98.085 98.085 0 0146.497.002c14.53 0 28.844 3.23 41.93 9.417 4.134 1.955 5.477 7.05 3.2 11.015-2.292 3.99-7.377 5.314-11.571 3.422a81.601 81.601 0 00-33.559-7.222 81.602 81.602 0 00-33.558 7.224c-4.194 1.892-9.28.568-11.571-3.422z"
                                    mask="url(#path-1-inside-1_3567_9493)"
                                ></path>
                            </svg>
                            <span
                                className={cn(
                                    'absolute -top-6 left-8 z-10',
                                    percentage > -30 && percentage < 30
                                        ? 'text-neutral-200'
                                        : 'text-gray-700'
                                )}
                            >
                                {dict.neutral}
                            </span>
                        </div>
                        <div className="relative top-0.5 z-10">
                            <div
                                className="text-center text-base font-bold"
                                style={{
                                    color:
                                        percentage <= -30
                                            ? '#DB2777'
                                            : percentage >= 30
                                              ? '#0FB6A3'
                                              : '#84859C',
                                }}
                            >
                                {!!percentage &&
                                    !(percentage > -30 && percentage < 30) &&
                                    `${Math.abs(percentage)}%`}
                            </div>
                            <div
                                className="text-center text-3xl font-bold"
                                style={{
                                    color:
                                        percentage <= -30
                                            ? '#DB2777'
                                            : percentage >= 30
                                              ? '#0FB6A3'
                                              : '#84859C',
                                }}
                            >
                                {percentage <= -30 ? (
                                    dict.sell
                                ) : percentage >= 30 ? (
                                    dict.buy
                                ) : percentage !== null ? (
                                    dict.neutral
                                ) : (
                                    <>
                                        داده
                                        <br />
                                        ناکافی
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="55"
                            height="84"
                            fill="none"
                            viewBox="0 0 55 84"
                        >
                            <mask id="path-1-inside-1_3567_9490" fill="#fff">
                                <path d="M1.595 4.5C3.887.51 9.009-.886 12.779 1.752a98.815 98.815 0 0129.03 31.758 99.358 99.358 0 0112.849 41.247c.378 4.554-3.362 8.264-7.932 8.263-4.57 0-8.23-3.715-8.685-8.262a82.662 82.662 0 00-10.564-32.933 82.224 82.224 0 00-23.07-25.652C.703 13.492-.683 8.464 1.595 4.499z"></path>
                            </mask>
                            <path
                                fill={percentage >= 30 ? '#0FB6A3' : '#E2E6E9'}
                                stroke="#fff"
                                strokeWidth="8"
                                d="M1.595 4.5C3.887.51 9.009-.886 12.779 1.752a98.815 98.815 0 0129.03 31.758 99.358 99.358 0 0112.849 41.247c.378 4.554-3.362 8.264-7.932 8.263-4.57 0-8.23-3.715-8.685-8.262a82.662 82.662 0 00-10.564-32.933 82.224 82.224 0 00-23.07-25.652C.703 13.492-.683 8.464 1.595 4.499z"
                                mask="url(#path-1-inside-1_3567_9490)"
                            />
                        </svg>
                        <span
                            className={cn(
                                'absolute left-10 top-4 z-10 rotate-[70deg]',
                                percentage >= 30
                                    ? 'text-teal-400'
                                    : 'text-gray-700'
                            )}
                        >
                            {dict.buy}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
