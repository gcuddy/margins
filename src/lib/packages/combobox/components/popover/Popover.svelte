<script  context="module">export var PopoverStates;
(function (PopoverStates) {
    PopoverStates[PopoverStates["Open"] = 0] = "Open";
    PopoverStates[PopoverStates["Closed"] = 1] = "Closed";
})(PopoverStates || (PopoverStates = {}));
const POPOVER_CONTEXT_NAME = "headlessui-popover-context";
export function usePopoverContext(component) {
    let context = getContext(POPOVER_CONTEXT_NAME);
    if (context === undefined) {
        throw new Error(`<${component} /> is missing a parent <Popover /> component.`);
    }
    return context;
}
</script>

<script >import { match } from "../../utils/match";
import { useId } from "../../hooks/use-id";
import { isFocusableElement, FocusableMode, } from "../../utils/focus-management";
import { State, useOpenClosedProvider } from "../../internal/open-closed";
import { usePopoverGroupContext } from "./PopoverGroup.svelte";
import { getContext, setContext, onMount } from "svelte";
import { writable } from "svelte/store";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
import Render from "../../utils/Render.svelte";
export let as = "div";
export let use = [];
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component());
/***** Component *****/
const buttonId = `headlessui-popover-button-${useId()}`;
const panelId = `headlessui-popover-panel-${useId()}`;
let popoverState = PopoverStates.Closed;
let panel = writable(null);
let button = writable(null);
let api = writable({
    popoverState,
    buttonId,
    panelId,
    panel,
    button,
    togglePopover() {
        popoverState = match(popoverState, {
            [PopoverStates.Open]: PopoverStates.Closed,
            [PopoverStates.Closed]: PopoverStates.Open,
        });
    },
    closePopover() {
        if (popoverState === PopoverStates.Closed)
            return;
        popoverState = PopoverStates.Closed;
    },
    close(focusableElement) {
        $api.closePopover();
        let restoreElement = (() => {
            if (!focusableElement)
                return $button;
            if (focusableElement instanceof HTMLElement)
                return focusableElement;
            return $button;
        })();
        restoreElement?.focus();
    },
});
setContext(POPOVER_CONTEXT_NAME, api);
let openClosedState = writable(State.Closed);
useOpenClosedProvider(openClosedState);
$: $openClosedState = match(popoverState, {
    [PopoverStates.Open]: State.Open,
    [PopoverStates.Closed]: State.Closed,
});
$: api.update((obj) => {
    return {
        ...obj,
        popoverState,
    };
});
const registerBag = {
    buttonId,
    panelId,
    close() {
        $api.closePopover();
    },
};
const groupContext = usePopoverGroupContext();
const registerPopover = groupContext?.registerPopover;
function isFocusWithinPopoverGroup() {
    return (groupContext?.isFocusWithinPopoverGroup() ??
        ($button?.contains(document.activeElement) ||
            $panel?.contains(document.activeElement)));
}
onMount(() => registerPopover?.(registerBag));
// Handle focus out
function handleFocus(event) {
    if (event.target === window.document.body) {
        // Workaround for a SvelteKit issue: https://github.com/sveltejs/kit/issues/3501
        return;
    }
    if (popoverState !== PopoverStates.Open)
        return;
    if (isFocusWithinPopoverGroup())
        return;
    if (!button)
        return;
    if (!panel)
        return;
    $api.closePopover();
}
// Handle outside click
function handleMousedown(event) {
    let target = event.target;
    if (popoverState !== PopoverStates.Open)
        return;
    if ($button?.contains(target))
        return;
    if ($panel?.contains(target))
        return;
    $api.closePopover();
    if (!isFocusableElement(target, FocusableMode.Loose)) {
        event.preventDefault();
        $button?.focus();
    }
}
$: slotProps = {
    open: popoverState === PopoverStates.Open,
    close: $api.close,
};
</script>

<svelte:window on:focus|capture={handleFocus} on:mousedown={handleMousedown} />
<Render
  {...$$restProps}
  {as}
  {slotProps}
  use={[...use, forwardEvents]}
  name={"Popover"}
>
  <slot {...slotProps} />
</Render>
