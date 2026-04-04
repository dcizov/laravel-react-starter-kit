import { BulkDeleteResourceDialog } from '@/components/bulk-delete-resource-dialog';
import { destroyBulk } from '@/routes/tasks';

interface BulkDeleteTasksDialogProps {
    /** String IDs of the selected tasks to delete. */
    ids: string[];
    /** Controls dialog visibility. */
    open: boolean;
    /** Called whenever the dialog should open or close. */
    onOpenChange: (open: boolean) => void;
    /** Called after successful deletion — use this to clear the row selection state. */
    onSuccess: () => void;
}

/**
 * Confirmation dialog for bulk-deleting selected tasks.
 * The title adapts between singular/plural based on `ids.length`.
 * Wraps the generic `BulkDeleteResourceDialog`.
 */
export function BulkDeleteTasksDialog({
    ids,
    open,
    onOpenChange,
    onSuccess,
}: BulkDeleteTasksDialogProps) {
    return (
        <BulkDeleteResourceDialog
            title={`Delete ${ids.length} ${ids.length === 1 ? 'task' : 'tasks'}?`}
            description="This will permanently delete the selected tasks. This action cannot be undone."
            deleteUrl={destroyBulk().url}
            ids={ids}
            open={open}
            onOpenChange={onOpenChange}
            onSuccess={onSuccess}
        />
    );
}
