'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Popover,
    PopoverContentWithoutPortal,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check, ChevronDown } from 'lucide-react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    cn,
    getDateAfterDate,
    getDirection,
    removeFalsyValuesExceptZero,
} from '@/libs/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { useAssets } from '@/services/useAssets';
import { useForm } from 'react-hook-form';
import Spinner from '@/components/spinner';
import { useGlobalContext } from '@/contexts/store';
import { Badge } from '@/components/ui/badge';
import { sendSignal } from '@/services/sendSignal';
import { toast } from 'sonner';

export default function PublishSecondForm({
    setSignal,
    signal,
    setStep,
    setResponse,
}) {
    const [loading, setIsLoading] = useState(false);
    const { assets: initial, isLoading } = useAssets();
    const { user } = useGlobalContext();
    const [open, setOpen] = useState(false);
    const [isSearching, setIsSearching] = useState('');
    const completeInfoFormSchema = z.object({
        asset_id: z.number({
            required_error: 'لطفا یک نماد را انتخاب کنید',
        }),
        entry_point_price: z.optional(z.number()),
        profit_target_price: z
            .union([z.literal(''), z.coerce.number()])
            .optional(),
        stop_loss_price: z.union([z.literal(''), z.coerce.number()]).optional(),
        type: z.optional(z.string()),
        value: z.optional(z.string()),
        firstResistance: z.optional(z.number()),
        firstSupport: z.optional(z.number()),
        timeout: z.optional(z.string()),
        timeframe: z.optional(z.string()),
    });
    type CompleteInfoFormValue = z.infer<typeof completeInfoFormSchema>;
    const defaultValues: Partial<CompleteInfoFormValue> = {};
    const form = useForm<CompleteInfoFormValue>({
        resolver: zodResolver(completeInfoFormSchema),
        defaultValues,
    });
    const onSubmit = async (info) => {
        setIsLoading(true);
        const pSignal = removeFalsyValuesExceptZero({
            ...signal,
            ...info,
            timeout:
                info.value !== 'S'
                    ? getDateAfterDate(parseInt(info.timeout)).coming
                    : null,
            profit_target_price:
                info.value !== 'S' ? info.profit_target_price : null,
            stop_loss_price: info.value !== 'S' ? info.stop_loss_price : null,
        });
        try {
            const response = await sendSignal(
                Object.fromEntries(Object.entries(pSignal))
            );
            setResponse(response);
            setStep(3);
        } catch ({ error }) {
            window.focus();
            // @ts-ignore
            document.activeElement?.blur();
            toast.error(error.params?.[0]);
        }
        setIsLoading(false);
    };
    const assets = !!initial && {
        crypto: !!initial.crypto
            ? initial.crypto.map((coin) => ({
                  ...coin,
                  image: `https://cdn.sahmeto.com/media/${coin.image}`,
                  symbol: coin.symbol + '/' + coin.name_fa,
                  type: 'cryptocurrency',
              }))
            : [],
        ticker: !!initial.ticker
            ? initial.ticker.map((ticker) => ({
                  ...ticker,
                  image: `https://sahmeto.com/ticker-images/${ticker.symbol_fa}.jpg`,
                  // symbol_fa: ticker.symbol_fa + '/' + ticker.name_fa,
                  type: 'tse',
              }))
            : [],
    };
    return (
        <div className="w-full">
            <Form {...form}>
                <form
                    className="mx-auto flex flex-col justify-evenly md:px-8"
                    onSubmit={form.handleSubmit(onSubmit)}
                    autoComplete="off"
                >
                    <div className="my-4 flex flex-col gap-2.5">
                        <div className="flex flex-col  gap-2">
                            <div className="item-center flex gap-2">
                                <div className="flex items-center text-sm font-medium">
                                    بازار فعالیت شما:
                                </div>
                                <Badge
                                    className={cn(
                                        'w-fit',
                                        user?.trader_page_status !== 'active'
                                            ? 'bg-slate-300 text-white'
                                            : 'bg-emerald-400 text-neutral-800'
                                    )}
                                >
                                    {user?.trader_page_status !== 'active'
                                        ? 'نامشخص'
                                        : user.trader.publisher_type ===
                                            'signal'
                                          ? 'بورس'
                                          : 'ارزدیجیتال'}
                                </Badge>
                            </div>
                            {user?.trader_page_status !== 'active' && (
                                <div className="flex items-center gap-1 text-sm font-light">
                                    <AlertCircle className="text-neutral-500" />
                                    <b className="font-semibold">توجه: </b>
                                    پس از ثبت اولین سیگنال، امکان تغییر بازار
                                    فعالیت برای تریدر شما وجود{' '}
                                    <b className="font-bold underline underline-offset-4">
                                        نخواهد
                                    </b>{' '}
                                    داشت.
                                </div>
                            )}
                        </div>
                        <FormField
                            control={form.control}
                            name="asset_id"
                            render={({ field }) => (
                                <FormItem>
                                    <p className="text-sm font-medium">
                                        انتخاب نماد:
                                        <span className="text-2xl text-red-700">
                                            *
                                        </span>
                                    </p>
                                    <FormControl>
                                        <Popover
                                            open={open}
                                            onOpenChange={setOpen}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-between md:w-96"
                                                >
                                                    {!isLoading && field.value
                                                        ? [
                                                              ...assets.crypto,
                                                          ].find(
                                                              (asset) =>
                                                                  asset.asset_id ===
                                                                  field.value
                                                          )?.symbol ||
                                                          [
                                                              ...assets.ticker,
                                                          ].find(
                                                              (asset) =>
                                                                  asset.asset_id ===
                                                                  field.value
                                                          )?.symbol_fa
                                                        : 'نمادی انتخاب نشده است'}
                                                    <ChevronDown
                                                        className="h-4 w-4"
                                                        opacity={0.5}
                                                    />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContentWithoutPortal className="z-[90] w-[340px] md:w-96">
                                                <Command className="w-full">
                                                    <CommandInput
                                                        placeholder="نماد خود را پیدا کنید"
                                                        onInput={(e) =>
                                                            setIsSearching(
                                                                // @ts-ignore
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <CommandEmpty>
                                                        نمادی یافت نشد
                                                    </CommandEmpty>
                                                    <CommandList>
                                                        {isLoading ? (
                                                            <Spinner />
                                                        ) : (
                                                            <CommandGroup className="h-72 overflow-auto">
                                                                {assets.ticker
                                                                    .slice(
                                                                        ...(!isSearching
                                                                            ? [
                                                                                  0,
                                                                                  10,
                                                                              ]
                                                                            : [
                                                                                  0,
                                                                              ])
                                                                    )
                                                                    .map(
                                                                        (
                                                                            asset
                                                                        ) => (
                                                                            <CommandItem
                                                                                key={
                                                                                    asset.symbol_fa
                                                                                }
                                                                                value={
                                                                                    asset.symbol_fa
                                                                                }
                                                                                onSelect={() => {
                                                                                    setOpen(
                                                                                        false
                                                                                    );
                                                                                    form.setValue(
                                                                                        'asset_id',
                                                                                        asset.asset_id
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <>
                                                                                    <img
                                                                                        width={
                                                                                            30
                                                                                        }
                                                                                        height={
                                                                                            30
                                                                                        }
                                                                                        src={
                                                                                            asset.image
                                                                                        }
                                                                                        alt="asset image"
                                                                                        className="h-11 w-11 min-w-11 rounded-full object-cover"
                                                                                    />
                                                                                    <Check
                                                                                        className={cn(
                                                                                            'ml-2 h-4 w-4',
                                                                                            field.value ===
                                                                                                asset.symbol_fa
                                                                                                ? 'opacity-100'
                                                                                                : 'opacity-0'
                                                                                        )}
                                                                                    />
                                                                                    {
                                                                                        asset.symbol_fa
                                                                                    }
                                                                                </>
                                                                            </CommandItem>
                                                                        )
                                                                    )}
                                                                {assets.crypto
                                                                    .slice(
                                                                        ...(!isSearching
                                                                            ? [
                                                                                  0,
                                                                                  10,
                                                                              ]
                                                                            : [
                                                                                  0,
                                                                              ])
                                                                    )
                                                                    .map(
                                                                        (
                                                                            asset
                                                                        ) => (
                                                                            <CommandItem
                                                                                key={
                                                                                    asset.symbol
                                                                                }
                                                                                value={
                                                                                    asset.symbol
                                                                                }
                                                                                onSelect={() => {
                                                                                    setOpen(
                                                                                        false
                                                                                    );
                                                                                    form.setValue(
                                                                                        'asset_id',
                                                                                        asset.asset_id
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <>
                                                                                    <img
                                                                                        width={
                                                                                            30
                                                                                        }
                                                                                        height={
                                                                                            30
                                                                                        }
                                                                                        src={
                                                                                            asset.image
                                                                                        }
                                                                                        alt="asset image"
                                                                                        className="h-11 w-11 min-w-11 rounded-full object-cover"
                                                                                    />

                                                                                    <Check
                                                                                        className={cn(
                                                                                            'h-4 w-4',
                                                                                            field.value ===
                                                                                                asset.symbol
                                                                                                ? 'opacity-100'
                                                                                                : 'opacity-0'
                                                                                        )}
                                                                                    />
                                                                                    {
                                                                                        asset.symbol
                                                                                    }
                                                                                </>
                                                                            </CommandItem>
                                                                        )
                                                                    )}
                                                            </CommandGroup>
                                                        )}
                                                    </CommandList>
                                                </Command>
                                            </PopoverContentWithoutPortal>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            defaultValue="N"
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormLabel>نوع سیگنال:</FormLabel>
                                    <RadioGroup
                                        defaultValue="N"
                                        className="flex w-fit items-center gap-3 rounded-md border border-neutral-100 px-1.5 py-1.5"
                                        {...field}
                                        onValueChange={field.onChange}
                                    >
                                        <div>
                                            <RadioGroupItem
                                                value="S"
                                                id="sell"
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor="sell"
                                                className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-red-500 peer-data-[state=checked]:font-black peer-data-[state=checked]:text-white [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
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
                                                className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-green-600 peer-data-[state=checked]:font-black peer-data-[state=checked]:text-white [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                            >
                                                خرید
                                            </Label>
                                        </div>
                                        <div>
                                            <RadioGroupItem
                                                value="N"
                                                id="neutral"
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor="neutral"
                                                className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-gray-300 peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                            >
                                                خنثی
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </FormItem>
                            )}
                        />
                        <FormField
                            defaultValue="N"
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormLabel>نوع تحلیل:</FormLabel>
                                    <RadioGroup
                                        defaultValue="N"
                                        className="flex w-fit gap-3 rounded-md border border-neutral-100 px-1.5 py-1.5"
                                        {...field}
                                        onValueChange={field.onChange}
                                    >
                                        <div>
                                            <RadioGroupItem
                                                value="T"
                                                id="technical"
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor="technical"
                                                className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-yellow-400 peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                            >
                                                تکنیکال
                                            </Label>
                                        </div>
                                        <div>
                                            <RadioGroupItem
                                                value="F"
                                                id="fundumental"
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor="fundumental"
                                                className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-neutral-800 peer-data-[state=checked]:font-black peer-data-[state=checked]:text-white [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                            >
                                                بنیادی
                                            </Label>
                                        </div>
                                        <div>
                                            <RadioGroupItem
                                                value="N"
                                                id="normal"
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor="normal"
                                                className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-gray-300 peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                            >
                                                عادی
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </FormItem>
                            )}
                        />
                        {form.watch('value') !== 'S' && (
                            <FormField
                                defaultValue="1"
                                control={form.control}
                                name="timeout"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <FormLabel>مدت اعتبار:</FormLabel>
                                        <RadioGroup
                                            defaultValue="1"
                                            dir={getDirection('fa')}
                                            className="flex w-fit items-center gap-0 rounded-md border border-neutral-100 py-1.5 md:gap-3 md:px-1.5"
                                            onValueChange={field.onChange}
                                            {...field}
                                        >
                                            <div>
                                                <RadioGroupItem
                                                    value="1"
                                                    id="messages-dialog-1Day"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="messages-dialog-1Day"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-2.5 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-gray-300 peer-data-[state=checked]:font-black md:px-3 [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    1روز
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem
                                                    value="7"
                                                    id="messages-dialog-1Week"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="messages-dialog-1Week"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-2.5 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-gray-300 peer-data-[state=checked]:font-black md:px-3 [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    1هفته
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem
                                                    value="30"
                                                    id="messages-dialog-1Month"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="messages-dialog-1Month"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-2.5 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-gray-300 peer-data-[state=checked]:font-black md:px-3 [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    1ماه
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem
                                                    value="90"
                                                    id="messages-dialog-3month"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="messages-dialog-3month"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-2.5 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-gray-300 peer-data-[state=checked]:font-black md:px-3 [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    3ماه
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem
                                                    value="180"
                                                    id="messages-dialog-6month"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="messages-dialog-6month"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-2.5 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-gray-300 peer-data-[state=checked]:font-black md:px-3 [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    6ماه
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem
                                                    value="360"
                                                    id="messages-dialog-1Year"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="messages-dialog-1Year"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-2.5 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-gray-300 peer-data-[state=checked]:font-black md:px-3 [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    1سال
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </FormItem>
                                )}
                            />
                        )}
                        {/*<FormField*/}
                        {/*    control={form.control}*/}
                        {/*    name="timeframe"*/}
                        {/*    render={({ field }) => (*/}
                        {/*        <FormItem className="">*/}
                        {/*            <FormLabel>تایم فریم:</FormLabel>*/}
                        {/*            <RadioGroup*/}
                        {/*                // disabled={form.getValues().type === 'F'}*/}
                        {/*                defaultValue="00:15:00"*/}
                        {/*                dir={getDirection('fa')}*/}
                        {/*                className="flex w-fit items-center gap-1 rounded-md border border-neutral-100 px-1.5 py-1.5"*/}
                        {/*                {...field}*/}
                        {/*                onValueChange={field.onChange}*/}
                        {/*            >*/}
                        {/*                <div>*/}
                        {/*                    <RadioGroupItem*/}
                        {/*                        value="00:15:00"*/}
                        {/*                        id="messages-dialog-15min"*/}
                        {/*                        className="peer sr-only"*/}
                        {/*                    />*/}
                        {/*                    <Label*/}
                        {/*                        htmlFor="messages-dialog-15min"*/}
                        {/*                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-gray-300 peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"*/}
                        {/*                    >*/}
                        {/*                        15دقیقه*/}
                        {/*                    </Label>*/}
                        {/*                </div>*/}
                        {/*                <div>*/}
                        {/*                    <RadioGroupItem*/}
                        {/*                        value="00:30:00"*/}
                        {/*                        id="messages-dialog-30min"*/}
                        {/*                        className="peer sr-only"*/}
                        {/*                    />*/}
                        {/*                    <Label*/}
                        {/*                        htmlFor="messages-dialog-30min"*/}
                        {/*                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-gray-300 peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"*/}
                        {/*                    >*/}
                        {/*                        30دقیقه*/}
                        {/*                    </Label>*/}
                        {/*                </div>*/}
                        {/*                <div>*/}
                        {/*                    <RadioGroupItem*/}
                        {/*                        value="01:00:00"*/}
                        {/*                        id="messages-dialog-1hour"*/}
                        {/*                        className="peer sr-only"*/}
                        {/*                    />*/}
                        {/*                    <Label*/}
                        {/*                        htmlFor="messages-dialog-1hour"*/}
                        {/*                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-gray-300 peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"*/}
                        {/*                    >*/}
                        {/*                        1ساعت*/}
                        {/*                    </Label>*/}
                        {/*                </div>*/}
                        {/*                <div>*/}
                        {/*                    <RadioGroupItem*/}
                        {/*                        value="04:00:00"*/}
                        {/*                        id="messages-dialog-4hour"*/}
                        {/*                        className="peer sr-only"*/}
                        {/*                    />*/}
                        {/*                    <Label*/}
                        {/*                        htmlFor="messages-dialog-4hour"*/}
                        {/*                        className="peer-data-[state=checked]:bg-gary-300 flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-gray-300 peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"*/}
                        {/*                    >*/}
                        {/*                        4ساعت*/}
                        {/*                    </Label>*/}
                        {/*                </div>*/}
                        {/*                <div>*/}
                        {/*                    <RadioGroupItem*/}
                        {/*                        value="1 00:00:00"*/}
                        {/*                        id="messages-dialog-1day"*/}
                        {/*                        className="peer sr-only"*/}
                        {/*                    />*/}
                        {/*                    <Label*/}
                        {/*                        htmlFor="messages-dialog-1day"*/}
                        {/*                        className="peer-data-[state=checked]:bg-gary-300 flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-gray-300 peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"*/}
                        {/*                    >*/}
                        {/*                        1روز*/}
                        {/*                    </Label>*/}
                        {/*                </div>*/}
                        {/*                <div>*/}
                        {/*                    <RadioGroupItem*/}
                        {/*                        value="7 00:00:00"*/}
                        {/*                        id="messages-dialog-1week"*/}
                        {/*                        className="peer sr-only"*/}
                        {/*                    />*/}
                        {/*                    <Label*/}
                        {/*                        htmlFor="messages-dialog-1week"*/}
                        {/*                        className="peer-data-[state=checked]:bg-gary-300 flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-gray-300 peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"*/}
                        {/*                    >*/}
                        {/*                        1هفته*/}
                        {/*                    </Label>*/}
                        {/*                </div>*/}
                        {/*                <div>*/}
                        {/*                    <RadioGroupItem*/}
                        {/*                        value="30 00:00:00"*/}
                        {/*                        id="messages-dialog-1month"*/}
                        {/*                        className="peer sr-only"*/}
                        {/*                    />*/}
                        {/*                    <Label*/}
                        {/*                        htmlFor="messages-dialog-1month"*/}
                        {/*                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-gray-300 peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"*/}
                        {/*                    >*/}
                        {/*                        1ماه*/}
                        {/*                    </Label>*/}
                        {/*                </div>*/}
                        {/*                <div>*/}
                        {/*                    <RadioGroupItem*/}
                        {/*                        value="360 00:00:00"*/}
                        {/*                        id="messages-dialog-1year"*/}
                        {/*                        className="peer sr-only"*/}
                        {/*                    />*/}
                        {/*                    <Label*/}
                        {/*                        htmlFor="messages-dialog-1year"*/}
                        {/*                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-gray-300 peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"*/}
                        {/*                    >*/}
                        {/*                        اسال*/}
                        {/*                    </Label>*/}
                        {/*                </div>*/}
                        {/*            </RadioGroup>*/}
                        {/*        </FormItem>*/}
                        {/*    )}*/}
                        {/*/>*/}

                        <div className="flex flex-col gap-3">
                            {/*<FormField*/}
                            {/*    control={form.control}*/}
                            {/*    name="entry_point_price"*/}
                            {/*    render={({ field }) => (*/}
                            {/*        <FormItem className="">*/}
                            {/*            <FormLabel>نقطه ورود:</FormLabel>*/}
                            {/*            <FormControl>*/}
                            {/*                <Input*/}
                            {/*                    dir="ltr"*/}
                            {/*                    type="number"*/}
                            {/*                    // step="0.01"*/}
                            {/*                    placeholder="مثال:12.34"*/}
                            {/*                    {...field}*/}
                            {/*                    onChange={(e) => {*/}
                            {/*                        form.setValue(*/}
                            {/*                            'entry_point_price',*/}
                            {/*                            parseFloat(*/}
                            {/*                                e.target.value*/}
                            {/*                            )*/}
                            {/*                        );*/}
                            {/*                    }}*/}
                            {/*                />*/}
                            {/*            </FormControl>*/}
                            {/*        </FormItem>*/}
                            {/*    )}*/}
                            {/*/>*/}
                            {form.watch('value') !== 'S' && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="profit_target_price"
                                        render={({ field }) => (
                                            <FormItem className="">
                                                <FormLabel>حد سود:</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        dir="ltr"
                                                        type="number"
                                                        placeholder="مثال:12.34"
                                                        {...field}
                                                        onChange={(e) => {
                                                            form.setValue(
                                                                'profit_target_price',
                                                                parseFloat(
                                                                    e.target
                                                                        .value
                                                                )
                                                            );
                                                        }}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="stop_loss_price"
                                        render={({ field }) => (
                                            <FormItem className="">
                                                <FormLabel>حد ضرر:</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        dir="ltr"
                                                        type="number"
                                                        placeholder="مثال:12.34"
                                                        {...field}
                                                        onChange={(e) => {
                                                            form.setValue(
                                                                'stop_loss_price',
                                                                parseFloat(
                                                                    e.target
                                                                        .value
                                                                )
                                                            );
                                                        }}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                            {/*<FormField*/}
                            {/*    control={form.control}*/}
                            {/*    name="firstResistance"*/}
                            {/*    render={({ field }) => (*/}
                            {/*        <FormItem className="mt-6">*/}
                            {/*            <FormLabel>اولین مقاومت:</FormLabel>*/}
                            {/*            <Input*/}
                            {/*                placeholder="مثال:123"*/}
                            {/*                {...field}*/}
                            {/*                onChange={(e) => {*/}
                            {/*                    form.setValue(*/}
                            {/*                        'firstResistance',*/}
                            {/*                        parseInt(e.target.value)*/}
                            {/*                    );*/}
                            {/*                }}*/}
                            {/*            />*/}
                            {/*        </FormItem>*/}
                            {/*    )}*/}
                            {/*/>*/}
                            {/*<FormField*/}
                            {/*    control={form.control}*/}
                            {/*    name="firstSupport"*/}
                            {/*    render={({ field }) => (*/}
                            {/*        <FormItem className="mt-6">*/}
                            {/*            <FormLabel>اولین حمایت:</FormLabel>*/}
                            {/*            <Input*/}
                            {/*                placeholder="مثال:123"*/}
                            {/*                {...field}*/}
                            {/*                onChange={(e) => {*/}
                            {/*                    form.setValue(*/}
                            {/*                        'firstSupport',*/}
                            {/*                        parseInt(e.target.value)*/}
                            {/*                    );*/}
                            {/*                }}*/}
                            {/*            />*/}
                            {/*        </FormItem>*/}
                            {/*    )}*/}
                            {/*/>*/}
                        </div>
                        <Button type="submit" className={cn('w-full')}>
                            {loading ? (
                                <Spinner width={20} height={20} />
                            ) : (
                                '        ثبت تحلیل'
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
