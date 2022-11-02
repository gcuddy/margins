import { SvelteComponentTyped } from "svelte";
export declare function usePanelContext(): string | undefined;
import type { SupportedAs } from "../../internal/elements";
declare class __sveltets_Render<TAsProp extends SupportedAs> {
    props(): Omit<import("../../types").TRenderProps<{
        open: boolean;
        close: (focusableElement: HTMLElement | null) => void;
    }, TAsProp, "div">, import("../../types").TInternalProps | "as" | "static" | "unmount"> & {
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
            close: (focusableElement: HTMLElement | null) => void;
        };
    };
}
export declare type DisclosurePanelProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type DisclosurePanelEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type DisclosurePanelSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class DisclosurePanel<TAsProp extends SupportedAs> extends SvelteComponentTyped<DisclosurePanelProps<TAsProp>, DisclosurePanelEvents<TAsProp>, DisclosurePanelSlots<TAsProp>> {
}
export {};
