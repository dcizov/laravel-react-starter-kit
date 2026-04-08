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

interface CreateTaskDialogProps {
    /** Controls dialog visibility. */
    open: boolean;
    /** Called whenever the dialog should open or close. */
    onOpenChange: (open: boolean) => void;
}

/**
 * Dialog for creating a new task.
 *
 * Maintains controlled state for status (default: 'todo'), label (default: 'feature'),
 * and priority (default: 'medium'). All three are reset to defaults on successful
 * submission so the next creation starts with sensible values.
 * Submits to `TaskController::store` via Inertia's `<Form>`.
 */
export function CreateTaskDialog({
    open,
    onOpenChange,
}: CreateTaskDialogProps) {
    const [status, setStatus] = useState<Task['status']>('todo');
    const [label, setLabel] = useState<Task['label']>('feature');
    const [priority, setPriority] = useState<Task['priority']>('medium');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create task</DialogTitle>
                    <DialogDescription>
                        Add a new task to your board.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...TaskController.store.form()}
                    disableWhileProcessing
                    onSuccess={() => {
                        toast.success('Task created');
                        setStatus('todo');
                        setLabel('feature');
                        setPriority('medium');
                        onOpenChange(false);
                    }}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="create-task-title">Title</Label>
                                <Input
                                    id="create-task-title"
                                    type="text"
                                    required
                                    autoFocus
                                    name="title"
                                    placeholder="Task title"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create-task-status">
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
                                        id="create-task-status"
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
                                <Label htmlFor="create-task-label">Label</Label>
                                <Select
                                    name="label"
                                    value={label}
                                    onValueChange={(v) =>
                                        setLabel(v as Task['label'])
                                    }
                                >
                                    <SelectTrigger
                                        id="create-task-label"
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
                                <Label htmlFor="create-task-priority">
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
                                        id="create-task-priority"
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

                            <Button type="submit" className="w-full">
                                {processing && <Spinner />}
                                Create task
                            </Button>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
