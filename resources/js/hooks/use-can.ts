import { usePage } from '@inertiajs/react';

export function useCan(permission: string): boolean {
    const { can } = usePage().props;

    return can?.[permission] ?? false;
}
