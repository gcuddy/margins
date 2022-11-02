import { SvelteComponentTyped } from "svelte";
export declare type PopoverPanelContext = string | null;
export declare function usePopoverPanelContext(): StateDefinition["panelId"] | undefined;
import type { StateDefinition } from "./Popover.svelte";
import type { SupportedAs } from "../../internal/elements";
declare class __sveltets_Render<TAsProp extends SupportedAs> {
    props(): Omit<import("../../types").TRenderProps<{
        open: boolean;
        close: (focusableElement: HTMLElement | null) => void;
    }, TAsProp, "div">, import("../../types").TInternalProps | "as" | "static" | "unmount"> & {
        as?: TAsProp | undefined;
    } & {
        /**
         * Whether the `PopoverPanel` should trap focus.
         * If true, focus will move inside the `PopoverPanel` when it is opened,
         * and if focus leaves the `PopoverPanel` it will close.
         */
        focus?: boolean | undefined;
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
            close: (focusableElement: HTMLElement | null) => void;
        };
    };
}
export declare type PopoverPanelProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type PopoverPanelEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type PopoverPanelSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class PopoverPanel<TAsProp extends SupportedAs> extends SvelteComponentTyped<PopoverPanelProps<TAsProp>, PopoverPanelEvents<TAsProp>, PopoverPanelSlots<TAsProp>> {
}
export {};
