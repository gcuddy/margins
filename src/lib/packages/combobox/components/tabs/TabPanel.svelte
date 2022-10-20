<script  context="module">"use strict";
</script>

<script >import { onMount } from "svelte";
import { useTabsContext } from "./TabGroup.svelte";
import { useId } from "../../hooks/use-id";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
import Render from "../../utils/Render.svelte";
import { writable } from "svelte/store";
import { Features } from "../../types";
export let as = "div";
export let use = [];
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component());
/***** Component *****/
let elementRef = writable(null);
let api = useTabsContext("TabPanel");
let id = `headlessui-tabs-panel-${useId()}`;
$: panelData = { id, ref: elementRef };
onMount(() => {
    $api.registerPanel(panelData);
    return () => $api.unregisterPanel(panelData);
});
$: myIndex = $api.panels.indexOf(panelData);
$: selected = myIndex === $api.selectedIndex;
$: propsWeControl = {
    id,
    role: "tabpanel",
    "aria-labelledby": $api.tabs[myIndex]?.id,
    tabIndex: selected ? 0 : -1,
};
$: if ("production" === "test") {
    Object.assign(propsWeControl, { ["data-headlessui-index"]: myIndex });
}
$: slotProps = { selected };
</script>

<Render
  {...{ ...$$restProps, ...propsWeControl }}
  {as}
  use={[...use, forwardEvents]}
  name={"TabPanel"}
  {slotProps}
  bind:el={$elementRef}
  visible={selected}
  features={Features.RenderStrategy | Features.Static}
>
  <slot {...slotProps} />
</Render>
