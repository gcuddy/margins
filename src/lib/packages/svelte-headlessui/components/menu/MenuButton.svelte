<script  context="module">"use strict";
</script>

<script >import { useMenuContext, MenuStates } from "./Menu.svelte";
import { useId } from "../../hooks/use-id";
import { Keys } from "../../utils/keyboard";
import { Focus } from "../../utils/calculate-active-index";
import { tick } from "svelte";
import Render from "../../utils/Render.svelte";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
import { resolveButtonType } from "../../utils/resolve-button-type";
export let as = "button";
export let use = [];
export let disabled = false;
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component());
/***** Component *****/
const api = useMenuContext("MenuButton");
const id = `headlessui-menu-button-${useId()}`;
$: buttonStore = $api.buttonStore;
$: itemsStore = $api.itemsStore;
async function handleKeyDown(e) {
    let event = e;
    switch (event.key) {
        // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-13
        case Keys.Space:
        case Keys.Enter:
        case Keys.ArrowDown:
            event.preventDefault();
            event.stopPropagation();
            $api.openMenu();
            await tick();
            $itemsStore?.focus({ preventScroll: true });
            $api.goToItem(Focus.First);
            break;
        case Keys.ArrowUp:
            event.preventDefault();
            event.stopPropagation();
            $api.openMenu();
            await tick();
            $itemsStore?.focus({ preventScroll: true });
            $api.goToItem(Focus.Last);
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
    if (disabled)
        return;
    if ($api.menuState === MenuStates.Open) {
        $api.closeMenu();
        await tick();
        $buttonStore?.focus({ preventScroll: true });
    }
    else {
        event.preventDefault();
        event.stopPropagation();
        $api.openMenu();
        await tick();
        $itemsStore?.focus({ preventScroll: true });
    }
}
$: propsWeControl = {
    id,
    type: resolveButtonType({ type: $$props.type, as }, $buttonStore),
    disabled: disabled ? true : undefined,
    "aria-haspopup": true,
    "aria-controls": $itemsStore?.id,
    "aria-expanded": disabled ? undefined : $api.menuState === MenuStates.Open,
};
$: slotProps = {
    open: $api.menuState === MenuStates.Open,
};
</script>

<Render
  {...{ ...$$restProps, ...propsWeControl }}
  {as}
  {slotProps}
  use={[...use, forwardEvents]}
  name={"MenuButton"}
  bind:el={$buttonStore}
  on:click={handleClick}
  on:keydown={handleKeyDown}
  on:keyup={handleKeyUp}
>
  <slot {...slotProps} />
</Render>
