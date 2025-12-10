'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import { useUsersKYCData } from '@/app/[lang]/(user)/admin/services/use-users-kyc';
import { KycDialog } from '@/app/[lang]/(user)/admin/users-kyc/kyc-dialog';


function KycBadge({ status, dict }: { status: string; dict: any }) {
    const badges: Record<string, { label: string; className: string }> = {
        approved: { label: dict.marketplace.admin.usersKycPage.status.approved, className: 'bg-green-100 text-green-800' },
        pending: { label: dict.marketplace.admin.usersKycPage.status.pendingReview, className: 'bg-yellow-100 text-yellow-800' },
        rejected: { label: dict.marketplace.admin.usersKycPage.status.rejected, className: 'bg-red-100 text-red-800' },
        not_submitted: { label: dict.marketplace.admin.usersKycPage.status.notSubmitted, className: 'bg-gray-100 text-gray-800' },
    };
    const config = badges[status] || badges.not_submitted;
    return <Badge variant="default" className={config.className}>{config.label}</Badge>;
}

function RoleBadge({ role, status }: { role: string; status: string }) {
    const colors: Record<string, string> = {
        requested: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
    };
    return <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>{role}</Badge>;
}

interface UsersKycTableProps {
    dict: any;
    searchQuery?: string;
    activeTab?: string;
}

export function UsersKycTable({ dict, searchQuery = '', activeTab = 'all' }: UsersKycTableProps) {
    const { users, isLoading, error } = useUsersKYCData();
    const [selectedUser, setSelectedUser] = React.useState<any>(null);

    if (isLoading) return <p className="py-8 text-center">Loading...</p>;
    if (error) return <p className="py-8 text-center text-red-600">Error loading users</p>;

    // Map API response to display format
    const mappedUsers = users.map((user: any) => ({
        id: user.id,
        username: user.username,
        companyName: user.company?.name,
        roles: user.groups.map((g: any) => ({ role: g.role, status: g.status })),
        kycStatus: (() => {
            if (!user.groups || user.groups.length === 0) return 'not_submitted';
            if (user.groups.some((g: any) => g.status === 'requested')) return 'pending';
            if (user.groups.every((g: any) => g.status === 'approved')) return 'approved';
            if (user.groups.some((g: any) => g.status === 'rejected')) return 'rejected';
            return 'not_submitted';
        })(),
    }));

    // Filter by search
    let filteredUsers = mappedUsers;
    if (searchQuery) {
        filteredUsers = filteredUsers.filter(user =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.companyName && user.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }

    // Filter by active tab
    if (activeTab === 'pending') {
        filteredUsers = filteredUsers.filter(u => u.kycStatus === 'pending');
    } else if (activeTab === 'approved') {
        filteredUsers = filteredUsers.filter(u => u.kycStatus === 'approved');
    }

    return (
        <div className="space-y-6">
            {/* Table */}
            <div className="rounded-lg border bg-white overflow-x-auto">
                <Table className="min-w-[700px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.name}</TableHead>
                            <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.email}</TableHead>
                            <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.company}</TableHead>
                            <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.roles}</TableHead>
                            <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.kycStatus}</TableHead>
                            <TableHead className="font-semibold text-right">{dict.marketplace.admin.usersKycPage.table.actions}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No users found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map(user => (
                                <TableRow key={user.id} className="hover:bg-gray-50">
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>-</TableCell>
                                    <TableCell>{user.companyName || '-'}</TableCell>
                                    <TableCell className="flex gap-1">
                                        {user.roles.map((r, idx) => (
                                            <RoleBadge key={idx} role={r.role} status={r.status} />
                                        ))}
                                    </TableCell>
                                    <TableCell><KycBadge status={user.kycStatus} dict={dict} /></TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100"
                                            >
                                                <Eye className="h-4 w-4 text-gray-600" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* KYC Dialog */}
            {selectedUser && (
                <KycDialog
                    user={selectedUser}
                    dict={dict}
                    lang="en"
                    activeTab={activeTab}
                    searchQuery={searchQuery}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </div>
    );
}
