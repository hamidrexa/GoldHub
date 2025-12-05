'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Eye, CheckCircle, XCircle, Upload } from 'lucide-react';
import { mockUsers, User } from '@/lib/mock-data';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UsersKycClientProps {
    dict: any;
}

export default function UsersKycClient({ dict }: UsersKycClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showKycDialog, setShowKycDialog] = useState(false);

    const getKycBadge = (status: User['kycStatus']) => {
        const badges = {
            approved: { variant: 'default' as const, label: dict.marketplace.admin.usersKycPage.status.approved, className: 'bg-green-100 text-green-800 hover:bg-green-100' },
            pending: { variant: 'default' as const, label: dict.marketplace.admin.usersKycPage.status.pendingReview, className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
            rejected: { variant: 'default' as const, label: dict.marketplace.admin.usersKycPage.status.rejected, className: 'bg-red-100 text-red-800 hover:bg-red-100' },
            not_submitted: { variant: 'default' as const, label: dict.marketplace.admin.usersKycPage.status.notSubmitted, className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
        };
        const config = badges[status];
        return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
    };

    const getRoleBadge = (role: User['role']) => {
        const colors = {
            admin: 'bg-red-100 text-red-800',
            supplier: 'bg-blue-100 text-blue-800',
            retailer: 'bg-purple-100 text-purple-800',
        };
        return <Badge variant="default" className={`${colors[role]} hover:${colors[role]}`}>{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>;
    };

    const filteredUsers = mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.companyName && user.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const pendingCount = mockUsers.filter(u => u.kycStatus === 'pending').length;

    const handleViewKyc = (user: User) => {
        setSelectedUser(user);
        setShowKycDialog(true);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{dict.marketplace.admin.usersKycPage.title}</h1>
                <p className="text-muted-foreground">{dict.marketplace.admin.usersKycPage.description}</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder={dict.marketplace.admin.usersKycPage.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-transparent border-b w-full justify-start rounded-none h-auto p-0 space-x-4">
                    <TabsTrigger
                        value="all"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                    >
                        {dict.marketplace.admin.usersKycPage.tabs.all}
                    </TabsTrigger>
                    <TabsTrigger
                        value="pending"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                    >
                        {dict.marketplace.admin.usersKycPage.tabs.pending} ({pendingCount})
                    </TabsTrigger>
                    <TabsTrigger
                        value="approved"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                    >
                        {dict.marketplace.admin.usersKycPage.tabs.approved}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                    <div className="rounded-lg border bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.name}</TableHead>
                                    <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.email}</TableHead>
                                    <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.company}</TableHead>
                                    <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.role}</TableHead>
                                    <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.kycStatus}</TableHead>
                                    <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.joined}</TableHead>
                                    <TableHead className="font-semibold text-right">{dict.marketplace.admin.usersKycPage.table.actions}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.companyName || '-'}</TableCell>
                                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                                        <TableCell>{getKycBadge(user.kycStatus)}</TableCell>
                                        <TableCell>{new Date(user.joinedDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleViewKyc(user)}
                                                >
                                                    <Eye className="h-4 w-4 text-gray-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="pending" className="mt-6">
                    <div className="rounded-lg border bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.name}</TableHead>
                                    <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.email}</TableHead>
                                    <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.company}</TableHead>
                                    <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.role}</TableHead>
                                    <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.submitted}</TableHead>
                                    <TableHead className="font-semibold text-right">{dict.marketplace.admin.usersKycPage.table.actions}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.filter(u => u.kycStatus === 'pending').map((user) => (
                                    <TableRow key={user.id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.companyName || '-'}</TableCell>
                                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                                        <TableCell>{new Date(user.joinedDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleViewKyc(user)}
                                                >
                                                    <Eye className="h-4 w-4 text-gray-600" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <XCircle className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="approved" className="mt-6">
                    <div className="rounded-lg border bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.name}</TableHead>
                                    <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.email}</TableHead>
                                    <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.company}</TableHead>
                                    <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.role}</TableHead>
                                    <TableHead className="font-semibold">{dict.marketplace.admin.usersKycPage.table.approved}</TableHead>
                                    <TableHead className="font-semibold text-right">{dict.marketplace.admin.usersKycPage.table.actions}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.filter(u => u.kycStatus === 'approved').map((user) => (
                                    <TableRow key={user.id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.companyName || '-'}</TableCell>
                                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                                        <TableCell>{new Date(user.joinedDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleViewKyc(user)}
                                                >
                                                    <Eye className="h-4 w-4 text-gray-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>

            <Dialog open={showKycDialog} onOpenChange={setShowKycDialog}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{dict.marketplace.admin.usersKycPage.dialog.title} - {selectedUser?.name}</DialogTitle>
                        <DialogDescription>
                            {dict.marketplace.admin.usersKycPage.dialog.description} {selectedUser?.companyName}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedUser && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">{dict.marketplace.admin.usersKycPage.dialog.companyInfo}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label className="text-sm text-muted-foreground">{dict.marketplace.admin.usersKycPage.dialog.companyName}</Label>
                                        <p className="font-medium">{selectedUser.companyName || dict.marketplace.admin.usersKycPage.dialog.notProvided}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-muted-foreground">{dict.marketplace.admin.usersKycPage.table.role}</Label>
                                        <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">{dict.marketplace.admin.usersKycPage.dialog.bankingInfo}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label className="text-sm text-muted-foreground">{dict.marketplace.admin.usersKycPage.dialog.iban}</Label>
                                        <p className="font-medium font-mono">{selectedUser.iban || dict.marketplace.admin.usersKycPage.dialog.notProvided}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm text-muted-foreground">{dict.marketplace.admin.usersKycPage.dialog.swift}</Label>
                                        <p className="font-medium font-mono">{selectedUser.swift || dict.marketplace.admin.usersKycPage.dialog.notProvided}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">{dict.marketplace.admin.usersKycPage.dialog.documents}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {selectedUser.documentsUploaded ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <Upload className="h-5 w-5 text-blue-600" />
                                                    <div>
                                                        <p className="font-medium text-sm">{dict.marketplace.admin.usersKycPage.dialog.businessRegistration}</p>
                                                        <p className="text-xs text-muted-foreground">{dict.marketplace.admin.usersKycPage.dialog.uploadedOn} {new Date(selectedUser.joinedDate).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm">{dict.marketplace.admin.usersKycPage.dialog.view}</Button>
                                            </div>
                                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <Upload className="h-5 w-5 text-blue-600" />
                                                    <div>
                                                        <p className="font-medium text-sm">{dict.marketplace.admin.usersKycPage.dialog.idVerification}</p>
                                                        <p className="text-xs text-muted-foreground">{dict.marketplace.admin.usersKycPage.dialog.uploadedOn} {new Date(selectedUser.joinedDate).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm">{dict.marketplace.admin.usersKycPage.dialog.view}</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">{dict.marketplace.admin.usersKycPage.dialog.noDocuments}</p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">{dict.marketplace.admin.usersKycPage.dialog.status}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label className="text-sm text-muted-foreground">{dict.marketplace.admin.usersKycPage.dialog.currentStatus}</Label>
                                            <div className="mt-1">{getKycBadge(selectedUser.kycStatus)}</div>
                                        </div>
                                        {selectedUser.kycStatus === 'pending' && (
                                            <div className="flex gap-2">
                                                <Button variant="default" className="bg-green-600 hover:bg-green-700">
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    {dict.marketplace.admin.usersKycPage.dialog.approve}
                                                </Button>
                                                <Button variant="destructive">
                                                    <XCircle className="h-4 w-4 mr-2" />
                                                    {dict.marketplace.admin.usersKycPage.dialog.reject}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
