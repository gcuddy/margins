import { SvelteComponentTyped } from "svelte";
import type { SupportedAs } from "../../internal/elements";
declare class __sveltets_Render<TAsProp extends SupportedAs> {
    props(): Omit<import("../../types").TRenderProps<{
        selected: boolean;
    }, TAsProp, "button">, import("../../types").TInternalProps | "as" | "static" | "unmount"> & {
        as?: TAsProp | undefined;
    } & {
        /** Whether the `Tab` is currently disabled */
        disabled?: boolean | undefined;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {
        default: {
            selected: boolean;
        };
    };
}
export declare type TabProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type TabEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type TabSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class Tab<TAsProp extends SupportedAs> extends SvelteComponentTyped<TabProps<TAsProp>, TabEvents<TAsProp>, TabSlots<TAsProp>> {
}
export {};
