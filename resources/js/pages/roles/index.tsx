import { Head } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/data-table';
import { DataTableFacetedFilter } from '@/components/data-table-faceted-filter';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-can';
import { useDataTablePage } from '@/hooks/use-data-table-page';
import { useInertiaLoading } from '@/hooks/use-inertia-loading';
import { index } from '@/routes/roles';
import type { Role } from '@/types';
import { BulkDeleteRolesDialog } from './bulk-delete-dialog';
import { columns } from './columns';
import { CreateRoleDialog } from './create-dialog';

type RolesPaginator = {
    data: Role[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
};

type RolesIndexProps = {
    roles: RolesPaginator;
    filters: {
        search?: string;
        guard?: string | null;
        sortBy?: string;
        sortDir?: 'asc' | 'desc';
        perPage?: number;
    };
    perPageOptions: number[];
    guardOptions: string[];
    permissions: Record<number, string>;
};

/**
 * Roles management index page.
 *
 * Renders a server-driven data table with search, guard filter, sort, and pagination.
 * Create and bulk-delete actions are permission-gated via `useCan()`.
 */
export default function RolesIndex({
    roles,
    filters,
    perPageOptions,
    guardOptions,
    permissions,
}: RolesIndexProps) {
    const [createOpen, setCreateOpen] = useState(false);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const loading = useInertiaLoading();
    const canCreate = useCan('create-roles');
    const canDelete = useCan('delete-roles');
    const { search, handleSearch, handleServerChange } = useDataTablePage(
        index().url,
        filters,
    );

    const guardFilterOptions = guardOptions.map((guard) => ({
        label: guard,
        value: guard,
    }));

    const filterSlot =
        guardFilterOptions.length > 0 ? (
            <DataTableFacetedFilter
                title="Guard"
                options={guardFilterOptions}
                value={filters.guard}
                onChange={(value) =>
                    handleServerChange({ guard: value, page: 1 })
                }
            />
        ) : undefined;

    const actionSlot = canCreate ? (
        <Button size="sm" className="h-8" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            Create Role
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
            <Head title="Roles" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Roles management"
                    description="Manage role assignments."
                />

                <DataTable
                    columns={columns}
                    data={roles.data}
                    getRowId={(row) => String(row.id)}
                    pagination={{
                        currentPage: roles.current_page,
                        perPage: roles.per_page,
                        total: roles.total,
                        lastPage: roles.last_page,
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
                        filters.guard
                            ? () =>
                                  handleServerChange({
                                      guard: undefined,
                                      page: 1,
                                  })
                            : undefined
                    }
                    tableKey="roles"
                    pageSizeOptions={perPageOptions}
                    loading={loading}
                />

                <CreateRoleDialog
                    open={createOpen}
                    onOpenChange={setCreateOpen}
                    permissions={permissions}
                />

                <BulkDeleteRolesDialog
                    ids={selectedIds}
                    open={bulkDeleteOpen}
                    onOpenChange={setBulkDeleteOpen}
                    onSuccess={() => setSelectedIds([])}
                />
            </div>
        </>
    );
}

RolesIndex.layout = {
    breadcrumbs: [{ title: 'Roles', href: index().url }],
};
