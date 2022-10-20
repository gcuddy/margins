<script  context="module">"use strict";
</script>

<script >import { useDisclosureContext, DisclosureStates } from "./Disclosure.svelte";
import { usePanelContext } from "./DisclosurePanel.svelte";
import { Keys } from "../../utils/keyboard";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
import Render from "../../utils/Render.svelte";
import { writable } from "svelte/store";
import { resolveButtonType } from "../../utils/resolve-button-type";
export let as = "button";
export let use = [];
export let disabled = false;
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component());
/***** Component *****/
const api = useDisclosureContext("DisclosureButton");
const panelContext = usePanelContext();
$: buttonStore = $api.buttonStore;
$: panelStore = $api.panelStore;
$: isWithinPanel =
    panelContext === null ? false : panelContext === $api.panelId;
let ourStore = writable(null);
$: if (!isWithinPanel)
    ourStore = buttonStore;
function handleClick() {
    if (disabled)
        return;
    if (isWithinPanel) {
        $api.toggleDisclosure();
        $buttonStore?.focus();
    }
    else {
        $api.toggleDisclosure();
    }
}
function handleKeyDown(e) {
    if (disabled)
        return;
    let event = e;
    if (isWithinPanel) {
        switch (event.key) {
            case Keys.Space:
            case Keys.Enter:
                event.preventDefault();
                event.stopPropagation();
                $api.toggleDisclosure();
                $buttonStore?.focus();
                break;
        }
    }
    else {
        switch (event.key) {
            case Keys.Space:
            case Keys.Enter:
                event.preventDefault();
                event.stopPropagation();
                $api.toggleDisclosure();
                break;
        }
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
$: type = resolveButtonType({ type: $$props.type, as }, $ourStore);
$: propsWeControl = isWithinPanel
    ? { type }
    : {
        id: $api.buttonId,
        type,
        "aria-expanded": disabled
            ? undefined
            : $api.disclosureState === DisclosureStates.Open,
        "aria-controls": $panelStore ? $api.panelId : undefined,
        disabled: disabled ? true : undefined,
    };
$: slotProps = {
    open: $api.disclosureState === DisclosureStates.Open,
    close: $api.close,
};
</script>

{#if isWithinPanel}
  <Render
    {...{ ...$$restProps, ...propsWeControl }}
    {as}
    {slotProps}
    use={[...use, forwardEvents]}
    name={"DisclosureButton"}
    bind:el={$ourStore}
    on:click={handleClick}
    on:keydown={handleKeyDown}
  >
    <slot {...slotProps} />
  </Render>
{:else}
  <Render
    {...{ ...$$restProps, ...propsWeControl }}
    {as}
    {slotProps}
    use={[...use, forwardEvents]}
    name={"DisclosureButton"}
    bind:el={$ourStore}
    on:click={handleClick}
    on:keydown={handleKeyDown}
    on:keyup={handleKeyUp}
  >
    <slot {...slotProps} />
  </Render>
{/if}
