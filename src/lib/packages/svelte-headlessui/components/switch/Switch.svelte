<script  context="module">"use strict";
</script>

<script >import { useSwitchContext } from "./SwitchGroup.svelte";
import { useLabelContext } from "../label/LabelProvider.svelte";
import { useDescriptionContext } from "../description/DescriptionProvider.svelte";
import { useId } from "../../hooks/use-id";
import { Keys } from "../../utils/keyboard";
import { createEventDispatcher } from "svelte";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
import Render from "../../utils/Render.svelte";
import { resolveButtonType } from "../../utils/resolve-button-type";
export let as = "button";
export let use = [];
export let checked = false;
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component(), [
    "change",
]);
const dispatch = createEventDispatcher();
/***** Component *****/
let api = useSwitchContext();
let labelContext = useLabelContext();
let descriptionContext = useDescriptionContext();
let id = `headlessui-switch-${useId()}`;
$: switchStore = $api?.switchStore;
function toggle() {
    dispatch("change", !checked);
}
function handleClick(e) {
    let event = e;
    event.preventDefault();
    toggle();
}
function handleKeyUp(e) {
    let event = e;
    if (event.key !== Keys.Tab)
        event.preventDefault();
    if (event.key === Keys.Space)
        toggle();
}
// This is needed so that we can "cancel" the click event when we use the `Enter` key on a button.
function handleKeyPress(e) {
    let event = e;
    event.preventDefault();
}
$: propsWeControl = {
    id,
    role: "switch",
    type: resolveButtonType({ type: $$props.type, as }, $switchStore),
    tabIndex: 0,
    "aria-checked": checked,
    "aria-labelledby": $labelContext?.labelIds,
    "aria-describedby": $descriptionContext?.descriptionIds,
};
$: slotProps = { checked };
</script>

<!-- TODO: I'm sure there's a better way of doing this -->
{#if switchStore}
  <Render
    {...{ ...$$restProps, ...propsWeControl }}
    {as}
    {slotProps}
    use={[...use, forwardEvents]}
    name={"Switch"}
    bind:el={$switchStore}
    on:click={handleClick}
    on:keyup={handleKeyUp}
    on:keypress={handleKeyPress}
  >
    <slot {...slotProps} />
  </Render>
{:else}
  <Render
    {...{ ...$$restProps, ...propsWeControl }}
    {as}
    {slotProps}
    use={[...use, forwardEvents]}
    name={"Switch"}
    on:click={handleClick}
    on:keyup={handleKeyUp}
    on:keypress={handleKeyPress}
  >
    <slot {...slotProps} />
  </Render>
{/if}
