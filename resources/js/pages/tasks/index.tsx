import { Head } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowRight,
    ArrowUp,
    CheckCircle,
    Circle,
    CircleOff,
    Plus,
    Timer,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

import { DataTable } from '@/components/data-table';
import { DataTableFacetedFilter } from '@/components/data-table-faceted-filter';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-can';
import { useDataTablePage } from '@/hooks/use-data-table-page';
import { useInertiaLoading } from '@/hooks/use-inertia-loading';
import { index } from '@/routes/tasks';
import type { Task } from '@/types';

import { BulkDeleteTasksDialog } from './bulk-delete-dialog';
import { columns } from './columns';
import { CreateTaskDialog } from './create-dialog';

type TasksPaginator = {
    data: Task[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
};

type TasksIndexProps = {
    tasks: TasksPaginator;
    filters: {
        search?: string;
        status?: string[] | null;
        label?: string[] | null;
        priority?: string[] | null;
        sortBy?: string;
        sortDir?: 'asc' | 'desc';
        perPage?: number;
    };
    perPageOptions: number[];
};

const STATUS_OPTIONS = [
    { label: 'Todo', value: 'todo', icon: Circle },
    { label: 'In Progress', value: 'in-progress', icon: Timer },
    { label: 'Done', value: 'done', icon: CheckCircle },
    { label: 'Canceled', value: 'canceled', icon: CircleOff },
];

const PRIORITY_OPTIONS = [
    { label: 'Low', value: 'low', icon: ArrowDown },
    { label: 'Medium', value: 'medium', icon: ArrowRight },
    { label: 'High', value: 'high', icon: ArrowUp },
];

const LABEL_OPTIONS = [
    { label: 'Bug', value: 'bug' },
    { label: 'Feature', value: 'feature' },
    { label: 'Enhancement', value: 'enhancement' },
    { label: 'Documentation', value: 'documentation' },
];

/**
 * Tasks management index page.
 *
 * Renders a server-driven data table with three simultaneous multi-value faceted filters
 * (status, priority, label). Create and bulk-delete actions are permission-gated.
 */
export default function TasksIndex({
    tasks,
    filters,
    perPageOptions,
}: TasksIndexProps) {
    const [createOpen, setCreateOpen] = useState(false);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const loading = useInertiaLoading();
    const canCreate = useCan('create-tasks');
    const canDelete = useCan('delete-tasks');
    const { search, handleSearch, handleServerChange } = useDataTablePage(
        index().url,
        filters,
    );

    const filterSlot = (
        <>
            <DataTableFacetedFilter
                multiple
                title="Status"
                options={STATUS_OPTIONS}
                value={filters.status ?? undefined}
                onChange={(value) =>
                    handleServerChange({ status: value, page: 1 })
                }
            />
            <DataTableFacetedFilter
                multiple
                title="Priority"
                options={PRIORITY_OPTIONS}
                value={filters.priority ?? undefined}
                onChange={(value) =>
                    handleServerChange({ priority: value, page: 1 })
                }
            />
            <DataTableFacetedFilter
                multiple
                title="Label"
                options={LABEL_OPTIONS}
                value={filters.label ?? undefined}
                onChange={(value) =>
                    handleServerChange({ label: value, page: 1 })
                }
            />
        </>
    );

    const actionSlot = canCreate ? (
        <Button size="sm" className="h-8" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            Create Task
        </Button>
    ) : undefined;

    const bulkActionSlot = canDelete ? (
        <Button
            size="sm"
            variant="destructive"
            className="h-8"
            onClick={() => setBulkDeleteOpen(true)}
        >
            <Trash2 className="size-4" />
            Delete {selectedIds.length} selected
        </Button>
    ) : undefined;

    return (
        <>
            <Head title="Tasks" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Tasks"
                    description="Manage and track your tasks."
                />

                <DataTable
                    columns={columns}
                    data={tasks.data}
                    getRowId={(row) => String(row.id)}
                    pagination={{
                        currentPage: tasks.current_page,
                        perPage: tasks.per_page,
                        total: tasks.total,
                        lastPage: tasks.last_page,
                    }}
                    sortBy={filters.sortBy}
                    sortDir={filters.sortDir}
                    search={search}
                    onSearch={handleSearch}
                    onServerChange={handleServerChange}
                    filterSlot={filterSlot}
                    actionSlot={actionSlot}
                    bulkActionSlot={bulkActionSlot}
                    onSelectionChange={setSelectedIds}
                    onResetFilters={
                        filters.status?.length ||
                        filters.priority?.length ||
                        filters.label?.length
                            ? () =>
                                  handleServerChange({
                                      status: undefined,
                                      priority: undefined,
                                      label: undefined,
                                      page: 1,
                                  })
                            : undefined
                    }
                    tableKey="tasks"
                    pageSizeOptions={perPageOptions}
                    loading={loading}
                    emptyTitle="No tasks found"
                    emptyDescription={(s) =>
                        s
                            ? `No tasks matching "${s}". Try a different search term or clear filters.`
                            : 'No tasks yet. Create your first task to get started.'
                    }
                />

                <CreateTaskDialog
                    open={createOpen}
                    onOpenChange={setCreateOpen}
                />

                <BulkDeleteTasksDialog
                    ids={selectedIds}
                    open={bulkDeleteOpen}
                    onOpenChange={setBulkDeleteOpen}
                    onSuccess={() => setSelectedIds([])}
                />
            </div>
        </>
    );
}

TasksIndex.layout = {
    breadcrumbs: [{ title: 'Tasks', href: index().url }],
};
