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

    const handleOrderStatusUpdate = async (updateType: 'Confirmed' | 'Rejected') => {
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
            'pending_supplier': 'submitted',
            'in_processing': 'confirmed',
            'ready': 'confirmed',
            'closed': 'delivered',
        };

        const mappedStatus = statusMap[normalizedStatus] || normalizedStatus;

        return ORDER_STATUS_FLOW.findIndex(
            (step) => step.id.toLowerCase() === mappedStatus || step.label.toLowerCase() === mappedStatus
        );
    };

    const currentStepIndex = getCurrentStepIndex(order.status);

    return (
        <Dialog open onOpenChange={(open) => { if (!open) handleClose(); }}>
            <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto p-0 sm:max-h-[85vh] gap-0">
                {/* Custom Header with working Close Button */}
                <div className="px-6 py-4 border-b flex items-center justify-between bg-background z-20">
                    <DialogTitle className="text-xl font-bold">
                        Order {order.id}
                    </DialogTitle>
                    <button
                        onClick={handleClose}
                        className="p-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-white">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: Status Stepper */}
                        <div className="lg:col-span-4 space-y-4">
                            <h3 className="font-semibold text-lg text-gray-800">Order Status</h3>
                            <div className="relative pl-2">
                                {/* Vertical Line */}
                                <div className="absolute left-[21px] top-2 bottom-6 w-0.5 bg-gray-100" />

                                {ORDER_STATUS_FLOW.map((step, index) => {
                                    const isCompleted = index < currentStepIndex;
                                    const isCurrent = index === currentStepIndex;
                                    const isFuture = index > currentStepIndex;
                                    const StepIcon = step.icon;

                                    return (
                                        <div key={step.id} className="flex gap-4 items-center mb-6 relative z-10">
                                            <div
                                                className={cn(
                                                    "w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0 bg-white transition-colors duration-200",
                                                    isCompleted && "bg-amber-500 border-amber-500 text-white",
                                                    isCurrent && "border-amber-500 text-amber-600 ring-4 ring-amber-50",
                                                    isFuture && "border-gray-200 text-gray-300"
                                                )}
                                            >
                                                {isCompleted ? (
                                                    <CheckCircle className="w-4 h-4" />
                                                ) : (
                                                    <StepIcon className="w-4 h-4" />
                                                )}
                                            </div>
                                            <div>
                                                <p className={cn(
                                                    "text-sm font-medium transition-colors",
                                                    isCompleted && "text-gray-500",
                                                    isCurrent && "text-amber-700 font-bold",
                                                    isFuture && "text-gray-400"
                                                )}>
                                                    {step.label}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Column: Details */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Corrected Info Cards Style */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="rounded-xl border border-gray-100 bg-gray-50/30 p-5 shadow-sm">
                                    <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
                                        Buyer Information
                                    </h4>
                                    <div className="space-y-1">
                                        <p className="font-bold text-gray-800 text-lg">
                                            {order.buyer?.username || order.buyer?.name || 'Eastern Gold Ltd.'}
                                        </p>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            ID: {order.buyer?.id || 'b2'}
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-gray-100 bg-gray-50/30 p-5 shadow-sm">
                                    <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
                                        Order Summary
                                    </h4>
                                    <div className="space-y-1">
                                        <p className="font-bold text-gray-800 text-lg">
                                            Total: ${order.total_price?.toLocaleString() || '21,500'}
                                        </p>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Created: {new Date(order.date).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg text-gray-800">Order Items</h3>
                                <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                                    {order.items?.map((item: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "flex items-center gap-4 p-5 bg-white hover:bg-gray-50/50 transition-colors",
                                                idx !== order.items.length - 1 && "border-b border-gray-100"
                                            )}
                                        >
                                            <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
                                                {item.product?.images?.[0] ? (
                                                    <img
                                                        src={item.product.images[0]}
                                                        alt={item.product.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Package className="w-6 h-6 text-gray-300" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-800 truncate">
                                                    {item.product?.title || 'Gold Krugerrand 1oz'}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    {item.product?.purity ? `${item.product.purity}K` : '22K'} · {item.product?.weight || '1ounce'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-800 text-lg">
                                                    ${(item.price * item.quantity).toLocaleString()}
                                                </p>
                                                <p className="text-xs font-medium text-gray-400">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions (Supplier Only) */}
                {isSupplier && (order.status === 'Submitted' || order.status === 'Pending Supplier' || order.status === 'pending_supplier') && (
                    <div className="p-6 border-t bg-gray-50/50 flex justify-end gap-3 z-20">
                        <Button
                            variant="outline"
                            className="h-11 px-6 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-white"
                            onClick={() => handleOrderStatusUpdate('Rejected')}
                            disabled={isLoading}
                        >
                            <XCircle className="w-4 h-4 mr-2" />
                            {isLoading ? "Processing..." : "Reject Order"}
                        </Button>
                        <Button
                            className="h-11 px-8 bg-green-500 hover:bg-green-600 text-white shadow-sm"
                            onClick={() => handleOrderStatusUpdate('Confirmed')}
                            disabled={isLoading}
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {isLoading ? "Processing..." : "Confirm Order"}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
