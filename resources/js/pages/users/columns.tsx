import { createColumnHelper } from '@tanstack/react-table';
import { CheckCircle2, XCircle } from 'lucide-react';

import { BadgeOverflowList } from '@/components/badge-overflow-list';
import { createSelectColumn } from '@/components/data-table';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import type { User } from '@/types';
import { UserRowActions } from './row-actions';

const columnHelper = createColumnHelper<User>();

export const columns = [
    createSelectColumn<User>(),
    columnHelper.accessor('name', {
        meta: { label: 'Name' },
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ getValue }) => (
            <span className="font-medium">{getValue()}</span>
        ),
    }),
    columnHelper.accessor('email', {
        meta: { label: 'Email' },
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
    }),
    columnHelper.accessor('email_verified_at', {
        meta: { label: 'Verified' },
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Verified" />
        ),
        size: 110,
        cell: ({ getValue }) => {
            const verified = getValue();

            return verified ? (
                <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                >
                    <CheckCircle2 />
                    Yes
                </Badge>
            ) : (
                <Badge variant="outline" className="text-muted-foreground">
                    <XCircle />
                    No
                </Badge>
            );
        },
    }),
    columnHelper.accessor('roles', {
        meta: { label: 'Role' },
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Role" />
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
        cell: ({ row }) => (
            <UserRowActions
                user={row.original}
                twoFactorEnabled={row.original.two_factor_enabled ?? false}
            />
        ),
    }),
];
