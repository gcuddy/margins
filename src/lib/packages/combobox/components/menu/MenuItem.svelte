<script  context="module">"use strict";
</script>

<script >import { useMenuContext, MenuStates } from "./Menu.svelte";
import { useId } from "../../hooks/use-id";
import { Focus } from "../../utils/calculate-active-index";
import { afterUpdate, onDestroy, onMount, tick } from "svelte";
import Render from "../../utils/Render.svelte";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
export let as = "a";
export let use = [];
export let disabled = false;
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component(), [
    { name: "click", shouldExclude: () => disabled },
]);
/***** Component *****/
const api = useMenuContext("MenuItem");
const id = `headlessui-menu-item-${useId()}`;
$: active =
    $api.activeItemIndex !== null
        ? $api.items[$api.activeItemIndex].id === id
        : false;
$: buttonStore = $api.buttonStore;
let elementRef;
$: textValue = elementRef?.textContent?.toLowerCase().trim() || "";
// Fairly hacky (Svelte): only mutate the contents of the data object.
// On first registration, `data` will not contain the correct textValue,
// so it must be mutated afterwards
let data = { disabled, textValue };
$: data.disabled = disabled;
$: data.textValue = textValue;
onMount(async () => {
    $api.registerItem(id, data);
});
onDestroy(() => {
    $api.unregisterItem(id);
});
afterUpdate(async () => {
    if ($api.menuState !== MenuStates.Open)
        return;
    if (!active)
        return;
    await tick();
    elementRef?.scrollIntoView?.({ block: "nearest" });
});
async function handleClick(event) {
    if (disabled)
        return event.preventDefault();
    $api.closeMenu();
    $buttonStore?.focus({ preventScroll: true });
}
function handleFocus() {
    if (disabled)
        return $api.goToItem(Focus.Nothing);
    $api.goToItem(Focus.Specific, id);
}
function handleMove() {
    if (disabled)
        return;
    if (active)
        return;
    $api.goToItem(Focus.Specific, id);
}
function handleLeave() {
    if (disabled)
        return;
    if (!active)
        return;
    $api.goToItem(Focus.Nothing);
}
$: propsWeControl = {
    id,
    role: "menuitem",
    tabIndex: disabled === true ? undefined : -1,
    "aria-disabled": disabled === true ? true : undefined,
};
$: slotProps = { active, disabled };
</script>

<Render
  {...{ ...$$restProps, ...propsWeControl }}
  use={[...use, forwardEvents]}
  {as}
  {slotProps}
  name={"MenuItem"}
  bind:el={elementRef}
  on:click={handleClick}
  on:focus={handleFocus}
  on:pointermove={handleMove}
  on:mousemove={handleMove}
  on:pointerleave={handleLeave}
  on:mouseleave={handleLeave}
>
  <slot {...slotProps} />
</Render>
