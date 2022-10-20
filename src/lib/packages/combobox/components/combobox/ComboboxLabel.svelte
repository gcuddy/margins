<script  context="module">"use strict";
</script>
  
  <script >import { ComboboxStates, useComboboxContext } from "./Combobox.svelte";
import { useId } from "../../hooks/use-id";
import Render from "../../utils/Render.svelte";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
export let as = "label";
export let use = [];
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component());
/***** Component *****/
let id = `headlessui-combobox-label-${useId()}`;
let api = useComboboxContext("ComboboxLabel");
let labelRef = $api.labelRef;
let inputRef = $api.inputRef;
function handleClick() {
    $inputRef?.focus({ preventScroll: true });
}
$: slotProps = {
    open: $api.comboboxState === ComboboxStates.Open,
    disabled: $api.disabled,
};
</script>
  
  <Render
    {...$$restProps}
    {id}
    {as}
    {slotProps}
    use={[...use, forwardEvents]}
    name={"ComboboxLabel"}
    bind:el={$labelRef}
    on:click={handleClick}
  >
    <slot {...slotProps} />
  </Render>
  