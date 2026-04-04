import { createColumnHelper } from '@tanstack/react-table';
import {
    ArrowDown,
    ArrowRight,
    ArrowUp,
    CheckCircle,
    Circle,
    CircleOff,
    Timer,
} from 'lucide-react';

import { createSelectColumn } from '@/components/data-table';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import type { Task } from '@/types';

import { TaskRowActions } from './row-actions';

const columnHelper = createColumnHelper<Task>();

/**
 * Label and icon mapping for each task status.
 * Used to render status cells consistently across the table and dialogs.
 */
const statusConfig: Record<
    Task['status'],
    { label: string; icon: React.ElementType }
> = {
    todo: { label: 'Todo', icon: Circle },
    'in-progress': { label: 'In Progress', icon: Timer },
    done: { label: 'Done', icon: CheckCircle },
    canceled: { label: 'Canceled', icon: CircleOff },
};

/**
 * Label and icon mapping for each task priority level.
 * Used to render priority cells consistently across the table and dialogs.
 */
const priorityConfig: Record<
    Task['priority'],
    { label: string; icon: React.ElementType }
> = {
    low: { label: 'Low', icon: ArrowDown },
    medium: { label: 'Medium', icon: ArrowRight },
    high: { label: 'High', icon: ArrowUp },
};

/**
 * Tailwind class map for task label badges.
 * - bug → red, feature → blue, enhancement → purple, documentation → green
 */
const labelColors: Record<Task['label'], string> = {
    bug: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    feature: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    enhancement:
        'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    documentation:
        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export const columns = [
    createSelectColumn<Task>(),

    columnHelper.accessor('id', {
        meta: { label: 'ID' },
        size: 60,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID" />
        ),
        cell: ({ getValue }) => (
            <span className="text-xs text-muted-foreground">
                TASK-{getValue()}
            </span>
        ),
        enableHiding: false,
    }),

    columnHelper.accessor('title', {
        meta: { label: 'Title' },
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: ({ row }) => {
            const label = row.original.label;
            const labelColor = labelColors[label];
            const labelText = label.charAt(0).toUpperCase() + label.slice(1);

            return (
                <div className="flex items-center gap-2">
                    <Badge
                        variant="outline"
                        className={`shrink-0 text-xs font-medium ${labelColor}`}
                    >
                        {labelText}
                    </Badge>
                    <span className="max-w-xs truncate font-medium">
                        {row.original.title}
                    </span>
                </div>
            );
        },
    }),

    columnHelper.accessor('status', {
        meta: { label: 'Status' },
        size: 120,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ getValue }) => {
            const status = getValue();
            const config = statusConfig[status];
            const Icon = config.icon;

            return (
                <div className="flex items-center gap-2">
                    <Icon className="size-4 text-muted-foreground" />
                    <span>{config.label}</span>
                </div>
            );
        },
    }),

    columnHelper.accessor('priority', {
        meta: { label: 'Priority' },
        size: 110,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Priority" />
        ),
        cell: ({ getValue }) => {
            const priority = getValue();
            const config = priorityConfig[priority];
            const Icon = config.icon;

            return (
                <div className="flex items-center gap-2">
                    <Icon className="size-4 text-muted-foreground" />
                    <span>{config.label}</span>
                </div>
            );
        },
    }),

    columnHelper.display({
        id: 'actions',
        size: 40,
        meta: { cellClassName: 'text-right' },
        enableHiding: false,
        cell: ({ row }) => <TaskRowActions task={row.original} />,
    }),
];

export { statusConfig, priorityConfig };
