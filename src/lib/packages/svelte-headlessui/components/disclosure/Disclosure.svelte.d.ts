import { SvelteComponentTyped } from "svelte";
import type { Readable, Writable } from "svelte/store";
export declare enum DisclosureStates {
    Open = 0,
    Closed = 1
}
export interface StateDefinition {
    disclosureState: DisclosureStates;
    panelStore: Writable<HTMLElement | null>;
    panelId: string;
    buttonStore: Writable<HTMLButtonElement | null>;
    buttonId: string;
    toggleDisclosure(): void;
    closeDisclosure(): void;
    close(focusableElement: HTMLElement | HTMLElement | null): void;
}
export declare function useDisclosureContext(component: string): Readable<StateDefinition>;
import type { SupportedAs } from "../../internal/elements";
declare class __sveltets_Render<TAsProp extends SupportedAs> {
    props(): Omit<import("../../types").TRenderProps<{
        open: boolean;
        close: (focusableElement: HTMLElement | null) => void;
    }, TAsProp, "div">, import("../../types").TInternalProps | "as" | "static" | "unmount"> & {
        as?: TAsProp | undefined;
    } & {
        /** Whether the `Disclosure` should be open by default */
        defaultOpen?: boolean | undefined;
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
export declare type DisclosureProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type DisclosureEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type DisclosureSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class Disclosure<TAsProp extends SupportedAs> extends SvelteComponentTyped<DisclosureProps<TAsProp>, DisclosureEvents<TAsProp>, DisclosureSlots<TAsProp>> {
}
export {};
