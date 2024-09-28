'use client';

import React from 'react';
import { ContentTypes } from '@/constants/content-types';
import { DataTable } from '@/app/[lang]/(user)/feed/components/data-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import Link from 'next/link';
import { cn, getImage, getLinksLang } from '@/libs/utils';
import Image from 'next/image';
import { LockIcon, VerifiedIcon } from 'lucide-react';
import { FollowButton } from '@/components/follow-button';
import { useGlobalContext } from '@/contexts/store';
import { usePathname } from 'next/navigation';
import { useFeed } from '@/app/[lang]/(user)/feed/services/useBookmarks';
import { Roi } from '@/components/roi';

export function MyPublishers({ dict, lang }) {
    const { user } = useGlobalContext();
    const path = usePathname();
    const { feed, mutate, isLoading } = useFeed({
        content_type: ContentTypes.publisher,
        size: 100,
    });
    const columns = [
        {
            accessorKey: 'rank',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={dict.rank}
                    dict={dict}
                    lang={lang}
                />
            ),
            cell: ({ row }) => (
                <div className="text-base font-medium">
                    {row.getValue('rank')}
                </div>
            ),
        },
        {
            accessorKey: 'name',
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
                    href={`${getLinksLang(lang)}/publisher/${row.original.primary_username}`}
                    className="flex items-center gap-2"
                >
                    <Image
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-contain"
                        src={getImage(row.original)}
                        alt={row.original.primary_username}
                        unoptimized
                    />
                    <span className="max-w-[120px] truncate">
                        {row.getValue('name')}
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
            accessorKey: 'gain180d',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={dict.sixMonthPerformance}
                    dict={dict}
                    lang={lang}
                />
            ),
            cell: ({ row }) => (
                <div className="text-center">
                    {row.original.performances?.['180d']?.return ||
                    row.original.performances?.['180d']?.return === 0 ? (
                        <Roi
                            className="block !text-center text-lg font-black"
                            number={
                                row.original.performances?.['180d']?.return *
                                100
                            }
                            sign="٪"
                        />
                    ) : (
                        dict.noData
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'return_per_order',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="میانگین بازدهی‌ هر سیگنال"
                    dict={dict}
                    lang={lang}
                />
            ),
            cell: ({ row }) => (
                <Roi
                    className="block !text-center text-lg font-black"
                    number={row.getValue('return_per_order')?.all * 100}
                    sign="٪"
                />
            ),
        },
        {
            accessorKey: 'winrate',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="درصد موفقیت"
                    dict={dict}
                    lang={lang}
                />
            ),
            cell: ({ row }) => (
                <div className="text-center">
                    {!!row.getValue('winrate') ? (
                        <Roi
                            className="block !text-center text-lg font-black"
                            number={row.getValue('winrate')['all'] * 100}
                            sign="٪"
                        />
                    ) : (
                        'ندارد'
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'sharpe_ratio',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="نسبت شارپ"
                    dict={dict}
                    lang={lang}
                />
            ),
            cell: ({ row }) => (
                <div className="text-center">
                    {row.getValue('sharpe_ratio') ||
                    row.getValue('sharpe_ratio') === 0 ? (
                        <Roi
                            className="block !text-center text-lg font-black"
                            number={row.getValue('sharpe_ratio')}
                        />
                    ) : (
                        dict.noData
                    )}
                </div>
            ),
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                return (
                    <FollowButton
                        dict={dict}
                        lang={lang}
                        defaultValue={row.original}
                        id={row.original.id}
                        type="publisher"
                        typeId={ContentTypes.publisher}
                        name={row.original.name}
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
                );
            },
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
