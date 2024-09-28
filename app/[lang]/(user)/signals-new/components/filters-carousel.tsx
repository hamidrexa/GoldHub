'use client';

import * as React from 'react';
import { Locale } from '@/i18n-config';
import { DragSlider } from '@/components/drag-slider';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronDown } from 'lucide-react';
import { Filters } from '@/app/[lang]/(user)/signals-new/components/filters';

type Props = {
    lang: Locale;
    dict: any;
    className?: string;
};

export function FiltersCarousel({ lang, dict, className }: Props) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const handleFilter = (filters) => {
        const params = new URLSearchParams(searchParams);
        Object.entries(filters).forEach(([key, val]: any[]) => {
            if (val) params.set(key, val);
            else params.delete(key);
        });
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="px-6">
            <div className="mb-5 flex min-w-80 flex-col gap-3">
                <h4 className="text-sm font-bold">مدت سرمایه گذاری</h4>
                <DragSlider
                    className="mb-5"
                    items={{
                        0: {
                            value: JSON.stringify({
                                estimated_order_duration_gte: 0,
                                estimated_order_duration_lte: 14,
                            }),
                            label: '2هفته',
                        },
                        1: {
                            value: JSON.stringify({
                                estimated_order_duration_gte: 14,
                                estimated_order_duration_lte: 30,
                            }),
                            label: '1ماهه',
                        },
                        2: {
                            value: JSON.stringify({
                                estimated_order_duration_gte: 30,
                                estimated_order_duration_lte: 180,
                            }),
                            label: '6ماهه',
                        },
                        3: {
                            value: JSON.stringify({
                                estimated_order_duration_gte: 180,
                                estimated_order_duration_lte: 360,
                            }),
                            label: 'یک ساله',
                        },
                    }}
                    defaultValue={JSON.stringify({
                        estimated_order_duration_gte:
                            searchParams.get('estimated_order_duration_gte') ??
                            30,
                        estimated_order_duration_lte:
                            searchParams.get('estimated_order_duration_lte') ??
                            180,
                    })}
                    onValueCommit={(value) => {
                        handleFilter({
                            estimated_order_duration_gte:
                                JSON.parse(value).estimated_order_duration_gte,
                            estimated_order_duration_lte:
                                JSON.parse(value).estimated_order_duration_lte,
                        });
                    }}
                />
            </div>
            <div className="mb-12 flex min-w-80 flex-col gap-3">
                <h4 className="text-sm font-bold">میزان سرمایه</h4>
                <DragSlider
                    className="mb-8"
                    items={{
                        0: {
                            value: 2,
                            label: (
                                <span className="leading-none">
                                    10
                                    <span className="block">میلیون تومان</span>
                                </span>
                            ),
                        },
                        1: {
                            value: 3,
                            label: (
                                <span className="leading-none">
                                    100
                                    <span className="block">میلیون تومان</span>
                                </span>
                            ),
                        },
                        2: {
                            value: 4,
                            label: (
                                <span className="leading-none">
                                    500
                                    <span className="block">میلیون تومان</span>
                                </span>
                            ),
                        },
                        3: {
                            value: 5,
                            label: (
                                <span className="leading-none">
                                    1
                                    <span className="block">میلیارد تومان</span>
                                </span>
                            ),
                        },
                    }}
                    defaultValue={3}
                    onValueCommit={(value) => {
                        handleFilter({
                            investment_amount: value,
                        });
                    }}
                />
            </div>
            <div className="flex w-full max-w-full items-center justify-start gap-2.5 overflow-auto">
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="flex min-w-fit items-center justify-between gap-1 rounded-md border border-neutral-100 px-2.5 py-1 text-sm font-black">
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
                    </DialogTrigger>
                    <DialogContent className="max-h-full w-full max-w-[425px] overflow-auto">
                        <Filters dict={dict} lang={lang} />
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <div
                            style={{ color: '#84859C', borderColor: '#E2E6E9' }}
                            className="flex min-w-fit items-center justify-between gap-1 rounded-md border px-2.5 py-1 text-sm"
                        >
                            نوع بازار
                            <ChevronDown width={18} height={18} />
                        </div>
                    </DialogTrigger>
                    <DialogContent className="max-h-full w-full max-w-[425px] overflow-auto">
                        <div className="flex flex-col gap-3">
                            <h4 className="text-sm font-bold">نوع بازار</h4>
                            <RadioGroup
                                defaultValue={searchParams.get('market')}
                                onValueChange={(market) =>
                                    handleFilter({
                                        market,
                                    })
                                }
                                className="flex w-fit items-center gap-3 rounded-md border border-neutral-100 px-1.5 py-1.5"
                            >
                                <div>
                                    <RadioGroupItem
                                        value="crypto"
                                        id="crypto"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="crypto"
                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-yellow-400 peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                    >
                                        ارزدیجیتال
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem
                                        value="ticker"
                                        id="ticker"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="ticker"
                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-neutral-800  peer-data-[state=checked]:font-black peer-data-[state=checked]:text-white [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                    >
                                        بورس
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem
                                        value={null}
                                        id="market-both"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="market-both"
                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                    >
                                        همه
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="flex min-w-fit items-center justify-between gap-1 rounded-md border border-neutral-100 px-2.5 py-1 text-sm text-gray-700">
                            رتبه تریدر
                            <ChevronDown width={18} height={18} />
                        </div>
                    </DialogTrigger>
                    <DialogContent className="max-h-full w-full max-w-[425px] overflow-auto">
                        <div className="flex flex-col gap-3">
                            <h4 className="text-sm font-bold">رتبه تریدر</h4>
                            <RadioGroup
                                defaultValue={
                                    searchParams.get('rank_limit') ?? '100'
                                }
                                onValueChange={(rank) =>
                                    handleFilter({
                                        rank_limit: rank,
                                    })
                                }
                                className="flex w-fit items-center gap-3 rounded-md border border-neutral-100 px-1.5 py-1.5"
                            >
                                <div>
                                    <RadioGroupItem
                                        value="1000"
                                        id="less_than_thousand"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="less_than_thousand"
                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black  [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                    >
                                        کمتر از1000
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem
                                        value="100"
                                        id="less_than_hundred"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="less_than_hundred"
                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                    >
                                        کمتر از100
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem
                                        value="10"
                                        id="less_than_ten"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="less_than_ten"
                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                    >
                                        کمتراز10
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="flex min-w-fit items-center justify-between gap-1 rounded-md border border-neutral-100 px-2.5 py-1 text-sm text-gray-700">
                            نوع تریدر
                            <ChevronDown width={18} height={18} />
                        </div>
                    </DialogTrigger>
                    <DialogContent className="max-h-full w-full max-w-[425px] overflow-auto">
                        <div className="flex flex-col gap-3">
                            <h4 className="text-sm font-bold">نوع تریدر</h4>
                            <RadioGroup
                                defaultValue={searchParams.get(
                                    'by_verified_publishers'
                                )}
                                onValueChange={(verified) =>
                                    handleFilter({
                                        by_verified_publishers: verified,
                                    })
                                }
                                className="flex w-fit items-center gap-3 rounded-md border border-neutral-100 px-1.5 py-1.5"
                            >
                                <div>
                                    <RadioGroupItem
                                        value="false"
                                        id="unverified"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="unverified"
                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black  [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                    >
                                        تاییده نشده
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem
                                        value="true"
                                        id="verified"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="verified"
                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                    >
                                        تایید شده
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem
                                        value={null}
                                        id="all"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="all"
                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                    >
                                        همه
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="flex min-w-fit items-center justify-between gap-1 rounded-md border border-neutral-100 px-2.5 py-1 text-sm text-gray-700">
                            پیش بینی حد سود
                            <ChevronDown width={18} height={18} />
                        </div>
                    </DialogTrigger>
                    <DialogContent className="max-h-full w-full max-w-[425px] overflow-auto">
                        <div className="flex flex-col gap-3">
                            <h4 className="text-sm font-bold">
                                پیش بینی حد سود
                            </h4>
                            <DragSlider
                                className="mb-5"
                                items={{
                                    0: {
                                        value: JSON.stringify({
                                            estimated_profit_ratio_gte: 0,
                                            estimated_profit_ratio_lte: 1.25,
                                        }),
                                        label: '25%',
                                    },
                                    1: {
                                        value: JSON.stringify({
                                            estimated_profit_ratio_gte: 1.25,
                                            estimated_profit_ratio_lte: 1.5,
                                        }),
                                        label: '50%',
                                    },
                                    2: {
                                        value: JSON.stringify({
                                            estimated_profit_ratio_gte: 1.5,
                                            estimated_profit_ratio_lte: 1.75,
                                        }),
                                        label: '75%',
                                    },
                                    3: {
                                        value: JSON.stringify({
                                            estimated_profit_ratio_gte: 1.75,
                                            estimated_profit_ratio_lte: 2,
                                        }),
                                        label: '100%',
                                    },
                                }}
                                defaultValue={JSON.stringify({
                                    estimated_profit_ratio_gte:
                                        searchParams.get(
                                            'estimated_profit_ratio_gte'
                                        ) ?? 1.25,
                                    estimated_profit_ratio_lte:
                                        searchParams.get(
                                            'estimated_profit_ratio_lte'
                                        ) ?? 1.5,
                                })}
                                onValueCommit={(value) => {
                                    handleFilter({
                                        estimated_profit_ratio_lte:
                                            JSON.parse(value)
                                                .estimated_profit_ratio_lte,
                                        estimated_profit_ratio_gte:
                                            JSON.parse(value)
                                                .estimated_profit_ratio_gte,
                                    });
                                }}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="flex min-w-fit items-center justify-between gap-1 rounded-md border border-neutral-100 px-2.5 py-1 text-sm text-gray-700">
                            اندازه شرکت
                            <ChevronDown width={18} height={18} />
                        </div>
                    </DialogTrigger>
                    <DialogContent className="max-h-full w-full max-w-[425px] overflow-auto">
                        <div className="flex flex-col gap-3">
                            <h4 className="text-sm font-bold">اندازه شرکت</h4>
                            <RadioGroup
                                defaultValue={null}
                                onValueChange={(marketSize) =>
                                    handleFilter({
                                        market_size: marketSize,
                                    })
                                }
                                className="flex w-fit items-center gap-3 rounded-md border border-neutral-100 px-1.5 py-1.5"
                            >
                                <div>
                                    <RadioGroupItem
                                        value="L"
                                        id="big"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="big"
                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100  peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                    >
                                        بزرگ
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem
                                        value="M"
                                        id="medium"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="medium"
                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100  peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                    >
                                        متوسط
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem
                                        value="S"
                                        id="small"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="small"
                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100  peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                    >
                                        کوچک
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem
                                        value={null}
                                        id="both"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="both"
                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                    >
                                        همه
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="flex min-w-fit items-center justify-between gap-1 rounded-md border border-neutral-100 px-2.5 py-1 text-sm text-gray-700">
                            نوع سیگنال
                            <ChevronDown width={18} height={18} />
                        </div>
                    </DialogTrigger>
                    <DialogContent className="max-h-full w-full max-w-[425px] overflow-auto">
                        <div className="flex flex-col gap-3">
                            <h4 className="text-sm font-bold">نوع سیگنال</h4>
                            <RadioGroup
                                defaultValue={searchParams.get('value') ?? 'B'}
                                onValueChange={(value) =>
                                    handleFilter({
                                        value,
                                    })
                                }
                                className="flex w-fit items-center gap-3 rounded-md border border-neutral-100 px-1.5 py-1.5"
                            >
                                <div>
                                    <RadioGroupItem
                                        value="S"
                                        id="sell"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="sell"
                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-red-500 peer-data-[state=checked]:font-black peer-data-[state=checked]:text-white  [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                    >
                                        فروش
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem
                                        value="B"
                                        id="buy"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="buy"
                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-green-500  peer-data-[state=checked]:font-black peer-data-[state=checked]:text-white  [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                    >
                                        خرید
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
