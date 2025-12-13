'use client';

import { Badge } from '@/components/ui/badge';
import React, { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import Cookies from 'js-cookie';
import { useGlobalContext } from '@/contexts/store';
import { toast } from 'sonner';
import { usePathname, useRouter } from 'next/navigation';

export function AddToDashboard({
    id,
    assetId,
    market,
    type = 'box',
    dict,
}: {
    id: string;
    assetId: string;
    market: string;
    type?: string;
    dict: any;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [bookmarkId, setBookmarkId] = useState(null);
    const { user } = useGlobalContext();
    const router = useRouter();
    const path = usePathname();

    useEffect(() => {
        isBookmarked();
    }, []);

    const bookmark = async () => {
        setIsLoading(true);
        let url = `${process.env.NEXT_PUBLIC_API_URL}/v2/bookmarks/`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
            body: JSON.stringify({
                title: market === 'tse' ? 'ticker' : 'crypto',
                content_type: market === 'tse' ? 9 : 68,
                object_id: assetId,
            }),
        });
        if (!res.ok) throw new Error(`Failed to fetch data ${url}`);
        const data = await res.json();
        setBookmarkId(data.id);
        setIsLoading(false);
    };
    const unBookmark = async () => {
        setIsLoading(true);
        let url = `${process.env.NEXT_PUBLIC_API_URL}/v2/bookmarks/${bookmarkId}/`;
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
        });
        if (!res.ok) throw new Error(`Failed to fetch data ${url}`);
        setBookmarkId(null);
        setIsLoading(false);
    };
    const isBookmarked = async () => {
        setIsLoading(true);
        let url =
            market === 'tse'
                ? `${process.env.NEXT_PUBLIC_API_URL}/v2/core/tickers/${id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/v1/cryptocurrencies/${id}`;
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
        });
        if (!res.ok) throw new Error(`Failed to fetch data ${url}`);
        const data = await res.json();
        setBookmarkId(data.bookmarked_by_user?.id);
        setIsLoading(false);
    };
    const onSubmit = async () => {
        if (isLoading) return;
        if (!user)
            return toast.info(dict.loginPrompt, {
                action: {
                    label: dict.login,
                    onClick: () => router.push(`/login?url=${path}`),
                },
            });
        if (!user.active_plan?.is_active) return toast(dict.subscriptionPrompt);
        if (!bookmarkId) bookmark();
        else unBookmark();
    };

    return type === 'badge' ? (
        <Badge
            onClick={onSubmit}
            className="cursor-pointer gap-1.5"
            variant={bookmarkId ? 'light' : 'outline-blue'}
            size="md"
        >
            <svg
                className="h-4 w-4 md:h-6 md:w-6"
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M11.4919 7.50001C11.9987 9.87439 13.125 10.625 13.125 10.625H1.875C1.875 10.625 3.75 9.37501 3.75 5.00001C3.75001 4.45467 3.86896 3.91589 4.09856 3.42123C4.32816 2.92658 4.66289 2.48795 5.0794 2.13594C5.49592 1.78392 5.9842 1.52699 6.51021 1.38304C7.03621 1.2391 7.58728 1.21162 8.125 1.30251"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M8.58047 13.125C8.47059 13.3144 8.31287 13.4717 8.12311 13.581C7.93335 13.6903 7.71821 13.7478 7.49922 13.7478C7.28023 13.7478 7.06509 13.6903 6.87533 13.581C6.68557 13.4717 6.52785 13.3144 6.41797 13.125"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M11.25 1.25V5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M13.125 3.125H9.375"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <span>{bookmarkId ? dict.addedDashboard : dict.addDashboard}</span>
        </Badge>
    ) : (
        <div className="flex items-center justify-between gap-2.5 self-stretch py-0">
            <div className="flex items-center justify-start gap-3.5 font-extrabold">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M13.7902 9C14.3985 11.8493 15.75 12.75 15.75 12.75H2.25C2.25 12.75 4.5 11.25 4.5 6C4.50001 5.34559 4.64275 4.69905 4.91827 4.10546C5.19379 3.51188 5.59547 2.98553 6.09529 2.56311C6.5951 2.14069 7.18104 1.83237 7.81225 1.65964C8.44345 1.48691 9.10474 1.45393 9.75 1.563"
                            stroke="#0C0E3C"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M10.2981 15.75C10.1663 15.9773 9.97701 16.166 9.74929 16.2971C9.52158 16.4283 9.26341 16.4973 9.00062 16.4973C8.73784 16.4973 8.47967 16.4283 8.25196 16.2971C8.02424 16.166 7.83498 15.9773 7.70312 15.75"
                            stroke="#0C0E3C"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M13.5 1.5V6"
                            stroke="#0C0E3C"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M15.75 3.75H11.25"
                            stroke="#0C0E3C"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
                {dict.addToDashboard}
            </div>
            <div>
                <Switch
                    disabled={isLoading}
                    checked={!!bookmarkId}
                    onCheckedChange={onSubmit}
                />
            </div>
        </div>
    );
}
