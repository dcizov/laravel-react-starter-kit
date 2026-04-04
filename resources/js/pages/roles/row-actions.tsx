import { usePage } from '@inertiajs/react';
import { useState } from 'react';

import { DataTableRowActions } from '@/components/data-table-row-actions';
import { useCan } from '@/hooks/use-can';
import type { Role } from '@/types';
import { DeleteRoleDialog } from './delete-dialog';
import { EditRoleDialog } from './edit-dialog';

interface RoleRowActionsProps {
    /** The role record for this table row. */
    role: Role;
}

/**
 * Per-row edit/delete actions for the roles table.
 *
 * Retrieves the `permissions` map from shared Inertia page props so the
 * edit dialog can render the permission multi-select.
 * Edit and delete options are only shown when the user has the corresponding permissions.
 */
export function RoleRowActions({ role }: RoleRowActionsProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const { permissions } = usePage().props as unknown as {
        permissions: Record<number, string>;
    };
    const canEdit = useCan('edit-roles');
    const canDelete = useCan('delete-roles');

    return (
        <>
            <DataTableRowActions
                editLabel="Edit role"
                deleteLabel="Delete role"
                onEdit={canEdit ? () => setEditOpen(true) : undefined}
                onDelete={canDelete ? () => setDeleteOpen(true) : undefined}
            />

            <EditRoleDialog
                role={role}
                open={editOpen}
                onOpenChange={setEditOpen}
                permissions={permissions ?? {}}
            />

            <DeleteRoleDialog
                role={role}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
            />
        </>
    );
}
