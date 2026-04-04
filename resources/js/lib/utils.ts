import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS class names, resolving conflicts via tailwind-merge.
 *
 * Combines clsx (conditional/array class composition) with tailwind-merge
 * (Tailwind-aware deduplication), so later classes win over earlier ones.
 *
 * @param inputs - Any number of class values: strings, arrays, or conditional objects.
 * @returns A single merged class string with Tailwind conflicts resolved.
 * @see https://github.com/dcastil/tailwind-merge
 * @see https://github.com/lukeed/clsx
 *
 * @example
 * cn('px-2 py-1', 'px-4') // → 'py-1 px-4'
 * cn('text-red-500', isError && 'text-red-700') // conditional classes
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Extracts the URL string from an Inertia href value.
 *
 * Inertia's `href` prop accepts either a plain string or an object `{ url, data }`.
 * This helper normalises both forms to a plain string for use in non-Inertia contexts.
 *
 * @param url - An Inertia href: either a plain string or an object with a `.url` property.
 * @returns The resolved URL string.
 */
export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

/**
 * Formats an ISO date string into a locale-aware short date.
 *
 * Uses the browser's locale for formatting. Returns an em dash (—) for
 * null/undefined values, making it safe to use with optional timestamp fields.
 *
 * @param date - An ISO 8601 date string, or null/undefined.
 * @returns A formatted date string (e.g. "Apr 1, 2026") or "—" if the value is nullish.
 */
export function formatDate(date: string | null | undefined): string {
    return date
        ? new Date(date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
          })
        : '—';
}
