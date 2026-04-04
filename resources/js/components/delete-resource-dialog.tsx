import { router } from '@inertiajs/react';
import { Trash2Icon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';

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
import { Spinner } from '@/components/ui/spinner';

interface DeleteResourceDialogProps {
    title: string;
    description: ReactNode;
    deleteUrl: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

/**
 * Confirmation dialog for deleting a single resource.
 *
 * Sends a `DELETE` request via Inertia. No request body (unlike `BulkDeleteResourceDialog`).
 */
export function DeleteResourceDialog({
    title,
    description,
    deleteUrl,
    open,
    onOpenChange,
    onSuccess,
}: DeleteResourceDialogProps) {
    const [deleting, setDeleting] = useState(false);

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline" disabled={deleting}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        disabled={deleting}
                        onClick={() => {
                            setDeleting(true);
                            router.delete(deleteUrl, {
                                preserveScroll: true,
                                onSuccess: () => {
                                    onOpenChange(false);
                                    onSuccess?.();
                                },
                                onFinish: () => setDeleting(false),
                            });
                        }}
                    >
                        {deleting && <Spinner />}
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
