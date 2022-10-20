import { SvelteComponentTyped } from "svelte";
import type { Writable } from "svelte/store";
export declare function usePortalRoot(): Writable<boolean> | undefined;
declare const __propDef: {
    props: {
        force: boolean;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type ForcePortalRootContextProps = typeof __propDef.props;
export declare type ForcePortalRootContextEvents = typeof __propDef.events;
export declare type ForcePortalRootContextSlots = typeof __propDef.slots;
export default class ForcePortalRootContext extends SvelteComponentTyped<ForcePortalRootContextProps, ForcePortalRootContextEvents, ForcePortalRootContextSlots> {
}
export {};
