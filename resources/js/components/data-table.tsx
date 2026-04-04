/**
 * Reusable server-driven data table.
 *
 * Designed for Laravel Inertia pages: pagination, sorting, and filtering are all
 * server-side. The component manages local UI state (selection, column visibility)
 * and delegates data changes to the `onServerChange` callback, which should trigger
 * an Inertia `router.get()` visit with the updated query parameters.
 *
 * **Key behaviours:**
 * - Manual pagination/sorting: TanStack Table runs in `manualPagination` + `manualSorting` mode.
 * - Column visibility is persisted to `localStorage` when `tableKey` is provided.
 * - Row selection is scoped to the current page; stale IDs from previous pages are auto-cleaned.
 * - Empty state adapts based on whether a search term is active.
 *
 * @see DataTablePaginationMeta
 * @see DataTableServerChangeParams
 * @see https://tanstack.com/table/v8/docs/guide/pagination#manual-pagination
 */
/* eslint-disable react-hooks/incompatible-library */
'use no memo';

import type {
    ColumnDef,
    PaginationState,
    SortingState,
} from '@tanstack/react-table';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Inbox, SearchX } from 'lucide-react';
import type { ElementType, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useColumnVisibility } from '@/hooks/use-column-visibility';
import { cn } from '@/lib/utils';
import type {
    DataTablePaginationMeta,
    DataTableServerChangeParams,
} from '@/types/data-table';

import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';

interface DataTableProps<TData> {
    columns: ColumnDef<TData, any>[];
    data: TData[];
    pagination: DataTablePaginationMeta;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    search?: string;
    onSearch?: (value: string) => void;
    onServerChange?: (params: DataTableServerChangeParams) => void;
    filterSlot?: ReactNode;
    actionSlot?: ReactNode;
    bulkActionSlot?: ReactNode;
    onSelectionChange?: (selectedIds: string[]) => void;
    tableKey?: string;
    pageSizeOptions?: number[];
    loading?: boolean;
    getRowId?: (originalRow: TData, index: number) => string;
    emptyTitle?: string;
    emptyDescription?: string | ((search: string | undefined) => string);
    emptyIcon?: ElementType;
    onResetFilters?: () => void;
}

export function DataTable<TData>({
    columns,
    data,
    pagination,
    sortBy,
    sortDir,
    search,
    onSearch,
    onServerChange,
    filterSlot,
    actionSlot,
    bulkActionSlot,
    onSelectionChange,
    tableKey,
    pageSizeOptions,
    loading = false,
    getRowId,
    emptyTitle = 'No results',
    emptyDescription,
    emptyIcon,
    onResetFilters,
}: DataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>(() =>
        sortBy ? [{ id: sortBy, desc: sortDir === 'desc' }] : [],
    );

    const [paginationState, setPaginationState] = useState<PaginationState>({
        pageIndex: pagination.currentPage - 1,
        pageSize: pagination.perPage,
    });

    const { columnVisibility, setColumnVisibility } = useColumnVisibility(
        tableKey ?? '',
        {},
        !!tableKey,
    );

    const [rowSelection, setRowSelection] = useState({});

    const sortingRef = useRef(sorting);
    const paginationRef = useRef(paginationState);

    useEffect(() => {
        sortingRef.current = sorting;
    });

    useEffect(() => {
        paginationRef.current = paginationState;
    });

    useEffect(() => {
        setPaginationState({
            pageIndex: pagination.currentPage - 1,
            pageSize: pagination.perPage,
        });
    }, [pagination.currentPage, pagination.perPage]);

    useEffect(() => {
        setSorting((prev) => {
            const expected = sortBy
                ? [{ id: sortBy, desc: sortDir === 'desc' }]
                : [];
            const same =
                prev.length === expected.length &&
                prev[0]?.id === expected[0]?.id &&
                prev[0]?.desc === expected[0]?.desc;

            return same ? prev : expected;
        });
    }, [sortBy, sortDir]);

    const ResolvedEmptyIcon = emptyIcon ?? (search ? SearchX : Inbox);

    const resolvedEmptyDescription =
        typeof emptyDescription === 'function'
            ? emptyDescription(search)
            : (emptyDescription ??
              (search
                  ? `No results for "${search}". Try a different search term.`
                  : 'No data found.'));

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        ...(getRowId ? { getRowId } : {}),

        manualPagination: true,
        manualSorting: true,
        pageCount: pagination.lastPage,
        rowCount: pagination.total,

        state: {
            sorting,
            pagination: paginationState,
            columnVisibility,
            rowSelection,
        },

        onSortingChange: (updater) => {
            const next =
                typeof updater === 'function'
                    ? updater(sortingRef.current)
                    : updater;

            setSorting(next);

            if (onServerChange) {
                const col = next[0];
                onServerChange({
                    sortBy: col?.id,
                    sortDir: col?.desc ? 'desc' : 'asc',
                    page: 1,
                    perPage: paginationRef.current.pageSize,
                });
            }
        },

        onPaginationChange: (updater) => {
            const previous = paginationRef.current;
            const next =
                typeof updater === 'function' ? updater(previous) : updater;

            const pageSizeChanged = next.pageSize !== previous.pageSize;

            setPaginationState(next);

            if (onServerChange) {
                onServerChange({
                    page: pageSizeChanged ? 1 : next.pageIndex + 1,
                    perPage: next.pageSize,
                    sortBy: sortingRef.current[0]?.id,
                    sortDir: sortingRef.current[0]?.desc ? 'desc' : 'asc',
                });
            }
        },

        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: (updater) => {
            const next =
                typeof updater === 'function' ? updater(rowSelection) : updater;
            // Drop IDs that no longer exist in the current page's data so stale
            // selections from a previous page load (e.g. after a bulk delete
            // redirect) don't accumulate in parent state.
            const existingIds = new Set(
                data.map((row, i) => (getRowId ? getRowId(row, i) : String(i))),
            );
            const cleaned: Record<string, boolean> = {};

            for (const id of Object.keys(next)) {
                if (existingIds.has(id)) {
                    cleaned[id] = true;
                }
            }

            setRowSelection(cleaned);
            onSelectionChange?.(Object.keys(cleaned));
        },
    });

    return (
        <div className="space-y-4">
            <DataTableToolbar
                table={table}
                search={search}
                onSearch={onSearch}
                filterSlot={filterSlot}
                actionSlot={actionSlot}
                bulkActionSlot={bulkActionSlot}
                onResetFilters={onResetFilters}
            />

            <div
                className={cn(
                    'rounded-md border transition-opacity',
                    loading && 'pointer-events-none opacity-50',
                )}
            >
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        style={{
                                            width: `${header.getSize()}px`,
                                        }}
                                        className={cn(
                                            header.column.columnDef.meta
                                                ?.className,
                                            header.column.columnDef.meta
                                                ?.headerClassName,
                                        )}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                ))}
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
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            style={{
                                                width: `${cell.column.getSize()}px`,
                                            }}
                                            className={cn(
                                                cell.column.columnDef.meta
                                                    ?.className,
                                                cell.column.columnDef.meta
                                                    ?.cellClassName,
                                            )}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="hover:bg-transparent">
                                <TableCell
                                    colSpan={columns.length}
                                    className="p-0"
                                >
                                    <Empty>
                                        <EmptyHeader>
                                            <EmptyMedia variant="icon">
                                                <ResolvedEmptyIcon />
                                            </EmptyMedia>
                                            <EmptyTitle>
                                                {emptyTitle}
                                            </EmptyTitle>
                                            <EmptyDescription>
                                                {resolvedEmptyDescription}
                                            </EmptyDescription>
                                        </EmptyHeader>
                                    </Empty>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination
                table={table}
                pageSizeOptions={pageSizeOptions}
            />
        </div>
    );
}

/**
 * Returns a standard row-selection column (checkbox header + checkbox cell)
 * that is identical across every resource table. Use once per `columns` array.
 */
export function createSelectColumn<TData>(): ColumnDef<TData, unknown> {
    const helper = createColumnHelper<TData>();

    return helper.display({
        id: 'select',
        size: 40,
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                indeterminate={table.getIsSomePageRowsSelected()}
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    }) as ColumnDef<TData, unknown>;
}
