import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        value: unknown;
    };
    events: {
        change: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type ManagedListboxProps = typeof __propDef.props;
export declare type ManagedListboxEvents = typeof __propDef.events;
export declare type ManagedListboxSlots = typeof __propDef.slots;
export default class ManagedListbox extends SvelteComponentTyped<ManagedListboxProps, ManagedListboxEvents, ManagedListboxSlots> {
}
export {};
