import { DeleteResourceDialog } from '@/components/delete-resource-dialog';
import { destroy } from '@/routes/roles';
import type { Role } from '@/types';

interface DeleteRoleDialogProps {
    /** The role to delete; its name is displayed in the confirmation message. */
    role: Role;
    /** Controls dialog visibility. */
    open: boolean;
    /** Called whenever the dialog should open or close. */
    onOpenChange: (open: boolean) => void;
}

/**
 * Confirmation dialog for permanently deleting a single role.
 * Wraps the generic `DeleteResourceDialog` with a role-specific message.
 */
export function DeleteRoleDialog({
    role,
    open,
    onOpenChange,
}: DeleteRoleDialogProps) {
    return (
        <DeleteResourceDialog
            title="Delete role?"
            description={
                <>
                    This will permanently delete{' '}
                    <span className="font-medium text-foreground">
                        {role.name}
                    </span>
                    . This action cannot be undone.
                </>
            }
            deleteUrl={destroy(role).url}
            open={open}
            onOpenChange={onOpenChange}
        />
    );
}
