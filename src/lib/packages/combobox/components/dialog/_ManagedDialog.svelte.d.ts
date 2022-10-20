import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        initialOpen?: boolean | undefined;
        onClose?: (() => void) | undefined;
        buttonInside?: boolean | undefined;
        buttonText?: string | null | undefined;
        buttonProps?: {} | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type ManagedDialogProps = typeof __propDef.props;
export declare type ManagedDialogEvents = typeof __propDef.events;
export declare type ManagedDialogSlots = typeof __propDef.slots;
export default class ManagedDialog extends SvelteComponentTyped<ManagedDialogProps, ManagedDialogEvents, ManagedDialogSlots> {
}
export {};
