import { SvelteComponentTyped } from "svelte";
export declare enum ListboxStates {
    Open = 0,
    Closed = 1
}
export declare type ListboxOptionDataRef = {
    textValue: string;
    disabled: boolean;
    value: unknown;
};
export declare type StateDefinition = {
    listboxState: ListboxStates;
    value: unknown;
    orientation: "vertical" | "horizontal";
    labelRef: Writable<HTMLLabelElement | null>;
    buttonRef: Writable<HTMLButtonElement | null>;
    optionsRef: Writable<HTMLElement | null>;
    disabled: boolean;
    options: {
        id: string;
        dataRef: ListboxOptionDataRef;
    }[];
    searchQuery: string;
    activeOptionIndex: number | null;
    closeListbox(): void;
    openListbox(): void;
    goToOption(focus: Focus, id?: string): void;
    search(value: string): void;
    clearSearch(): void;
    registerOption(id: string, dataRef: ListboxOptionDataRef): void;
    unregisterOption(id: string): void;
    select(value: unknown): void;
};
export declare function useListboxContext(component: string): Readable<StateDefinition>;
import { Focus } from "../../utils/calculate-active-index";
import type { Readable, Writable } from "svelte/store";
import type { SupportedAs } from "../../internal/elements";
declare class __sveltets_Render<TAsProp extends SupportedAs> {
    props(): Omit<import("../../types").TRenderProps<{
        open: boolean;
    }, TAsProp, "div">, import("../../types").TInternalProps | "as" | "static" | "unmount"> & {
        as?: TAsProp | undefined;
    } & {
        /** Whether the entire `Listbox` and its children should be disabled */
        disabled?: boolean | undefined;
        /** Whether the entire `Listbox` should be oriented horizontally instead of vertically */
        horizontal?: boolean | undefined;
        /** The selected value */
        value?: unknown;
    };
    events(): {
        change: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {
        default: {
            open: boolean;
        };
    };
}
export declare type ListboxProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type ListboxEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type ListboxSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class Listbox<TAsProp extends SupportedAs> extends SvelteComponentTyped<ListboxProps<TAsProp>, ListboxEvents<TAsProp>, ListboxSlots<TAsProp>> {
}
export {};
