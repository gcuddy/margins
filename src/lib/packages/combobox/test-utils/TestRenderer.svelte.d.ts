import { SvelteComponentTyped } from "svelte";
declare type HandlerType = (event?: CustomEvent) => any;
interface ComponentProps {
    onChange?: HandlerType;
    onClose?: HandlerType;
    onFocus?: HandlerType;
    onKeydown?: HandlerType;
    onSubmit?: HandlerType;
    onClick?: HandlerType;
}
declare type SingleComponent = string | [typeof SvelteComponent, ComponentProps, TestRendererProps];
export declare type TestRendererProps = undefined | SingleComponent | SingleComponent[];
import type { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        allProps: TestRendererProps;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type TestRendererProps = typeof __propDef.props;
export declare type TestRendererEvents = typeof __propDef.events;
export declare type TestRendererSlots = typeof __propDef.slots;
export default class TestRenderer extends SvelteComponentTyped<TestRendererProps, TestRendererEvents, TestRendererSlots> {
}
export {};
