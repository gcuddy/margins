import { SvelteComponentTyped } from "svelte";
export declare enum PopoverStates {
    Open = 0,
    Closed = 1
}
export interface StateDefinition {
    popoverState: PopoverStates;
    button: Writable<HTMLElement | null>;
    buttonId: string;
    panel: Writable<HTMLElement | null>;
    panelId: string;
    togglePopover(): void;
    closePopover(): void;
    close(focusableElement: HTMLElement | null): void;
}
export interface PopoverRegisterBag {
    buttonId: string;
    panelId: string;
    close(): void;
}
export declare function usePopoverContext(component: string): Readable<StateDefinition>;
import type { Readable, Writable } from "svelte/store";
import type { SupportedAs } from "../../internal/elements";
declare class __sveltets_Render<TAsProp extends SupportedAs> {
    props(): Omit<import("../../types").TRenderProps<{
        open: boolean;
        close: (focusableElement: HTMLElement | null) => void;
    }, TAsProp, "div">, import("../../types").TInternalProps | "as" | "static" | "unmount"> & {
        as?: TAsProp | undefined;
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
export declare type PopoverProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type PopoverEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type PopoverSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class Popover<TAsProp extends SupportedAs> extends SvelteComponentTyped<PopoverProps<TAsProp>, PopoverEvents<TAsProp>, PopoverSlots<TAsProp>> {
}
export {};
