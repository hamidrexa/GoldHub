'use client';

import React from 'react';
import { useNotifications } from '@/app/[lang]/(user)/notifications/services/useNotifications';
import dayjs from 'dayjs';
import { Notification } from '@/app/[lang]/(user)/notifications/components/notification';
import { Skeleton } from '@/components/ui/skeleton';
import { useGlobalContext } from '@/contexts/store';

export function NotificationsWrap({ dict, lang }) {
    const { user } = useGlobalContext();
    const { notifications, isLoading, mutate } = useNotifications(!!user);

    return (
        <div className="flex flex-col gap-4">
            {}
            {isLoading && (
                <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((_, index) => (
                        <Skeleton key={index} className="h-[114px] w-full" />
                    ))}
                </div>
            )}
            {notifications
                .filter((notification) => {
                    const originalDate = dayjs(notification.created);
                    const currentDate = dayjs();
                    const differenceInDays = currentDate.diff(
                        originalDate,
                        'day'
                    );
                    return differenceInDays <= 10;
                })
                .map((notification, index) => (
                    <Notification
                        key={notification.id}
                        notification={notification}
                        dict={dict}
                        lang={lang}
                        onClick={mutate}
                    />
                ))}
        </div>
    );
}
