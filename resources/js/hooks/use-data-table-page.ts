import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { useDebouncedCallback } from '@/hooks/use-debounced-callback';

/**
 * Encapsulates the repeated search/filter/pagination wiring used by every
 * resource index page. Syncs the search field with the Inertia-provided
 * `filters.search` prop so back-navigation keeps the input in sync.
 */
export function useDataTablePage(
    indexUrl: string,
    filters: Record<string, unknown>,
) {
    const [search, setSearch] = useState<string>(() =>
        String(filters.search ?? ''),
    );

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- controlled draft must mirror Inertia props
        setSearch(String(filters.search ?? ''));
    }, [filters.search]);

    const [debouncedSearch, cancelSearch] = useDebouncedCallback(
        (value: string) => {
            router.get(
                indexUrl,
                { ...filters, search: value || undefined, page: 1 },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        },
        300,
    );

    const handleSearch = (value: string) => {
        setSearch(value);
        debouncedSearch(value);
    };

    const handleServerChange = (params: Record<string, unknown>) => {
        cancelSearch();
        router.get(
            indexUrl,
            { ...filters, search: search || undefined, ...params },
            { preserveState: true, preserveScroll: true },
        );
    };

    return { search, handleSearch, handleServerChange };
}
