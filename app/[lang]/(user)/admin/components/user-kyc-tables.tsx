'use client';

import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHead,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { SmartPagination } from '@/components/ui/pagination';
import { useUsersKYCData } from '@/app/[lang]/(user)/admin/services/use-users-kyc';
import { KycDialog } from '@/app/[lang]/(user)/admin/users-kyc/kyc-dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

function KycBadge({ status, dict }: { status: string; dict: any }) {
    const badges: Record<string, { label: string; className: string }> = {
        approved: {
            label: dict.marketplace.admin.usersKycPage.status.approved,
            className: 'bg-green-100 text-green-800',
        },
        pending: {
            label: dict.marketplace.admin.usersKycPage.status.pendingReview,
            className: 'bg-yellow-100 text-yellow-800',
        },
        rejected: {
            label: dict.marketplace.admin.usersKycPage.status.rejected,
            className: 'bg-red-100 text-red-800',
        },
        not_submitted: {
            label: dict.marketplace.admin.usersKycPage.status.notSubmitted,
            className: 'bg-gray-100 text-gray-800',
        },
    };
    const config = badges[status] || badges.not_submitted;
    return <Badge className={config.className}>{config.label}</Badge>;
}

function RoleBadge({ role, status }: { role: string; status: string }) {
    const colors: Record<string, string> = {
        requested: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
    };
    return (
        <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
            {role}
        </Badge>
    );
}

interface UsersKycTableProps {
    dict: any;
    lang: string;
    searchQuery?: string;
    activeTab?: string;
    showKycStatusColumn?: boolean;
    showSubmittedColumn?: boolean;
    showApprovedColumn?: boolean;
}

export function UsersKycTable({
    dict,
    lang,
    searchQuery = '',
    activeTab = 'all',
    showKycStatusColumn = true,
    showSubmittedColumn = false,
    showApprovedColumn = false,
}: UsersKycTableProps) {
    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(10);
    const { users, count, isLoading, error, mutate } = useUsersKYCData(
        page,
        pageSize
    );
    const totalPages = Math.ceil((count || 0) / pageSize);
    const [selectedUser, setSelectedUser] = React.useState<any>(null);

    if (isLoading) return <p className="py-8 text-center">Loading...</p>;
    if (error)
        return (
            <p className="py-8 text-center text-red-600">Error loading users</p>
        );

    // Normalize API -> UI columns
    const mappedUsers = users.map((user: any) => ({
        id: user.id,
        name: user.username,
        email: user.email ?? '-',
        company: user.company ?? '-',
        roles: user.groups ?? [],
        kycStatus: (() => {
            const groups = user.groups || [];
            if (groups.some((g) => g.status === 'requested')) return 'pending';
            if (
                groups.every((g) => g.status === 'approved') &&
                groups.length > 0
            )
                return 'approved';
            if (groups.some((g) => g.status === 'rejected')) return 'rejected';
            return 'not_submitted';
        })(),
        joinedDate: user.joined_at ?? user.created_at ?? new Date(),
    }));

    // Search filter
    let filteredUsers = mappedUsers;
    if (searchQuery) {
        filteredUsers = filteredUsers.filter(
            (u) =>
                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.company.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Tab filtering
    if (activeTab === 'pending') {
        filteredUsers = filteredUsers.filter((u) => u.kycStatus === 'pending');
    } else if (activeTab === 'approved') {
        filteredUsers = filteredUsers.filter((u) => u.kycStatus === 'approved');
    }

    return (
        <>
            <div className="bg-card rounded-lg border shadow-sm">
                <div className="w-full max-w-[calc(100vw-3rem)] overflow-x-auto">
                    <Table className="min-w-[700px]">
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="bg-card sticky left-0 z-20 font-semibold shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                    {
                                        dict.marketplace.admin.usersKycPage
                                            .table.name
                                    }
                                </TableHead>
                                <TableHead className="font-semibold">
                                    {
                                        dict.marketplace.admin.usersKycPage
                                            .table.email
                                    }
                                </TableHead>
                                <TableHead className="font-semibold">
                                    {
                                        dict.marketplace.admin.usersKycPage
                                            .table.company
                                    }
                                </TableHead>
                                <TableHead className="font-semibold">
                                    {
                                        dict.marketplace.admin.usersKycPage
                                            .table.role
                                    }
                                </TableHead>

                                {showKycStatusColumn && (
                                    <TableHead className="font-semibold">
                                        {
                                            dict.marketplace.admin.usersKycPage
                                                .table.kycStatus
                                        }
                                    </TableHead>
                                )}

                                {showSubmittedColumn && (
                                    <TableHead className="font-semibold">
                                        {
                                            dict.marketplace.admin.usersKycPage
                                                .table.submitted
                                        }
                                    </TableHead>
                                )}

                                {showApprovedColumn && (
                                    <TableHead className="font-semibold">
                                        {
                                            dict.marketplace.admin.usersKycPage
                                                .table.approved
                                        }
                                    </TableHead>
                                )}

                                {!showSubmittedColumn &&
                                    !showApprovedColumn && (
                                        <TableHead className="font-semibold">
                                            {
                                                dict.marketplace.admin
                                                    .usersKycPage.table.joined
                                            }
                                        </TableHead>
                                    )}

                                <TableHead className="text-right font-semibold">
                                    {
                                        dict.marketplace.admin.usersKycPage
                                            .table.actions
                                    }
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-muted-foreground py-8 text-center"
                                    >
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow
                                        key={user.id}
                                        className="hover:bg-gray-50"
                                    >
                                        {/* Sticky first column */}
                                        <TableCell className="bg-card sticky left-0 z-10 font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                            {user.name}
                                        </TableCell>

                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.company?.name}</TableCell>

                                        <TableCell className="flex gap-1">
                                            {user.roles.map(
                                                (r: any, idx: number) => (
                                                    <RoleBadge
                                                        key={idx}
                                                        role={r.role}
                                                        status={r.status}
                                                    />
                                                )
                                            )}
                                        </TableCell>

                                        {showKycStatusColumn && (
                                            <TableCell>
                                                <KycBadge
                                                    status={user.kycStatus}
                                                    dict={dict}
                                                />
                                            </TableCell>
                                        )}

                                        {/* Joined Date */}
                                        <TableCell>
                                            {new Date(
                                                user.joinedDate
                                            ).toLocaleDateString()}
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        setSelectedUser(user)
                                                    }
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
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
            </div>
            <div className="flex flex-col items-center justify-between gap-4 border-t px-4 py-4 sm:flex-row">
                <div className="flex items-center gap-2">
                    <p className="text-muted-foreground text-sm whitespace-nowrap">
                        {dict?.common?.rowsPerPage || 'Rows per page'}
                    </p>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => {
                            setPageSize(Number(value));
                            setPage(0);
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[5, 10, 20, 50].map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex-1">
                    <SmartPagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        dict={dict}
                    />
                </div>

                <div className="hidden text-sm text-muted-foreground sm:block">
                    {dict?.common?.pageOf
                        ?.replace('{current}', String(page + 1))
                        .replace('{total}', String(totalPages)) ||
                        `Page ${page + 1} of ${totalPages}`}
                </div>
            </div>

            {/* KYC Dialog */}
            {!!selectedUser && (
                <KycDialog
                    mutate={mutate}
                    user={selectedUser}
                    dict={dict}
                    lang={lang}
                    activeTab={activeTab}
                    searchQuery={searchQuery}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </>
    );
}
