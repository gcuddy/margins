import { SvelteComponentTyped } from "svelte";
import type { SupportedAs } from "../../internal/elements";
declare class __sveltets_Render<TAsProp extends SupportedAs> {
    props(): Omit<import("../../types").TRenderProps<{
        open: boolean;
    }, TAsProp, "button">, import("../../types").TInternalProps | "as" | "static" | "unmount"> & {
        as?: TAsProp | undefined;
    } & {
        disabled?: boolean | undefined;
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
export declare type MenuButtonProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type MenuButtonEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type MenuButtonSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class MenuButton<TAsProp extends SupportedAs> extends SvelteComponentTyped<MenuButtonProps<TAsProp>, MenuButtonEvents<TAsProp>, MenuButtonSlots<TAsProp>> {
}
export {};
