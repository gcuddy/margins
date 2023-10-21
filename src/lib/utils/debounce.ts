export function debounceAsync<T, F extends (...args: any[]) => Promise<any>>(
    fn: F,
    delay: number
): (this: T, ...args: Parameters<F>) => void {
    let timerId: ReturnType<typeof setTimeout> | undefined;

    return function debounced(this: T, ...args: Parameters<F>): void {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            void fn.apply(this, args)
        }, delay);
    };
}

export function debounce(delay: number) {
    let timeout: number | undefined = undefined;
    return {
        debounce: (fn: () => void) => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(fn, delay) as unknown as number;
        },
        cancel: () => {
            if (timeout) clearTimeout(timeout);
        }
    };
}