'use client';

import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import { cn, getLinksLang } from '@/libs/utils';

export function ProductsNavigator({ dict, lang }) {
    const pathname = usePathname();
    const menuItems = [
        {
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    fill="none"
                    viewBox="0 0 25 25"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="square"
                        strokeWidth="1.5"
                        d="M14.625 10.964h2.672"
                    ></path>
                    <path
                        fill="currentColor"
                        fillRule="evenodd"
                        stroke="#000"
                        strokeLinecap="square"
                        strokeWidth="1.5"
                        d="M7.909 20.027a.524.524 0 110 1.048.524.524 0 010-1.048zM18.776 20.027a.525.525 0 110 1.05.525.525 0 010-1.05z"
                        clipRule="evenodd"
                    ></path>
                    <path
                        stroke="currentColor"
                        strokeLinecap="square"
                        strokeWidth="1.5"
                        d="M5.875 7.053H21.5l-1.27 9.634H6.745L5.467 3.993H3"
                    ></path>
                </svg>
            ),
            url: `/`,
            name: 'خرید/فروش',
        },
    ];

    return (
        <div className="sticky top-32 hidden !h-fit min-w-[100px] flex-col items-center gap-5 md:flex">
            {menuItems.map((item, index) => (
                <Link
                    key={index}
                    className={cn(
                        'relative flex w-full flex-col items-center gap-1.5 whitespace-nowrap text-base',
                        item.url === pathname ||
                            `${getLinksLang(lang)}${item.url}` === pathname
                            ? 'font-bold text-neutral-800 before:absolute before:top-0 before:h-full before:w-0.5 before:rounded-full before:bg-emerald-400 ltr:before:-left-2 rtl:before:-right-2'
                            : 'font-medium text-gray-800'
                    )}
                    href={`${getLinksLang(lang)}${item.url}`}
                >
                    {item.icon}
                    {item.name}
                </Link>
            ))}
        </div>
    );
}
