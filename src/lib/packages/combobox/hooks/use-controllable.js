import { writable } from "svelte/store";
export function useControllable(controlledValue, onChange, defaultValue) {
    let internalValue = defaultValue;
    let isControlled = controlledValue !== undefined;
    const valueStore = writable(isControlled ? controlledValue : internalValue);
    return [
        valueStore,
        function (value) {
            if (isControlled) {
                valueStore.set(value);
                return onChange?.(value);
            }
            else {
                internalValue = value;
                valueStore.set(internalValue);
                return onChange?.(value);
            }
        },
    ];
}
