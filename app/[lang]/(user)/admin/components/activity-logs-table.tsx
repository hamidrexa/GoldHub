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
import { useActivityLogs } from '@/app/[lang]/(user)/admin/services/use-activity-logs';
import { AuditLog } from '@/lib/mock-data';

function RoleBadge({ role, status }: { role: string; status: string }) {
    const statusColors: Record<string, string> = {
        requested: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
    };
    return (
        <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
            {role}
        </Badge>
    );
}

function EventBadge({ event, dict }: { event: string; dict: any }) {
    const badges = {
        login: {
            label: dict.marketplace.admin.auditLogsPage.events.login,
            className: 'bg-green-100 text-green-800 hover:bg-green-100',
        },
        logout: {
            label: dict.marketplace.admin.auditLogsPage.events.logout,
            className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
        },
        order_created: {
            label: dict.marketplace.admin.auditLogsPage.events.orderCreated,
            className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
        },
        kyc_submitted: {
            label: dict.marketplace.admin.auditLogsPage.events.kycSubmitted,
            className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
        },
        kyc_approved: {
            label: dict.marketplace.admin.auditLogsPage.events.kycApproved,
            className: 'bg-green-100 text-green-800 hover:bg-green-100',
        },
        kyc_rejected: {
            label: dict.marketplace.admin.auditLogsPage.events.kycRejected,
            className: 'bg-red-100 text-red-800 hover:bg-red-100',
        },
    };
    const config = badges[event]
    return (
        <Badge variant="default" className={config.className}>
            {config.label }
        </Badge>
    );
}

interface ActivityLogsTableProps {
    searchQuery?: string;
    eventFilter?: string;
    dict: any;
}

export function ActivityLogsTable({
    searchQuery = '',
    eventFilter = 'all',
    dict,
}: ActivityLogsTableProps) {
    const { logs, isLoading, error } = useActivityLogs();

    if (isLoading) return <p className="py-8 text-center">Loading...</p>;
    if (error)
        return (
            <p className="py-8 text-center text-red-600">Error loading logs</p>
        );

    // Normalize API structure
    const mappedLogs = logs.map((log: any) => ({
        timestamp: log.timestamp,
        activity_type: log.activity_type,
        username: log.user?.username ?? 'Unknown',
        roles:
            log.user?.groups?.map((g: any) => ({
                role: g.role,
                status: g.status,
            })) ?? [],
    }));

    // Client-side filtering
    let filteredLogs = mappedLogs;
    if (searchQuery) {
        filteredLogs = filteredLogs.filter(
            (log) =>
                log.username
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                log.roles.some((r: any) =>
                    r.role.toLowerCase().includes(searchQuery.toLowerCase())
                )
        );
    }
    if (eventFilter !== 'all') {
        filteredLogs = filteredLogs.filter((log) =>
            log.roles.some((r) => r.role === eventFilter)
        );
    }

    return (
        <div className="bg-card rounded-lg border shadow-sm">
            <div className="w-full max-w-[calc(100vw-3rem)] overflow-x-auto">
                <Table className="min-w-[700px]">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="bg-card sticky left-0 z-20 font-semibold shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                {
                                    dict.marketplace.admin.auditLogsPage.table
                                        .timestamp
                                }
                            </TableHead>
                            <TableHead className="font-semibold">
                                {
                                    dict.marketplace.admin.auditLogsPage.table
                                        .user
                                }
                            </TableHead>
                            <TableHead className="font-semibold">
                                {
                                    dict.marketplace.admin.auditLogsPage.table
                                        .event
                                }
                            </TableHead>
                            <TableHead className="font-semibold">
                                {
                                    dict.marketplace.admin.auditLogsPage.table
                                        .roles
                                }
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredLogs.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={3}
                                    className="text-muted-foreground py-8 text-center"
                                >
                                    {
                                        dict.marketplace.admin.auditLogsPage
                                            .table.noLogs
                                    }
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredLogs.map((log: any, index: number) => (
                                <TableRow
                                    key={index}
                                    className="hover:bg-gray-50"
                                >
                                    <TableCell className="bg-card sticky left-0 z-10 font-mono text-sm font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                        {new Date(
                                            log.timestamp
                                        ).toLocaleString()}
                                    </TableCell>

                                    <TableCell>{log.username}</TableCell>
                                    <TableCell>
                                        {EventBadge({
                                            event: log.activity_type,
                                            dict: dict,
                                        })}
                                    </TableCell>

                                    <TableCell className="flex gap-1">
                                        {log.roles.map(
                                            (r: any, idx: number) => (
                                                <RoleBadge
                                                    key={idx}
                                                    role={r.role}
                                                    status={r.status}
                                                />
                                            )
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
