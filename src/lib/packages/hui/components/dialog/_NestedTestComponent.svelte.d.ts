import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {};
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type NestedTestComponentProps = typeof __propDef.props;
export declare type NestedTestComponentEvents = typeof __propDef.events;
export declare type NestedTestComponentSlots = typeof __propDef.slots;
export default class NestedTestComponent extends SvelteComponentTyped<NestedTestComponentProps, NestedTestComponentEvents, NestedTestComponentSlots> {
}
export {};
