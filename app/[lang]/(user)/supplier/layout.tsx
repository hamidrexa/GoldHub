'use client';

import { RoleGuard } from '@/components/role-guard';

export default function SupplierLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard requiredRole="supplier">
            {children}
        </RoleGuard>
    );
}
