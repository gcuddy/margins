import { SvelteComponentTyped } from "svelte";
import type { SupportedAs } from "../../internal/elements";
declare class __sveltets_Render<TAsProp extends SupportedAs> {
    props(): Omit<import("../../types").TRenderProps<{
        open: boolean;
        close: (focusableElement: HTMLElement | null) => void;
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
            close: (focusableElement: HTMLElement | null) => void;
        };
    };
}
export declare type DisclosureButtonProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type DisclosureButtonEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type DisclosureButtonSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class DisclosureButton<TAsProp extends SupportedAs> extends SvelteComponentTyped<DisclosureButtonProps<TAsProp>, DisclosureButtonEvents<TAsProp>, DisclosureButtonSlots<TAsProp>> {
}
export {};
