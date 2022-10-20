import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        initialChecked?: boolean | undefined;
        onChange?: (() => void) | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type ManagedSwitchProps = typeof __propDef.props;
export declare type ManagedSwitchEvents = typeof __propDef.events;
export declare type ManagedSwitchSlots = typeof __propDef.slots;
export default class ManagedSwitch extends SvelteComponentTyped<ManagedSwitchProps, ManagedSwitchEvents, ManagedSwitchSlots> {
}
export {};
