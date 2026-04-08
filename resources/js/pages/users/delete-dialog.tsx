import { toast } from 'sonner';
import { DeleteResourceDialog } from '@/components/delete-resource-dialog';
import { destroy } from '@/routes/users';
import type { User } from '@/types';

interface DeleteUserDialogProps {
    /** The user to delete; their name is displayed in the confirmation message. */
    user: User;
    /** Controls dialog visibility. */
    open: boolean;
    /** Called whenever the dialog should open or close. */
    onOpenChange: (open: boolean) => void;
}

/**
 * Confirmation dialog for permanently deleting a user account.
 * Wraps the generic `DeleteResourceDialog` with a user-specific message.
 */
export function DeleteUserDialog({
    user,
    open,
    onOpenChange,
}: DeleteUserDialogProps) {
    return (
        <DeleteResourceDialog
            title="Delete user?"
            description={
                <>
                    This will permanently delete{' '}
                    <span className="font-medium text-foreground">
                        {user.name}
                    </span>
                    . This action cannot be undone.
                </>
            }
            deleteUrl={destroy(user).url}
            open={open}
            onOpenChange={onOpenChange}
            onSuccess={() => toast.success('User deleted')}
        />
    );
}
