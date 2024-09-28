'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn, getDirection, removeFalsyValuesExceptZero } from '@/libs/utils';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import dayjs from 'dayjs';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/spinner';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { updateSignal } from '@/services/update-signal';
import { toast } from 'sonner';

export function EditSignalForm({ message, dict, lang, setOpen }) {
    const editFormSchema = z.object({
        value: z.string(),
        type: z.string(),
        timeframe: z.union([z.literal(''), z.coerce.string()]).optional(),
        timeout: z.union([z.literal(''), z.coerce.string()]).optional(),
        support_price: z.union([z.literal(''), z.coerce.number()]).optional(),
        resistance_price: z
            .union([z.literal(''), z.coerce.number()])
            .optional(),
        // entry_point_price: z.number(),
        profit_target_price: z
            .union([z.literal(''), z.coerce.number()])
            .optional(),
        stop_loss_price: z.union([z.literal(''), z.coerce.number()]).optional(),
    });
    type EditFormValue = z.infer<typeof editFormSchema>;
    const [loading, setLoading] = useState(false);
    const [signals, setSignals] = useState(message.assets_signals);
    const [signalIndex, setSignalIndex] = useState('0');
    const defaultValues: Partial<EditFormValue> = {
        value: signals[signalIndex]?.value ?? 'N',
        type: signals[signalIndex]?.type ?? 'N',
        timeframe: signals[signalIndex]?.timeframe ?? 'null',
        timeout: signals[signalIndex]?.timeout
            ? dayjs(signals[signalIndex].timeout)
                  .diff(message.date, 'day')
                  .toString()
            : 'null',

        resistance_price: signals[signalIndex]?.resistance_price ?? '',
        stop_loss_price: signals[signalIndex]?.stop_loss_price ?? '',
        profit_target_price: signals[signalIndex]?.profit_target_price ?? '',
        support_price: signals[signalIndex]?.support_price ?? '',
    };
    const form = useForm<EditFormValue>({
        resolver: zodResolver(editFormSchema),
        values: defaultValues,
    });
    const onSubmit = async (data) => {
        setLoading(true);
        const newSignal = {
            ...removeFalsyValuesExceptZero({
                ...data,
            }),
            timeframe: data.timeframe === 'null' ? null : data.timeframe,
            timeout:
                data.timeout === 'null'
                    ? null
                    : dayjs(message.date)
                          .add(+data.timeout, 'day')
                          .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            profit_target_price:
                data.profit_target_price === ''
                    ? null
                    : data.profit_target_price,
            stop_loss_price:
                data.stop_loss_price === '' ? null : data.stop_loss_price,
            resistance_price:
                data.resistance_price === '' ? null : data.resistance_price,
            support_price:
                data.support_price === '' ? null : data.support_price,
        };
        try {
            await updateSignal(newSignal, signals[signalIndex].id);
        } catch (e) {
            window.focus();
            // @ts-ignore
            document.activeElement?.blur();
            toast.error('خطایی در ویرایش سیگنال رخ داده است.');
        }
        setLoading(false);
        setOpen(false);
        toast.success('اصلاحات شما با موفقیت اعمال شد.');
    };

    return (
        <div className="max-h-[500px] w-full py-3">
            <div className="mb-2.5 max-w-full">
                <Label className="text-base font-bold">نماد</Label>
                <Select
                    dir="rtl"
                    defaultValue={signalIndex}
                    onValueChange={(index) => {
                        setSignalIndex(null);
                        setSignalIndex(index);
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="انتخاب نماد" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {signals.map((signal, index) => (
                                <SelectItem
                                    key={index}
                                    value={index.toString()}
                                >
                                    {signal.asset.symbol}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 pb-4"
                >
                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-bold">
                                    سیگنال
                                </FormLabel>
                                <FormControl>
                                    <div className="flex w-full items-center">
                                        <RadioGroup
                                            dir={getDirection(lang)}
                                            className="flex items-center gap-3 rounded-md border border-neutral-100 px-1.5 py-1.5"
                                            onValueChange={field.onChange}
                                            {...field}
                                        >
                                            <div>
                                                <RadioGroupItem
                                                    value="N"
                                                    id="edit-signal-dialog-all"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="edit-signal-dialog-all"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    {dict.neutral}
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem
                                                    value="B"
                                                    id="edit-signal-dialog-buy"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="edit-signal-dialog-buy"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    {dict.buy}
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem
                                                    value="S"
                                                    id="edit-signal-dialog-sell"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="edit-signal-dialog-sell"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    {dict.sell}
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-bold">
                                    نوع
                                </FormLabel>
                                <FormControl>
                                    <div className="flex w-full items-center">
                                        <RadioGroup
                                            dir={getDirection(lang)}
                                            className="flex items-center gap-3 rounded-md border border-neutral-100 px-1.5 py-1.5"
                                            onValueChange={field.onChange}
                                            {...field}
                                        >
                                            <div>
                                                <RadioGroupItem
                                                    value="N"
                                                    id="messages-dialog-normal"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="messages-dialog-normal"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    عادی
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem
                                                    value="F"
                                                    id="messages-dialog-fundumental"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="messages-dialog-fundumental"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    بنیادی
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem
                                                    value="T"
                                                    id="messages-dialog-technical"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="messages-dialog-technical"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    تکنیکال
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem
                                                    value="B"
                                                    id="messages-dialog-technical"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="messages-dialog-technical"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    بورد
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="timeframe"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center text-base font-bold">
                                    تایم فریم
                                </FormLabel>
                                <FormControl>
                                    <div className="flex w-full items-center">
                                        <RadioGroup
                                            dir={getDirection(lang)}
                                            className="grid grid-cols-4 grid-rows-2 items-center gap-3 rounded-md border border-neutral-100 px-1.5 py-1.5 md:flex"
                                            onValueChange={field.onChange}
                                            {...field}
                                        >
                                            <div>
                                                <RadioGroupItem
                                                    value="null"
                                                    id="messages-dialog-null"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="messages-dialog-null"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    ندارد
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem
                                                    value="00:15:00"
                                                    id="messages-dialog-15min"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="messages-dialog-15min"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    15دقیقه
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem
                                                    value="00:30:00"
                                                    id="messages-dialog-30min"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="messages-dialog-30min"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    30دقیقه
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem
                                                    value="01:00:00"
                                                    id="messages-dialog-1hour"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="messages-dialog-1hour"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    1ساعت
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem
                                                    value="04:00:00"
                                                    id="messages-dialog-4hour"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="messages-dialog-4hour"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    4ساعت
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem
                                                    value="1 00:00:00"
                                                    id="messages-dialog-1day"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="messages-dialog-1day"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    1روز
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem
                                                    value="7 00:00:00"
                                                    id="messages-dialog-1week"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="messages-dialog-1week"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    1هفته
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem
                                                    value="30 00:00:00"
                                                    id="messages-dialog-1month"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="messages-dialog-1month"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    1ماه
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem
                                                    value="360 00:00:00"
                                                    id="messages-dialog-1year"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="messages-dialog-1year"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    اسال
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="timeout"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1">
                                    <div className="text-base font-bold">
                                        {' '}
                                        مدت اعتبار
                                    </div>
                                    <div className="rounded-md border-gray-600">
                                        (مقدار فعلی:
                                        {!!signals[signalIndex].timeout
                                            ? dayjs(
                                                  signals[signalIndex].timeout
                                              ).diff(message.date, 'day') +
                                              ' روز'
                                            : 'ندارد'}
                                        )
                                    </div>
                                </FormLabel>
                                <FormControl>
                                    <div className="flex w-full items-center">
                                        <RadioGroup
                                            dir={getDirection(lang)}
                                            className="grid w-full grid-cols-4 grid-rows-2 items-center gap-3 rounded-md border border-neutral-100 px-1.5 py-1.5 md:flex md:w-fit"
                                            {...field}
                                            onValueChange={field.onChange}
                                        >
                                            <div>
                                                <RadioGroupItem
                                                    value="null"
                                                    id="messages-dialog-Null"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="messages-dialog-Null"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    ندارد
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem
                                                    value="1"
                                                    id="messages-dialog-1Day"
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor="messages-dialog-1Day"
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
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
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
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
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
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
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
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
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
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
                                                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border border-transparent bg-transparent px-3 py-1.5 peer-data-[state=checked]:border-neutral-100 peer-data-[state=checked]:bg-white peer-data-[state=checked]:font-black [&:has([data-state=checked])]:border-neutral-100 [&:has([data-state=checked])]:bg-white [&:has([data-state=checked])]:font-black"
                                                >
                                                    1سال
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="support_price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>اولین حمایت</FormLabel>
                                <FormControl>
                                    <Input
                                        dir="ltr"
                                        type="number"
                                        placeholder="اولین حمایت"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="resistance_price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>اولین مقاومت </FormLabel>
                                <FormControl>
                                    <Input
                                        dir="ltr"
                                        type="number"
                                        placeholder="اولین مقاومت"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    {/*<FormField*/}
                    {/*    control={form.control}*/}
                    {/*    name="entry_point_price"*/}
                    {/*    render={({ field }) => (*/}
                    {/*        <FormItem>*/}
                    {/*            <FormLabel>نقطه ورود</FormLabel>*/}
                    {/*            <FormControl>*/}
                    {/*                <Input*/}
                    {/*                    // defaultValue={signal.entry_point_price}*/}
                    {/*                    placeholder="نقطه ورود"*/}
                    {/*                    {...field}*/}
                    {/*                />*/}
                    {/*            </FormControl>*/}
                    {/*        </FormItem>*/}
                    {/*    )}*/}
                    {/*/>*/}
                    <FormField
                        control={form.control}
                        name="profit_target_price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>حد سود</FormLabel>
                                <FormControl>
                                    <Input
                                        dir="ltr"
                                        type="number"
                                        placeholder="حد سود"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="stop_loss_price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>حد ضرر</FormLabel>
                                <FormControl>
                                    <Input
                                        dir="ltr"
                                        type="number"
                                        placeholder="حد ضرر"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        className={cn(
                            buttonVariants({ variant: 'default' }),
                            'w-full'
                        )}
                    >
                        {loading ? <Spinner /> : 'ذخیره اصلاحات'}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
