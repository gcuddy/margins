<script  context="module">"use strict";
</script>

<script >import { onDestroy } from "svelte";
import DescriptionProvider from "../description/DescriptionProvider.svelte";
import LabelProvider from "../label/LabelProvider.svelte";
import { useRadioGroupContext } from "./RadioGroup.svelte";
import { useId } from "../../hooks/use-id";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
import Render from "../../utils/Render.svelte";
export let as = "div";
export let use = [];
export let value;
export let disabled = false;
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component());
/***** Component *****/
var OptionState;
(function (OptionState) {
    OptionState[OptionState["Empty"] = 1] = "Empty";
    OptionState[OptionState["Active"] = 2] = "Active";
})(OptionState || (OptionState = {}));
let api = useRadioGroupContext("RadioGroupOption");
let id = `headlessui-radiogroup-option-${useId()}`;
let optionRef = null;
$: propsRef = { value, disabled };
let state = OptionState.Empty;
function updateOption(option) {
    $api.unregisterOption(option.id);
    $api.registerOption(option);
}
$: updateOption({ id, element: optionRef, propsRef });
onDestroy(() => $api.unregisterOption(id));
$: isFirstOption = $api.firstOption?.id === id;
$: isDisabled = $api.disabled || disabled;
$: checked = $api.value === value;
$: tabIndex = (() => {
    if (isDisabled)
        return -1;
    if (checked)
        return 0;
    if (!$api.containsCheckedOption && isFirstOption)
        return 0;
    return -1;
})();
function handleClick() {
    if (!$api.change(value))
        return;
    state |= OptionState.Active;
    optionRef?.focus();
}
function handleFocus() {
    state |= OptionState.Active;
}
function handleBlur() {
    state &= ~OptionState.Active;
}
$: propsWeControl = {
    id,
    role: "radio",
    "aria-checked": checked ? "true" : "false",
    "aria-disabled": isDisabled ? true : undefined,
    tabIndex: tabIndex,
};
$: slotProps = {
    checked,
    disabled: isDisabled,
    active: !!(state & OptionState.Active),
};
</script>

<DescriptionProvider name="RadioGroupDescription" {slotProps} let:describedby>
  <LabelProvider name="RadioGroupLabel" {slotProps} let:labelledby>
    <Render
      {...{ ...$$restProps, ...propsWeControl }}
      {as}
      {slotProps}
      use={[...use, forwardEvents]}
      name={"RadioGroupOption"}
      bind:el={optionRef}
      aria-labelledby={labelledby}
      aria-describedby={describedby}
      on:click={isDisabled ? () => {} : handleClick}
      on:focus={isDisabled ? () => {} : handleFocus}
      on:blur={isDisabled ? () => {} : handleBlur}
    >
      <slot {...slotProps} />
    </Render>
  </LabelProvider>
</DescriptionProvider>
