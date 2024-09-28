import { cn, convertDateToHumanTime, removeHtmlTags } from '@/libs/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import React, { useState } from 'react';
import { setNotificationReadState } from '@/app/[lang]/(user)/notifications/services/setNotificationReadState';

export function Notification({ dict, lang, notification, onClick }) {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
        if (notification.state === 'unread')
            setNotificationReadState(notification.id);
    };

    return (
        <>
            <div
                className={cn(
                    'relative flex w-full cursor-pointer gap-4 rounded-md border p-4 text-neutral-800 shadow-md outline-none',
                    notification.state === 'unread'
                        ? 'bg-white before:absolute before:top-1/2 before:-translate-y-1/2 before:h-[calc(100%-20px)] before:w-0.5 before:rounded-full before:bg-neutral-300 ltr:before:left-1.5 rtl:before:right-1.5'
                        : 'bg-gray-50'
                )}
                onClick={handleClick}
            >
                <Avatar>
                    <AvatarImage src="/img/logo.png" />
                    <AvatarFallback>SH</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <h4
                        className={cn('text-base', {
                            'font-bold': notification.state === 'unread',
                        })}
                    >
                        {notification.title}
                    </h4>
                    <p className="text-sm">
                        {removeHtmlTags(notification.message)}
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                        <CalendarDays className="h-4 w-4 opacity-70" />{' '}
                        <span className="text-sm">
                            {convertDateToHumanTime(
                                dict,
                                lang,
                                notification.created
                            )}
                        </span>
                    </div>
                </div>
            </div>
            <Dialog
                open={open}
                onOpenChange={(open) => {
                    setOpen(open);
                    if (!open) onClick();
                }}
            >
                <DialogContent className="w-full max-w-[425px]">
                    <Avatar>
                        <AvatarImage src="/img/logo.png" />
                        <AvatarFallback>SH</AvatarFallback>
                    </Avatar>
                    <h4 className="text-base font-bold">
                        {notification.title}
                    </h4>
                    <p
                        className="text-sm rendered-html"
                        dangerouslySetInnerHTML={{
                            __html: notification.message,
                        }}
                    />
                    <div className="flex items-center gap-2 pt-2">
                        <CalendarDays className="h-4 w-4 opacity-70" />{' '}
                        <span className="text-sm">
                            {convertDateToHumanTime(
                                dict,
                                lang,
                                notification.created
                            )}
                        </span>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
