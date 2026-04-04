import { usePage } from '@inertiajs/react';
import { useState } from 'react';

import { DataTableRowActions } from '@/components/data-table-row-actions';
import { useCan } from '@/hooks/use-can';
import type { User } from '@/types';
import { DeleteUserDialog } from './delete-dialog';
import { EditUserDialog } from './edit-dialog';

interface UserRowActionsProps {
    /** The user record for this table row. */
    user: User;
    /**
     * Whether the user has 2FA enabled. When true, the edit dialog
     * shows a "Security" tab with a "Disable 2FA" action.
     */
    twoFactorEnabled?: boolean;
}

/**
 * Per-row edit/delete actions for the users table.
 *
 * Retrieves the `roles` map from shared Inertia page props so the edit dialog
 * can render the roles multi-select. Edit and delete options are only shown
 * when the user has the `edit-users` / `delete-users` permissions respectively.
 */
export function UserRowActions({
    user,
    twoFactorEnabled = false,
}: UserRowActionsProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const { roles } = usePage().props as unknown as {
        roles: Record<number, string>;
    };
    const canEdit = useCan('edit-users');
    const canDelete = useCan('delete-users');

    return (
        <>
            <DataTableRowActions
                editLabel="Edit user"
                deleteLabel="Delete user"
                onEdit={canEdit ? () => setEditOpen(true) : undefined}
                onDelete={canDelete ? () => setDeleteOpen(true) : undefined}
            />

            <EditUserDialog
                user={user}
                open={editOpen}
                onOpenChange={setEditOpen}
                twoFactorEnabled={twoFactorEnabled}
                roles={roles ?? {}}
            />

            <DeleteUserDialog
                user={user}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
            />
        </>
    );
}
