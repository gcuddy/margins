export function toString(value: unknown): string {
    if (value === undefined || value === null) {
        return '';
    }
    if (typeof value === 'object') {
        return Array.isArray(value) ? value.map((item) => toString(item)).join('') : Object.values(value).map((value) => toString(value)).join('');
    }

    return String(value);
}
