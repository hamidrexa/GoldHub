'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/contexts/store';
import Spinner from '@/components/spinner';

export default function AppRedirectPage() {
    const { role, isUserLoading } = useGlobalContext();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && role) {
            if (role === 'admin') {
                router.replace('/admin');
            } else if (role.includes('supplier')) {
                router.replace('/supplier/products');
            } else if (role.includes('buyer')) {
                router.replace('/buyer/catalog');
            } else {
                router.replace('/');
            }
        }
    }, [role, isUserLoading, router]);

    return (
        <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center md:h-[calc(100vh-90px)]">
            <Spinner width={40} height={40} />
        </div>
    );
}
