'use no memo';

import { Popover } from '@base-ui/react/popover';
import { Check, ChevronsUpDown, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MultiSelectOption {
    value: string;
    label: string;
}

interface MultiSelectProps {
    options: MultiSelectOption[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    /** The `name` attribute used for hidden inputs, e.g. "permission_ids[]" */
    name: string;
    placeholder?: string;
}

export function MultiSelect({
    options,
    selectedValues,
    onChange,
    name,
    placeholder = 'Select…',
}: MultiSelectProps) {
    function toggle(value: string) {
        const next = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value];
        onChange(next);
    }

    function remove(value: string) {
        onChange(selectedValues.filter((v) => v !== value));
    }

    const hasSelection = selectedValues.length > 0;

    return (
        <div className="space-y-2">
            {/* Hidden inputs for form submission */}
            {selectedValues.map((val) => (
                <input key={val} type="hidden" name={name} value={val} />
            ))}

            <Popover.Root>
                <Popover.Trigger
                    render={
                        <Button
                            type="button"
                            variant="outline"
                            className="h-9 w-full justify-between font-normal"
                        >
                            <span className="text-muted-foreground">
                                {hasSelection
                                    ? `${selectedValues.length} selected`
                                    : placeholder}
                            </span>
                            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                        </Button>
                    }
                />
                <Popover.Portal>
                    <Popover.Positioner
                        align="start"
                        sideOffset={4}
                        className="z-50 w-(--anchor-width)"
                    >
                        <Popover.Popup className="max-h-60 w-full overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                            {options.length === 0 ? (
                                <p className="py-6 text-center text-sm text-muted-foreground">
                                    No options available.
                                </p>
                            ) : (
                                <div className="space-y-0.5">
                                    {options.map((option) => {
                                        const isSelected = selectedValues.includes(option.value);

                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => toggle(option.value)}
                                                className={cn(
                                                    'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent',
                                                    isSelected && 'font-medium',
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        'flex size-4 shrink-0 items-center justify-center rounded-sm border',
                                                        isSelected
                                                            ? 'border-primary bg-primary text-primary-foreground'
                                                            : 'border-muted-foreground/25',
                                                    )}
                                                >
                                                    {isSelected && (
                                                        <Check className="size-3" />
                                                    )}
                                                </div>
                                                <span>{option.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </Popover.Popup>
                    </Popover.Positioner>
                </Popover.Portal>
            </Popover.Root>

            {hasSelection && (
                <div className="flex flex-wrap gap-1.5">
                    {selectedValues.map((val) => {
                        const option = options.find((o) => o.value === val);

                        return (
                            <Badge key={val} variant="secondary" className="gap-1 pr-1">
                                {option?.label ?? val}
                                <button
                                    type="button"
                                    onClick={() => remove(val)}
                                    className="ml-0.5 rounded-full outline-none hover:bg-muted-foreground/20 focus-visible:ring-1"
                                    aria-label={`Remove ${option?.label ?? val}`}
                                >
                                    <X className="size-3" />
                                </button>
                            </Badge>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
