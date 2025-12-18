'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Upload, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { setKycStatus } from '@/app/[lang]/(user)/admin/services/set-kyc-status';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'supplier' | 'retailer';
    kycStatus: 'pending' | 'approved' | 'rejected' | 'not_submitted';
    companyName?: string;
    joinedDate: string;
    documentsUploaded: boolean;
    iban?: string;
    swift?: string;
}

interface KycDialogProps {
    user: any;
    dict: any;
    lang: string;
    activeTab: string;
    searchQuery: string;
    onClose: () => void;
    mutate?:any;
}

export function KycDialog({ user, dict, lang, activeTab, searchQuery,onClose,mutate = null }: KycDialogProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => {
        const params = new URLSearchParams();
        params.set('tab', activeTab);
        if (searchQuery) params.set('q', searchQuery);
        router.push(`/${lang}/admin/users-kyc?${params.toString()}`);
        onClose();
    };

    const handleKycAction = async (action: 'approve' | 'reject') => {
        setIsLoading(true);
        setError(null);

        try {
            const primaryRole = user.roles?.[0]?.role;

            if (!primaryRole) {
                throw new Error("User role not found");
            }

            const new_status =
                action === "approve"
                    ? `${primaryRole}_approved`
                    : `${primaryRole}_rejected`;

            await setKycStatus({
                user_id: Number(user.id),
                new_status,
            });

            !!mutate &&  await mutate();
            handleClose();

        } catch (e) {
            console.error("KYC update failed:", e);
            setError("Failed to update KYC status");
        } finally {
            setIsLoading(false);
        }
    };

    const getKycBadge = (status: User['kycStatus']) => {
        const badges = {
            approved: { label: dict.marketplace.admin.usersKycPage.status.approved, className: 'bg-green-100 text-green-800 hover:bg-green-100' },
            pending: { label: dict.marketplace.admin.usersKycPage.status.pendingReview, className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
            rejected: { label: dict.marketplace.admin.usersKycPage.status.rejected, className: 'bg-red-100 text-red-800 hover:bg-red-100' },
            not_submitted: { label: dict.marketplace.admin.usersKycPage.status.notSubmitted, className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
        };
        const config = badges[status];
        return <Badge variant="default" className={config.className}>{config.label}</Badge>;
    };

    const getRoleBadge = (user) => {
        const roleObj = user.roles?.[0];
        const role = roleObj?.role || 'unknown';

        const colors = {
            admin: 'bg-red-100 text-red-800',
            supplier: 'bg-blue-100 text-blue-800',
            retailer: 'bg-purple-100 text-purple-800',
            buyer: 'bg-purple-100 text-purple-800',
        };

        return <Badge variant="default" className={`${colors[role]} hover:${colors[role]}`}>{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>;
    };


    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{dict.marketplace.admin.usersKycPage.dialog.title} - {user.name}</DialogTitle>
                    <DialogDescription>
                        {dict.marketplace.admin.usersKycPage.dialog.description} {user.companyName}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">{dict.marketplace.admin.usersKycPage.dialog.companyInfo}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm text-muted-foreground">{dict.marketplace.admin.usersKycPage.dialog.companyName}</Label>
                                <p className="font-medium">{user.companyName || dict.marketplace.admin.usersKycPage.dialog.notProvided}</p>
                            </div>
                            <div>
                                <Label className="text-sm text-muted-foreground">{dict.marketplace.admin.usersKycPage.table.role}</Label>
                                <div className="mt-1">{getRoleBadge(user)}</div>
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
                                <p className="font-medium font-mono">{user.iban || dict.marketplace.admin.usersKycPage.dialog.notProvided}</p>
                            </div>
                            <div>
                                <Label className="text-sm text-muted-foreground">{dict.marketplace.admin.usersKycPage.dialog.swift}</Label>
                                <p className="font-medium font-mono">{user.swift || dict.marketplace.admin.usersKycPage.dialog.notProvided}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">{dict.marketplace.admin.usersKycPage.dialog.documents}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {user.documentsUploaded ? (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Upload className="h-5 w-5 text-blue-600" />
                                            <div>
                                                <p className="font-medium text-sm">{dict.marketplace.admin.usersKycPage.dialog.businessRegistration}</p>
                                                <p className="text-xs text-muted-foreground">{dict.marketplace.admin.usersKycPage.dialog.uploadedOn} {new Date(user.joinedDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">{dict.marketplace.admin.usersKycPage.dialog.view}</Button>
                                    </div>
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Upload className="h-5 w-5 text-blue-600" />
                                            <div>
                                                <p className="font-medium text-sm">{dict.marketplace.admin.usersKycPage.dialog.idVerification}</p>
                                                <p className="text-xs text-muted-foreground">{dict.marketplace.admin.usersKycPage.dialog.uploadedOn} {new Date(user.joinedDate).toLocaleDateString()}</p>
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
                                    <div className="mt-1">{getKycBadge(user.kycStatus)}</div>
                                </div>
                                {user.kycStatus === 'pending' && (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="default"
                                            className="bg-green-600 hover:bg-green-700"
                                            onClick={() => handleKycAction('approve')}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            ) : (
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                            )}
                                            {dict.marketplace.admin.usersKycPage.dialog.approve}
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleKycAction('reject')}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            ) : (
                                                <XCircle className="h-4 w-4 mr-2" />
                                            )}
                                            {dict.marketplace.admin.usersKycPage.dialog.reject}
                                        </Button>
                                    </div>
                                )}
                            </div>
                            {error && (
                                <p className="text-sm text-red-600 mt-2">{error}</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}
