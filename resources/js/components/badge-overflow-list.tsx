'use no memo';

import { Popover } from '@base-ui/react/popover';

import { Badge } from '@/components/ui/badge';

interface BadgeOverflowListProps {
    items: Array<{ id: number; name: string }>;
    limit?: number;
}

/**
 * Groups items by the prefix before the first dot (e.g. "users" from "users.view").
 * Items without a dot are placed under "other".
 */
function groupByPrefix(
    items: Array<{ id: number; name: string }>,
): Record<string, Array<{ id: number; name: string }>> {
    return items.reduce<Record<string, Array<{ id: number; name: string }>>>(
        (acc, item) => {
            const key = item.name.includes('.')
                ? item.name.split('.')[0]
                : 'other';
            (acc[key] ??= []).push(item);

            return acc;
        },
        {},
    );
}

/**
 * Renders up to `limit` items as badges. Excess items collapse into a "+N" popover
 * that shows all items grouped by resource prefix.
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
    const grouped = groupByPrefix(items);
    const groups = Object.entries(grouped);
    const isFlat = groups.length === 1;

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
                            <Popover.Popup className="z-50 flex max-h-72 w-72 flex-col overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                                <div className="border-b px-3 py-2">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Permissions ({items.length})
                                    </p>
                                </div>
                                <div className="overflow-y-auto p-2">
                                    {isFlat ? (
                                        <div className="flex flex-wrap gap-1">
                                            {items.map((item) => (
                                                <Badge
                                                    key={item.id}
                                                    variant="secondary"
                                                >
                                                    {item.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            {groups.map(
                                                ([group, groupItems]) => (
                                                    <div key={group}>
                                                        <p className="mb-1 text-xs font-medium text-muted-foreground capitalize">
                                                            {group}
                                                        </p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {groupItems.map(
                                                                (item) => (
                                                                    <Badge
                                                                        key={
                                                                            item.id
                                                                        }
                                                                        variant="secondary"
                                                                    >
                                                                        {item.name
                                                                            .split(
                                                                                '.',
                                                                            )
                                                                            .slice(
                                                                                1,
                                                                            )
                                                                            .join(
                                                                                '.',
                                                                            ) ||
                                                                            item.name}
                                                                    </Badge>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Popover.Popup>
                        </Popover.Positioner>
                    </Popover.Portal>
                </Popover.Root>
            )}
        </div>
    );
}
