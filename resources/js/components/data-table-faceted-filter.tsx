'use no memo';

import { Check, PlusCircle } from 'lucide-react';
import type { ComponentType } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

/** A single option in the faceted filter dropdown. */
interface FacetedFilterOption {
    label: string;
    value: string;
    icon?: ComponentType<{ className?: string }>;
}

type SingleSelectProps = {
    title: string;
    options: FacetedFilterOption[];
    multiple?: false;
    value?: string | null;
    onChange: (value: string | undefined) => void;
};

type MultiSelectProps = {
    title: string;
    options: FacetedFilterOption[];
    multiple: true;
    value?: string[] | null;
    onChange: (value: string[] | undefined) => void;
};

/** Discriminated union: single-select when `multiple` is falsy, multi-select when `multiple={true}`. */
type DataTableFacetedFilterProps = SingleSelectProps | MultiSelectProps;

/**
 * Popover-based faceted filter for data table toolbars.
 *
 * Dispatches to `SingleSelectFilter` or `MultiSelectFilter` based on the `multiple` prop.
 */
export function DataTableFacetedFilter(props: DataTableFacetedFilterProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { title, options, multiple } = props;

    if (multiple) {
        return <MultiSelectFilter {...props} />;
    }

    return <SingleSelectFilter {...(props as SingleSelectProps)} />;
}

function SingleSelectFilter({
    title,
    options,
    value,
    onChange,
}: SingleSelectProps) {
    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <Popover>
            <PopoverTrigger
                render={
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-dashed"
                    >
                        <PlusCircle className="size-4" />
                        {title}
                        {selectedOption && (
                            <>
                                <div className="mx-2 h-4 w-px shrink-0 bg-border" />
                                <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">
                                    {selectedOption.label}
                                </span>
                            </>
                        )}
                    </Button>
                }
            />
            <PopoverContent
                align="start"
                sideOffset={4}
                className="w-48 gap-0 overflow-hidden p-1"
            >
                <div className="space-y-0.5">
                    {options.map((option) => {
                        const isSelected = option.value === value;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() =>
                                    onChange(
                                        isSelected ? undefined : option.value,
                                    )
                                }
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
                                    {isSelected && <Check className="size-3" />}
                                </div>
                                {option.icon && (
                                    <option.icon className="size-4 text-muted-foreground" />
                                )}
                                <span>{option.label}</span>
                            </button>
                        );
                    })}
                </div>

                {value && (
                    <>
                        <div className="-mx-1 my-1 h-px bg-border" />
                        <button
                            type="button"
                            onClick={() => onChange(undefined)}
                            className="flex w-full items-center justify-center rounded-sm py-1.5 text-sm font-medium hover:bg-accent"
                        >
                            Clear filter
                        </button>
                    </>
                )}
            </PopoverContent>
        </Popover>
    );
}

function MultiSelectFilter({
    title,
    options,
    value,
    onChange,
}: MultiSelectProps) {
    const selectedValues = value ?? [];

    function toggle(optionValue: string) {
        const next = selectedValues.includes(optionValue)
            ? selectedValues.filter((v) => v !== optionValue)
            : [...selectedValues, optionValue];

        onChange(next.length > 0 ? next : undefined);
    }

    const hasSelection = selectedValues.length > 0;

    return (
        <Popover>
            <PopoverTrigger
                render={
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-dashed"
                    >
                        <PlusCircle className="size-4" />
                        {title}
                        {hasSelection && (
                            <>
                                <div className="mx-2 h-4 w-px shrink-0 bg-border" />
                                {selectedValues.length > 2 ? (
                                    <Badge
                                        variant="secondary"
                                        className="rounded px-1.5 py-0.5 text-xs font-medium"
                                    >
                                        {selectedValues.length} selected
                                    </Badge>
                                ) : (
                                    <div className="flex gap-1">
                                        {selectedValues.map((v) => {
                                            const opt = options.find(
                                                (o) => o.value === v,
                                            );

                                            return (
                                                <Badge
                                                    key={v}
                                                    variant="secondary"
                                                    className="rounded px-1.5 py-0.5 text-xs font-medium"
                                                >
                                                    {opt?.label ?? v}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                    </Button>
                }
            />
            <PopoverContent
                align="start"
                sideOffset={4}
                className="w-48 gap-0 overflow-hidden p-1"
            >
                <div className="space-y-0.5">
                    {options.map((option) => {
                        const isSelected = selectedValues.includes(
                            option.value,
                        );

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
                                    {isSelected && <Check className="size-3" />}
                                </div>
                                {option.icon && (
                                    <option.icon className="size-4 text-muted-foreground" />
                                )}
                                <span>{option.label}</span>
                            </button>
                        );
                    })}
                </div>

                {hasSelection && (
                    <>
                        <div className="-mx-1 my-1 h-px bg-border" />
                        <button
                            type="button"
                            onClick={() => onChange(undefined)}
                            className="flex w-full items-center justify-center rounded-sm py-1.5 text-sm font-medium hover:bg-accent"
                        >
                            Clear filter
                        </button>
                    </>
                )}
            </PopoverContent>
        </Popover>
    );
}
