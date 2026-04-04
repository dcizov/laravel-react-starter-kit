import { useCallback, useEffect, useRef } from 'react';

export function useDebouncedCallback<T extends (...args: never[]) => void>(
    callback: T,
    delay: number,
): [(...args: Parameters<T>) => void, () => void] {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
        undefined,
    );
    const callbackRef = useRef<T>(callback);

    useEffect(() => {
        callbackRef.current = callback;
    });

    useEffect(() => () => clearTimeout(timeoutRef.current), []);

    const debouncedFn = useCallback(
        (...args: Parameters<T>) => {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(
                () => callbackRef.current(...args),
                delay,
            );
        },
        [delay],
    );

    const cancel = useCallback(() => {
        clearTimeout(timeoutRef.current);
    }, []);

    return [debouncedFn, cancel];
}
