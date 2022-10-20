<script >import Render from "../../utils/Render.svelte";
import { useId } from "../../hooks/use-id";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { onMount } from "svelte";
import { get_current_component } from "svelte/internal";
import { useLabelContext } from "./LabelProvider.svelte";
const forwardEvents = forwardEventsBuilder(get_current_component());
export let as = "label";
export let use = [];
const id = `headlessui-label-${useId()}`;
export let passive = false;
let contextStore = useLabelContext();
if (!contextStore) {
    throw new Error("You used a <Label /> component, but it is not inside a relevant parent.");
}
onMount(() => $contextStore.register(id));
let allProps = {};
$: allProps = { ...$$restProps, ...$contextStore.props, id };
$: slotProps = $contextStore.slotProps;
if (passive)
    delete allProps["onClick"];
</script>

<Render
  {...allProps}
  name={"Label"}
  {as}
  {slotProps}
  use={[...use, forwardEvents]}
  on:click={(event) => {
    if (!passive) allProps["onClick"]?.(event);
  }}
>
  <slot {...slotProps} />
</Render>
