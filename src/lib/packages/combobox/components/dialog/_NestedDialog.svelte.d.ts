import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        level?: number | undefined;
    };
    events: {
        close: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type NestedDialogProps = typeof __propDef.props;
export declare type NestedDialogEvents = typeof __propDef.events;
export declare type NestedDialogSlots = typeof __propDef.slots;
export default class NestedDialog extends SvelteComponentTyped<NestedDialogProps, NestedDialogEvents, NestedDialogSlots> {
}
export {};
