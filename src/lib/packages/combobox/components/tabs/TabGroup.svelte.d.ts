import { SvelteComponentTyped } from "svelte";
interface PanelData {
    id: string;
    ref: Readable<HTMLElement | null>;
}
export declare type StateDefinition = {
    selectedIndex: number | null;
    orientation: "vertical" | "horizontal";
    activation: "auto" | "manual";
    tabs: HTMLElement[];
    panels: PanelData[];
    listRef: Writable<HTMLElement | null>;
    setSelectedIndex(index: number): void;
    registerTab(tab: HTMLElement | null): void;
    unregisterTab(tab: HTMLElement | null): void;
    registerPanel(panel: PanelData): void;
    unregisterPanel(panel: PanelData): void;
};
export declare function useTabsContext(component: string): Readable<StateDefinition>;
import type { Readable, Writable } from "svelte/store";
import type { SupportedAs } from "../../internal/elements";
declare class __sveltets_Render<TAsProp extends SupportedAs> {
    props(): Omit<import("../../types").TRenderProps<{
        selectedIndex: number | null;
    }, TAsProp, "div">, import("../../types").TInternalProps | "as" | "static" | "unmount"> & {
        as?: TAsProp | undefined;
    } & {
        /** The index of the default selected tab */
        defaultIndex?: number | undefined;
        /** Whether the orientation of the `TabList` is vertical instead of horizontal */
        vertical?: boolean | undefined;
        /**
         * Whether, in keyboard navigation, the Enter or Space key is necessary to change tabs.
         * By default, the arrow keys will change tabs automatically without hitting Enter/Space.
         * This has no impact on mouse behavior
         */
        manual?: boolean | undefined;
    };
    events(): {
        change: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {
        default: {
            selectedIndex: number | null;
        };
    };
}
export declare type TabGroupProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type TabGroupEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type TabGroupSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class TabGroup<TAsProp extends SupportedAs> extends SvelteComponentTyped<TabGroupProps<TAsProp>, TabGroupEvents<TAsProp>, TabGroupSlots<TAsProp>> {
}
export {};
