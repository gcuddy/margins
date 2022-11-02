import { SvelteComponentTyped } from "svelte";
import type { SupportedAs } from "../../internal/elements";
declare class __sveltets_Render<TAsProp extends SupportedAs> {
    props(): Omit<import("../../types").TRenderProps<{
        open: boolean;
    }, TAsProp, "h2">, import("../../types").TInternalProps | "as" | "static" | "unmount"> & {
        as?: TAsProp | undefined;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {
        default: {
            open: boolean;
        };
    };
}
export declare type DialogTitleProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type DialogTitleEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type DialogTitleSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class DialogTitle<TAsProp extends SupportedAs> extends SvelteComponentTyped<DialogTitleProps<TAsProp>, DialogTitleEvents<TAsProp>, DialogTitleSlots<TAsProp>> {
}
export {};
