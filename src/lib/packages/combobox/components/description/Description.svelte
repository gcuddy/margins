<script >import { useId } from "../../hooks/use-id";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import Render from "../../utils/Render.svelte";
import { onMount } from "svelte";
import { get_current_component } from "svelte/internal";
import { useDescriptionContext } from "./DescriptionProvider.svelte";
const forwardEvents = forwardEventsBuilder(get_current_component());
export let as = "p";
export let use = [];
const id = `headlessui-description-${useId()}`;
let contextStore = useDescriptionContext();
if (!contextStore) {
    throw new Error("You used a <Description /> component, but it is not inside a relevant parent.");
}
onMount(() => $contextStore?.register(id));
$: slotProps = $contextStore.slotProps || {};
</script>

<Render
  name={"Description"}
  {...$$restProps}
  {as}
  {slotProps}
  {...$contextStore?.props}
  {id}
  use={[...use, forwardEvents]}
>
  <slot {...slotProps} />
</Render>
