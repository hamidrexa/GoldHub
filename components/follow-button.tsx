'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useGlobalContext } from '@/contexts/store';
import { Locale } from '@/i18n-config';
import { usePathname } from 'next/navigation';
import { LoginModal } from '@/components/login-modal';

export function FollowButton({
    dict,
    lang,
    defaultValue,
    name,
    id,
    type,
    typeId,
    render,
    onChange,
}: {
    dict: any;
    lang: Locale;
    defaultValue: any;
    name?: string;
    id: any;
    type: any;
    typeId: any;
    render: any;
    onChange?: any;
}) {
    const { user } = useGlobalContext();
    const [follow, setFollow] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const path = usePathname();

    useEffect(() => {
        setFollow(defaultValue);
    }, [defaultValue]);

    const handleBookmark = async (id, type, typeId) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/v2/bookmarks/`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
            body: JSON.stringify({
                object_id: id,
                title: type,
                content_type: typeId,
            }),
        });

        if (!res.ok) throw new Error(`Failed to fetch data ${url}`);

        return await res.json();
    };
    const handleUnbookmark = async (id) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/v2/bookmarks/${id}/`;
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
        });

        if (!res.ok) throw new Error(`Failed to fetch data ${url}`);

        return null;
    };

    return (
        <>
            <LoginModal
                lang={lang}
                dict={dict}
                texts={{
                    title: (
                        <>
                            دنبال کردن {name}
                            <br />
                            نیاز به اشتراک دارد.
                        </>
                    ),
                    description:
                        'با ثبت نام در طلانو، 7 روز رایگان از تمامی امکانات استفاده کنید.',
                    button: 'فعال سازی 7 روز رایگان',
                    buttonVariant: 'info',
                    inputLabel: 'ثبت نام سریع',
                }}
                open={openLoginModal}
                setOpen={setOpenLoginModal}
                redirectUrl={path}
            />
            <div
                className="flex items-center whitespace-nowrap"
                onClick={async (e) => {
                    e.stopPropagation();
                    if (!user) return setOpenLoginModal(true);

                    if (follow) {
                        setIsLoading(true);
                        const res = await handleUnbookmark(follow.id);
                        setIsLoading(false);
                        setFollow(res);
                        if (onChange) onChange(follow);
                    } else {
                        setIsLoading(true);
                        const res = await handleBookmark(id, type, typeId);
                        setIsLoading(false);
                        setFollow(res);
                        if (onChange) onChange(follow);
                    }
                }}
            >
                {render(isLoading, follow)}
            </div>
        </>
    );
}
