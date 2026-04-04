'use no memo';

import { Popover } from '@base-ui/react/popover';

import { Badge } from '@/components/ui/badge';

interface BadgeOverflowListProps {
    items: Array<{ id: number; name: string }>;
    limit?: number;
}

/**
 * Renders up to `limit` items as badges. Excess items collapse into a "+N" popover.
 * Returns an em dash (—) when the items array is empty.
 */
export function BadgeOverflowList({
    items,
    limit = 3,
}: BadgeOverflowListProps) {
    if (!items || items.length === 0) {
        return <span className="text-muted-foreground">—</span>;
    }

    const visible = items.slice(0, limit);
    const overflow = items.slice(limit);

    return (
        <div className="flex flex-wrap gap-1">
            {visible.map((item) => (
                <Badge key={item.id} variant="secondary">
                    {item.name}
                </Badge>
            ))}
            {overflow.length > 0 && (
                <Popover.Root>
                    <Popover.Trigger
                        render={
                            <Badge
                                variant="outline"
                                className="cursor-pointer text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                            >
                                +{overflow.length}
                            </Badge>
                        }
                    />
                    <Popover.Portal>
                        <Popover.Positioner align="start" sideOffset={6}>
                            <Popover.Popup className="z-50 max-w-60 overflow-hidden rounded-md border bg-popover p-2 text-popover-foreground shadow-md">
                                <div className="flex flex-wrap gap-1">
                                    {overflow.map((item) => (
                                        <Badge
                                            key={item.id}
                                            variant="secondary"
                                        >
                                            {item.name}
                                        </Badge>
                                    ))}
                                </div>
                            </Popover.Popup>
                        </Popover.Positioner>
                    </Popover.Portal>
                </Popover.Root>
            )}
        </div>
    );
}
