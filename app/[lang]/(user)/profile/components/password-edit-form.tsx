'use client';

import { useForm } from 'react-hook-form';
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
import { Button } from '@/components/ui/button';
import { cn } from '@/libs/utils';
import React, { useState } from 'react';
import { useGlobalContext } from '@/contexts/store';
import Spinner from '@/components/spinner';
import { EyeIcon, EyeOff } from 'lucide-react';
import { changePassword } from '@/app/[lang]/(user)/profile/services/changePassword';
import { toast } from 'sonner';

export function PasswordEditForm({ lang, dict, setOpen }) {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const { user, setUser } = useGlobalContext();
    const formSchema = z
        .object({
            old_password: z.string().optional(),
            new_password: z
                .string({ required_error: 'پر کردن این فیلد الزامی است.' })
                .min(4, { message: 'حداقل طول رمز عبور ۴ کاراکتر است.' }),
            confirm_password: z
                .string({ required_error: 'پر کردن این فیلد الزامی است.' })
                .min(4, { message: 'حداقل طول رمز عبور ۴ کاراکتر است.' }),
        })
        .refine((data) => data.confirm_password === data.new_password, {
            message: 'مقدار دو رمز عبور وارد شده باید برابر باشند.',
            path: ['confirm_password'],
        });

    type formValue = z.infer<typeof formSchema>;
    const defaultValues: Partial<formValue> = {};
    const form = useForm<formValue>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });
    const onSubmit = async (info) => {
        setLoading(true);
        try {
            await changePassword({
                new_password: info.new_password,
                old_password: info.old_password ?? ' ',
            });
            setUser({
                ...user,
                has_password: true,
            });
            toast.success('تغییرات با موفقیت اعمال شد.');
            setOpen(false);
        } catch (e) {
            toast.warning(e?.error.messages.error[0]);
        }
        setLoading(false);
    };

    const Eye = (value, color, setShow) => {
        return (
            <>
                {value ? (
                    <EyeIcon
                        width={20}
                        height={20}
                        onClick={() => {
                            setShow(false);
                        }}
                        style={{ color: color }}
                        className="absolute left-4 top-2 hover:cursor-pointer"
                    />
                ) : (
                    <EyeOff
                        width={20}
                        height={20}
                        onClick={() => {
                            setShow(true);
                        }}
                        style={{ color: color }}
                        className="absolute left-4 top-2 hover:cursor-pointer"
                    />
                )}
            </>
        );
    };
    return (
        <div className="w-full">
            <Form {...form}>
                <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-3">
                        {user.has_password && (
                            <FormField
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>رمز عبور فعلی</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={
                                                        showOldPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    className="w-full"
                                                    placeholder="رمز عبور فعلی خود را وارد کنید"
                                                    {...field}
                                                />
                                                {Eye(
                                                    showOldPassword,
                                                    '#C5C8D2',
                                                    setShowOldPassword
                                                )}
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                                name="old_password"
                            />
                        )}
                        <FormField
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>رمز عبور جدید</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                className="w-full"
                                                placeholder="رمز عبور جدید خود را وارد کنید"
                                                {...field}
                                            />
                                            {Eye(
                                                showPassword,
                                                '#C5C8D2',
                                                setShowPassword
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            name="new_password"
                        />{' '}
                        <FormField
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>تایید رمز عبور</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={
                                                    showConfirmPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                className="w-full"
                                                placeholder="رمز عبور خود را مجدد وارد کنید"
                                                {...field}
                                            />
                                            {Eye(
                                                showConfirmPassword,
                                                '#C5C8D2',
                                                setShowConfirmPassword
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            name="confirm_password"
                        />
                    </div>
                    <Button type="submit" className={cn('mt-8 w-full')}>
                        {loading ? <Spinner /> : 'ذخیره'}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
