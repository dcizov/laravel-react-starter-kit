import { useState } from 'react';

import { DataTableRowActions } from '@/components/data-table-row-actions';
import { useCan } from '@/hooks/use-can';
import type { Task } from '@/types';

import { DeleteTaskDialog } from './delete-dialog';
import { EditTaskDialog } from './edit-dialog';

interface TaskRowActionsProps {
    /** The task record for this table row. */
    task: Task;
}

/**
 * Per-row edit/delete actions for the tasks table.
 *
 * Edit and delete options are only shown when the user has the
 * `edit-tasks` / `delete-tasks` permissions respectively.
 */
export function TaskRowActions({ task }: TaskRowActionsProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const canEdit = useCan('edit-tasks');
    const canDelete = useCan('delete-tasks');

    return (
        <>
            <DataTableRowActions
                editLabel="Edit task"
                deleteLabel="Delete task"
                onEdit={canEdit ? () => setEditOpen(true) : undefined}
                onDelete={canDelete ? () => setDeleteOpen(true) : undefined}
            />

            <EditTaskDialog
                task={task}
                open={editOpen}
                onOpenChange={setEditOpen}
            />

            <DeleteTaskDialog
                task={task}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
            />
        </>
    );
}
