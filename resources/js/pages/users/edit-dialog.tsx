import { Form, router } from '@inertiajs/react';
import { ShieldOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import UserController from '@/actions/App/Http/Controllers/Users/UserController';
import UserPasswordController from '@/actions/App/Http/Controllers/Users/UserPasswordController';
import UserRolesController from '@/actions/App/Http/Controllers/Users/UserRolesController';
import UserTwoFactorController from '@/actions/App/Http/Controllers/Users/UserTwoFactorController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { User } from '@/types';

interface EditUserDialogProps {
    /** The user to edit; current values pre-fill all form fields. */
    user: User;
    /** Controls dialog visibility. */
    open: boolean;
    /** Called whenever the dialog should open or close. */
    onOpenChange: (open: boolean) => void;
    /**
     * Whether the user has 2FA enabled. When `true`, a "Security" tab
     * is added with a "Disable 2FA" button that triggers a nested AlertDialog
     * confirmation before sending the DELETE request.
     */
    twoFactorEnabled?: boolean;
    /** Available roles for assignment, keyed by ID. Rendered in a `MultiSelect`. */
    roles: Record<number, string>;
}

/**
 * Multi-tab dialog for comprehensive user editing.
 *
 * **Tabs:**
 * 1. **Profile** — Edit name and email (`UserController::update`).
 * 2. **Roles** — Multi-select role assignment (`UserRolesController`). Shown only when roles exist.
 * 3. **Password** — Change password with confirmation (`UserPasswordController`). Resets on success.
 * 4. **Security** — Disable 2FA (`UserTwoFactorController`). Shown only when `twoFactorEnabled` is true.
 *
 * The 2FA disable action opens a nested `AlertDialog` confirmation before sending
 * the DELETE request. `key={user.id}` ensures all state resets when a different user is opened.
 */
export function EditUserDialog({
    user,
    open,
    onOpenChange,
    twoFactorEnabled = false,
    roles,
}: EditUserDialogProps) {
    const [confirmDisable2faOpen, setConfirmDisable2faOpen] = useState(false);

    const handleDisable2fa = (): void => {
        router.delete(UserTwoFactorController.url(user), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Two-factor authentication disabled');
                setConfirmDisable2faOpen(false);
                onOpenChange(false);
            },
        });
    };

    const roleOptions = (Object.entries(roles) as [string, string][]).map(
        ([id, name]) => ({ value: id, label: name }),
    );

    const [selectedRoles, setSelectedRoles] = useState<string[]>(() =>
        (user.roles ?? []).map((r) => String(r.id)),
    );

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange} key={user.id}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit user</DialogTitle>
                        <DialogDescription>
                            Manage settings for{' '}
                            <span className="font-medium text-foreground">
                                {user.name}
                            </span>
                            .
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs
                        defaultValue="profile"
                        className="flex min-h-52 w-full flex-col"
                    >
                        <TabsList className="w-full">
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            {roleOptions.length > 0 && (
                                <TabsTrigger value="roles">Roles</TabsTrigger>
                            )}
                            <TabsTrigger value="password">Password</TabsTrigger>
                            {twoFactorEnabled && (
                                <TabsTrigger value="security">
                                    Security
                                </TabsTrigger>
                            )}
                        </TabsList>

                        <TabsContent value="profile">
                            <Form
                                {...UserController.update.form(user)}
                                disableWhileProcessing
                                options={{ preserveScroll: true }}
                                onSuccess={() => {
                                    toast.success('User updated');
                                    onOpenChange(false);
                                }}
                                className="space-y-4 pt-4"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor={`edit-name-${user.id}`}
                                            >
                                                Name
                                            </Label>
                                            <Input
                                                id={`edit-name-${user.id}`}
                                                defaultValue={user.name}
                                                name="name"
                                                required
                                                autoFocus
                                                autoComplete="name"
                                                placeholder="Full name"
                                            />
                                            <InputError message={errors.name} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor={`edit-email-${user.id}`}
                                            >
                                                Email address
                                            </Label>
                                            <Input
                                                id={`edit-email-${user.id}`}
                                                type="email"
                                                defaultValue={user.email}
                                                name="email"
                                                required
                                                autoComplete="username"
                                                placeholder="email@example.com"
                                            />
                                            <InputError
                                                message={errors.email}
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing && <Spinner />}
                                            Save changes
                                        </Button>
                                    </>
                                )}
                            </Form>
                        </TabsContent>

                        {roleOptions.length > 0 && (
                            <TabsContent value="roles">
                                <Form
                                    {...UserRolesController.form(user)}
                                    disableWhileProcessing
                                    options={{ preserveScroll: true }}
                                    onSuccess={() => {
                                        toast.success('Roles updated');
                                        onOpenChange(false);
                                    }}
                                    className="space-y-4 pt-4"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="grid gap-2">
                                                <Label>Roles</Label>
                                                <MultiSelect
                                                    name="role_ids[]"
                                                    options={roleOptions}
                                                    selectedValues={
                                                        selectedRoles
                                                    }
                                                    onChange={setSelectedRoles}
                                                    placeholder="Select roles…"
                                                />
                                                <InputError
                                                    message={errors.role_ids}
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing && <Spinner />}
                                                Save roles
                                            </Button>
                                        </>
                                    )}
                                </Form>
                            </TabsContent>
                        )}

                        <TabsContent value="password">
                            <Form
                                {...UserPasswordController.form(user)}
                                disableWhileProcessing
                                options={{ preserveScroll: true }}
                                resetOnSuccess
                                onSuccess={() => {
                                    toast.success('Password updated');
                                    onOpenChange(false);
                                }}
                                className="space-y-4 pt-4"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor={`edit-password-${user.id}`}
                                            >
                                                New password
                                            </Label>
                                            <PasswordInput
                                                id={`edit-password-${user.id}`}
                                                name="password"
                                                required
                                                autoComplete="new-password"
                                                placeholder="New password"
                                            />
                                            <InputError
                                                message={errors.password}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor={`edit-password-confirmation-${user.id}`}
                                            >
                                                Confirm password
                                            </Label>
                                            <PasswordInput
                                                id={`edit-password-confirmation-${user.id}`}
                                                name="password_confirmation"
                                                required
                                                autoComplete="new-password"
                                                placeholder="Confirm password"
                                            />
                                            <InputError
                                                message={
                                                    errors.password_confirmation
                                                }
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing && <Spinner />}
                                            Save password
                                        </Button>
                                    </>
                                )}
                            </Form>
                        </TabsContent>

                        {twoFactorEnabled && (
                            <TabsContent value="security">
                                <div className="space-y-4 pt-4">
                                    <p className="text-sm text-muted-foreground">
                                        This user has 2FA enabled. Disabling it
                                        will remove the authenticator app
                                        binding and recovery codes.
                                    </p>
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        type="button"
                                        onClick={() =>
                                            setConfirmDisable2faOpen(true)
                                        }
                                    >
                                        Disable 2FA
                                    </Button>
                                </div>
                            </TabsContent>
                        )}
                    </Tabs>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={confirmDisable2faOpen}
                onOpenChange={setConfirmDisable2faOpen}
            >
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                            <ShieldOff />
                        </AlertDialogMedia>
                        <AlertDialogTitle>
                            Disable two-factor auth?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove the authenticator binding and
                            recovery codes for{' '}
                            <span className="font-medium text-foreground">
                                {user.name}
                            </span>
                            . They can set up 2FA again from their account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel variant="outline">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={handleDisable2fa}
                        >
                            Disable 2FA
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
