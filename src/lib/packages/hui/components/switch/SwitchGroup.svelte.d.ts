import { SvelteComponentTyped } from "svelte";
export interface StateDefinition {
    switchStore: Writable<HTMLButtonElement | null>;
}
export declare function useSwitchContext(): Writable<StateDefinition> | undefined;
import type { Writable } from "svelte/store";
import type { SupportedAs } from "../../internal/elements";
declare class __sveltets_Render<TAsProp extends SupportedAs> {
    props(): Omit<import("../../types").TRenderProps<{}, TAsProp, "div">, import("../../types").TInternalProps | "as" | "static" | "unmount"> & {
        as?: TAsProp | undefined;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {
        default: {};
    };
}
export declare type SwitchGroupProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type SwitchGroupEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type SwitchGroupSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class SwitchGroup<TAsProp extends SupportedAs> extends SvelteComponentTyped<SwitchGroupProps<TAsProp>, SwitchGroupEvents<TAsProp>, SwitchGroupSlots<TAsProp>> {
}
export {};
