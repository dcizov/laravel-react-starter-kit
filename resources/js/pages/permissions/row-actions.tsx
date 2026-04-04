import { useState } from 'react';

import { DataTableRowActions } from '@/components/data-table-row-actions';
import { useCan } from '@/hooks/use-can';
import type { Permission } from '@/types';
import { DeletePermissionDialog } from './delete-dialog';
import { EditPermissionDialog } from './edit-dialog';

interface PermissionRowActionsProps {
    /** The permission record for this table row. */
    permission: Permission;
}

/**
 * Per-row edit/delete actions for the permissions table.
 *
 * Edit and delete options are only shown when the authenticated user has
 * the `edit-permissions` / `delete-permissions` permissions respectively.
 * Each option opens its corresponding dialog.
 */
export function PermissionRowActions({
    permission,
}: PermissionRowActionsProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const canEdit = useCan('edit-permissions');
    const canDelete = useCan('delete-permissions');

    return (
        <>
            <DataTableRowActions
                editLabel="Edit permission"
                deleteLabel="Delete permission"
                onEdit={canEdit ? () => setEditOpen(true) : undefined}
                onDelete={canDelete ? () => setDeleteOpen(true) : undefined}
            />

            <EditPermissionDialog
                permission={permission}
                open={editOpen}
                onOpenChange={setEditOpen}
            />

            <DeletePermissionDialog
                permission={permission}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
            />
        </>
    );
}
