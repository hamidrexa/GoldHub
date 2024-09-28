'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { XIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button, buttonVariants } from '@/components/ui/button';
import { getBase64 } from '@/libs/utils';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function PublishFirstForm({ setStep, setSignal }) {
    const completeInfoFormSchema = z.object({
        title: z.string({
            required_error: 'تحلیل باید دارای عنوان باشد',
        }),
        text: z.string({
            required_error: 'متن پیام نمی تواند خالی باشد',
        }),
        images: z.optional(z.any()),
    });
    type CompleteInfoFormValue = z.infer<typeof completeInfoFormSchema>;
    const defaultValues: Partial<CompleteInfoFormValue> = {};
    const form = useForm<CompleteInfoFormValue>({
        resolver: zodResolver(completeInfoFormSchema),
        defaultValues,
    });

    const onSubmit = (info) => {
        setSignal(info);
        setStep(2);
    };

    return (
        <div className="w-full">
            <Form {...form}>
                <form
                    className="mx-auto flex w-full flex-col md:px-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                    autoComplete="off"
                >
                    <div className="flex flex-col gap-1.5 py-2">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        عنوان تحلیل{' '}
                                        <span className="text-2xl text-red-700">
                                            *
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="h-10 w-full"
                                            placeholder="عنوان تحلیل خود را به صورت دقیق وارد کنید."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="images"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormLabel htmlFor="picture">
                                        تصویر
                                    </FormLabel>
                                    {field.value ? (
                                        <div className="relative flex justify-center border">
                                            <XIcon
                                                onClick={() => {
                                                    form.setValue('images', '');
                                                }}
                                                className="absolute right-2 top-2 rounded-md border border-white bg-red-500 text-white hover:cursor-pointer"
                                            />
                                            <img
                                                src={form.getValues().images}
                                                alt="Preview"
                                                className="h-64"
                                                width={
                                                    (form.getValues().images *
                                                        256) /
                                                    form.getValues().images
                                                        .height
                                                }
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative flex h-72 w-full flex-col border-4 border-dashed">
                                            <Label
                                                className="flex h-72 flex-col items-center justify-center gap-5"
                                                htmlFor="picture"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="120"
                                                    height="120"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="gray"
                                                    strokeWidth="1"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="lucide lucide-cloud-upload"
                                                >
                                                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                                                    <path d="M12 12v9" />
                                                    <path d="m16 16-4-4-4 4" />
                                                </svg>
                                                {/*<p className="text-xl">*/}
                                                {/*    فایل خود را بکشید و رها کنید*/}
                                                {/*</p>*/}
                                                {/*<p>یا</p>*/}
                                                <div
                                                    className={buttonVariants({
                                                        variant: 'outline',
                                                    })}
                                                >
                                                    انتخاب فایل
                                                </div>
                                            </Label>
                                            <Input
                                                className="invisible absolute"
                                                id="picture"
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    form.setValue(
                                                        'images',
                                                        await getBase64(
                                                            e.target.files[0]
                                                        )
                                                    );
                                                }}
                                            />
                                        </div>
                                    )}
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="text"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        شرح تحلیل{' '}
                                        <span className="text-2xl text-red-700">
                                            *
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="h-36"
                                            placeholder="متن تحلیل خود را با کاربران به اشتراک بگذارید."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="mt-3"
                            variant="default"
                        >
                            ادامه
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
