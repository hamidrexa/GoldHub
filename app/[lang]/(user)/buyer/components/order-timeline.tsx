'use client';

import React from 'react';
import { OrderTimelineEntry, OrderStatus } from '@/lib/mock-data';
import { Check, Clock, Package, Truck, CheckCircle2, Box, Home } from 'lucide-react';

interface OrderTimelineProps {
    timeline: OrderTimelineEntry[];
    currentStatus: OrderStatus;
}

export default function OrderTimeline({ timeline, currentStatus }: OrderTimelineProps) {
    const getStepIcon = (status: OrderStatus, isCompleted: boolean) => {
        const iconClass = `h-5 w-5 ${isCompleted ? 'text-white' : 'text-gray-400'}`;

        const icons = {
            draft: <Package className={iconClass} />,
            submitted: <Check className={iconClass} />,
            pending_supplier: <Clock className={iconClass} />,
            confirmed: <CheckCircle2 className={iconClass} />,
            in_processing: <Box className={iconClass} />,
            ready: <Package className={iconClass} />,
            shipped: <Truck className={iconClass} />,
            delivered: <Home className={iconClass} />,
            closed: <CheckCircle2 className={iconClass} />,
            cancelled: <Check className={iconClass} />,
        };

        return icons[status] || icons.draft;
    };

    return (
        <div className="relative">
            {/* Timeline */}
            <div className="space-y-6">
                {timeline.map((entry, index) => {
                    const isLast = index === timeline.length - 1;
                    const isCompleted = entry.completed;
                    const isCurrent = entry.status === currentStatus;

                    return (
                        <div key={index} className="relative flex gap-4">
                            {/* Connector Line */}
                            {!isLast && (
                                <div
                                    className={`absolute left-5 top-12 bottom-0 w-0.5 ${isCompleted
                                            ? 'bg-green-500'
                                            : 'bg-gray-200'
                                        }`}
                                    style={{ height: 'calc(100% + 24px)' }}
                                />
                            )}

                            {/* Icon */}
                            <div
                                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${isCompleted
                                        ? 'bg-green-500'
                                        : isCurrent
                                            ? 'bg-blue-500 ring-4 ring-blue-100'
                                            : 'bg-gray-200'
                                    }`}
                            >
                                {getStepIcon(entry.status, isCompleted || isCurrent)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-8">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4
                                            className={`font-semibold ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                                                }`}
                                        >
                                            {getStatusLabel(entry.status)}
                                        </h4>
                                        {entry.notes && (
                                            <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>
                                        )}
                                    </div>
                                    {entry.timestamp && (
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                                            {entry.timestamp}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function getStatusLabel(status: OrderStatus): string {
    const labels = {
        draft: 'Draft',
        submitted: 'Submitted',
        pending_supplier: 'Pending Supplier',
        confirmed: 'Confirmed',
        in_processing: 'In Processing',
        ready: 'Ready',
        shipped: 'Shipped',
        delivered: 'Delivered',
        closed: 'Closed',
        cancelled: 'Cancelled',
    };
    return labels[status] || status;
}
