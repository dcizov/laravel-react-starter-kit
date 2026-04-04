import { createColumnHelper } from '@tanstack/react-table';
import { KeyRound } from 'lucide-react';

import { BadgeOverflowList } from '@/components/badge-overflow-list';
import { createSelectColumn } from '@/components/data-table';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import type { Permission } from '@/types';
import { PermissionRowActions } from './row-actions';

const columnHelper = createColumnHelper<Permission>();

/**
 * Tailwind class map for guard name badges.
 * - `web` guard → blue
 * - `api` guard → amber
 * Unknown guards receive no extra styling.
 */
const guardColors: Record<string, string> = {
    web: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    api: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

export const columns = [
    createSelectColumn<Permission>(),
    columnHelper.accessor('name', {
        meta: { label: 'Name' },
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ getValue }) => (
            <div className="flex items-center gap-2">
                <KeyRound className="size-4 text-muted-foreground" />
                <span className="font-medium">{getValue()}</span>
            </div>
        ),
    }),
    columnHelper.accessor('guard_name', {
        meta: { label: 'Guard Name' },
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Guard Name" />
        ),
        cell: ({ getValue }) => {
            const guard = getValue();

            return (
                <Badge variant="outline" className={guardColors[guard] ?? ''}>
                    {guard}
                </Badge>
            );
        },
    }),
    columnHelper.accessor('roles', {
        meta: { label: 'Roles' },
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Roles" />
        ),
        enableSorting: false,
        cell: ({ getValue }) => <BadgeOverflowList items={getValue() ?? []} />,
    }),
    columnHelper.accessor('created_at', {
        meta: { label: 'Created' },
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created" />
        ),
        cell: ({ getValue }) => formatDate(getValue()),
    }),
    columnHelper.accessor('updated_at', {
        meta: { label: 'Updated' },
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Updated" />
        ),
        cell: ({ getValue }) => formatDate(getValue()),
    }),
    columnHelper.display({
        id: 'actions',
        size: 40,
        meta: { cellClassName: 'text-right' },
        enableHiding: false,
        cell: ({ row }) => <PermissionRowActions permission={row.original} />,
    }),
];
