import { Table } from '@tanstack/react-table';

import { getDirection } from '@/libs/utils';
import { Locale } from '@/i18n-config';
import React from 'react';
import { SmartPagination } from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    dict: any;
    lang: Locale;
}

export function DataTablePagination<TData>({
    table,
    dict,
    lang,
}: DataTablePaginationProps<TData>) {
    const dir = getDirection(lang);

    return (
        <div className="flex flex-col items-center justify-between gap-4 px-2 py-4 sm:flex-row">
            <div className="flex items-center gap-2">
                <p className="text-muted-foreground text-sm whitespace-nowrap">
                    {dict?.common?.rowsPerPage || 'Rows per page'}
                </p>
                <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                        table.setPageSize(Number(value));
                    }}
                >
                    <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={table.getState().pagination.pageSize} />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[5, 10, 20, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex-1">
                <SmartPagination
                    currentPage={table.getState().pagination.pageIndex}
                    totalPages={table.getPageCount()}
                    onPageChange={(page) => table.setPageIndex(page)}
                    dict={dict}
                />
            </div>

            <div className="hidden text-sm text-muted-foreground sm:block">
                {dict?.common?.pageOf?.replace('{current}', table.getState().pagination.pageIndex + 1).replace('{total}', table.getPageCount()) ||
                    `Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount()}`}
            </div>
        </div>
    );
}

