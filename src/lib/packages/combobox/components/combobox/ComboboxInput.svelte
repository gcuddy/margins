<script  context="module">"use strict";
</script>

<script >import { useId } from "../../hooks/use-id";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { Features } from "../../types";
import { Focus } from "../../utils/calculate-active-index";
import { Keys } from "../../utils/keyboard";
import { match } from "../../utils/match";
import Render from "../../utils/Render.svelte";
import { createEventDispatcher, get_current_component, onMount, tick } from "svelte/internal";
import { ComboboxStates, useComboboxContext, ValueMode } from "./Combobox.svelte";
export let as = "input";
export let displayValue = undefined;
export let use = [];
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component(), [
    "change",
]);
const dispatch = createEventDispatcher();
/***** Component *****/
let id = `headlessui-combobox-input-${useId()}`;
let api = useComboboxContext("ComboboxInput");
let labelRef = $api.labelRef;
let buttonRef = $api.buttonRef;
let inputRef = $api.inputRef;
let optionsRef = $api.optionsRef;
let optionsPropsRef = $api.optionsPropsRef;
let currentValue = $api.value;
let getCurrentValue = () => {
    let value = $api.value;
    if (!$inputRef)
        return "";
    if (typeof displayValue !== "undefined") {
        return displayValue(value) ?? "";
    }
    else if (typeof value === "string") {
        return value;
    }
    else {
        return "";
    }
};
function handleStateChange(state) {
    let input = $inputRef;
    if (!input)
        return;
    const newValue = getCurrentValue();
    if (state === ComboboxStates.Closed && input.value != newValue)
        input.value = newValue;
}
$: handleStateChange($api.comboboxState);
onMount(() => {
    $inputRef.value = getCurrentValue();
});
async function handleKeyDown(e) {
    let event = e;
    switch (event.key) {
        // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-12
        case Keys.Backspace:
        case Keys.Delete:
            if ($api.mode !== ValueMode.Single)
                return;
            if (!$api.nullable)
                return;
            let input = event.currentTarget;
            requestAnimationFrame(() => {
                if (input.value === "") {
                    $api.change(null);
                    let options = $optionsRef;
                    if (options) {
                        options.scrollTop = 0;
                    }
                    $api.goToOption(Focus.Nothing);
                }
            });
            break;
        case Keys.Enter:
            if ($api.comboboxState !== ComboboxStates.Open)
                return;
            if (event.isComposing)
                return;
            event.preventDefault();
            event.stopPropagation();
            if ($api.activeOptionIndex === null) {
                $api.closeCombobox();
                return;
            }
            $api.selectActiveOption();
            if ($api.mode === ValueMode.Single) {
                $api.closeCombobox();
            }
            break;
        case Keys.ArrowDown:
            event.preventDefault();
            event.stopPropagation();
            return match($api.comboboxState, {
                [ComboboxStates.Open]: () => $api.goToOption(Focus.Next),
                [ComboboxStates.Closed]: () => $api.openCombobox(),
            });
        case Keys.ArrowUp:
            event.preventDefault();
            event.stopPropagation();
            return match($api.comboboxState, {
                [ComboboxStates.Open]: () => $api.goToOption(Focus.Previous),
                [ComboboxStates.Closed]: async () => {
                    $api.openCombobox();
                    await tick();
                    if (!$api.value) {
                        $api.goToOption(Focus.Last);
                    }
                },
            });
        case Keys.Home:
        case Keys.PageUp:
            event.preventDefault();
            event.stopPropagation();
            return $api.goToOption(Focus.First);
        case Keys.End:
        case Keys.PageDown:
            event.preventDefault();
            event.stopPropagation();
            return $api.goToOption(Focus.Last);
        case Keys.Escape:
            if ($api.comboboxState !== ComboboxStates.Open)
                return;
            event.preventDefault();
            if ($optionsRef && !$optionsPropsRef.static) {
                event.stopPropagation();
            }
            $api.closeCombobox();
            break;
        case Keys.Tab:
            if ($api.comboboxState !== ComboboxStates.Open)
                return;
            if ($api.mode === ValueMode.Single)
                $api.selectActiveOption();
            $api.closeCombobox();
            break;
    }
}
function handleChange(e) {
    const target = e.target;
    dispatch("change", target.value);
}
function handleInput(e) {
    const target = e.target;
    $api.openCombobox();
    dispatch("change", target.value);
}
$: propsWeControl = {
    "aria-controls": $optionsRef?.id,
    "aria-expanded": $api.disabled
        ? undefined
        : $api.comboboxState === ComboboxStates.Open,
    "aria-activedescendant": $api.activeOptionIndex === null
        ? undefined
        : $api.options[$api.activeOptionIndex]?.id,
    "aria-multiselectable": $api.mode === ValueMode.Multi ? true : undefined,
    "aria-labelledby": $labelRef?.id ?? $buttonRef?.id,
    id,
    role: "combobox",
    type: $$restProps.type ?? "text",
    tabIndex: 0,
};
$: slotProps = {
    open: $api.comboboxState === ComboboxStates.Open,
};
</script>

<Render
  {...$$restProps}
  {...propsWeControl}
  {as}
  {slotProps}
  use={[...use, forwardEvents]}
  name={"ComboboxInput"}
  bind:el={$inputRef}
  on:input={handleInput}
  on:keydown={handleKeyDown}
  on:change={handleChange}
  features={Features.RenderStrategy | Features.Static}
>
  <slot {...slotProps} />
</Render>
