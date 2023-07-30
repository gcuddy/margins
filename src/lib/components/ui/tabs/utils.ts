import { CreateTabsProps, createTabs } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";

export type Tabs = ReturnType<typeof createTabs>;

const symbol = Symbol("Tabs");

export function createTabsContext(opts?: CreateTabsProps) {
    let tabs = createTabs(opts);
    setContext(symbol, tabs);
    return tabs;
}

export function getTabsContext() {
    const ctx =  getContext(symbol);
    if (!ctx) {
        throw new Error("No tabs context found");
    }
    return ctx as Tabs;
}
