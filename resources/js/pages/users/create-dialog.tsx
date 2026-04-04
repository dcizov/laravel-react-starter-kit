import { Form } from '@inertiajs/react';
import { useState } from 'react';

import UserController from '@/actions/App/Http/Controllers/Users/UserController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
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

interface CreateUserDialogProps {
    /** Controls dialog visibility. */
    open: boolean;
    /** Called whenever the dialog should open or close. */
    onOpenChange: (open: boolean) => void;
    /** Available roles for assignment, keyed by ID. Rendered in a `MultiSelect`. */
    roles: Record<number, string>;
}

/**
 * Dialog for creating a new user account.
 *
 * Includes fields for name, email, optional role assignment via `MultiSelect`,
 * and password with confirmation. Password fields are reset via `resetOnSuccess`
 * and selected roles are cleared on success. Submits to `UserController::store`.
 */
export function CreateUserDialog({
    open,
    onOpenChange,
    roles,
}: CreateUserDialogProps) {
    const roleOptions = (Object.entries(roles) as [string, string][]).map(
        ([id, name]) => ({ value: id, label: name }),
    );

    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create user</DialogTitle>
                    <DialogDescription>
                        Add a new user account.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...UserController.store.form()}
                    resetOnSuccess={['password', 'password_confirmation']}
                    disableWhileProcessing
                    onSuccess={() => {
                        setSelectedRoles([]);
                        onOpenChange(false);
                    }}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="create-user-name">Name</Label>
                                <Input
                                    id="create-user-name"
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
                                <Label htmlFor="create-user-email">
                                    Email address
                                </Label>
                                <Input
                                    id="create-user-email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {roleOptions.length > 0 && (
                                <div className="grid gap-2">
                                    <Label>Roles</Label>
                                    <MultiSelect
                                        name="role_ids[]"
                                        options={roleOptions}
                                        selectedValues={selectedRoles}
                                        onChange={setSelectedRoles}
                                        placeholder="Select roles…"
                                    />
                                    <InputError message={errors.role_ids} />
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="create-user-password">
                                    Password
                                </Label>
                                <PasswordInput
                                    id="create-user-password"
                                    required
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create-user-password-confirmation">
                                    Confirm password
                                </Label>
                                <PasswordInput
                                    id="create-user-password-confirmation"
                                    required
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Create user
                            </Button>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
