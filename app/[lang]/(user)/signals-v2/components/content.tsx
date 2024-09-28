'use client';

import { useSignals } from '@/app/[lang]/(user)/signals-v2/services/useSignals';
import React, { useState } from 'react';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import {
    cn,
    currency,
    getDirection,
    getLinksLang,
    removeFalsyValuesExceptZero,
} from '@/libs/utils';
import { VerifiedIcon } from 'lucide-react';
import { FollowButton } from '@/components/follow-button';
import { DataTable } from '@/app/[lang]/(user)/signals-v2/components/data-table';
import SparkLine from '@/components/sparkline';
import { Roi } from '@/components/roi';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useGlobalContext } from '@/contexts/store';
import { LoginModal } from '@/app/[lang]/(user)/leaderboard/components/login-modal';
import { PricingModal } from '@/app/[lang]/(user)/leaderboard/components/pricing-modal';
import { usePathname } from 'next/navigation';

export function Content({ dict, lang }) {
    const path = usePathname();
    const { user } = useGlobalContext();
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [openPricingModal, setOpenPricingModal] = useState(false);
    const [filters, setFilters] = useState({
        type: 'crypto',
        limit: 5,
    });
    const { signals, isLoading } = useSignals(
        removeFalsyValuesExceptZero(filters)
    );
    const columns = [
        {
            accessorKey: 'symbol',
            header: ({ column }) => (
                <DataTableColumnHeader
                    className="text-center"
                    column={column}
                    title={dict.name}
                    dict={dict}
                    lang={lang}
                />
            ),
            cell: ({ row }) => (
                <Link
                    href={`${getLinksLang(lang)}${row.original.absolute_url}`}
                    className="flex items-center gap-2 text-center"
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
                        {row.getValue('symbol')}
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
                    className="text-center"
                    column={column}
                    title="قیمت فعلی"
                    dict={dict}
                    lang={lang}
                />
            ),
            cell: ({ row }) => (
                <div className="text-center text-lg font-black">
                    {currency(
                        row.getValue('price'),
                        row.original.type === 'ticker' ? 'tse' : 'crypto',
                        lang
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'target',
            header: ({ column }) => (
                <DataTableColumnHeader
                    className="text-center"
                    column={column}
                    title="قیمت هدف"
                    dict={dict}
                    lang={lang}
                />
            ),
            cell: ({ row }) => (
                <div className="text-center text-lg font-black">
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
                    className="text-center"
                    column={column}
                    title="کف احتمالی"
                    dict={dict}
                    lang={lang}
                />
            ),
            cell: ({ row }) => (
                <div className="text-center text-lg font-black">
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
            accessorKey: 'signals_count.buy_count',
            header: ({ column }) => (
                <DataTableColumnHeader
                    className="text-center"
                    column={column}
                    title="تعداد خریداران"
                    dict={dict}
                    lang={lang}
                />
            ),
            cell: ({ row }) => (
                <div className="text-center">
                    {row.original.signals_count.buy_count}
                </div>
            ),
        },
        {
            accessorKey: 'signals_count.sell_count',
            header: ({ column }) => (
                <DataTableColumnHeader
                    className="text-center"
                    column={column}
                    title="تعداد فروشندگان"
                    dict={dict}
                    lang={lang}
                />
            ),
            cell: ({ row }) => (
                <div className="text-center">
                    {row.original.signals_count.sell_count}
                </div>
            ),
        },
        {
            accessorKey: 'price_history',
            header: ({ column }) => (
                <DataTableColumnHeader
                    className="text-center"
                    column={column}
                    title="روند قیمت"
                    dict={dict}
                    lang={lang}
                />
            ),
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <SparkLine
                        market="tse"
                        tooltip={false}
                        name={dict.rank}
                        lang={lang}
                        color="#10EDC5"
                        xDataKey="date"
                        yDataKey="return_price"
                        data={row.getValue('price_history')}
                        width={120}
                        height={48}
                    />
                </div>
            ),
            enableSorting: false,
        },
        {
            accessorKey: 'cross_relative_score',
            header: ({ column }) => (
                <DataTableColumnHeader
                    className="text-center"
                    column={column}
                    title="امتیاز نماد"
                    dict={dict}
                    lang={lang}
                />
            ),
            cell: ({ row }) => (
                <Roi
                    className="block !text-center text-lg font-black"
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
                    defaultValue={row.original.bookmarked_by_user}
                    id={row.original.id}
                    type={row.original.type}
                    name={row.original.symbol}
                    typeId={row.original.type === 'crypto' ? 68 : 9}
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

    return (
        <>
            <div className="mb-5 border border-gray-100 bg-white p-5 text-neutral-800 md:rounded-lg">
                <h3 className="mb-6 flex w-full items-center gap-4 text-base font-black">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="#0C0E3C"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"
                        ></path>
                    </svg>
                    فیلتر
                </h3>
                <div className="flex w-full flex-col justify-center gap-2.5 md:flex-row md:items-center">
                    <div className="text-sm font-bold">{dict.market}:</div>
                    <RadioGroup
                        defaultValue={filters.type}
                        dir={getDirection(lang)}
                        className="flex w-full max-w-xl flex-wrap items-center gap-3 rounded-md border border-neutral-100 px-1.5 py-1.5 md:flex-nowrap"
                        onValueChange={(val) =>
                            setFilters((prevState) => ({
                                ...prevState,
                                ...(val === '1' || val === '2'
                                    ? { type: 'all', group_id: val }
                                    : {
                                          type: val,
                                          group_id:
                                              val === 'crypto' ? '36' : '3',
                                      }),
                            }))
                        }
                    >
                        <div className="md:w-full">
                            <RadioGroupItem
                                value="crypto"
                                id="type-crypto"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="type-crypto"
                                className="flex w-full cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                            >
                                {dict.crypto}
                            </Label>
                        </div>
                        <div className="md:w-full">
                            <RadioGroupItem
                                value="ticker"
                                id="type-ticker"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="type-ticker"
                                className="flex w-full cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                            >
                                {dict.tse}
                            </Label>
                        </div>
                        <div className="md:w-full">
                            <RadioGroupItem
                                value="1"
                                id="type-gold"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="type-gold"
                                className="flex w-full cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                            >
                                صندوق طلا
                            </Label>
                        </div>
                        <div className="md:w-full">
                            <RadioGroupItem
                                value="2"
                                id="type-stock"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="type-stock"
                                className="flex w-full cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                            >
                                صندوق های سهامی
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>
            <DataTable
                data={signals.map((signal, index) => ({
                    ...signal,
                    lock: !user || !user.active_plan?.is_active,
                    lockAction: () => {
                        if (!user) return setOpenLoginModal(true);
                        if (!user.active_plan?.is_active)
                            setOpenPricingModal(true);
                    },
                }))}
                columns={columns}
                dict={dict}
                lang={lang}
                loading={isLoading}
            />
            <LoginModal
                lang={lang}
                dict={dict}
                texts={{
                    title: (
                        <>
                            مشاهده این نماد
                            <br />
                            نیاز به اشتراک دارد.
                        </>
                    ),
                    description: dict.traderLoginModal.description,
                    button: dict.traderLoginModal.button,
                    buttonVariant: 'info',
                    inputLabel: dict.traderLoginModal.inputLabel,
                }}
                open={openLoginModal}
                setOpen={setOpenLoginModal}
                redirectUrl={path}
            />
            <PricingModal
                dict={dict}
                lang={lang}
                contents={{
                    title: (
                        <>
                            مشاهده این نماد
                            <br />
                            نیاز به اشتراک دارد.
                        </>
                    ),
                }}
                open={openPricingModal}
                setOpen={setOpenPricingModal}
            />
        </>
    );
}
