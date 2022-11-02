<script  context="module">"use strict";
</script>

<script >import { useId } from "../../hooks/use-id";
import { treeWalker } from "../../hooks/use-tree-walker";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { State, useOpenClosed } from "../../internal/open-closed";
import { Features } from "../../types";
import Render from "../../utils/Render.svelte";
import { get_current_component } from "svelte/internal";
import { ComboboxStates, useComboboxContext } from "./Combobox.svelte";
export let as = "ul";
export let hold = false;
let static_ = false;
export { static_ as static };
export let use = [];
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component());
/***** Component *****/
let id = `headlessui-combobox-options-${useId()}`;
let api = useComboboxContext("ComboboxOptions");
let labelRef = $api.labelRef;
let buttonRef = $api.buttonRef;
let optionsRef = $api.optionsRef;
let optionsPropsRef = $api.optionsPropsRef;
$: $optionsPropsRef.static = static_;
$: $optionsPropsRef.hold = hold;
let usesOpenClosedState = useOpenClosed();
$: visible =
    usesOpenClosedState !== undefined
        ? $usesOpenClosedState === State.Open
        : $api.comboboxState === ComboboxStates.Open;
$: treeWalker({
    container: $optionsRef,
    enabled: $api.comboboxState === ComboboxStates.Open,
    accept(node) {
        if (node.getAttribute("role") === "option")
            return NodeFilter.FILTER_REJECT;
        if (node.hasAttribute("role"))
            return NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
    },
    walk(node) {
        node.setAttribute("role", "none");
    },
});
$: propsWeControl = {
    "aria-activedescendant": $api.activeOptionIndex === null
        ? undefined
        : $api.options[$api.activeOptionIndex]?.id,
    "aria-labelledby": $labelRef?.id ?? $buttonRef?.id,
    id,
    role: "listbox",
    static: static_
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
  name={"ComboboxOptions"}
  bind:el={$optionsRef}
  {visible}
  features={Features.RenderStrategy | Features.Static}
>
  <slot {...slotProps} />
</Render>
