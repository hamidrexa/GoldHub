'use client';

import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '@/contexts/store';
import { useRouter } from 'next/navigation';
import { Locale } from '@/i18n-config';

export default function AdminGuard({ children, lang }: { children: React.ReactNode; lang: Locale }) {
    const { user, isUserLoading } = useGlobalContext();
    const router = useRouter();
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        if (isUserLoading) return;
        const hasAdmin = !!user?.groups?.some((g) => g?.name === 'admin');
        if (!user || !hasAdmin) {
            router.replace(`/${lang}/profile`);
            return;
        }
        setAllowed(true);
    }, [user, isUserLoading, router, lang]);

    if (isUserLoading || !allowed) return null;
    return <>{children}</>;
}




