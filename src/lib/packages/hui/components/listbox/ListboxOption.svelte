<script  context="module">"use strict";
</script>

<script >import { onDestroy, onMount, tick } from "svelte";
import { ListboxStates, useListboxContext } from "./Listbox.svelte";
import { useId } from "../../hooks/use-id";
import { Focus } from "../../utils/calculate-active-index";
import Render from "../../utils/Render.svelte";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
export let as = "li";
export let use = [];
export let value;
export let disabled = false;
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component());
/***** Component *****/
let api = useListboxContext("ListboxOption");
let id = `headlessui-listbox-option-${useId()}`;
let buttonRef = $api.buttonRef;
$: active =
    $api.activeOptionIndex !== null
        ? $api.options[$api.activeOptionIndex].id === id
        : false;
$: selected = $api.value === value;
$: dataRef = {
    disabled,
    value,
    textValue: "",
};
onMount(() => {
    let textValue = document
        .getElementById(id)
        ?.textContent?.toLowerCase()
        .trim();
    if (textValue !== undefined)
        dataRef.textValue = textValue;
});
onMount(() => $api.registerOption(id, dataRef));
onDestroy(() => $api.unregisterOption(id));
let oldState = $api.listboxState;
let oldSelected = selected;
let oldActive = active;
async function updateFocus(newState, newSelected, newActive) {
    // Wait for a tick since we need to ensure registerOption has been applied
    await tick();
    if (newState !== oldState || newSelected !== oldSelected) {
        if (newState === ListboxStates.Open && newSelected) {
            $api.goToOption(Focus.Specific, id);
        }
    }
    if (newState !== oldState || newActive !== oldActive) {
        if (newState === ListboxStates.Open && newActive) {
            document.getElementById(id)?.scrollIntoView?.({ block: "nearest" });
        }
    }
    oldState = newState;
    oldSelected = newSelected;
    oldActive = newActive;
}
$: updateFocus($api.listboxState, selected, active);
async function handleClick(e) {
    let event = e;
    if (disabled)
        return event.preventDefault();
    $api.select(value);
    $api.closeListbox();
    await tick();
    $buttonRef?.focus({ preventScroll: true });
}
function handleFocus() {
    if (disabled)
        return $api.goToOption(Focus.Nothing);
    $api.goToOption(Focus.Specific, id);
}
function handleMove() {
    if (disabled)
        return;
    if (active)
        return;
    $api.goToOption(Focus.Specific, id);
}
function handleLeave() {
    if (disabled)
        return;
    if (!active)
        return;
    $api.goToOption(Focus.Nothing);
}
$: propsWeControl = {
    id,
    role: "option",
    tabIndex: disabled === true ? undefined : -1,
    "aria-disabled": disabled === true ? true : undefined,
    "aria-selected": selected === true ? selected : undefined,
};
$: slotProps = { active, selected, disabled };
</script>

<Render
  {...$$restProps}
  {...propsWeControl}
  {as}
  {slotProps}
  use={[...use, forwardEvents]}
  name={"ListboxOption"}
  on:click={handleClick}
  on:focus={handleFocus}
  on:pointermove={handleMove}
  on:mousemove={handleMove}
  on:pointerleave={handleLeave}
  on:mouseleave={handleLeave}
>
  <slot {...slotProps} />
</Render>
