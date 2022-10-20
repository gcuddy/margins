import { SvelteComponentTyped } from "svelte";
import type { SupportedAs } from "../../internal/elements";
declare class __sveltets_Render<TAsProp extends SupportedAs> {
    props(): Omit<import("../../types").TRenderProps<{
        open: boolean;
        disabled: boolean;
        value: unknown;
    }, TAsProp, "button">, import("../../types").TInternalProps | "as" | "static" | "unmount"> & {
        as?: TAsProp | undefined;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {
        default: {
            open: boolean;
            disabled: boolean;
            value: unknown;
        };
    };
}
export declare type ComboboxButtonProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type ComboboxButtonEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type ComboboxButtonSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class ComboboxButton<TAsProp extends SupportedAs> extends SvelteComponentTyped<ComboboxButtonProps<TAsProp>, ComboboxButtonEvents<TAsProp>, ComboboxButtonSlots<TAsProp>> {
}
export {};
