<script  context="module">"use strict";
</script>

<script >import { State, useOpenClosed } from "../../internal/open-closed";
import { PopoverStates, usePopoverContext } from "./Popover.svelte";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
import Render from "../../utils/Render.svelte";
import { useId } from "../../hooks/use-id";
import { Features } from "../../types";
export let as = "div";
export let use = [];
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component());
/***** Component *****/
let api = usePopoverContext("PopoverOverlay");
let id = `headlessui-popover-overlay-${useId()}`;
let openClosedState = useOpenClosed();
$: visible =
    openClosedState !== undefined
        ? $openClosedState === State.Open
        : $api.popoverState === PopoverStates.Open;
function handleClick() {
    $api.closePopover();
}
$: slotProps = { open: $api.popoverState === PopoverStates.Open };
$: propsWeControl = { id };
</script>

<Render
  {...$$restProps}
  {...propsWeControl}
  {as}
  {slotProps}
  use={[...use, forwardEvents]}
  name={"PopoverOverlay"}
  on:click={handleClick}
  aria-hidden
  {visible}
  features={Features.RenderStrategy | Features.Static}
>
  <slot {...slotProps} />
</Render>
