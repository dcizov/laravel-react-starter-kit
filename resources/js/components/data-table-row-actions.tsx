import { Edit, MoreHorizontal, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DataTableRowActionsProps {
    editLabel?: string;
    deleteLabel?: string;
    onEdit?: () => void;
    onDelete?: () => void;
}

/**
 * Per-row actions dropdown (edit / delete) for a data table.
 *
 * Renders a "⋯" (more options) button that opens a dropdown menu. Only the
 * options for which callbacks are provided will appear. If neither `onEdit`
 * nor `onDelete` is provided, the component returns `null`.
 *
 * @returns A dropdown menu, or `null` if no action callbacks are provided.
 */
export function DataTableRowActions({
    editLabel,
    deleteLabel,
    onEdit,
    onDelete,
}: DataTableRowActionsProps) {
    if (!onEdit && !onDelete) {
        return null;
    }

    return (
        <div className="text-right">
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button variant="ghost" className="size-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="size-4" />
                        </Button>
                    }
                />
                <DropdownMenuContent align="end">
                    {onEdit && (
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={onEdit}>
                                <Edit />
                                {editLabel}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    )}
                    {onEdit && onDelete && <DropdownMenuSeparator />}
                    {onDelete && (
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={onDelete}
                        >
                            <Trash2 />
                            {deleteLabel}
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
