import { Form } from '@inertiajs/react';
import { toast } from 'sonner';

import PermissionController from '@/actions/App/Http/Controllers/Permissions/PermissionController';
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
import { Spinner } from '@/components/ui/spinner';
import type { Permission } from '@/types';

interface EditPermissionDialogProps {
    /** The permission to edit; its current values are used as form defaults. */
    permission: Permission;
    /** Controls dialog visibility. */
    open: boolean;
    /** Called whenever the dialog should open or close. */
    onOpenChange: (open: boolean) => void;
}

/**
 * Dialog for editing an existing permission.
 *
 * Submits to `PermissionController::update` via Inertia's `<Form>` with
 * `preserveScroll: true` so the table position is maintained.
 * The `key={permission.id}` ensures the form resets when a different
 * permission is opened. The dialog closes automatically on success.
 */
export function EditPermissionDialog({
    permission,
    open,
    onOpenChange,
}: EditPermissionDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange} key={permission.id}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit permission</DialogTitle>
                    <DialogDescription>
                        Manage settings for{' '}
                        <span className="font-medium text-foreground">
                            {permission.name}
                        </span>
                        .
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...PermissionController.update.form(permission)}
                    disableWhileProcessing
                    options={{ preserveScroll: true }}
                    onSuccess={() => {
                        toast.success('Permission updated');
                        onOpenChange(false);
                    }}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label
                                    htmlFor={`edit-permission-name-${permission.id}`}
                                >
                                    Name
                                </Label>
                                <Input
                                    id={`edit-permission-name-${permission.id}`}
                                    defaultValue={permission.name}
                                    name="name"
                                    required
                                    autoFocus
                                    autoComplete="off"
                                    placeholder="permission name"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor={`edit-permission-guard-name-${permission.id}`}
                                >
                                    Guard Name
                                </Label>
                                <Input
                                    id={`edit-permission-guard-name-${permission.id}`}
                                    defaultValue={permission.guard_name}
                                    name="guard_name"
                                    required
                                    autoComplete="off"
                                    placeholder="Guard name"
                                />
                                <InputError message={errors.guard_name} />
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
