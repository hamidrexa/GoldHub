'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    CheckCircle,
    XCircle,
    User,
    Package,
    Calendar,
    CreditCard,
    X,
    FileText,
    Clock,
    AlertCircle,
    Truck,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePathname, useRouter } from 'next/navigation';
import { updateOrderStatus } from '@/app/[lang]/(user)/supplier/services/update-order-status';
import { cn } from '@/libs/utils';

interface OrderDialogProps {
    order: any;
    dict: any;
    lang: string;
    activeTab: string;
    searchQuery: string;
    onClose: () => void;
    mutate?: any;
}

// Updated status flow as per user request: "Draft", "Cancelled", "Submitted", "Rejected", "Confirmed", "Paid", "Shipped", "Delivered"
const ORDER_STATUS_FLOW = [
    { id: 'Draft', label: 'Draft', icon: FileText },
    { id: 'Cancelled', label: 'Cancelled', icon: XCircle },
    { id: 'Submitted', label: 'Submitted', icon: Clock },
    { id: 'Rejected', label: 'Rejected', icon: AlertCircle },
    { id: 'Confirmed', label: 'Confirmed', icon: CheckCircle },
    { id: 'Paid', label: 'Paid', icon: CreditCard },
    { id: 'Shipped', label: 'Shipped', icon: Truck },
    { id: 'Delivered', label: 'Delivered', icon: CheckCircle },
];

export function OrderDialog({
    order,
    dict,
    lang,
    activeTab,
    searchQuery,
    onClose,
    mutate = null,
}: OrderDialogProps) {
    const router = useRouter();
    const path = usePathname();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isSupplier = path.includes('/supplier');

    const handleClose = async () => {
        if (mutate) await mutate();
        onClose();
    };

    const handleOrderStatusUpdate = async (
        updateType: 'Confirmed' | 'Rejected'
    ) => {
        setIsLoading(true);
        setError(null);

        try {
            await updateOrderStatus({
                order_id: order.id,
                status: updateType,
            });

            handleClose();
            router.refresh();
        } catch (e) {
            console.error('order status update failed:', e);
            setError('Failed to update order status');
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to determine active step in stepper
    const getCurrentStepIndex = (status: string) => {
        const normalizedStatus = status.toLowerCase();
        // Specific mapping for legacy or alternative status names
        const statusMap: Record<string, string> = {
            pending_supplier: 'submitted',
            in_processing: 'confirmed',
            ready: 'confirmed',
            closed: 'delivered',
        };

        const mappedStatus = statusMap[normalizedStatus] || normalizedStatus;

        return ORDER_STATUS_FLOW.findIndex(
            (step) =>
                step.id.toLowerCase() === mappedStatus ||
                step.label.toLowerCase() === mappedStatus
        );
    };

    const currentStepIndex = getCurrentStepIndex(order.status);

    return (
        <Dialog
            open
            onOpenChange={onClose}
        >
            <DialogContent className="max-h-[90vh] max-w-5xl gap-0 overflow-y-auto p-0 sm:max-h-[85vh]">
                <div className="bg-background flex items-center justify-between border-b px-6 py-4">
                    <DialogTitle className="text-xl font-bold">
                        Order {order.id}
                    </DialogTitle>
                </div>

                <div className="flex-1 overflow-y-auto bg-white p-6">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* Left Column: Status Stepper */}
                        <div className="space-y-4 lg:col-span-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Order Status
                            </h3>
                            <div className="relative pl-2">
                                {/* Vertical Line */}
                                <div className="absolute bottom-6 left-[21px] top-2 w-0.5 bg-gray-100" />

                                {ORDER_STATUS_FLOW.map((step, index) => {
                                    const isCompleted =
                                        index < currentStepIndex;
                                    const isCurrent =
                                        index === currentStepIndex;
                                    const isFuture = index > currentStepIndex;
                                    const StepIcon = step.icon;

                                    return (
                                        <div
                                            key={step.id}
                                            className="relative z-10 mb-6 flex items-center gap-4"
                                        >
                                            <div
                                                className={cn(
                                                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 bg-white transition-colors duration-200',
                                                    isCompleted &&
                                                        'border-amber-500 bg-amber-500 text-white',
                                                    isCurrent &&
                                                        'border-amber-500 text-amber-600 ring-4 ring-amber-50',
                                                    isFuture &&
                                                        'border-gray-200 text-gray-300'
                                                )}
                                            >
                                                {isCompleted ? (
                                                    <CheckCircle className="h-4 w-4" />
                                                ) : (
                                                    <StepIcon className="h-4 w-4" />
                                                )}
                                            </div>
                                            <div>
                                                <p
                                                    className={cn(
                                                        'text-sm font-medium transition-colors',
                                                        isCompleted &&
                                                            'text-gray-500',
                                                        isCurrent &&
                                                            'font-bold text-amber-700',
                                                        isFuture &&
                                                            'text-gray-400'
                                                    )}
                                                >
                                                    {step.label}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Column: Details */}
                        <div className="space-y-6 lg:col-span-8">
                            {/* Corrected Info Cards Style */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="rounded-xl border border-gray-100 bg-gray-50/30 p-5 shadow-sm">
                                    <h4 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-400">
                                        Buyer Information
                                    </h4>
                                    <div className="space-y-1">
                                        <p className="text-lg font-bold text-gray-800">
                                            {order.buyer?.username ||
                                                order.buyer?.name ||
                                                'Eastern Gold Ltd.'}
                                        </p>
                                        <p className="flex items-center gap-1 text-sm text-gray-500">
                                            <User className="h-3 w-3" />
                                            ID: {order.buyer?.id || 'b2'}
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-gray-100 bg-gray-50/30 p-5 shadow-sm">
                                    <h4 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-400">
                                        Order Summary
                                    </h4>
                                    <div className="space-y-1">
                                        <p className="text-lg font-bold text-gray-800">
                                            Total: $
                                            {order.total_price?.toLocaleString() ||
                                                '21,500'}
                                        </p>
                                        <p className="flex items-center gap-1 text-sm text-gray-500">
                                            <Calendar className="h-3 w-3" />
                                            Created:{' '}
                                            {new Date(
                                                order.date
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Order Items
                                </h3>
                                <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                                    {order.items?.map(
                                        (item: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className={cn(
                                                    'flex items-center gap-4 bg-white p-5 transition-colors hover:bg-gray-50/50',
                                                    idx !==
                                                        order.items.length -
                                                            1 &&
                                                        'border-b border-gray-100'
                                                )}
                                            >
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-100">
                                                    {item.product
                                                        ?.images?.[0] ? (
                                                        <img
                                                            src={
                                                                item.product
                                                                    .images[0]
                                                                    .image
                                                            }
                                                            alt={
                                                                item.product
                                                                    .title
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="h-6 w-6 text-gray-300" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="truncate font-bold text-gray-800">
                                                        {item.product?.title ||
                                                            'Gold Krugerrand 1oz'}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {item.product?.purity
                                                            ? `${item.product.purity}K`
                                                            : '22K'}{' '}
                                                        ·{' '}
                                                        {item.product?.net_weight ||
                                                            '1ounce'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-gray-800">
                                                        $
                                                        {(
                                                            parseFloat(
                                                                item.product
                                                                    .unit_price
                                                            ) * item.count
                                                        ).toLocaleString()}
                                                    </p>
                                                    <p className="text-xs font-medium text-gray-400">
                                                        Qty: {item.count}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions (Supplier Only) */}
                {isSupplier &&
                    (order.status === 'Submitted' ||
                        order.status === 'Pending Supplier' ||
                        order.status === 'pending_supplier') && (
                        <div className="z-20 flex justify-end gap-3 border-t bg-gray-50/50 p-6">
                            <Button
                                variant="outline"
                                className="h-11 border-red-200 bg-white px-6 text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() =>
                                    handleOrderStatusUpdate('Rejected')
                                }
                                disabled={isLoading}
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                {isLoading ? 'Processing...' : 'Reject Order'}
                            </Button>
                            <Button
                                className="h-11 bg-green-500 px-8 text-white shadow-sm hover:bg-green-600"
                                onClick={() =>
                                    handleOrderStatusUpdate('Confirmed')
                                }
                                disabled={isLoading}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                {isLoading ? 'Processing...' : 'Confirm Order'}
                            </Button>
                        </div>
                    )}
            </DialogContent>
        </Dialog>
    );
}
