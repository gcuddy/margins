<script  context="module">const POPOVER_PANEL_CONTEXT_NAME = "headlessui-popover-panel-context";
export function usePopoverPanelContext() {
    return getContext(POPOVER_PANEL_CONTEXT_NAME);
}
</script>

<script >import { Keys } from "../../utils/keyboard";
import { State, useOpenClosed } from "../../internal/open-closed";
import { getFocusableElements, Focus, FocusResult, focusIn, } from "../../utils/focus-management";
import { getContext, setContext } from "svelte";
import { PopoverStates, usePopoverContext } from "./Popover.svelte";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
import Render from "../../utils/Render.svelte";
import { Features } from "../../types";
export let as = "div";
export let use = [];
export let focus = false;
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component());
/***** Component *****/
let api = usePopoverContext("PopoverPanel");
setContext(POPOVER_PANEL_CONTEXT_NAME, $api.panelId);
let panelStore = $api.panel;
let apiButton = $api.button;
let openClosedState = useOpenClosed();
$: visible =
    openClosedState !== undefined
        ? $openClosedState === State.Open
        : $api.popoverState === PopoverStates.Open;
$: (() => {
    if (!focus)
        return;
    if ($api.popoverState !== PopoverStates.Open)
        return;
    if (!$panelStore)
        return;
    let activeElement = document.activeElement;
    if ($panelStore.contains(activeElement))
        return; // Already focused within Dialog
    focusIn($panelStore, Focus.First);
})();
function handleWindowKeydown(event) {
    if ($api.popoverState !== PopoverStates.Open)
        return;
    if (!$panelStore)
        return;
    if (event.key !== Keys.Tab)
        return;
    if (!document.activeElement)
        return;
    if (!$panelStore?.contains(document.activeElement))
        return;
    // We will take-over the default tab behaviour so that we have a bit
    // control over what is focused next. It will behave exactly the same,
    // but it will also "fix" some issues based on whether you are using a
    // Portal or not.
    event.preventDefault();
    let result = focusIn($panelStore, event.shiftKey ? Focus.Previous : Focus.Next);
    if (result === FocusResult.Underflow) {
        return $apiButton?.focus();
    }
    else if (result === FocusResult.Overflow) {
        if (!$apiButton)
            return;
        let elements = getFocusableElements();
        let buttonIdx = elements.indexOf($apiButton);
        let nextElements = elements
            .splice(buttonIdx + 1) // Elements after button
            .filter((element) => !$panelStore?.contains(element)); // Ignore items in panel
        // Try to focus the next element, however it could fail if we are in a
        // Portal that happens to be the very last one in the DOM. In that
        // case we would Error (because nothing after the button is
        // focusable). Therefore we will try and focus the very first item in
        // the document.body.
        if (focusIn(nextElements, Focus.First) === FocusResult.Error) {
            focusIn(document.body, Focus.First);
        }
    }
}
function handleFocus(event) {
    if (event.target === window.document.body) {
        // Workaround for a SvelteKit issue: https://github.com/sveltejs/kit/issues/3501
        return;
    }
    if (!focus)
        return;
    if ($api.popoverState !== PopoverStates.Open)
        return;
    if (!$panelStore)
        return;
    if ($panelStore.contains(document.activeElement))
        return;
    $api.closePopover();
}
function handleKeydown(e) {
    let event = e;
    switch (event.key) {
        case Keys.Escape:
            if ($api.popoverState !== PopoverStates.Open)
                return;
            if (!$panelStore)
                return;
            if (!$panelStore.contains(document.activeElement))
                return;
            event.preventDefault();
            event.stopPropagation();
            $api.closePopover();
            $apiButton?.focus();
            break;
    }
}
$: slotProps = {
    open: $api.popoverState === PopoverStates.Open,
    close: $api.close,
};
</script>

<svelte:window
  on:keydown={handleWindowKeydown}
  on:focus|capture={handleFocus}
/>
<Render
  {...$$restProps}
  id={$api.panelId}
  {as}
  {slotProps}
  use={[...use, forwardEvents]}
  name={"PopoverPanel"}
  bind:el={$panelStore}
  on:keydown={handleKeydown}
  {visible}
  features={Features.RenderStrategy | Features.Static}
>
  <slot {...slotProps} />
</Render>
