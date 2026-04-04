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
import { index } from '@/routes/permissions';
import type { Permission } from '@/types';
import { BulkDeletePermissionsDialog } from './bulk-delete-dialog';
import { columns } from './columns';
import { CreatePermissionDialog } from './create-dialog';

type PermissionsPaginator = {
    data: Permission[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
};

type PermissionsIndexProps = {
    permissions: PermissionsPaginator;
    filters: {
        search?: string;
        role?: string | null;
        sortBy?: string;
        sortDir?: 'asc' | 'desc';
        perPage?: number;
    };
    perPageOptions: number[];
    roleOptions: string[];
};

/**
 * Permissions management index page.
 *
 * Renders a server-driven data table with search, role filter, sort, and pagination.
 * Create and bulk-delete actions are permission-gated via `useCan()`.
 */
export default function PermissionsIndex({
    permissions,
    filters,
    perPageOptions,
    roleOptions,
}: PermissionsIndexProps) {
    const [createOpen, setCreateOpen] = useState(false);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const loading = useInertiaLoading();
    const canCreate = useCan('create-permissions');
    const canDelete = useCan('delete-permissions');
    const { search, handleSearch, handleServerChange } = useDataTablePage(
        index().url,
        filters,
    );

    const roleFilterOptions = roleOptions.map((role) => ({
        label: role,
        value: role,
    }));

    const filterSlot =
        roleFilterOptions.length > 0 ? (
            <DataTableFacetedFilter
                title="Role"
                options={roleFilterOptions}
                value={filters.role}
                onChange={(value) =>
                    handleServerChange({ role: value, page: 1 })
                }
            />
        ) : undefined;

    const actionSlot = canCreate ? (
        <Button size="sm" className="h-8" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            Create Permission
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
            <Head title="Permissions" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Permissions management"
                    description="Manage permissions."
                />

                <DataTable
                    columns={columns}
                    data={permissions.data}
                    getRowId={(row) => String(row.id)}
                    pagination={{
                        currentPage: permissions.current_page,
                        perPage: permissions.per_page,
                        total: permissions.total,
                        lastPage: permissions.last_page,
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
                        filters.role
                            ? () =>
                                  handleServerChange({
                                      role: undefined,
                                      page: 1,
                                  })
                            : undefined
                    }
                    tableKey="permissions"
                    pageSizeOptions={perPageOptions}
                    loading={loading}
                />

                <CreatePermissionDialog
                    open={createOpen}
                    onOpenChange={setCreateOpen}
                />

                <BulkDeletePermissionsDialog
                    ids={selectedIds}
                    open={bulkDeleteOpen}
                    onOpenChange={setBulkDeleteOpen}
                    onSuccess={() => setSelectedIds([])}
                />
            </div>
        </>
    );
}

PermissionsIndex.layout = {
    breadcrumbs: [{ title: 'Permissions', href: index().url }],
};
