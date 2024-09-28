'use client';

import { Switch } from '@/components/ui/switch';
import React, { useEffect, useState } from 'react';
import { cn, getDirection, getLinksLang } from '@/libs/utils';
import { VerifiedIcon } from 'lucide-react';
import { transformPublishersData } from '@/libs/dataTransformers';
import { DataTable } from '@/components/ui/data-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { FollowButton } from '@/components/follow-button';
import { getTopPublishers } from '@/app/[lang]/(user)/leaderboard/services/getTopPublishers';
import Image from 'next/image';
import { useGlobalContext } from '@/contexts/store';
import { LoginModal } from '@/app/[lang]/(user)/leaderboard/components/login-modal';
import { usePathname } from 'next/navigation';
import { PricingModal } from '@/app/[lang]/(user)/leaderboard/components/pricing-modal';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Roi } from '@/components/roi';
import Link from 'next/link';

const LeaderboardPage = ({ purePublishers, dict, lang }) => {
    const dir = getDirection(lang);
    const { user } = useGlobalContext();
    const [publishers, setPublishers] = useState(purePublishers);
    const [isLoading, setIsLoading] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [openPricingModal, setOpenPricingModal] = useState(false);
    const [filters, setFilters] = useState({
        type: 'signal',
        account_type: null,
        is_verified: false,
        order_by: null,
    });
    const path = usePathname();

    const gainCell = (row: any, day: number) => {
        const gain = `gain${day}d`;
        return (
            <div className="text-center">
                {row.getValue(gain) || row.getValue(gain) === 0 ? (
                    <Roi
                        className="block !text-center text-lg font-black"
                        number={row.getValue(gain) * 100}
                        sign="٪"
                    />
                ) : (
                    dict.noData
                )}
            </div>
        );
    };
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
                <div className="text-center text-base font-medium">
                    {row.getValue('rank')}
                </div>
            ),
        },
        {
            accessorKey: 'name',
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
                    href={`${getLinksLang(lang)}/publisher/${row.original.primary_username}`}
                    className="flex items-center gap-2"
                >
                    <Image
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-contain"
                        src={row.original.photo}
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
            cell: ({ row }) => gainCell(row, 180),
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
                    number={row.getValue('return_per_order') * 100}
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
                            number={row.getValue('winrate') * 100}
                            sign="٪"
                        />
                    ) : (
                        'ندارد'
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'signals_count',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="تعداد سیگنال‌های ۲ سال"
                    dict={dict}
                    lang={lang}
                />
            ),
            cell: ({ row }) => (
                <div className="text-center" dir="ltr">
                    {row.getValue('signals_count')}
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
                <Roi
                    className="block !text-center text-lg font-black"
                    number={row.getValue('sharpe_ratio')}
                />
            ),
        },
        // {
        //     accessorKey: 'gain90d',
        //     header: ({ column }) => (
        //         <DataTableColumnHeader
        //             column={column}
        //             title={dict.threeMonthPerformance}
        //             dict={dict}
        //             lang={lang}
        //         />
        //     ),
        //     cell: ({ row }) => gainCell(row, 90),
        // },
        // {
        //     accessorKey: 'gain30d',
        //     header: ({ column }) => (
        //         <DataTableColumnHeader
        //             column={column}
        //             title={dict.monthPerformance}
        //             dict={dict}
        //             lang={lang}
        //         />
        //     ),
        //     cell: ({ row }) => gainCell(row, 30),
        // },
        {
            accessorKey: 'account_type',
            header: ({ column }) => (
                <DataTableColumnHeader
                    className="text-center"
                    column={column}
                    title={dict.source}
                    dict={dict}
                    lang={lang}
                />
            ),
            cell: ({ row }) => (
                <Image
                    className="h-auto w-10 min-w-10"
                    src={
                        dict.messagesSourceType[row.getValue('account_type')]
                            ?.logo
                    }
                    width={100}
                    height={50}
                    alt="refrence"
                />
            ),
            enableSorting: false,
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <FollowButton
                    dict={dict}
                    lang={lang}
                    defaultValue={row.original.bookmarked_by_user}
                    id={row.original.id}
                    type="publisher"
                    typeId={23}
                    name={row.original.lock ? 'این تریدر' : row.original.name}
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

    useEffect(() => {
        getPublishers();
    }, [filters]);

    const getPublishers = async () => {
        setIsLoading(true);
        try {
            const publishers = await getTopPublishers({
                ...filters,
                limit: 100,
                ...(process.env.NEXT_PUBLIC_ENVIRONMENT === 'BETA' && {
                    formula_id: 117,
                }),
            });
            setPublishers(transformPublishersData(publishers));
        } catch (e) {
            setPublishers([]);
        }
        setIsLoading(false);
    };

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
                <div className="flex flex-wrap gap-x-20 gap-y-5">
                    <div className="flex w-full flex-col justify-center gap-2.5 md:flex-row md:items-center">
                        <div className="text-sm font-bold">{dict.market}:</div>
                        <RadioGroup
                            defaultValue={filters.type}
                            dir={getDirection(lang)}
                            className="flex w-full items-center gap-3 rounded-md border border-neutral-100 px-1.5 py-1.5 md:max-w-sm"
                            onValueChange={(val) =>
                                setFilters((prevState) => ({
                                    ...prevState,
                                    type: val,
                                    account_type: null,
                                }))
                            }
                        >
                            <div className="w-full">
                                <RadioGroupItem
                                    value="signal"
                                    id="type-signal"
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor="type-signal"
                                    className="flex w-full cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-neutral-800 peer-data-[state=checked]:font-black peer-data-[state=checked]:text-white [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                >
                                    {dict.tse}
                                </Label>
                            </div>
                            <div className="w-full">
                                <RadioGroupItem
                                    value="cryptocurrency"
                                    id="type-crypto"
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor="type-crypto"
                                    className="flex w-full cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-neutral-800 peer-data-[state=checked]:font-black peer-data-[state=checked]:text-white [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                >
                                    {dict.crypto}
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="flex w-full flex-col gap-2.5 md:w-fit md:flex-row md:items-center">
                        <div className="text-sm font-bold">
                            {dict.traderType}:
                        </div>
                        <RadioGroup
                            defaultValue={filters.account_type}
                            value={filters.account_type}
                            dir={getDirection(lang)}
                            className="flex flex-wrap items-center gap-3 rounded-md border border-neutral-100 px-1.5 py-1.5"
                            onValueChange={(val) =>
                                setFilters((prevState) => ({
                                    ...prevState,
                                    account_type: val,
                                }))
                            }
                        >
                            <div>
                                <RadioGroupItem
                                    value={null}
                                    id="account-type-all"
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor="account-type-all"
                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                >
                                    {dict.all}
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem
                                    value="telegram"
                                    id="account-type-telegram"
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor="account-type-telegram"
                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                >
                                    {dict.telegram}
                                </Label>
                            </div>
                            {filters.type === 'cryptocurrency' && (
                                <div>
                                    <RadioGroupItem
                                        value="tradingview"
                                        id="account-type-tradingview"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="account-type-tradingview"
                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                    >
                                        {dict.tradingview}
                                    </Label>
                                </div>
                            )}
                            {filters.type === 'cryptocurrency' && (
                                <div>
                                    <RadioGroupItem
                                        value="arzdigital"
                                        id="account-type-arzdigital"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="account-type-arzdigital"
                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                    >
                                        {dict.crypto}
                                    </Label>
                                </div>
                            )}
                            {filters.type === 'signal' && (
                                <div>
                                    <RadioGroupItem
                                        value="rahavard"
                                        id="account-type-rahavard"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="account-type-rahavard"
                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                    >
                                        {dict.rahavard}
                                    </Label>
                                </div>
                            )}
                            {filters.type === 'signal' && (
                                <div>
                                    <RadioGroupItem
                                        value="sahamyab"
                                        id="account-type-sahamyab"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="account-type-sahamyab"
                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                    >
                                        {dict.sahamyab}
                                    </Label>
                                </div>
                            )}
                            {filters.type === 'signal' && (
                                <div>
                                    <RadioGroupItem
                                        value="institutional"
                                        id="account-type-institutional"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="account-type-institutional"
                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                    >
                                        {dict.shareholders}
                                    </Label>
                                </div>
                            )}
                            {filters.type === 'cryptocurrency' && (
                                <div>
                                    <RadioGroupItem
                                        value="wallet"
                                        id="account-type-wallet"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="account-type-wallet"
                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                    >
                                        کیف پول
                                    </Label>
                                </div>
                            )}
                        </RadioGroup>
                    </div>
                    <div className="flex w-full flex-col gap-2.5 md:w-fit md:flex-row md:items-center">
                        <label className="text-sm font-bold">
                            {dict.verifiedTraders}:
                        </label>
                        <Switch
                            id="isVerified"
                            defaultValue={Number(filters.is_verified)}
                            onCheckedChange={(val) =>
                                setFilters((prevState) => ({
                                    ...prevState,
                                    is_verified: val,
                                }))
                            }
                        />
                    </div>
                </div>
            </div>
            {/*<div className="mb-5 inline-flex w-full items-center justify-end px-4 md:px-0">*/}
            {/*    <span className="font-medium ltr:mr-4 rtl:ml-4">*/}
            {/*        {dict.sortBasedOn}*/}
            {/*    </span>*/}
            {/*    <Select*/}
            {/*        dir={dir}*/}
            {/*        defaultValue={filters.order_by}*/}
            {/*        onValueChange={(val) =>*/}
            {/*            setFilters((prevState) => ({*/}
            {/*                ...prevState,*/}
            {/*                order_by: val,*/}
            {/*            }))*/}
            {/*        }*/}
            {/*    >*/}
            {/*        <SelectTrigger className="w-40">*/}
            {/*            <SelectValue />*/}
            {/*        </SelectTrigger>*/}
            {/*        <SelectContent>*/}
            {/*            <SelectItem value={null}>{dict.sahmeto}</SelectItem>*/}
            {/*            <SelectItem value="personal_score">*/}
            {/*                {dict.personalFormula}*/}
            {/*            </SelectItem>*/}
            {/*        </SelectContent>*/}
            {/*    </Select>*/}
            {/*</div>*/}
            <DataTable
                data={publishers.map((publisher, index) => ({
                    ...publisher,
                    lock:
                        index > 0 &&
                        index < 5 &&
                        (!user || !user.active_plan?.is_active),
                    lockAction: () => {
                        if (!user) return setOpenLoginModal(true);
                        if (!user.active_plan?.is_active)
                            setOpenPricingModal(true);
                    },
                }))}
                columns={columns}
                dict={dict}
                lang={lang}
            />
            <LoginModal
                lang={lang}
                dict={dict}
                texts={{
                    title: (
                        <>
                            مشاهده این تریدر
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
                            مشاهده پروفایل این تریدر
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
};

export default LeaderboardPage;
