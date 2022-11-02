import { SvelteComponentTyped } from "svelte";
import type { ActionArray } from "../../hooks/use-actions";
declare const __propDef: {
    props: {
        [x: string]: any;
        use?: ActionArray | undefined;
        el?: HTMLButtonElement | null | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type ButtonProps = typeof __propDef.props;
export declare type ButtonEvents = typeof __propDef.events;
export declare type ButtonSlots = typeof __propDef.slots;
export default class Button extends SvelteComponentTyped<ButtonProps, ButtonEvents, ButtonSlots> {
}
export {};
