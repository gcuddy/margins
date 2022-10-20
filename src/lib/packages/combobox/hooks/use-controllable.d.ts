import { type Writable } from "svelte/store";
export declare function useControllable<T>(controlledValue: T | undefined, onChange?: (value: T) => void, defaultValue?: T): readonly [Writable<T>, (value: unknown) => void | undefined];
