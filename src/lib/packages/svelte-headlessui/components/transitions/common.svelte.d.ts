import { SvelteComponentTyped } from "svelte";
import type { useId } from "../../hooks/use-id";
import { RenderStrategy } from "../../utils/Render.svelte";
import type { Readable } from "svelte/store";
export declare enum TreeStates {
    Visible = "visible",
    Hidden = "hidden"
}
declare type ID = ReturnType<typeof useId>;
export interface NestingContextValues {
    children: {
        id: ID;
        state: TreeStates;
    }[];
    register: (id: ID) => () => void;
    unregister: (id: ID, strategy?: RenderStrategy) => void;
}
export interface TransitionContextValues {
    show: boolean;
    appear: boolean;
    initialShow: boolean;
}
export declare const TRANSITION_CONTEXT_NAME = "headlessui-transition-context";
export declare const NESTING_CONTEXT_NAME = "headlessui-nesting-context";
export declare function hasTransitionContext(): boolean;
export declare function useTransitionContext(): Readable<TransitionContextValues>;
export declare function useParentNesting(): Readable<NestingContextValues>;
export declare function hasChildren(bag: NestingContextValues["children"] | {
    children: NestingContextValues["children"];
}): boolean;
export declare function useNesting(done?: () => void): {
    children: {
        id: number;
        state: TreeStates;
    }[];
    register: (childId: ID) => () => void;
    unregister: (childId: ID, strategy?: RenderStrategy) => void;
};
declare const __propDef: {
    props: {};
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CommonProps = typeof __propDef.props;
export declare type CommonEvents = typeof __propDef.events;
export declare type CommonSlots = typeof __propDef.slots;
export default class Common extends SvelteComponentTyped<CommonProps, CommonEvents, CommonSlots> {
}
export {};
