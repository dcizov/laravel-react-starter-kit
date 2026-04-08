import { Form } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

import TaskController from '@/actions/App/Http/Controllers/Tasks/TaskController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import type { Task } from '@/types';

const STATUS_LABELS: Record<Task['status'], string> = {
    todo: 'Todo',
    'in-progress': 'In Progress',
    done: 'Done',
    canceled: 'Canceled',
};

const LABEL_LABELS: Record<Task['label'], string> = {
    bug: 'Bug',
    feature: 'Feature',
    enhancement: 'Enhancement',
    documentation: 'Documentation',
};

const PRIORITY_LABELS: Record<Task['priority'], string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
};

interface EditTaskDialogProps {
    /** The task to edit; its current values are used to initialise controlled selects. */
    task: Task;
    /** Controls dialog visibility. */
    open: boolean;
    /** Called whenever the dialog should open or close. */
    onOpenChange: (open: boolean) => void;
}

/**
 * Dialog for editing an existing task.
 *
 * Status, label, and priority are controlled state initialised from `task` values.
 * Uses `key={task.id}` to ensure state resets when a different task is opened.
 * Submits to `TaskController::update` with `preserveScroll`.
 */
export function EditTaskDialog({
    task,
    open,
    onOpenChange,
}: EditTaskDialogProps) {
    const [status, setStatus] = useState<Task['status']>(task.status);
    const [label, setLabel] = useState<Task['label']>(task.label);
    const [priority, setPriority] = useState<Task['priority']>(task.priority);

    return (
        <Dialog open={open} onOpenChange={onOpenChange} key={task.id}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit task</DialogTitle>
                    <DialogDescription>
                        Update details for{' '}
                        <span className="font-medium text-foreground">
                            TASK-{task.id}
                        </span>
                        .
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...TaskController.update.form(task)}
                    disableWhileProcessing
                    options={{ preserveScroll: true }}
                    onSuccess={() => {
                        toast.success('Task updated');
                        onOpenChange(false);
                    }}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor={`edit-task-title-${task.id}`}>
                                    Title
                                </Label>
                                <Input
                                    id={`edit-task-title-${task.id}`}
                                    type="text"
                                    required
                                    autoFocus
                                    name="title"
                                    defaultValue={task.title}
                                    placeholder="Task title"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor={`edit-task-status-${task.id}`}>
                                    Status
                                </Label>
                                <Select
                                    name="status"
                                    value={status}
                                    onValueChange={(v) =>
                                        setStatus(v as Task['status'])
                                    }
                                >
                                    <SelectTrigger
                                        id={`edit-task-status-${task.id}`}
                                        className="w-full"
                                    >
                                        <SelectValue>
                                            {STATUS_LABELS[status]}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todo">
                                            Todo
                                        </SelectItem>
                                        <SelectItem value="in-progress">
                                            In Progress
                                        </SelectItem>
                                        <SelectItem value="done">
                                            Done
                                        </SelectItem>
                                        <SelectItem value="canceled">
                                            Canceled
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor={`edit-task-label-${task.id}`}>
                                    Label
                                </Label>
                                <Select
                                    name="label"
                                    value={label}
                                    onValueChange={(v) =>
                                        setLabel(v as Task['label'])
                                    }
                                >
                                    <SelectTrigger
                                        id={`edit-task-label-${task.id}`}
                                        className="w-full"
                                    >
                                        <SelectValue>
                                            {LABEL_LABELS[label]}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bug">Bug</SelectItem>
                                        <SelectItem value="feature">
                                            Feature
                                        </SelectItem>
                                        <SelectItem value="enhancement">
                                            Enhancement
                                        </SelectItem>
                                        <SelectItem value="documentation">
                                            Documentation
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.label} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor={`edit-task-priority-${task.id}`}
                                >
                                    Priority
                                </Label>
                                <Select
                                    name="priority"
                                    value={priority}
                                    onValueChange={(v) =>
                                        setPriority(v as Task['priority'])
                                    }
                                >
                                    <SelectTrigger
                                        id={`edit-task-priority-${task.id}`}
                                        className="w-full"
                                    >
                                        <SelectValue>
                                            {PRIORITY_LABELS[priority]}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">
                                            Medium
                                        </SelectItem>
                                        <SelectItem value="high">
                                            High
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.priority} />
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing && <Spinner />}
                                Save changes
                            </Button>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
