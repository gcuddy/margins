import { SvelteComponentTyped } from "svelte";
import { Focus } from "../../utils/calculate-active-index";
import type { Readable, Writable } from "svelte/store";
import type { SupportedAs } from "../../internal/elements";
export declare enum MenuStates {
    Open = 0,
    Closed = 1
}
export declare type MenuItemData = {
    textValue: string;
    disabled: boolean;
};
export declare type StateDefinition = {
    menuState: MenuStates;
    buttonStore: Writable<HTMLButtonElement | null>;
    itemsStore: Writable<HTMLDivElement | null>;
    items: {
        id: string;
        data: MenuItemData;
    }[];
    searchQuery: string;
    activeItemIndex: number | null;
    closeMenu(): void;
    openMenu(): void;
    goToItem(focus: Focus, id?: string): void;
    search(value: string): void;
    clearSearch(): void;
    registerItem(id: string, dataRef: MenuItemData): void;
    unregisterItem(id: string): void;
};
export declare function useMenuContext(componentName: string): Readable<StateDefinition>;
declare class __sveltets_Render<TAsProp extends SupportedAs> {
    props(): Omit<import("../../types").TRenderProps<{
        open: boolean;
    }, TAsProp, "div">, import("../../types").TInternalProps | "as" | "static" | "unmount"> & {
        as?: TAsProp | undefined;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {
        default: {
            open: boolean;
        };
    };
}
export declare type MenuProps<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['props']>;
export declare type MenuEvents<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['events']>;
export declare type MenuSlots<TAsProp extends SupportedAs> = ReturnType<__sveltets_Render<TAsProp>['slots']>;
export default class Menu<TAsProp extends SupportedAs> extends SvelteComponentTyped<MenuProps<TAsProp>, MenuEvents<TAsProp>, MenuSlots<TAsProp>> {
}
export {};
