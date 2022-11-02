import { SvelteComponentTyped } from "svelte";
import type { SupportedAs } from "../../internal/elements";
declare class __sveltets_Render<TAsProp extends SupportedAs> {
    props(): Omit<import("../../types").TRenderProps<{
        selected: boolean;
    }, TAsProp, "div">, import("../../types").TInternalProps | "as" | "static" | "unmount"> & {
        as?: TAsProp | undefined;
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
export declare type TabPanelProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type TabPanelEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type TabPanelSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class TabPanel<TAsProp extends SupportedAs> extends SvelteComponentTyped<TabPanelProps<TAsProp>, TabPanelEvents<TAsProp>, TabPanelSlots<TAsProp>> {
}
export {};
