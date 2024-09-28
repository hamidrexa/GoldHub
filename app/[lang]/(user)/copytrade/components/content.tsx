'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { getDirection, getLinksLang } from '@/libs/utils';
import { PlusIcon, VerifiedIcon } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import Image from 'next/image';
import { useGlobalContext } from '@/contexts/store';
import { LoginModal } from '@/app/[lang]/(user)/leaderboard/components/login-modal';
import { usePathname } from 'next/navigation';
import { Roi } from '@/components/roi';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Locale } from '@/i18n-config';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useCopytradeContext } from '@/app/[lang]/(user)/copytrade/contexts/store';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/ui/icons';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getBalance } from '@/app/[lang]/(user)/copytrade/services/getBalance';
import { setUserCopytradeBalance } from '@/app/[lang]/(user)/copytrade/services/setUserCopytradeBalance';
import { updateUserCopytradeBalance } from '@/app/[lang]/(user)/copytrade/services/updateUserCopytradeBalance';

export function Content({
    dict,
    lang,
    onlyCopied,
}: {
    dict: any;
    lang: Locale;
    onlyCopied?: boolean;
}) {
    const dir = getDirection(lang);
    const { user } = useGlobalContext();
    const [isLoading, setIsLoading] = useState(false);
    const {
        broker,
        setOpenBrokerConnect,
        openCopytrade,
        setOpenCopytrade,
        isPublisherLoading,
        publishers,
        getPublishers,
    } = useCopytradeContext();
    const [selectedPublisher, setSelectedPublisher] = useState(null);
    const [balance, setBalance] = useState({
        total_balance: null,
        blocked_balance: null,
    });
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const path = usePathname();
    const formSchema = z.object({
        balance: z.string({
            required_error: 'مقدار تتر نمی تواند خالی باشد.',
        }),
    });
    type FormValues = z.infer<typeof formSchema>;
    const defaultValues: Partial<FormValues> = {};
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const columns = useMemo(
        () => [
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
                cell: ({ row }) => {
                    const gainCell = (row: any, day: number) => {
                        const gain = `gain${day}d`;
                        return (
                            <div className="text-center">
                                {row.getValue(gain) ||
                                row.getValue(gain) === 0 ? (
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
                    return gainCell(row, 180);
                },
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
                            dict.messagesSourceType[
                                row.getValue('account_type')
                            ]?.logo
                        }
                        width={100}
                        height={50}
                        alt="refrence"
                    />
                ),
                enableSorting: false,
            },
            ...(!onlyCopied
                ? [
                      {
                          id: 'actions',
                          cell: ({ row }) => {
                              return (
                                  <>
                                      <Button
                                          className="whitespace-nowrap"
                                          variant={
                                              row.original?.copied_by_user
                                                  ? 'default-outline'
                                                  : 'default'
                                          }
                                          onClick={() => {
                                              setSelectedPublisher(
                                                  row.original
                                              );
                                              if (!user)
                                                  return setOpenLoginModal(
                                                      true
                                                  );
                                              if (!broker)
                                                  return setOpenBrokerConnect(
                                                      true
                                                  );
                                              setOpenCopytrade(true);
                                          }}
                                      >
                                          {!row.original?.copied_by_user && (
                                              <PlusIcon
                                                  color="#fff"
                                                  height={20}
                                                  width={20}
                                              />
                                          )}
                                          {row.original?.copied_by_user
                                              ? 'کپی شده'
                                              : 'کپی کن'}
                                      </Button>
                                  </>
                              );
                          },
                      },
                  ]
                : []),
        ],
        [publishers]
    );

    useEffect(() => {
        async function getData() {
            const res = await getBalance(broker.id);
            setBalance(res);
        }

        if (openCopytrade && broker) getData();
    }, [openCopytrade, broker]);

    const handleSubmit = async (data: Required<FormValues>) => {
        setIsLoading(true);
        try {
            if (!selectedPublisher?.copied_by_user)
                setUserCopytradeBalance({
                    publisherId: selectedPublisher.id,
                    balance: data.balance,
                });
            else
                updateUserCopytradeBalance({
                    id: selectedPublisher.copied_by_user.id,
                    balance: data.balance,
                });
            toast.success(
                'با موفقیت کپی شد، از این لحظه سیگنال های تریدر برای شما کپی می شوند.',
                { position: 'top-center' }
            );
            setOpenCopytrade(false);
            getPublishers();
        } catch (e) {
            toast.error('مشکل در کپی کردن تریدر');
        }
        setIsLoading(false);
    };

    return (
        <>
            <DataTable
                loading={isPublisherLoading}
                data={
                    onlyCopied
                        ? publishers.filter(
                              (publisher) => publisher?.copied_by_user
                          )
                        : publishers
                }
                columns={columns}
                dict={dict}
                lang={lang}
            />
            {!onlyCopied && (
                <>
                    <Dialog
                        open={openCopytrade}
                        onOpenChange={setOpenCopytrade}
                    >
                        <DialogContent className="max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>
                                    چه میزان سرمایه به تریدر اختصاص می‌دهید؟
                                </DialogTitle>
                            </DialogHeader>
                            <div>
                                <div className="flex items-center justify-between gap-2 rounded-md bg-gray-200 px-4 py-2.5 font-bold">
                                    موجودی فعلی:
                                    <div
                                        className="flex items-center gap-2 font-mono"
                                        dir="ltr"
                                    >
                                        <Image
                                            width={30}
                                            height={30}
                                            className="aspect-square h-7 w-7 rounded-full object-contain"
                                            src="/img/usdt.png"
                                            alt="usdt"
                                        />
                                        {balance.total_balance -
                                        balance.blocked_balance
                                            ? balance.total_balance -
                                              balance.blocked_balance
                                            : 0}{' '}
                                        USDT
                                    </div>
                                </div>
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(
                                            handleSubmit
                                        )}
                                        className="mt-4 flex gap-2"
                                    >
                                        <FormField
                                            control={form.control}
                                            name="balance"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormControl>
                                                        <Input
                                                            className="w-full"
                                                            placeholder="مقدار تتر جهت کپی ترید"
                                                            type="text"
                                                            autoComplete="off"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                        >
                                            {isLoading && (
                                                <Icons.spinner className="h-5 w-5 animate-spin" />
                                            )}
                                            {selectedPublisher?.copied_by_user
                                                ? 'ویرایش'
                                                : 'ثبت'}
                                        </Button>
                                    </form>
                                </Form>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <LoginModal
                        lang={lang}
                        dict={dict}
                        texts={{
                            title: (
                                <>
                                    کپی کردن
                                    <br />
                                    نیاز به ورود/ثبت‌نام دارد.
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
                </>
            )}
        </>
    );
}
