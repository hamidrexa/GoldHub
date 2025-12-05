'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { mockAuditLogs, AuditLog } from '@/lib/mock-data';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AuditLogsClientProps {
    dict: any;
}

export default function AuditLogsClient({ dict }: AuditLogsClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [eventFilter, setEventFilter] = useState<string>('all');

    const getEventBadge = (event: AuditLog['event']) => {
        const badges = {
            login: { label: dict.marketplace.admin.auditLogsPage.events.login, className: 'bg-green-100 text-green-800 hover:bg-green-100' },
            logout: { label: dict.marketplace.admin.auditLogsPage.events.logout, className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
            order_created: { label: dict.marketplace.admin.auditLogsPage.events.orderCreated, className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
            kyc_submitted: { label: dict.marketplace.admin.auditLogsPage.events.kycSubmitted, className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
            kyc_approved: { label: dict.marketplace.admin.auditLogsPage.events.kycApproved, className: 'bg-green-100 text-green-800 hover:bg-green-100' },
            kyc_rejected: { label: dict.marketplace.admin.auditLogsPage.events.kycRejected, className: 'bg-red-100 text-red-800 hover:bg-red-100' },
        };
        const config = badges[event];
        return <Badge variant="default" className={config.className}>{config.label}</Badge>;
    };

    const filterLogs = (logs: AuditLog[]) => {
        let filtered = logs;

        // Filter by search
        if (searchQuery) {
            filtered = filtered.filter(log =>
                log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.ipAddress.includes(searchQuery) ||
                log.device.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by event type
        if (eventFilter !== 'all') {
            filtered = filtered.filter(log => log.event === eventFilter);
        }

        return filtered;
    };

    const filteredLogs = filterLogs(mockAuditLogs);
    const loginCount = mockAuditLogs.filter(l => l.event === 'login').length;
    const kycCount = mockAuditLogs.filter(l =>
        l.event === 'kyc_submitted' || l.event === 'kyc_approved' || l.event === 'kyc_rejected'
    ).length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.admin.auditLogsPage.title}</h1>
                <p className="text-muted-foreground">{dict.marketplace.admin.auditLogsPage.description}</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder={dict.marketplace.admin.auditLogsPage.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <Tabs value={eventFilter} onValueChange={setEventFilter} className="w-full">
                <TabsList className="bg-transparent border-b w-full justify-start rounded-none h-auto p-0 space-x-4">
                    <TabsTrigger
                        value="all"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                    >
                        {dict.marketplace.admin.auditLogsPage.tabs.all}
                    </TabsTrigger>
                    <TabsTrigger
                        value="login"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                    >
                        {dict.marketplace.admin.auditLogsPage.tabs.login} ({loginCount})
                    </TabsTrigger>
                    <TabsTrigger
                        value="kyc_submitted"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                    >
                        {dict.marketplace.admin.auditLogsPage.tabs.kyc} ({kycCount})
                    </TabsTrigger>
                    <TabsTrigger
                        value="order_created"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                    >
                        {dict.marketplace.admin.auditLogsPage.tabs.orders}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={eventFilter} className="mt-6">
                    <div className="rounded-lg border bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold">{dict.marketplace.admin.auditLogsPage.table.timestamp}</TableHead>
                                    <TableHead className="font-semibold">{dict.marketplace.admin.auditLogsPage.table.user}</TableHead>
                                    <TableHead className="font-semibold">{dict.marketplace.admin.auditLogsPage.table.event}</TableHead>
                                    <TableHead className="font-semibold">{dict.marketplace.admin.auditLogsPage.table.ipAddress}</TableHead>
                                    <TableHead className="font-semibold">{dict.marketplace.admin.auditLogsPage.table.device}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            {dict.marketplace.admin.auditLogsPage.table.noLogs}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <TableRow key={log.id} className="hover:bg-gray-50">
                                            <TableCell className="font-medium font-mono text-sm">{log.timestamp}</TableCell>
                                            <TableCell>{log.user}</TableCell>
                                            <TableCell>{getEventBadge(log.event)}</TableCell>
                                            <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{log.device}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border bg-white p-6">
                    <div className="text-sm text-muted-foreground mb-2">{dict.marketplace.admin.auditLogsPage.stats.totalEvents}</div>
                    <div className="text-3xl font-bold">{mockAuditLogs.length}</div>
                </div>
                <div className="rounded-lg border bg-white p-6">
                    <div className="text-sm text-muted-foreground mb-2">{dict.marketplace.admin.auditLogsPage.stats.loginEvents}</div>
                    <div className="text-3xl font-bold text-green-600">{loginCount}</div>
                </div>
                <div className="rounded-lg border bg-white p-6">
                    <div className="text-sm text-muted-foreground mb-2">{dict.marketplace.admin.auditLogsPage.stats.kycEvents}</div>
                    <div className="text-3xl font-bold text-yellow-600">{kycCount}</div>
                </div>
            </div>
        </div>
    );
}
