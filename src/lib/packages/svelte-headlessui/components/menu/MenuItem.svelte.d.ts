import { SvelteComponentTyped } from "svelte";
import type { SupportedAs } from "../../internal/elements";
declare class __sveltets_Render<TAsProp extends SupportedAs> {
    props(): Omit<import("../../types").TRenderProps<{
        active: boolean;
        disabled: boolean;
    }, TAsProp, "a">, import("../../types").TInternalProps | "as" | "static" | "unmount"> & {
        as?: TAsProp | undefined;
    } & {
        /** Whether the item should be disabled for keyboard navigation and ARIA purposes */
        disabled?: boolean | undefined;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {
        default: {
            active: boolean;
            disabled: boolean;
        };
    };
}
export declare type MenuItemProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type MenuItemEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type MenuItemSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class MenuItem<TAsProp extends SupportedAs> extends SvelteComponentTyped<MenuItemProps<TAsProp>, MenuItemEvents<TAsProp>, MenuItemSlots<TAsProp>> {
}
export {};
