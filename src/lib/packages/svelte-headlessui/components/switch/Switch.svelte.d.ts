import { SvelteComponentTyped } from "svelte";
import type { SupportedAs } from "../../internal/elements";
declare class __sveltets_Render<TAsProp extends SupportedAs> {
    props(): Omit<import("../../types").TRenderProps<{
        checked: boolean;
    }, TAsProp, "button">, import("../../types").TInternalProps | "as" | "static" | "unmount"> & {
        as?: TAsProp | undefined;
    } & {
        /** Whether the switch is checked */
        checked: boolean;
    };
    events(): {
        change: CustomEvent<boolean>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {
        default: {
            checked: boolean;
        };
    };
}
export declare type SwitchProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type SwitchEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type SwitchSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class Switch<TAsProp extends SupportedAs> extends SvelteComponentTyped<SwitchProps<TAsProp>, SwitchEvents<TAsProp>, SwitchSlots<TAsProp>> {
}
export {};
