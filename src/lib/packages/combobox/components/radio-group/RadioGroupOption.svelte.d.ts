import { SvelteComponentTyped } from "svelte";
import type { SupportedAs } from "../../internal/elements";
declare class __sveltets_Render<TAsProp extends SupportedAs> {
    props(): Omit<import("../../types").TRenderProps<{
        checked: boolean;
        disabled: boolean;
        active: boolean;
    }, TAsProp, "div">, import("../../types").TInternalProps | "as" | "static" | "unmount"> & {
        as?: TAsProp | undefined;
    } & {
        /**
         * The value of the `RadioGroupOption`.
         * The type should match the type of the value prop in the `RadioGroup`
         */
        value: unknown;
        /** Whether the `RadioGroupOption` is disabled */
        disabled?: boolean | undefined;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {
        default: {
            checked: boolean;
            disabled: boolean;
            active: boolean;
        };
    };
}
export declare type RadioGroupOptionProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type RadioGroupOptionEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type RadioGroupOptionSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class RadioGroupOption<TAsProp extends SupportedAs> extends SvelteComponentTyped<RadioGroupOptionProps<TAsProp>, RadioGroupOptionEvents<TAsProp>, RadioGroupOptionSlots<TAsProp>> {
}
export {};
