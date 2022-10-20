import { SvelteComponentTyped } from "svelte";
export interface PopoverGroupContext {
    registerPopover(registerbag: PopoverRegisterBag): void;
    unregisterPopover(registerbag: PopoverRegisterBag): void;
    isFocusWithinPopoverGroup(): boolean;
    closeOthers(buttonId: string): void;
}
export declare function usePopoverGroupContext(): PopoverGroupContext | undefined;
import type { PopoverRegisterBag } from "./Popover.svelte";
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
export declare type PopoverGroupProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type PopoverGroupEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type PopoverGroupSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class PopoverGroup<TAsProp extends SupportedAs> extends SvelteComponentTyped<PopoverGroupProps<TAsProp>, PopoverGroupEvents<TAsProp>, PopoverGroupSlots<TAsProp>> {
}
export {};
