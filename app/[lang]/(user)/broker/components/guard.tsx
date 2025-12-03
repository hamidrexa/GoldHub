'use client';

import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '@/contexts/store';
import { useRouter } from 'next/navigation';
import { Locale } from '@/i18n-config';

export default function BrokerGuard({ children, lang }: { children: React.ReactNode; lang: Locale }) {
    const { user, isUserLoading } = useGlobalContext();
    const router = useRouter();
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        if (isUserLoading) return;
        const hasBroker = !!user?.groups?.some((g) => g?.name === 'broker');
        if (!user || !hasBroker) {
            router.replace(`/${lang}/profile`);
            return;
        }
        setAllowed(true);
    }, [user, isUserLoading, router, lang]);

    if (isUserLoading || !allowed) return null;
    return <>{children}</>;
}