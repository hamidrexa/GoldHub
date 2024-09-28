'use client';

import React, { useEffect, useState } from 'react';
import { Message } from '@/components/message';
import { PackageOpenIcon } from 'lucide-react';
import { getGroupMessages } from '@/app/[lang]/(user)/group/services/getGroupMessages';

export function MessagesWrap({ dict, lang }) {
    const [isLoading, setIsLoading] = useState(true);
    const [messages, setMessages] = useState(null);

    useEffect(() => {
        async function loadGroupMessages() {
            setIsLoading(true);
            try {
                const messages = await getGroupMessages();
                setMessages([
                    ...messages.results.map((message: any) => ({
                        ...message,
                        market: 'tse',
                    })),
                ]);
            } catch (e) {}
            setIsLoading(false);
        }

        loadGroupMessages();
    }, []);

    if (isLoading)
        return (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {[1, 2, 3].map((item, index) => (
                    <div
                        key={index}
                        className="w-full animate-pulse rounded-lg bg-gray-200"
                        style={{ height: '689px' }}
                    />
                ))}
            </div>
        );
    if (!messages || !messages?.length)
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white p-6">
                <PackageOpenIcon strokeWidth={1.5} />
                <h1 className="text-base font-medium">{dict.emptyFeed}</h1>
            </div>
        );

    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {messages.map((message: any, index: number) => (
                <Message
                    key={message.id}
                    publisher={message.message.publisher}
                    message={message.message}
                    signal={message}
                    market={message.market}
                    dict={dict}
                    lang={lang}
                />
            ))}
        </div>
    );
}
