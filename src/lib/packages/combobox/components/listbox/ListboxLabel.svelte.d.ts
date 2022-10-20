import { SvelteComponentTyped } from "svelte";
import type { SupportedAs } from "../../internal/elements";
declare class __sveltets_Render<TAsProp extends SupportedAs> {
    props(): Omit<import("../../types").TRenderProps<{
        open: boolean;
        disabled: boolean;
    }, TAsProp, "label">, import("../../types").TInternalProps | "as" | "static" | "unmount"> & {
        as?: TAsProp | undefined;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {
        default: {
            open: boolean;
            disabled: boolean;
        };
    };
}
export declare type ListboxLabelProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type ListboxLabelEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type ListboxLabelSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class ListboxLabel<TAsProp extends SupportedAs> extends SvelteComponentTyped<ListboxLabelProps<TAsProp>, ListboxLabelEvents<TAsProp>, ListboxLabelSlots<TAsProp>> {
}
export {};
