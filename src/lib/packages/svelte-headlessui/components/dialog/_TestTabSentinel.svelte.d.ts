/** @typedef {typeof __propDef.props}  TestTabSentinelProps */
/** @typedef {typeof __propDef.events}  TestTabSentinelEvents */
/** @typedef {typeof __propDef.slots}  TestTabSentinelSlots */
export default class TestTabSentinel extends SvelteComponentTyped<{
    [x: string]: any;
}, {
    focus: FocusEvent;
} & {
    [evt: string]: CustomEvent<any>;
}, {
    default: {};
}> {
}
export type TestTabSentinelProps = typeof __propDef.props;
export type TestTabSentinelEvents = typeof __propDef.events;
export type TestTabSentinelSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
    };
    events: {
        focus: FocusEvent;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export {};
