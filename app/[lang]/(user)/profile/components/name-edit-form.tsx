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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/libs/utils';
import { useGlobalContext } from '@/contexts/store';
import { updateUser } from '@/app/[lang]/(user)/profile/services/updateUser';
import { useState } from 'react';
import Spinner from '@/components/spinner';

export function NameEditForm({ lang, dict, setOpen }) {
    const [loading, setLoading] = useState(false);
    const { user, setUser } = useGlobalContext();
    const formSchema = z.object({
        firstName: z.string(),
        lastName: z.string(),
    });
    type formValue = z.infer<typeof formSchema>;
    const defaultValues: Partial<formValue> = {};
    const form = useForm<formValue>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });
    const onSubmit = async (info) => {
        setLoading(true);
        await updateUser({
            ...user,
            first_name: !!info.firstName ? info.firstName : user.first_name,
            last_name: !!info.lastName ? info.lastName : user.last_name,
        });
        setUser({
            ...user,
            first_name: info.firstName,
            last_name: info.lastName,
        });
        setLoading(false);
        setOpen(false);
    };
    return (
        <div className="w-full">
            <Form {...form}>
                <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-3">
                        <FormField
                            defaultValue={
                                user.first_name ? user.first_name : ''
                            }
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>نام</FormLabel>
                                    <FormControl>
                                        <Input
                                            defaultValue={
                                                !!user && user.first_name
                                            }
                                            className="w-full"
                                            placeholder={'نام خود را وارد کنید'}
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                            name="firstName"
                        />
                        <FormField
                            defaultValue={user.last_name ? user.last_name : ''}
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>نام‌ خانوادگی</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full"
                                            defaultValue={
                                                !!user && user.last_name
                                            }
                                            placeholder={
                                                'نام‌ خانوادگی خود را وارد کنید'
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                            name="lastName"
                        />
                        <Button type="submit" className={cn('w-full')}>
                            {loading ? <Spinner /> : 'ذخیره'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
