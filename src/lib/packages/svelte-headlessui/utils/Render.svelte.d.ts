import { SvelteComponentTyped } from "svelte";
import { type SupportedAs } from "../internal/elements";
export declare enum RenderStrategy {
    Unmount = 0,
    Hidden = 1
}
import { type HTMLActionArray } from "../hooks/use-actions";
import { Features } from "../types";
declare class __sveltets_Render<TSlotProps extends {}, TAsProp extends SupportedAs> {
    props(): import("../types").TRestProps<import("../types").TResolveAs<TAsProp, TAsProp>> & {
        name: string;
        slotProps: TSlotProps;
        el?: HTMLElement | null | undefined;
        visible?: boolean | undefined;
        features?: Features | undefined;
        as: TAsProp;
        static?: boolean | undefined;
        unmount?: boolean | undefined;
        use?: HTMLActionArray | undefined;
        class?: string | ((props: TSlotProps) => string) | undefined;
        style?: string | ((props: TSlotProps) => string) | undefined;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {
        default: {};
    };
}
export declare type RenderProps<TSlotProps extends {}, TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TSlotProps, TAsProp>['props']>;
export declare type RenderEvents<TSlotProps extends {}, TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TSlotProps, TAsProp>['events']>;
export declare type RenderSlots<TSlotProps extends {}, TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TSlotProps, TAsProp>['slots']>;
export default class Render<TSlotProps extends {}, TAsProp extends SupportedAs> extends SvelteComponentTyped<RenderProps<TSlotProps, TAsProp>, RenderEvents<TSlotProps, TAsProp>, RenderSlots<TSlotProps, TAsProp>> {
}
export {};
