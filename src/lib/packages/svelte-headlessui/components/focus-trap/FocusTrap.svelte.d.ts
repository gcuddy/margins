import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        containers: Set<HTMLElement>;
        enabled?: boolean | undefined;
        options?: {
            initialFocus?: HTMLElement | null | undefined;
        } | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type FocusTrapProps = typeof __propDef.props;
export declare type FocusTrapEvents = typeof __propDef.events;
export declare type FocusTrapSlots = typeof __propDef.slots;
export default class FocusTrap extends SvelteComponentTyped<FocusTrapProps, FocusTrapEvents, FocusTrapSlots> {
}
export {};
