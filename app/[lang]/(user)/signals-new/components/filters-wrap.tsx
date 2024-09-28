'use client';

import { Filters } from '@/app/[lang]/(user)/signals-new/components/filters';
import { isMobile } from 'react-device-detect';
import { FiltersCarousel } from '@/app/[lang]/(user)/signals-new/components/filters-carousel';

export function FiltersWrap({ dict, lang }) {
    return (
        <>
            {!isMobile ? (
                <>
                    <div className="mb-6 flex items-center gap-2 text-base font-black md:gap-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M20 7h-9M14 17H5M17 20a3 3 0 100-6 3 3 0 000 6zM7 10a3 3 0 100-6 3 3 0 000 6z"
                            ></path>
                        </svg>
                        فیلتر
                    </div>
                    <Filters
                        className="hidden md:flex"
                        lang={lang}
                        dict={dict}
                    />
                </>
            ) : (
                <>
                    <div className="mb-6 w-full gap-1.5 text-base font-black">
                        <FiltersCarousel
                            className="flex md:hidden"
                            lang={lang}
                            dict={dict}
                        />
                    </div>
                </>
            )}
        </>
    );
}
