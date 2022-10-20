import { SvelteComponentTyped } from "svelte";
import type { SupportedAs } from "../../internal/elements";
declare class __sveltets_Render<TAsProp extends SupportedAs> {
    props(): Omit<import("../../types").TRenderProps<{
        open: boolean;
    }, TAsProp, "ul">, import("../../types").TInternalProps | "as" | "static" | "unmount"> & {
        as?: TAsProp | undefined;
    } & {
        /** Whether the element should ignore the internally managed open/closed state */
        static?: boolean | undefined;
        /** Whether the element should be unmounted, instead of just hidden, based on the open/closed state	*/
        unmount?: boolean | undefined;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {
        default: {
            open: boolean;
        };
    };
}
export declare type ListboxOptionsProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type ListboxOptionsEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type ListboxOptionsSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class ListboxOptions<TAsProp extends SupportedAs> extends SvelteComponentTyped<ListboxOptionsProps<TAsProp>, ListboxOptionsEvents<TAsProp>, ListboxOptionsSlots<TAsProp>> {
}
export {};
