import { SvelteComponentTyped } from "svelte";
import type { ActionArray } from "../../hooks/use-actions";
declare const __propDef: {
    props: {
        [x: string]: any;
        use?: ActionArray | undefined;
        el?: HTMLAnchorElement | null | undefined;
        href?: string | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type AProps = typeof __propDef.props;
export declare type AEvents = typeof __propDef.events;
export declare type ASlots = typeof __propDef.slots;
export default class A extends SvelteComponentTyped<AProps, AEvents, ASlots> {
}
export {};
