import { toast } from 'sonner';
import { BulkDeleteResourceDialog } from '@/components/bulk-delete-resource-dialog';
import { destroyBulk } from '@/routes/users';

interface BulkDeleteUsersDialogProps {
    /** String IDs of the selected users to delete. */
    ids: string[];
    /** Controls dialog visibility. */
    open: boolean;
    /** Called whenever the dialog should open or close. */
    onOpenChange: (open: boolean) => void;
    /** Called after successful deletion — use this to clear the row selection state. */
    onSuccess: () => void;
}

/**
 * Confirmation dialog for bulk-deleting selected user accounts.
 * The title adapts between singular/plural based on `ids.length`.
 * Wraps the generic `BulkDeleteResourceDialog`.
 */
export function BulkDeleteUsersDialog({
    ids,
    open,
    onOpenChange,
    onSuccess,
}: BulkDeleteUsersDialogProps) {
    return (
        <BulkDeleteResourceDialog
            title={`Delete ${ids.length} ${ids.length === 1 ? 'user' : 'users'}?`}
            description="This will permanently delete the selected users. This action cannot be undone."
            deleteUrl={destroyBulk().url}
            ids={ids}
            open={open}
            onOpenChange={onOpenChange}
            onSuccess={() => {
                toast.success(
                    `${ids.length} ${ids.length === 1 ? 'user' : 'users'} deleted`,
                );
                onSuccess();
            }}
        />
    );
}
