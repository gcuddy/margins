export function numberOrString(value: string | number) {
    return isNaN(Number(value)) ? value : Number(value);
}
