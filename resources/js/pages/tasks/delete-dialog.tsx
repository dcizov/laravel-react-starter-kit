import { DeleteResourceDialog } from '@/components/delete-resource-dialog';
import { destroy } from '@/routes/tasks';
import type { Task } from '@/types';

interface DeleteTaskDialogProps {
    /** The task to delete; its ID is shown in the confirmation message as "TASK-{id}". */
    task: Task;
    /** Controls dialog visibility. */
    open: boolean;
    /** Called whenever the dialog should open or close. */
    onOpenChange: (open: boolean) => void;
}

/**
 * Confirmation dialog for permanently deleting a single task.
 * Wraps the generic `DeleteResourceDialog` with a task-specific message.
 */
export function DeleteTaskDialog({
    task,
    open,
    onOpenChange,
}: DeleteTaskDialogProps) {
    return (
        <DeleteResourceDialog
            title="Delete task?"
            description={
                <>
                    This will permanently delete{' '}
                    <span className="font-medium text-foreground">
                        TASK-{task.id}
                    </span>
                    . This action cannot be undone.
                </>
            }
            deleteUrl={destroy(task).url}
            open={open}
            onOpenChange={onOpenChange}
        />
    );
}
