<script  context="module">import { getContext, setContext } from "svelte";
let DISCLOSURE_PANEL_CONTEXT_NAME = "headlessui-disclosure-panel-context";
export function usePanelContext() {
    return getContext(DISCLOSURE_PANEL_CONTEXT_NAME);
}
</script>

<script >import { useDisclosureContext, DisclosureStates } from "./Disclosure.svelte";
import { State, useOpenClosed } from "../../internal/open-closed";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
import Render from "../../utils/Render.svelte";
import { Features } from "../../types";
export let as = "div";
export let use = [];
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component());
/***** Component *****/
const api = useDisclosureContext("DisclosurePanel");
let openClosedState = useOpenClosed();
setContext(DISCLOSURE_PANEL_CONTEXT_NAME, $api.panelId);
$: panelStore = $api.panelStore;
$: visible =
    $openClosedState !== null
        ? $openClosedState === State.Open
        : $api.disclosureState === DisclosureStates.Open;
$: propsWeControl = { id: $api.panelId };
$: slotProps = {
    open: $api.disclosureState === DisclosureStates.Open,
    close: $api.close,
};
</script>

<Render
  {...{ ...$$restProps, ...propsWeControl }}
  {as}
  {slotProps}
  use={[...use, forwardEvents]}
  name={"DisclosurePanel"}
  bind:el={$panelStore}
  {visible}
  features={Features.RenderStrategy | Features.Static}
>
  <slot {...slotProps} />
</Render>
