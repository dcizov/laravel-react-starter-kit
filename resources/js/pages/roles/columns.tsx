import { createColumnHelper } from '@tanstack/react-table';
import { ShieldCheck, Users } from 'lucide-react';

import { BadgeOverflowList } from '@/components/badge-overflow-list';
import { createSelectColumn } from '@/components/data-table';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import type { Role } from '@/types';
import { RoleRowActions } from './row-actions';

const columnHelper = createColumnHelper<Role>();

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
    createSelectColumn<Role>(),
    columnHelper.accessor('name', {
        meta: { label: 'Name' },
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ getValue }) => (
            <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-muted-foreground" />
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
    columnHelper.accessor('permissions', {
        meta: { label: 'Permissions' },
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Permissions" />
        ),
        enableSorting: false,
        cell: ({ getValue }) => <BadgeOverflowList items={getValue() ?? []} />,
    }),
    columnHelper.accessor('users_count', {
        meta: { label: 'Users' },
        size: 90,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Users" />
        ),
        enableSorting: false,
        cell: ({ getValue }) => (
            <div className="flex items-center gap-2">
                <Users className="size-4 text-muted-foreground" />
                <span>{getValue() ?? 0}</span>
            </div>
        ),
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
        cell: ({ row }) => <RoleRowActions role={row.original} />,
    }),
];
