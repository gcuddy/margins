import { SvelteComponentTyped } from "svelte";
export declare enum Features {
    None = 1,
    Focusable = 2,
    Hidden = 4
}
import type { SupportedAs } from "./elements";
declare const __propDef: {
    props: {
        [x: string]: any;
        as?: SupportedAs | undefined;
        features?: Features | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type HiddenProps = typeof __propDef.props;
export declare type HiddenEvents = typeof __propDef.events;
export declare type HiddenSlots = typeof __propDef.slots;
export default class Hidden extends SvelteComponentTyped<HiddenProps, HiddenEvents, HiddenSlots> {
}
export {};
