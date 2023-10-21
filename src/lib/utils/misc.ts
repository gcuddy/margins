export function numberOrString(value: string | number) {
    return Number.isNaN(Number(value)) ? value : Number(value);
}
