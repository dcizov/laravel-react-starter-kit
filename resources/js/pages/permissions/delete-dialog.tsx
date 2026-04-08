import { toast } from 'sonner';
import { DeleteResourceDialog } from '@/components/delete-resource-dialog';
import { destroy } from '@/routes/permissions';
import type { Permission } from '@/types';

interface DeletePermissionDialogProps {
    /** The permission to delete; its name is displayed in the confirmation message. */
    permission: Permission;
    /** Controls dialog visibility. */
    open: boolean;
    /** Called whenever the dialog should open or close. */
    onOpenChange: (open: boolean) => void;
}

/**
 * Confirmation dialog for permanently deleting a single permission.
 * Wraps the generic `DeleteResourceDialog` with a permission-specific message.
 */
export function DeletePermissionDialog({
    permission,
    open,
    onOpenChange,
}: DeletePermissionDialogProps) {
    return (
        <DeleteResourceDialog
            title="Delete permission?"
            description={
                <>
                    This will permanently delete{' '}
                    <span className="font-medium text-foreground">
                        {permission.name}
                    </span>
                    . This action cannot be undone.
                </>
            }
            deleteUrl={destroy(permission).url}
            open={open}
            onOpenChange={onOpenChange}
            onSuccess={() => toast.success('Permission deleted')}
        />
    );
}
