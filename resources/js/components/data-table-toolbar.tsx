'use no memo';

import type { Table } from '@tanstack/react-table';
import { Check, Settings2, X } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    search?: string;
    onSearch?: (value: string) => void;
    filterSlot?: ReactNode;
    actionSlot?: ReactNode;
    bulkActionSlot?: ReactNode;
    onResetFilters?: () => void;
}

/**
 * Toolbar for data tables with search, filters, column visibility, and action slots.
 *
 * `bulkActionSlot` replaces `actionSlot` when rows are selected.
 */
export function DataTableToolbar<TData>({
    table,
    search,
    onSearch,
    filterSlot,
    actionSlot,
    bulkActionSlot,
    onResetFilters,
}: DataTableToolbarProps<TData>) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2">
                {onSearch !== undefined && (
                    <Input
                        placeholder="Search..."
                        value={search ?? ''}
                        onChange={(e) => onSearch(e.target.value)}
                        className="h-8 max-w-xs"
                    />
                )}

                {filterSlot}

                {onResetFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={onResetFilters}
                    >
                        Reset
                        <X className="ml-1 size-4" />
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button
                                variant="outline"
                                size="sm"
                                className="ml-auto hidden h-8 lg:flex"
                            >
                                <Settings2 />
                                View
                            </Button>
                        }
                    />
                    <DropdownMenuContent align="end" className="w-37.5">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>
                                Toggle columns
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !==
                                            'undefined' && column.getCanHide(),
                                )
                                .map((column) => {
                                    const isVisible = column.getIsVisible();

                                    return (
                                        <DropdownMenuItem
                                            key={column.id}
                                            onClick={() =>
                                                column.toggleVisibility(
                                                    !isVisible,
                                                )
                                            }
                                        >
                                            <span className="flex w-full items-center gap-2">
                                                {isVisible ? (
                                                    <Check className="size-4" />
                                                ) : (
                                                    <span className="size-4" />
                                                )}
                                                {column.columnDef.meta?.label ??
                                                    column.id}
                                            </span>
                                        </DropdownMenuItem>
                                    );
                                })}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                {table.getSelectedRowModel().rows.length > 0 && bulkActionSlot
                    ? bulkActionSlot
                    : actionSlot}
            </div>
        </div>
    );
}
