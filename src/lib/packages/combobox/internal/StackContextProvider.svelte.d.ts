import { SvelteComponentTyped } from "svelte";
export declare enum StackMessage {
    Add = 0,
    Remove = 1
}
declare const __propDef: {
    props: {
        onUpdate: ((message: StackMessage, element: HTMLElement) => void) | undefined;
        element: HTMLElement | null;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type StackContextProviderProps = typeof __propDef.props;
export declare type StackContextProviderEvents = typeof __propDef.events;
export declare type StackContextProviderSlots = typeof __propDef.slots;
export default class StackContextProvider extends SvelteComponentTyped<StackContextProviderProps, StackContextProviderEvents, StackContextProviderSlots> {
}
export {};
