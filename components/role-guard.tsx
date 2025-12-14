'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/contexts/store';
import Spinner from '@/components/spinner';

interface RoleGuardProps {
    children: React.ReactNode;
    requiredRole: 'admin' | 'supplier' | 'buyer';
    fallbackPath?: string;
}

export function RoleGuard({ children, requiredRole, fallbackPath = '/profile' }: RoleGuardProps) {
    const router = useRouter();
    const { user, isUserLoading } = useGlobalContext();

    useEffect(() => {
        if (isUserLoading || !user) {
            return;
        }

        const userGroups = user.groups ?? [];
        const roleNames = userGroups.map((g) => g?.name || '');

        const hasAccess = (() => {
            switch (requiredRole) {
                case 'admin':
                    return roleNames.includes('admin');
                case 'supplier':
                    return roleNames.some((name) => name?.includes('supplier'));
                case 'buyer':
                    return true; // Buyer routes are open to all users
                default:
                    return false;
            }
        })();

        if (!hasAccess) {
            router.push(fallbackPath);
        }
    }, [user, isUserLoading, requiredRole, router, fallbackPath]);

    if (isUserLoading || !user) {
        return (
            <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center md:h-[calc(100vh-90px)]">
                <Spinner width={40} height={40} />
            </div>
        );
    }

    const userGroups = user.groups ?? [];
    const roleNames = userGroups.map((g) => g?.name || '');

    const hasAccess = (() => {
        switch (requiredRole) {
            case 'admin':
                return roleNames.includes('admin');
            case 'supplier':
                return roleNames.some((name) => name?.includes('supplier'));
            case 'buyer':
                return true; // Buyer routes are open to all users
            default:
                return false;
        }
    })();

    if (!hasAccess) {
        return (
            <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center md:h-[calc(100vh-90px)]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
                    <p className="text-sm text-gray-500">Redirecting to profile...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
