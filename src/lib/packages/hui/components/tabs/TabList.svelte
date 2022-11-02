<script  context="module">"use strict";
</script>

<script >import { useTabsContext } from "./TabGroup.svelte";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
import Render from "../../utils/Render.svelte";
export let as = "div";
export let use = [];
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component());
/***** Component *****/
let api = useTabsContext("TabList");
let listRef = $api.listRef;
$: propsWeControl = {
    role: "tablist",
    "aria-orientation": $api.orientation,
};
$: slotProps = { selectedIndex: $api.selectedIndex };
</script>

<Render
  {...{ ...$$restProps, ...propsWeControl }}
  {as}
  {slotProps}
  bind:el={$listRef}
  use={[...use, forwardEvents]}
  name={"TabList"}
>
  <slot {...slotProps} />
</Render>
