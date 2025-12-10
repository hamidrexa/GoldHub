'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useActivityLogs } from '@/app/[lang]/(user)/admin/services/use-activity-logs';

function RoleBadge({ role, status }: { role: string; status: string }) {
    const statusColors: Record<string, string> = {
        requested: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
    };
    return <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>{role}</Badge>;
}

interface ActivityLogsTableProps {
    searchQuery?: string;
    eventFilter?: string;
    dict: any;
}

export function ActivityLogsTable({ searchQuery = '', eventFilter = 'all', dict }: ActivityLogsTableProps) {
    const { logs, isLoading, error } = useActivityLogs();

    if (isLoading) return <p className="py-8 text-center">Loading...</p>;
    if (error) return <p className="py-8 text-center text-red-600">Error loading logs</p>;

    // Map logs to flattened structure
    const mappedLogs = logs.map((log: any) => ({
        timestamp: log.timestamp,
        username: log.user?.username ?? 'Unknown',
        roles: log.user?.groups?.map((g: any) => ({ role: g.role, status: g.status })) ?? [],
    }));

    // Client-side filtering
    let filteredLogs = mappedLogs;
    if (searchQuery) {
        filteredLogs = filteredLogs.filter(
            log =>
                log.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.roles.some((r: any) => r.role.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }
    if (eventFilter !== 'all') {
        filteredLogs = filteredLogs.filter(log => log.roles.some(r => r.role === eventFilter));
    }

    return (
        <div className="rounded-lg border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{dict.marketplace.admin.auditLogsPage.table.timestamp}</TableHead>
                        <TableHead>{dict.marketplace.admin.auditLogsPage.table.user}</TableHead>
                        <TableHead>{dict.marketplace.admin.auditLogsPage.table.roles}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredLogs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                {dict.marketplace.admin.auditLogsPage.table.noLogs}
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredLogs.map((log: any, index: number) => (
                            <TableRow key={index}>
                                <TableCell className="font-mono text-sm">{new Date(log.timestamp).toLocaleString()}</TableCell>
                                <TableCell>{log.username}</TableCell>
                                <TableCell className="flex gap-1">
                                    {log.roles.map((r: any, idx: number) => (
                                        <RoleBadge key={idx} role={r.role} status={r.status} />
                                    ))}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
