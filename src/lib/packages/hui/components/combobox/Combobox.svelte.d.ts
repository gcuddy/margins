import { SvelteComponentTyped } from "svelte";
export declare enum ComboboxStates {
    Open = 0,
    Closed = 1
}
export declare enum ValueMode {
    Single = 0,
    Multi = 1
}
export declare enum ActivationTrigger {
    Pointer = 0,
    Other = 1
}
export declare type ComboboxOptionData = {
    disabled: boolean;
    value: unknown;
    domRef: Writable<HTMLElement | null>;
};
declare type StateDefinition = {
    comboboxState: ComboboxStates;
    value: unknown;
    mode: ValueMode;
    nullable: boolean;
    compare: (a: unknown, z: unknown) => boolean;
    optionsPropsRef: Writable<{
        static: boolean;
        hold: boolean;
    }>;
    labelRef: Writable<HTMLLabelElement | null>;
    inputRef: Writable<HTMLInputElement | null>;
    buttonRef: Writable<HTMLButtonElement | null>;
    optionsRef: Writable<HTMLDivElement | null>;
    disabled: boolean;
    options: {
        id: string;
        dataRef: ComboboxOptionData;
    }[];
    activeOptionIndex: number | null;
    activationTrigger: ActivationTrigger;
    closeCombobox(): void;
    openCombobox(): void;
    goToOption(focus: Focus, id?: string, trigger?: ActivationTrigger): void;
    change(value: unknown): void;
    selectOption(id: string): void;
    selectActiveOption(): void;
    registerOption(id: string, dataRef: ComboboxOptionData): void;
    unregisterOption(id: string): void;
};
export declare function useComboboxContext(component: string): Readable<StateDefinition>;
export declare function defaultComparator<T>(a: T, z: T): boolean;
import { type Readable, type Writable } from "svelte/store";
import type { SupportedAs } from "../../internal/elements";
import { Focus } from "../../utils/calculate-active-index";
declare class __sveltets_Render<TAsProp extends SupportedAs> {
    props(): Omit<import("../../types").TRenderProps<{
        open: boolean;
        disabled: boolean;
        activeIndex: number | null;
        activeOption: any;
        value: unknown;
    }, TAsProp, "div">, import("../../types").TInternalProps | "as" | "static" | "unmount"> & {
        as?: TAsProp | undefined;
    } & {
        /** Whether the entire `Combobox` and its children should be disabled */
        disabled?: boolean | undefined;
        /** The selected value */
        value?: unknown;
        /** The default value when using as an uncontrolled component. */
        defaultValue?: unknown;
        /** The name used when using this component inside a form. */
        name?: string | undefined;
        /** Use this to compare objects by a particular field, or pass your own comparison function for complete control over how objects are compared. */
        by?: string | Function | undefined;
        /** Whether you can clear the combobox or not. */
        nullable?: boolean | undefined;
        /** Whether multiple options can be selected or not. */
        multiple?: boolean | undefined;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {
        default: {
            open: boolean;
            disabled: boolean;
            activeIndex: number | null;
            activeOption: any;
            value: unknown;
        };
    };
}
export declare type ComboboxProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type ComboboxEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type ComboboxSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class Combobox<TAsProp extends SupportedAs> extends SvelteComponentTyped<ComboboxProps<TAsProp>, ComboboxEvents<TAsProp>, ComboboxSlots<TAsProp>> {
}
export {};
