'use client';

import React from 'react';
import { ContentTypes } from '@/constants/content-types';
import { FollowButton } from '@/components/follow-button';
import { cn, currency, getLinksLang } from '@/libs/utils';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { DataTable } from '@/app/[lang]/(user)/feed/components/data-table';
import Link from 'next/link';
import { LockIcon, VerifiedIcon } from 'lucide-react';
import { Roi } from '@/components/roi';
import { useGlobalContext } from '@/contexts/store';
import { usePathname } from 'next/navigation';
import { useFeed } from '@/app/[lang]/(user)/feed/services/useBookmarks';

export function MyAssets({ dict, lang }) {
    const { user } = useGlobalContext();
    const path = usePathname();
    const { feed, mutate, isLoading } = useFeed({
        content_type: ContentTypes.asset,
        size: 100,
    });
    const columns = [
        {
            accessorKey: 'symbol',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={dict.name}
                    dict={dict}
                    lang={lang}
                />
            ),
            cell: ({ row }) => (
                <Link
                    href={`${getLinksLang(lang)}${row.original.absolute_url}`}
                    className="flex items-center gap-2"
                >
                    <div className="rounded-full border-2 border-neutral-700 p-1">
                        <img
                            width={40}
                            height={40}
                            src={row.original.image ?? '/img/no-image.jpg'}
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = '/img/no-image.jpg';
                            }}
                            alt="asset image"
                            className="h-10 w-10 min-w-10 rounded-full object-cover"
                        />
                    </div>
                    <span className="max-w-[120px] truncate">
                        {row.getValue('symbol') || row.original.symbol_fa}
                    </span>
                    {row.original.has_owner && (
                        <VerifiedIcon
                            className="inline-block h-5 w-5 min-w-5"
                            fill="#2830C9"
                            color="#fff"
                        />
                    )}
                </Link>
            ),
            enableSorting: false,
        },
        {
            accessorKey: 'price',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="قیمت فعلی"
                    dict={dict}
                    lang={lang}
                />
            ),
            cell: ({ row }) => (
                <div className="text-lg font-black">
                    {currency(row.getValue('price'), 'tse', lang)}
                </div>
            ),
        },
        {
            accessorKey: 'target',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="قیمت هدف"
                    dict={dict}
                    lang={lang}
                />
            ),
            cell: ({ row }) => (
                <div className="text-lg font-black">
                    {!row.getValue('target') ? (
                        <span className="text-sm font-normal">ندارد</span>
                    ) : (
                        currency(
                            row.getValue('target'),
                            row.original.type === 'ticker' ? 'tse' : 'crypto',
                            lang
                        )
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'stop_loss',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="کف احتمالی"
                    dict={dict}
                    lang={lang}
                />
            ),
            cell: ({ row }) => (
                <div className="text-lg font-black">
                    {!row.getValue('stop_loss') ? (
                        <span className="text-sm font-normal">ندارد</span>
                    ) : (
                        currency(
                            row.getValue('stop_loss'),
                            row.original.type === 'ticker' ? 'tse' : 'crypto',
                            lang
                        )
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'cross_relative_score',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="امتیاز نماد"
                    dict={dict}
                    lang={lang}
                />
            ),
            cell: ({ row }) => (
                <Roi
                    className="block text-lg font-black"
                    number={row.getValue('cross_relative_score') * 100}
                    sign="٪"
                />
            ),
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <FollowButton
                    dict={dict}
                    lang={lang}
                    defaultValue={row.original}
                    id={row.original.id}
                    type={row.original.type}
                    name={row.original.symbol}
                    typeId={ContentTypes.asset}
                    onChange={() => mutate()}
                    render={(isLoading, follow) => (
                        <button
                            className={cn(
                                'flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-bold',
                                follow
                                    ? 'bg-blue-700 text-white'
                                    : 'border border-neutral-100 text-neutral-800',
                                { 'animate-pulse': isLoading }
                            )}
                            disabled={isLoading}
                        >
                            {follow ? dict.followed : dict.follow}
                        </button>
                    )}
                />
            ),
        },
    ];

    if (!user && !isLoading)
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white p-6">
                <LockIcon stroke="#0C0E3C" strokeWidth={2} />
                <h1 className="text-base font-medium">{dict.loginPrompt}</h1>
                <Link
                    href={`${getLinksLang(lang)}/user/login?url=${path}`}
                    className="rounded-lg bg-neutral-800 px-5 py-2.5 text-white"
                >
                    {dict.loginRegister}
                </Link>
            </div>
        );

    return (
        <div className="w-full">
            <DataTable
                data={isLoading ? [] : feed}
                loading={isLoading}
                columns={columns}
                dict={dict}
                lang={lang}
            />
        </div>
    );
}
