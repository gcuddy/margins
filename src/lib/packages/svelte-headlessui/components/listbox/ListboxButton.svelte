<script  context="module">"use strict";
</script>

<script >import { tick } from "svelte";
import { ListboxStates, useListboxContext } from "./Listbox.svelte";
import { useId } from "../../hooks/use-id";
import { Keys } from "../../utils/keyboard";
import { Focus } from "../../utils/calculate-active-index";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
import Render from "../../utils/Render.svelte";
import { resolveButtonType } from "../../utils/resolve-button-type";
export let as = "button";
export let use = [];
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component());
/***** Component *****/
let api = useListboxContext("ListboxButton");
let id = `headlessui-listbox-button-${useId()}`;
let buttonRef = $api.buttonRef;
let optionsRef = $api.optionsRef;
let labelRef = $api.labelRef;
async function handleKeyDown(e) {
    let event = e;
    switch (event.key) {
        // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-13
        case Keys.Space:
        case Keys.Enter:
        case Keys.ArrowDown:
            event.preventDefault();
            $api.openListbox();
            await tick();
            $optionsRef?.focus({ preventScroll: true });
            if (!$api.value)
                $api.goToOption(Focus.First);
            break;
        case Keys.ArrowUp:
            event.preventDefault();
            $api.openListbox();
            await tick();
            $optionsRef?.focus({ preventScroll: true });
            if (!$api.value)
                $api.goToOption(Focus.Last);
            break;
    }
}
function handleKeyUp(e) {
    let event = e;
    switch (event.key) {
        case Keys.Space:
            // Required for firefox, event.preventDefault() in handleKeyDown for
            // the Space key doesn't cancel the handleKeyUp, which in turn
            // triggers a *click*.
            event.preventDefault();
            break;
    }
}
async function handleClick(e) {
    let event = e;
    if ($api.disabled)
        return;
    if ($api.listboxState === ListboxStates.Open) {
        $api.closeListbox();
        await tick();
        $buttonRef?.focus({ preventScroll: true });
    }
    else {
        event.preventDefault();
        $api.openListbox();
        await tick();
        $optionsRef?.focus({ preventScroll: true });
    }
}
$: propsWeControl = {
    id,
    type: resolveButtonType({ type: $$props.type, as }, $buttonRef),
    "aria-haspopup": true,
    "aria-controls": $optionsRef?.id,
    "aria-expanded": $api.disabled
        ? undefined
        : $api.listboxState === ListboxStates.Open,
    "aria-labelledby": $labelRef ? [$labelRef?.id, id].join(" ") : undefined,
    disabled: $api.disabled === true ? true : undefined,
};
$: slotProps = {
    open: $api.listboxState === ListboxStates.Open,
    disabled: $api.disabled,
};
</script>

<Render
  {...$$restProps}
  {...propsWeControl}
  {as}
  {slotProps}
  use={[...use, forwardEvents]}
  name={"ListboxButton"}
  bind:el={$buttonRef}
  on:click={handleClick}
  on:keydown={handleKeyDown}
  on:keyup={handleKeyUp}
>
  <slot {...slotProps} />
</Render>
