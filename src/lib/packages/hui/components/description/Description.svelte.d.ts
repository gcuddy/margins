import { SvelteComponentTyped } from "svelte";
import type { HTMLActionArray } from "../../hooks/use-actions";
import type { SupportedAs } from "../../internal/elements";
declare const __propDef: {
    props: {
        [x: string]: any;
        as?: SupportedAs | undefined;
        use?: HTMLActionArray | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type DescriptionProps = typeof __propDef.props;
export declare type DescriptionEvents = typeof __propDef.events;
export declare type DescriptionSlots = typeof __propDef.slots;
export default class Description extends SvelteComponentTyped<DescriptionProps, DescriptionEvents, DescriptionSlots> {
}
export {};
