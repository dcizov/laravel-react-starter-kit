import { Form } from '@inertiajs/react';
import { toast } from 'sonner';
import RoleController from '@/actions/App/Http/Controllers/Roles/RoleController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

interface CreateRoleDialogProps {
    /** Controls dialog visibility. */
    open: boolean;
    /** Called whenever the dialog should open or close. */
    onOpenChange: (open: boolean) => void;
    /** Available permissions for assignment, keyed by ID. Renders as checkboxes. */
    permissions: Record<number, string>;
}

/**
 * Dialog for creating a new role with optional permission assignment.
 *
 * Permissions are rendered as a scrollable checkbox list via native `permission_ids[]`
 * form inputs. Submits to `RoleController::store` via Inertia's `<Form>`.
 * The dialog closes automatically on a successful response.
 */
export function CreateRoleDialog({
    open,
    onOpenChange,
    permissions,
}: CreateRoleDialogProps) {
    const permissionEntries = Object.entries(permissions) as [string, string][];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create role</DialogTitle>
                    <DialogDescription>Add a new role.</DialogDescription>
                </DialogHeader>

                <Form
                    {...RoleController.store.form()}
                    disableWhileProcessing
                    onSuccess={() => {
                        toast.success('Role created');
                        onOpenChange(false);
                    }}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="create-role-name">Name</Label>
                                <Input
                                    id="create-role-name"
                                    type="text"
                                    required
                                    autoFocus
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create-role-guard-name">
                                    Guard Name
                                </Label>
                                <Input
                                    id="create-role-guard-name"
                                    type="text"
                                    required
                                    autoComplete="guard_name"
                                    name="guard_name"
                                    placeholder="Guard name"
                                />
                                <InputError message={errors.guard_name} />
                            </div>

                            {permissionEntries.length > 0 && (
                                <div className="grid gap-2">
                                    <Label>Permissions</Label>
                                    <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
                                        {permissionEntries.map(([id, name]) => (
                                            <div
                                                key={id}
                                                className="flex items-center gap-2"
                                            >
                                                <Checkbox
                                                    id={`create-perm-${id}`}
                                                    name="permission_ids[]"
                                                    value={id}
                                                />
                                                <label
                                                    htmlFor={`create-perm-${id}`}
                                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <InputError
                                        message={errors.permission_ids}
                                    />
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                data-test="create-role-button"
                            >
                                {processing && <Spinner />}
                                Create role
                            </Button>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
