import { Form } from '@inertiajs/react';
import { useState } from 'react';

import RoleController from '@/actions/App/Http/Controllers/Roles/RoleController';
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
import { MultiSelect } from '@/components/ui/multi-select';
import { Spinner } from '@/components/ui/spinner';
import type { Role } from '@/types';

interface EditRoleDialogProps {
    /** The role to edit; its current values are used as form defaults. */
    role: Role;
    /** Controls dialog visibility. */
    open: boolean;
    /** Called whenever the dialog should open or close. */
    onOpenChange: (open: boolean) => void;
    /** Available permissions for assignment, keyed by ID. Rendered in a `MultiSelect`. */
    permissions: Record<number, string>;
}

/**
 * Dialog for editing an existing role's name, guard, and permissions.
 *
 * Permissions are managed via `MultiSelect` with controlled `selectedPermissions` state
 * initialized from `role.permissions`. Uses `key={role.id}` to reset state when
 * a different role is opened. Submits to `RoleController::update` with `preserveScroll`.
 */
export function EditRoleDialog({
    role,
    open,
    onOpenChange,
    permissions,
}: EditRoleDialogProps) {
    const permissionOptions = (
        Object.entries(permissions) as [string, string][]
    ).map(([id, name]) => ({ value: id, label: name }));

    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
        () => (role.permissions ?? []).map((p) => String(p.id)),
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange} key={role.id}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit role</DialogTitle>
                    <DialogDescription>
                        Manage settings for{' '}
                        <span className="font-medium text-foreground">
                            {role.name}
                        </span>
                        .
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...RoleController.update.form(role)}
                    disableWhileProcessing
                    options={{ preserveScroll: true }}
                    onSuccess={() => onOpenChange(false)}
                    className="space-y-4 pt-2"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor={`edit-role-name-${role.id}`}>
                                    Name
                                </Label>
                                <Input
                                    id={`edit-role-name-${role.id}`}
                                    defaultValue={role.name}
                                    name="name"
                                    required
                                    autoFocus
                                    autoComplete="off"
                                    placeholder="Role name"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor={`edit-role-guard-name-${role.id}`}
                                >
                                    Guard Name
                                </Label>
                                <Input
                                    id={`edit-role-guard-name-${role.id}`}
                                    defaultValue={role.guard_name}
                                    name="guard_name"
                                    required
                                    autoComplete="off"
                                    placeholder="Guard name"
                                />
                                <InputError message={errors.guard_name} />
                            </div>

                            {permissionOptions.length > 0 && (
                                <div className="grid gap-2">
                                    <Label>Permissions</Label>
                                    <MultiSelect
                                        name="permission_ids[]"
                                        options={permissionOptions}
                                        selectedValues={selectedPermissions}
                                        onChange={setSelectedPermissions}
                                        placeholder="Select permissions…"
                                    />
                                    <InputError
                                        message={errors.permission_ids}
                                    />
                                </div>
                            )}

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
