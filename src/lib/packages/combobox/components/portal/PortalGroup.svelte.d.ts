import { SvelteComponentTyped } from "svelte";
import type { Readable } from "svelte/store";
export declare function usePortalGroupContext(): Readable<HTMLElement | null> | undefined;
declare const __propDef: {
    props: {
        target: HTMLElement | null;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type PortalGroupProps = typeof __propDef.props;
export declare type PortalGroupEvents = typeof __propDef.events;
export declare type PortalGroupSlots = typeof __propDef.slots;
export default class PortalGroup extends SvelteComponentTyped<PortalGroupProps, PortalGroupEvents, PortalGroupSlots> {
}
export {};
