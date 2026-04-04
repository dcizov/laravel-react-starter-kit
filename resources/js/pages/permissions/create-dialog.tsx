import { Form } from '@inertiajs/react';
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

interface CreatePermissionDialogProps {
    /** Controls dialog visibility. */
    open: boolean;
    /** Called whenever the dialog should open or close. */
    onOpenChange: (open: boolean) => void;
}

/**
 * Dialog for creating a new permission.
 *
 * Submits to `PermissionController::store` via Inertia's `<Form>`.
 * The dialog closes automatically on a successful response.
 */
export function CreatePermissionDialog({
    open,
    onOpenChange,
}: CreatePermissionDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create permission</DialogTitle>
                    <DialogDescription>Add a new permission.</DialogDescription>
                </DialogHeader>

                <Form
                    {...PermissionController.store.form()}
                    disableWhileProcessing
                    onSuccess={() => onOpenChange(false)}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="create-permission-name">
                                    Name
                                </Label>
                                <Input
                                    id="create-permission-name"
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
                                <Label htmlFor="create-permission-guard-name">
                                    Guard Name
                                </Label>
                                <Input
                                    id="create-permission-guard-name"
                                    type="text"
                                    required
                                    autoComplete="guard_name"
                                    name="guard_name"
                                    placeholder="Guard name"
                                />
                                <InputError message={errors.guard_name} />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                data-test="create-permission-button"
                            >
                                {processing && <Spinner />}
                                Create permission
                            </Button>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
