<script  context="module">"use strict";
</script>

<script >import { onMount } from "svelte";
import { Focus, focusIn } from "../../utils/focus-management";
import { Keys } from "../../utils/keyboard";
import { match } from "../../utils/match";
import { useTabsContext } from "./TabGroup.svelte";
import { useId } from "../../hooks/use-id";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
import Render from "../../utils/Render.svelte";
import { resolveButtonType } from "../../utils/resolve-button-type";
export let as = "button";
export let use = [];
export let disabled = false;
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component());
/***** Component *****/
let api = useTabsContext("Tab");
let id = `headlessui-tabs-tab-${useId()}`;
let tabRef = null;
onMount(() => {
    $api.registerTab(tabRef);
    return () => $api.unregisterTab(tabRef);
});
$: myIndex = tabRef ? $api.tabs.indexOf(tabRef) : -1;
$: selected = myIndex === $api.selectedIndex;
function handleKeyDown(e) {
    let event = e;
    let list = $api.tabs.filter(Boolean);
    if (event.key === Keys.Space || event.key === Keys.Enter) {
        event.preventDefault();
        event.stopPropagation();
        $api.setSelectedIndex(myIndex);
        return;
    }
    switch (event.key) {
        case Keys.Home:
        case Keys.PageUp:
            event.preventDefault();
            event.stopPropagation();
            return focusIn(list, Focus.First);
        case Keys.End:
        case Keys.PageDown:
            event.preventDefault();
            event.stopPropagation();
            return focusIn(list, Focus.Last);
    }
    return match($api.orientation, {
        vertical() {
            if (event.key === Keys.ArrowUp)
                return focusIn(list, Focus.Previous | Focus.WrapAround);
            if (event.key === Keys.ArrowDown)
                return focusIn(list, Focus.Next | Focus.WrapAround);
            return;
        },
        horizontal() {
            if (event.key === Keys.ArrowLeft)
                return focusIn(list, Focus.Previous | Focus.WrapAround);
            if (event.key === Keys.ArrowRight)
                return focusIn(list, Focus.Next | Focus.WrapAround);
            return;
        },
    });
}
function handleFocus() {
    tabRef?.focus();
}
function handleSelection() {
    if (disabled)
        return;
    tabRef?.focus();
    $api.setSelectedIndex(myIndex);
}
$: myPanelRef = $api.panels[myIndex]?.ref;
$: propsWeControl = {
    id,
    role: "tab",
    type: resolveButtonType({ type: $$props.type, as }, tabRef),
    "aria-controls": $myPanelRef ? $api.panels[myIndex]?.id : undefined,
    "aria-selected": selected,
    tabIndex: selected ? 0 : -1,
    disabled: disabled ? true : undefined,
};
$: if ("production" === "test") {
    Object.assign(propsWeControl, { ["data-headlessui-index"]: myIndex });
}
$: slotProps = { selected };
</script>

<Render
  {...{ ...$$restProps, ...propsWeControl }}
  {as}
  {slotProps}
  use={[...use, forwardEvents]}
  name={"Tab"}
  bind:el={tabRef}
  on:keydown={handleKeyDown}
  on:click={handleSelection}
  on:focus={$api.activation === "manual" ? handleFocus : handleSelection}
>
  <slot {...slotProps} />
</Render>
