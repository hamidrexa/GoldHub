'use client';

import * as React from 'react';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { DataTablePagination } from '@/app/[lang]/(user)/top-assets/components/data-table-pagination';
import { Locale } from '@/i18n-config';
import { LockIcon } from 'lucide-react';
import { cn } from '@/libs/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    dict: any;
    lang: Locale;
    loading?: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    dict,
    lang,
    loading,
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const table = useReactTable({
        data: loading ? Array(10).fill({}) : data,
        columns: loading
            ? columns.map((column) => ({
                  ...column,
                  cell: () => (
                      <Skeleton className="h-6 max-w-40 rounded-full" />
                  ),
              }))
            : columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        enableRowSelection: false,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    // @ts-ignore
    return (
        <div className="space-y-4">
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader className="sticky top-0 z-20 bg-white">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header, index) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className={cn(
                                                'whitespace-nowrap px-1',
                                                {
                                                    'sticky right-0 bg-white':
                                                        index === 0,
                                                }
                                            )}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row
                                        .getVisibleCells()
                                        .map((cell, index) => (
                                            <TableCell
                                                className={cn('relative', {
                                                    '!sticky right-0 z-10 bg-white':
                                                        index === 0,
                                                })}
                                                key={cell.id}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                                {cell.column.id === 'name' &&
                                                    // @ts-ignore
                                                    row.original.lock && (
                                                        <div
                                                            onClick={
                                                                // @ts-ignore
                                                                row.original[
                                                                    'lockAction'
                                                                ]
                                                            }
                                                            className="absolute bottom-0 left-0 right-0 top-0 flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 bg-white/20 p-4 text-xs backdrop-blur-lg"
                                                        >
                                                            <LockIcon
                                                                stroke="#0C0E3C"
                                                                strokeWidth={2}
                                                            />
                                                            نیاز به اشتراک دارد
                                                        </div>
                                                    )}
                                            </TableCell>
                                        ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    نتیجه ای یافت نشد.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} dict={dict} lang={lang} />
        </div>
    );
}
