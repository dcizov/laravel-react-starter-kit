import { toast } from 'sonner';
import { BulkDeleteResourceDialog } from '@/components/bulk-delete-resource-dialog';
import { destroyBulk } from '@/routes/roles';

interface BulkDeleteRolesDialogProps {
    /** String IDs of the selected roles to delete. */
    ids: string[];
    /** Controls dialog visibility. */
    open: boolean;
    /** Called whenever the dialog should open or close. */
    onOpenChange: (open: boolean) => void;
    /** Called after successful deletion — use this to clear the row selection state. */
    onSuccess: () => void;
}

/**
 * Confirmation dialog for bulk-deleting selected roles.
 * The title adapts between singular/plural based on `ids.length`.
 * Wraps the generic `BulkDeleteResourceDialog`.
 */
export function BulkDeleteRolesDialog({
    ids,
    open,
    onOpenChange,
    onSuccess,
}: BulkDeleteRolesDialogProps) {
    return (
        <BulkDeleteResourceDialog
            title={`Delete ${ids.length} ${ids.length === 1 ? 'role' : 'roles'}?`}
            description="This will permanently delete the selected roles. This action cannot be undone."
            deleteUrl={destroyBulk().url}
            ids={ids}
            open={open}
            onOpenChange={onOpenChange}
            onSuccess={() => {
                toast.success(
                    `${ids.length} ${ids.length === 1 ? 'role' : 'roles'} deleted`,
                );
                onSuccess();
            }}
        />
    );
}
