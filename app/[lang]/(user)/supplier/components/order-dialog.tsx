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
import { usePathname, useRouter } from 'next/navigation';
import { setKycStatus } from '@/app/[lang]/(user)/admin/services/set-kyc-status';
import { updateOrderStatus } from '@/app/[lang]/(user)/supplier/services/update-order-status';

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

interface OrderDialogProps {
    order: any;
    dict: any;
    lang: string;
    activeTab: string;
    searchQuery: string;
    onClose: () => void;
    mutate?:any
}

export function OrderDialog({ order, dict, lang, activeTab, searchQuery,onClose,mutate=null }: OrderDialogProps) {
    const router = useRouter();
    const path = usePathname();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClose = async () => {
        const params = new URLSearchParams();
        params.set('tab', activeTab);
        if (searchQuery) params.set('q', searchQuery);
        router.push(`/${lang}/supplier/orders?${params.toString()}`);
        !!mutate && await mutate();
        onClose();
    };

    const handleKycAction = async (action: 'Confirmed' | 'Rejected') => {
        setIsLoading(true);
        setError(null);

        try {

            await updateOrderStatus({
                order_id:order.id,
                status:action,
            });

            handleClose();
            router.refresh();

        } catch (e) {
            console.error("order status update failed:", e);
            setError("Failed to update order status");
        } finally {
            setIsLoading(false);
        }
    };

    const getKycBadge = (status: string) => {
        const badges = {
            Confirmed: { label: dict.marketplace.admin.usersKycPage.status.approved, className: 'bg-green-100 text-green-800 hover:bg-green-100' },
            Submitted: { label: dict.marketplace.admin.usersKycPage.status.pendingReview, className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
            rejected: { label: dict.marketplace.admin.usersKycPage.status.rejected, className: 'bg-red-100 text-red-800 hover:bg-red-100' },
            not_submitted: { label: dict.marketplace.admin.usersKycPage.status.notSubmitted, className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
        };
        const config = badges[status] || { label: status, className: 'bg-status-draft-bg text-status-draft-text hover:bg-status-draft-bg' };
        return <Badge variant="default" className={config.className}>{config.label}</Badge>;
    };

    const getRoleBadge = (order) => {
        const roleObj = order.roles?.[0];
        const role = roleObj?.role || 'buyer';

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
            <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {dict.marketplace.supplier.ordersPage.dialog.title} -{' '}
                        {order.name}
                    </DialogTitle>
                    <DialogDescription>
                        {
                            dict.marketplace.supplier.ordersPage.dialog
                                .description
                        }{' '}
                        {order.companyName}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                {
                                    dict.marketplace.supplier.ordersPage.dialog
                                        .companyInfo
                                }
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {order.items.length !== 0 && (
                                <div>
                                    <Label className="text-muted-foreground text-sm">
                                        {
                                            dict.marketplace.supplier.ordersPage
                                                .dialog.companyName
                                        }
                                    </Label>
                                    <p className="font-medium">
                                        {order.items[0].product.supplier
                                            .username ||
                                            dict.marketplace.supplier.ordersPage
                                                .dialog.notProvided}
                                    </p>
                                </div>
                            )}
                            <div>
                                <Label className="text-muted-foreground text-sm">
                                    {
                                        dict.marketplace.supplier.ordersPage
                                            .table.role
                                    }
                                </Label>
                                <div className="mt-1">
                                    {getRoleBadge(order)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                {
                                    dict.marketplace.supplier.ordersPage.dialog
                                        .bankingInfo
                                }
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-muted-foreground text-sm">
                                    {
                                        dict.marketplace.supplier.ordersPage
                                            .dialog.iban
                                    }
                                </Label>
                                <p className="font-mono font-medium">
                                    {order.iban ||
                                        dict.marketplace.supplier.ordersPage
                                            .dialog.notProvided}
                                </p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-sm">
                                    {
                                        dict.marketplace.supplier.ordersPage
                                            .dialog.swift
                                    }
                                </Label>
                                <p className="font-mono font-medium">
                                    {order.swift ||
                                        dict.marketplace.supplier.ordersPage
                                            .dialog.notProvided}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                {
                                    dict.marketplace.supplier.ordersPage.dialog
                                        .documents
                                }
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {order.documentsUploaded ? (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="flex items-center gap-3">
                                            <Upload className="h-5 w-5 text-blue-600" />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {
                                                        dict.marketplace
                                                            .supplier.ordersPage
                                                            .dialog
                                                            .businessRegistration
                                                    }
                                                </p>
                                                <p className="text-muted-foreground text-xs">
                                                    {
                                                        dict.marketplace
                                                            .supplier.ordersPage
                                                            .dialog.uploadedOn
                                                    }{' '}
                                                    {new Date(
                                                        order.joinedDate
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            {
                                                dict.marketplace.supplier
                                                    .ordersPage.dialog.view
                                            }
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="flex items-center gap-3">
                                            <Upload className="h-5 w-5 text-blue-600" />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {
                                                        dict.marketplace
                                                            .supplier.ordersPage
                                                            .dialog
                                                            .idVerification
                                                    }
                                                </p>
                                                <p className="text-muted-foreground text-xs">
                                                    {
                                                        dict.marketplace
                                                            .supplier.ordersPage
                                                            .dialog.uploadedOn
                                                    }{' '}
                                                    {new Date(
                                                        order.joinedDate
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            {
                                                dict.marketplace.supplier
                                                    .ordersPage.dialog.view
                                            }
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm">
                                    {
                                        dict.marketplace.supplier.ordersPage
                                            .dialog.noDocuments
                                    }
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                {
                                    dict.marketplace.supplier.ordersPage.dialog
                                        .status
                                }
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-muted-foreground text-sm">
                                        {
                                            dict.marketplace.supplier.ordersPage
                                                .dialog.currentStatus
                                        }
                                    </Label>
                                    <div className="mt-1">
                                        {getKycBadge(order.status)}
                                    </div>
                                </div>
                                {order.status === 'Submitted' && path.includes('/supplier') &&(
                                    <div className="flex gap-2">
                                        <Button
                                            variant="default"
                                            className="bg-green-600 hover:bg-green-700"
                                            onClick={() =>
                                                handleKycAction('Confirmed')
                                            }
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                            )}
                                            {
                                                dict.marketplace.supplier
                                                    .ordersPage.dialog.approve
                                            }
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() =>
                                                handleKycAction('Rejected')
                                            }
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <XCircle className="mr-2 h-4 w-4" />
                                            )}
                                            {
                                                dict.marketplace.supplier
                                                    .ordersPage.dialog.reject
                                            }
                                        </Button>
                                    </div>
                                )}
                            </div>
                            {error && (
                                <p className="mt-2 text-sm text-red-600">
                                    {error}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}
