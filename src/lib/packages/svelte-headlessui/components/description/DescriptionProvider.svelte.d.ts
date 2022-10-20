import { SvelteComponentTyped } from "svelte";
export interface DescriptionContext {
    name?: string;
    slotProps?: object;
    props?: object;
    register: (value: string) => void;
    descriptionIds?: string;
}
export declare function useDescriptionContext(): Readable<DescriptionContext> | undefined;
import type { Readable } from "svelte/store";
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
            describedby: string | undefined;
        };
    };
};
export declare type DescriptionProviderProps = typeof __propDef.props;
export declare type DescriptionProviderEvents = typeof __propDef.events;
export declare type DescriptionProviderSlots = typeof __propDef.slots;
export default class DescriptionProvider extends SvelteComponentTyped<DescriptionProviderProps, DescriptionProviderEvents, DescriptionProviderSlots> {
}
export {};
