'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useGlobalContext } from '@/contexts/store';
import Cookies from 'js-cookie';
import { LoginModal } from '@/components/login-modal';

export function PayWall({ dict, lang }) {
    const { user, isUserLoading } = useGlobalContext();
    const path = usePathname();
    const router = useRouter();
    const [show, setShow] = useState(false);

    useEffect(() => {
        const history: any[] = Cookies.get('routeHistory')
            ? JSON.parse(Cookies.get('routeHistory'))
            : [];
        if (
            (!path.includes('/pricing') &&
                !path.includes('/login') &&
                !path.includes('/privacy') &&
                !path.includes('/profile') &&
                !path.includes('/notifications')) ||
            !path.includes('/about') ||
            !path.includes('/feed') ||
            path !== '/'
        )
            Cookies.set(
                'routeHistory',
                JSON.stringify(Array.from(new Set([...history, path]))),
                {
                    expires: 1,
                }
            );

        if (
            history.length >= 2 &&
            !isUserLoading &&
            !user?.active_plan?.is_active
        )
            setShow(true);
    }, [path, isUserLoading]);

    if (
        !show ||
        path.includes('/pricing') ||
        path.includes('/finochat') ||
        path.includes('/login') ||
        path.includes('/privacy') ||
        path.includes('/profile') ||
        path.includes('/notifications') ||
        path.includes('/about') ||
        path.includes('/feed') ||
        path === '/'
    )
        return;

    return (
        !user && (
            <LoginModal
                lang={lang}
                dict={dict}
                texts={{
                    title: 'شما به محدودیت روزانه ۳ صفحه از سایت برخورد کرده اید',
                    description:
                        'با ثبت نام در طلانو، 7 روز اشتراک رایگان هدیه بگیرید.',
                    button: dict.traderLoginModal.button,
                    buttonVariant: 'info',
                    inputLabel: dict.traderLoginModal.inputLabel,
                }}
                open={show}
                setOpen={(open) => {
                    if (!open) router.replace('/');
                }}
                redirectUrl={path}
            />
        )
    );
}
