<script  context="module">"use strict";
</script>

<script >import { ListboxStates, useListboxContext } from "./Listbox.svelte";
import { useId } from "../../hooks/use-id";
import Render from "../../utils/Render.svelte";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
export let as = "label";
export let use = [];
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component());
/***** Component *****/
let id = `headlessui-listbox-label-${useId()}`;
let api = useListboxContext("ListboxLabel");
let labelRef = $api.labelRef;
let buttonRef = $api.buttonRef;
function handleClick() {
    $buttonRef?.focus({ preventScroll: true });
}
$: slotProps = {
    open: $api.listboxState === ListboxStates.Open,
    disabled: $api.disabled,
};
</script>

<Render
  {...$$restProps}
  {id}
  {as}
  {slotProps}
  use={[...use, forwardEvents]}
  name={"ListboxLabel"}
  bind:el={$labelRef}
  on:click={handleClick}
>
  <slot {...slotProps} />
</Render>
