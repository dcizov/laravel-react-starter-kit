import { Head } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { ShieldCheck, ShieldX } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/data-table';
import { DataTableFacetedFilter } from '@/components/data-table-faceted-filter';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-can';
import { useDataTablePage } from '@/hooks/use-data-table-page';
import { useInertiaLoading } from '@/hooks/use-inertia-loading';
import { index } from '@/routes/users';
import type { User } from '@/types';
import { BulkDeleteUsersDialog } from './bulk-delete-dialog';
import { columns } from './columns';
import { CreateUserDialog } from './create-dialog';

type UsersPaginator = {
    data: User[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
};

type UsersIndexProps = {
    users: UsersPaginator;
    filters: {
        search?: string;
        verified?: string | null;
        role?: string | null;
        sortBy?: string;
        sortDir?: 'asc' | 'desc';
        perPage?: number;
    };
    perPageOptions: number[];
    roleOptions: string[];
    roles: Record<number, string>;
};

// No "All" option — clearing the filter shows all records.
const VERIFIED_OPTIONS = [
    { label: 'Verified', value: 'yes', icon: ShieldCheck },
    { label: 'Unverified', value: 'no', icon: ShieldX },
];

/**
 * Users management index page.
 *
 * Renders a server-driven data table with search, verified-status filter, and role filter.
 * Create and bulk-delete actions are permission-gated via `useCan()`.
 */
export default function UsersIndex({
    users,
    filters,
    perPageOptions,
    roleOptions,
}: UsersIndexProps) {
    const [createOpen, setCreateOpen] = useState(false);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const loading = useInertiaLoading();
    const canCreate = useCan('create-users');
    const canDelete = useCan('delete-users');
    const { search, handleSearch, handleServerChange } = useDataTablePage(
        index().url,
        filters,
    );

    const roleFilterOptions = roleOptions.map((role) => ({
        label: role,
        value: role,
    }));

    const filterSlot = (
        <>
            <DataTableFacetedFilter
                title="Verified"
                options={VERIFIED_OPTIONS}
                value={filters.verified}
                onChange={(value) =>
                    handleServerChange({ verified: value, page: 1 })
                }
            />
            {roleFilterOptions.length > 0 && (
                <DataTableFacetedFilter
                    title="Role"
                    options={roleFilterOptions}
                    value={filters.role}
                    onChange={(value) =>
                        handleServerChange({ role: value, page: 1 })
                    }
                />
            )}
        </>
    );

    const actionSlot = canCreate ? (
        <Button size="sm" className="h-8" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            Create User
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
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Users management"
                    description="Manage user accounts."
                />

                <DataTable
                    columns={columns}
                    data={users.data}
                    getRowId={(row) => String(row.id)}
                    pagination={{
                        currentPage: users.current_page,
                        perPage: users.per_page,
                        total: users.total,
                        lastPage: users.last_page,
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
                        filters.verified || filters.role
                            ? () =>
                                  handleServerChange({
                                      verified: undefined,
                                      role: undefined,
                                      page: 1,
                                  })
                            : undefined
                    }
                    tableKey="users"
                    pageSizeOptions={perPageOptions}
                    loading={loading}
                />

                <CreateUserDialog
                    open={createOpen}
                    onOpenChange={setCreateOpen}
                    roles={roleOptions}
                />

                <BulkDeleteUsersDialog
                    ids={selectedIds}
                    open={bulkDeleteOpen}
                    onOpenChange={setBulkDeleteOpen}
                    onSuccess={() => setSelectedIds([])}
                />
            </div>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [{ title: 'Users', href: index().url }],
};
