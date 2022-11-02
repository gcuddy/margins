<script  context="module">const TABS_CONTEXT_NAME = "headlessui-tabs-context";
export function useTabsContext(component) {
    let context = getContext(TABS_CONTEXT_NAME);
    if (context === undefined) {
        throw new Error(`<${component} /> is missing a parent <TabGroup /> component.`);
    }
    return context;
}
</script>

<script >import { createEventDispatcher, getContext, onMount, setContext, } from "svelte";
import { writable } from "svelte/store";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
import Render from "../../utils/Render.svelte";
export let as = "div";
export let use = [];
export let defaultIndex = 0;
export let vertical = false;
export let manual = false;
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component(), [
    "change",
]);
const dispatch = createEventDispatcher();
/***** Component *****/
let selectedIndex = null;
let tabs = [];
let panels = [];
let listRef = writable(null);
let api = writable({
    selectedIndex,
    orientation: vertical ? "vertical" : "horizontal",
    activation: manual ? "manual" : "auto",
    tabs,
    panels,
    listRef,
    setSelectedIndex(index) {
        if (selectedIndex === index)
            return;
        selectedIndex = index;
        dispatch("change", index);
    },
    registerTab(tab) {
        if (tabs.includes(tab))
            return;
        if (!$listRef) {
            // We haven't mounted yet so just append
            tabs = [...tabs, tab];
            return;
        }
        let currentSelectedTab = selectedIndex !== null ? tabs[selectedIndex] : null;
        let orderMap = Array.from($listRef.querySelectorAll('[id^="headlessui-tabs-tab-"]')).reduce((lookup, element, index) => Object.assign(lookup, { [element.id]: index }), {});
        let nextTabs = [...tabs, tab];
        nextTabs.sort((a, z) => orderMap[a.id] - orderMap[z.id]);
        tabs = nextTabs;
        // Maintain the correct item active
        selectedIndex = (() => {
            if (currentSelectedTab === null)
                return null;
            return tabs.indexOf(currentSelectedTab);
        })();
    },
    unregisterTab(tab) {
        tabs = tabs.filter((t) => t !== tab);
    },
    registerPanel(panel) {
        if (!panels.includes(panel))
            panels = [...panels, panel];
    },
    unregisterPanel(panel) {
        panels = panels.filter((p) => p !== panel);
    },
});
setContext(TABS_CONTEXT_NAME, api);
$: api.update((obj) => {
    return {
        ...obj,
        selectedIndex,
        orientation: vertical ? "vertical" : "horizontal",
        activation: manual ? "manual" : "auto",
        tabs,
        panels,
    };
});
onMount(() => {
    if (tabs.length <= 0)
        return;
    if (selectedIndex !== null)
        return;
    let mountedTabs = tabs.filter(Boolean);
    let focusableTabs = mountedTabs.filter((tab) => !tab.hasAttribute("disabled"));
    if (focusableTabs.length <= 0)
        return;
    // Underflow
    if (defaultIndex < 0) {
        selectedIndex = mountedTabs.indexOf(focusableTabs[0]);
    }
    // Overflow
    else if (defaultIndex > mountedTabs.length) {
        selectedIndex = mountedTabs.indexOf(focusableTabs[focusableTabs.length - 1]);
    }
    // Middle
    else {
        let before = mountedTabs.slice(0, defaultIndex);
        let after = mountedTabs.slice(defaultIndex);
        let next = [...after, ...before].find((tab) => focusableTabs.includes(tab));
        if (!next)
            return;
        selectedIndex = mountedTabs.indexOf(next);
    }
});
$: slotProps = { selectedIndex };
</script>

<Render
  {...$$restProps}
  {as}
  {slotProps}
  use={[...use, forwardEvents]}
  name={"TabGroup"}
>
  <slot {...slotProps} />
</Render>
