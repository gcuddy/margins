import type { createContextMenu } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { writable } from "svelte/store";

type ContextMenuItemContext = {
    inset: boolean;
}

const ContextMenuItemKey = 'ContextMenuItem__options'

export function createContextMenuItemContext({ inset = false }: ContextMenuItemContext) {
    const options = writable({
        inset
    })

    setContext(ContextMenuItemKey, options);

    return options;
}

export function getContextMenuItemContext() {
    const ctx =  getContext(ContextMenuItemKey);
    if (!ctx) {
        throw new Error('ContextMenuItemContext not found')
    }
    return ctx;
}

export type C = ReturnType<typeof createContextMenu>;

