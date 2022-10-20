import { SvelteComponentTyped } from "svelte";
import type { Readable } from "svelte/store";
export interface Option {
    id: string;
    element: HTMLElement | null;
    propsRef: {
        value: unknown;
        disabled: boolean;
    };
}
export interface StateDefinition {
    options: Option[];
    value: unknown;
    disabled: boolean;
    firstOption: Option | undefined;
    containsCheckedOption: boolean;
    change(nextValue: unknown): boolean;
    registerOption(action: Option): void;
    unregisterOption(id: Option["id"]): void;
}
export declare function useRadioGroupContext(component: string): Readable<StateDefinition>;
import type { SupportedAs } from "../../internal/elements";
declare class __sveltets_Render<TAsProp extends SupportedAs> {
    props(): Omit<import("../../types").TRenderProps<{}, TAsProp, "div">, import("../../types").TInternalProps | "as" | "static" | "unmount"> & {
        as?: TAsProp | undefined;
    } & {
        /** The currently selected value in the `RadioGroup` */
        value: unknown;
        /** Whether the `RadioGroup` and all of its `RadioGroupOption`s are disabled */
        disabled?: boolean | undefined;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {
        default: {};
    };
}
export declare type RadioGroupProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type RadioGroupEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type RadioGroupSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class RadioGroup<TAsProp extends SupportedAs> extends SvelteComponentTyped<RadioGroupProps<TAsProp>, RadioGroupEvents<TAsProp>, RadioGroupSlots<TAsProp>> {
}
export {};
