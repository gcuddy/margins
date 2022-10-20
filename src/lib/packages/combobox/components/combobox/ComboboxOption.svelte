<script  context="module">"use strict";
</script>

<script >import { ActivationTrigger, ComboboxStates, useComboboxContext, ValueMode, } from "./Combobox.svelte";
import { useId } from "../../hooks/use-id";
import Render from "../../utils/Render.svelte";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component, onMount, tick } from "svelte/internal";
import { writable } from "svelte/store";
import { match } from "../../utils/match";
import { Focus } from "../../utils/calculate-active-index";
export let as = "li";
export let value;
export let disabled = false;
export let use = [];
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component());
/***** Component *****/
let id = `headlessui-combobox-option-${useId()}`;
let api = useComboboxContext("ComboboxOption");
let internalOptionRef = writable(null);
let optionsPropsRef = $api.optionsPropsRef;
$: active =
    $api.activeOptionIndex !== null
        ? $api.options[$api.activeOptionIndex].id === id
        : false;
$: selected = match($api.mode, {
    [ValueMode.Single]: () => $api.compare($api.value, value),
    [ValueMode.Multi]: () => $api.value.some((v) => $api.compare(v, value)),
});
$: dataRef = {
    disabled: disabled,
    value: value,
    domRef: internalOptionRef,
};
onMount(() => {
    $api.registerOption(id, dataRef);
    return () => {
        $api.unregisterOption(id);
    };
});
async function scrollIntoViewIfActive(newState, newActive, newActivationTrigger) {
    if (newState !== ComboboxStates.Open)
        return;
    if (!newActive)
        return;
    if (newActivationTrigger === ActivationTrigger.Pointer)
        return;
    await tick();
    $internalOptionRef?.scrollIntoView?.({ block: "nearest" });
}
$: scrollIntoViewIfActive($api.comboboxState, active, $api.activationTrigger);
function handleClick(e) {
    let event = e;
    if (disabled)
        return event.preventDefault();
    $api.selectOption(id);
    if ($api.mode === ValueMode.Single) {
        $api.closeCombobox();
    }
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
    $api.goToOption(Focus.Specific, id, ActivationTrigger.Pointer);
}
function handleLeave() {
    if (disabled)
        return;
    if (!active)
        return;
    if ($optionsPropsRef.hold)
        return;
    $api.goToOption(Focus.Nothing);
}
$: propsWeControl = {
    id,
    ref: internalOptionRef,
    role: "option",
    tabIndex: disabled === true ? undefined : -1,
    "aria-disabled": disabled === true ? true : undefined,
    // According to the WAI-ARIA best practices, we should use aria-checked for
    // multi-select,but Voice-Over disagrees. So we use aria-checked instead for
    // both single and multi-select.
    "aria-selected": selected,
    disabled: undefined, // Never forward the `disabled` prop
};
$: slotProps = {
    active,
    selected,
    disabled,
};
</script>

<Render
  {...$$restProps}
  {...propsWeControl}
  {as}
  {slotProps}
  use={[...use, forwardEvents]}
  name={"ComboboxOption"}
  bind:el={$internalOptionRef}
  on:click={handleClick}
  on:focus={handleFocus}
  on:pointermove={handleMove}
  on:mousemove={handleMove}
  on:pointerleave={handleLeave}
  on:mouseleave={handleLeave}
>
  <slot {...slotProps} />
</Render>
