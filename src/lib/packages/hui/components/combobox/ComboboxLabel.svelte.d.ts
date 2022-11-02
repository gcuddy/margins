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
export declare type ComboboxLabelProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type ComboboxLabelEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type ComboboxLabelSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class ComboboxLabel<TAsProp extends SupportedAs> extends SvelteComponentTyped<ComboboxLabelProps<TAsProp>, ComboboxLabelEvents<TAsProp>, ComboboxLabelSlots<TAsProp>> {
}
export {};
