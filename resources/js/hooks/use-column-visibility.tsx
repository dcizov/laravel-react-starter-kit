import type { VisibilityState } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';

export function useColumnVisibility(
    tableKey: string,
    defaultVisibility: VisibilityState = {},
    persist: boolean = true,
) {
    const storageKey = `datatable-column-visibility-${tableKey}`;

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        () => {
            if (!persist || typeof window === 'undefined') {
                return defaultVisibility;
            }

            try {
                const stored = localStorage.getItem(storageKey);

                return stored ? JSON.parse(stored) : defaultVisibility;
            } catch {
                return defaultVisibility;
            }
        },
    );

    useEffect(() => {
        if (!persist || typeof window === 'undefined') {
            return;
        }

        try {
            localStorage.setItem(storageKey, JSON.stringify(columnVisibility));
        } catch (e) {
            console.warn('Failed to persist column visibility', e);
        }
    }, [columnVisibility, storageKey, persist]);

    const resetColumnVisibility = useCallback(() => {
        setColumnVisibility(defaultVisibility);
    }, [defaultVisibility]);

    return { columnVisibility, setColumnVisibility, resetColumnVisibility };
}
