<script  context="module">const POPOVER_GROUP_CONTEXT_NAME = "headlessui-popover-group-context";
export function usePopoverGroupContext() {
    return getContext(POPOVER_GROUP_CONTEXT_NAME);
}
</script>

<script >import { getContext, setContext } from "svelte";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
import Render from "../../utils/Render.svelte";
export let as = "div";
export let use = [];
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component());
/***** Component *****/
let groupRef;
let popovers = [];
function unregisterPopover(registerBag) {
    popovers = popovers.filter((bag) => bag != registerBag);
}
function registerPopover(registerBag) {
    popovers = [...popovers, registerBag];
    return () => {
        unregisterPopover(registerBag);
    };
}
function isFocusWithinPopoverGroup() {
    let element = document.activeElement;
    if (groupRef?.contains(element))
        return true;
    // Check if the focus is in one of the button or panel elements. This is important in case you are rendering inside a Portal.
    return popovers.some((bag) => {
        return (document.getElementById(bag.buttonId)?.contains(element) ||
            document.getElementById(bag.panelId)?.contains(element));
    });
}
function closeOthers(buttonId) {
    for (let popover of popovers) {
        if (popover.buttonId !== buttonId)
            popover.close();
    }
}
setContext(POPOVER_GROUP_CONTEXT_NAME, {
    unregisterPopover,
    registerPopover,
    isFocusWithinPopoverGroup,
    closeOthers,
});
$: slotProps = {};
</script>

<Render
  {...$$restProps}
  {as}
  use={[...use, forwardEvents]}
  {slotProps}
  name={"PopoverGroup"}
  bind:el={groupRef}
>
  <slot {...slotProps} />
</Render>
