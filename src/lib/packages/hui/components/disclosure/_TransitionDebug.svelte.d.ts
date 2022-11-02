import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        name: string;
        fn: (arg0: any) => any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type TransitionDebugProps = typeof __propDef.props;
export declare type TransitionDebugEvents = typeof __propDef.events;
export declare type TransitionDebugSlots = typeof __propDef.slots;
export default class TransitionDebug extends SvelteComponentTyped<TransitionDebugProps, TransitionDebugEvents, TransitionDebugSlots> {
}
export {};
