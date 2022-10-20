<script  context="module">"use strict";
</script>

<script >import { useId } from "../../hooks/use-id";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { Focus } from "../../utils/calculate-active-index";
import { Keys } from "../../utils/keyboard";
import Render from "../../utils/Render.svelte";
import { resolveButtonType } from "../../utils/resolve-button-type";
import { tick } from "svelte";
import { get_current_component } from "svelte/internal";
import { ComboboxStates, useComboboxContext } from "./Combobox.svelte";
export let as = "button";
export let use = [];
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component());
/***** Component *****/
let api = useComboboxContext("ComboboxButton");
let id = `headlessui-combobox-button-${useId()}`;
let buttonRef = $api.buttonRef;
let optionsRef = $api.optionsRef;
let labelRef = $api.labelRef;
let inputRef = $api.inputRef;
let optionsPropsRef = $api.optionsPropsRef;
async function handleClick(e) {
    let event = e;
    if ($api.disabled)
        return;
    if ($api.comboboxState === ComboboxStates.Open) {
        $api.closeCombobox();
    }
    else {
        event.preventDefault();
        $api.openCombobox();
    }
    await tick();
    $inputRef?.focus({ preventScroll: true });
}
async function handleKeyDown(e) {
    let event = e;
    switch (event.key) {
        // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-12
        case Keys.ArrowDown:
            event.preventDefault();
            event.stopPropagation();
            if ($api.comboboxState === ComboboxStates.Closed) {
                $api.openCombobox();
            }
            await tick();
            $inputRef?.focus({ preventScroll: true });
            return;
        case Keys.ArrowUp:
            event.preventDefault();
            event.stopPropagation();
            if ($api.comboboxState === ComboboxStates.Closed) {
                $api.openCombobox();
                await tick();
                if (!$api.value) {
                    $api.goToOption(Focus.Last);
                }
            }
            await tick();
            $inputRef?.focus({ preventScroll: true });
            return;
        case Keys.Escape:
            if ($api.comboboxState !== ComboboxStates.Open)
                return;
            event.preventDefault();
            if ($optionsRef && !$optionsPropsRef.static) {
                event.stopPropagation();
            }
            $api.closeCombobox();
            await tick();
            $inputRef?.focus({ preventScroll: true });
            return;
    }
}
$: propsWeControl = {
    id,
    type: resolveButtonType({ type: $$props.type, as }, $buttonRef),
    tabindex: "-1",
    "aria-haspopup": true,
    "aria-controls": $optionsRef?.id,
    "aria-expanded": $api.disabled
        ? undefined
        : $api.comboboxState === ComboboxStates.Open,
    "aria-labelledby": $labelRef ? [$labelRef?.id, id].join(" ") : undefined,
    disabled: $api.disabled === true ? true : undefined,
};
$: slotProps = {
    open: $api.comboboxState === ComboboxStates.Open,
    disabled: $api.disabled,
    value: $api.value,
};
</script>

<Render
  {...$$restProps}
  {...propsWeControl}
  {as}
  {slotProps}
  use={[...use, forwardEvents]}
  name={"ComboboxButton"}
  bind:el={$buttonRef}
  on:click={handleClick}
  on:keydown={handleKeyDown}
>
  <slot {...slotProps} />
</Render>
