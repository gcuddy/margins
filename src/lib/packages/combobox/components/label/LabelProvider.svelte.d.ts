import { SvelteComponentTyped } from "svelte";
export interface LabelContext {
    name?: string;
    slotProps?: object;
    props?: object;
    register: (value: string) => void;
    labelIds?: string;
}
export declare function useLabelContext(): Writable<LabelContext> | undefined;
import type { Writable } from "svelte/store";
declare const __propDef: {
    props: {
        [x: string]: any;
        name: string;
        slotProps?: {} | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            labelledby: string | undefined;
        };
    };
};
export declare type LabelProviderProps = typeof __propDef.props;
export declare type LabelProviderEvents = typeof __propDef.events;
export declare type LabelProviderSlots = typeof __propDef.slots;
export default class LabelProvider extends SvelteComponentTyped<LabelProviderProps, LabelProviderEvents, LabelProviderSlots> {
}
export {};
