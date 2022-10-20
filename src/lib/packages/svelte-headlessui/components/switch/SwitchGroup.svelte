<script  context="module">const SWITCH_CONTEXT_NAME = "headlessui-switch-context";
export function useSwitchContext() {
    return getContext(SWITCH_CONTEXT_NAME);
}
</script>

<script >import DescriptionProvider from "../description/DescriptionProvider.svelte";
import LabelProvider from "../label/LabelProvider.svelte";
import { getContext, setContext } from "svelte";
import { writable } from "svelte/store";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
import Render from "../../utils/Render.svelte";
export let as = "div";
export let use = [];
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component());
/***** Component *****/
let switchStore = writable(null);
let api = writable({
    switchStore,
});
setContext(SWITCH_CONTEXT_NAME, api);
function onClick() {
    if (!$switchStore)
        return;
    $switchStore.click();
    $switchStore.focus({ preventScroll: true });
}
$: slotProps = {};
</script>

<Render
  {...$$restProps}
  {as}
  use={[...use, forwardEvents]}
  {slotProps}
  name={"SwitchGroup"}
>
  <DescriptionProvider name="SwitchDescription">
    <LabelProvider name="SwitchLabel" {onClick}>
      <slot {...slotProps} />
    </LabelProvider>
  </DescriptionProvider>
</Render>
