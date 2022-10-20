import { SvelteComponentTyped } from "svelte";
export declare enum DialogStates {
    Open = 0,
    Closed = 1
}
export interface StateDefinition {
    dialogState: DialogStates;
    titleId?: string;
    setTitleId(id?: string): void;
    close(): void;
}
export declare function useDialogContext(component: string): Readable<StateDefinition>;
import type { Readable } from "svelte/store";
import type { SupportedAs } from "../../internal/elements";
declare class __sveltets_Render<TAsProp extends SupportedAs> {
    props(): Omit<import("../../types").TRenderProps<{
        open: boolean | undefined;
    }, TAsProp, "div">, import("../../types").TInternalProps | "as" | "static" | "unmount"> & {
        as?: TAsProp | undefined;
    } & {
        /** Whether the `Dialog` is open */
        open?: boolean | undefined;
        /** The element that should receive focus when the Dialog is first opened */
        initialFocus?: HTMLElement | null | undefined;
        /** Whether the element should ignore the internally managed open/closed state */
        static?: boolean | undefined;
        /** Whether the element should be unmounted, instead of just hidden, based on the open/closed state	*/
        unmount?: boolean | undefined;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {
        default: {
            open: boolean | undefined;
        };
    };
}
export declare type DialogProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type DialogEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type DialogSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class Dialog<TAsProp extends SupportedAs> extends SvelteComponentTyped<DialogProps<TAsProp>, DialogEvents<TAsProp>, DialogSlots<TAsProp>> {
}
export {};
