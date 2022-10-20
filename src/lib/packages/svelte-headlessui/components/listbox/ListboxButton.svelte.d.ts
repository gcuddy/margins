import { SvelteComponentTyped } from "svelte";
import type { SupportedAs } from "../../internal/elements";
declare class __sveltets_Render<TAsProp extends SupportedAs> {
    props(): Omit<import("../../types").TRenderProps<{
        open: boolean;
        disabled: boolean;
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
        };
    };
}
export declare type ListboxButtonProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type ListboxButtonEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type ListboxButtonSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class ListboxButton<TAsProp extends SupportedAs> extends SvelteComponentTyped<ListboxButtonProps<TAsProp>, ListboxButtonEvents<TAsProp>, ListboxButtonSlots<TAsProp>> {
}
export {};
