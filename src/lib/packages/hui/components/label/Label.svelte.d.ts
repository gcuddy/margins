import { SvelteComponentTyped } from "svelte";
import type { HTMLActionArray } from "../../hooks/use-actions";
import type { SupportedAs } from "../../internal/elements";
declare const __propDef: {
    props: {
        [x: string]: any;
        as?: SupportedAs | undefined;
        use?: HTMLActionArray | undefined;
        passive?: boolean | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type LabelProps = typeof __propDef.props;
export declare type LabelEvents = typeof __propDef.events;
export declare type LabelSlots = typeof __propDef.slots;
export default class Label extends SvelteComponentTyped<LabelProps, LabelEvents, LabelSlots> {
}
export {};
