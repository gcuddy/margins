<script  context="module">import DescriptionProvider from "../description/DescriptionProvider.svelte";
import LabelProvider from "../label/LabelProvider.svelte";
import { createEventDispatcher, getContext, setContext } from "svelte";
import { writable } from "svelte/store";
import { Focus, focusIn, FocusResult } from "../../utils/focus-management";
import { Keys } from "../../utils/keyboard";
import { useId } from "../../hooks/use-id";
const RADIO_GROUP_CONTEXT_NAME = "headlessui-radio-group-context";
export function useRadioGroupContext(component) {
    const context = getContext(RADIO_GROUP_CONTEXT_NAME);
    if (context === undefined) {
        throw new Error(`<${component} /> is missing a parent <RadioGroup /> component.`);
    }
    return context;
}
</script>

<script >import { treeWalker } from "../../hooks/use-tree-walker";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
import Render from "../../utils/Render.svelte";
export let as = "div";
export let use = [];
export let value;
export let disabled = false;
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component(), [
    "change",
]);
const dispatch = createEventDispatcher();
/***** Component *****/
let radioGroupRef = null;
let options = [];
let id = `headlessui-radiogroup-${useId()}`;
let api = writable({
    options,
    value,
    disabled,
    firstOption: options.find((option) => !option.propsRef.disabled),
    containsCheckedOption: options.some((option) => option.propsRef.value === value),
    change(nextValue) {
        if (disabled)
            return false;
        if (value === nextValue)
            return false;
        let nextOption = options.find((option) => option.propsRef.value === nextValue)?.propsRef;
        if (nextOption?.disabled)
            return false;
        dispatch("change", nextValue);
        return true;
    },
    registerOption(action) {
        if (!radioGroupRef) {
            // We haven't mounted yet so just append
            options = [...options, action];
            return;
        }
        let orderMap = Array.from(radioGroupRef.querySelectorAll('[id^="headlessui-radiogroup-option-"]')).reduce((lookup, element, index) => Object.assign(lookup, { [element.id]: index }), {});
        let newOptions = [...options, action];
        newOptions.sort((a, z) => orderMap[a.id] - orderMap[z.id]);
        options = newOptions;
    },
    unregisterOption(id) {
        options = options.filter((radio) => radio.id !== id);
    },
});
setContext(RADIO_GROUP_CONTEXT_NAME, api);
$: api.update((obj) => {
    return {
        ...obj,
        options,
        value,
        disabled,
        firstOption: options.find((option) => !option.propsRef.disabled),
        containsCheckedOption: options.some((option) => option.propsRef.value === value),
    };
});
$: treeWalker({
    container: radioGroupRef,
    accept(node) {
        if (node.getAttribute("role") === "radio")
            return NodeFilter.FILTER_REJECT;
        if (node.hasAttribute("role"))
            return NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
    },
    walk(node) {
        node.setAttribute("role", "none");
    },
});
function handleKeyDown(e) {
    let event = e;
    if (!radioGroupRef)
        return;
    if (!radioGroupRef.contains(event.target))
        return;
    let all = options
        .filter((option) => option.propsRef.disabled === false)
        .map((radio) => radio.element);
    switch (event.key) {
        case Keys.ArrowLeft:
        case Keys.ArrowUp:
            {
                event.preventDefault();
                event.stopPropagation();
                let result = focusIn(all, Focus.Previous | Focus.WrapAround);
                if (result === FocusResult.Success) {
                    let activeOption = options.find((option) => option.element === document.activeElement);
                    if (activeOption)
                        $api.change(activeOption.propsRef.value);
                }
            }
            break;
        case Keys.ArrowRight:
        case Keys.ArrowDown:
            {
                event.preventDefault();
                event.stopPropagation();
                let result = focusIn(all, Focus.Next | Focus.WrapAround);
                if (result === FocusResult.Success) {
                    let activeOption = options.find((option) => option.element === document.activeElement);
                    if (activeOption)
                        $api.change(activeOption.propsRef.value);
                }
            }
            break;
        case Keys.Space:
            {
                event.preventDefault();
                event.stopPropagation();
                let activeOption = options.find((option) => option.element === document.activeElement);
                if (activeOption)
                    $api.change(activeOption.propsRef.value);
            }
            break;
    }
}
$: propsWeControl = {
    id,
    role: "radiogroup",
};
$: slotProps = {};
</script>

<DescriptionProvider name="RadioGroupDescription" let:describedby>
  <LabelProvider name="RadioGroupLabel" let:labelledby>
    <Render
      {...{ ...$$restProps, ...propsWeControl }}
      {as}
      use={[...use, forwardEvents]}
      {slotProps}
      name={"RadioGroup"}
      bind:el={radioGroupRef}
      aria-labelledby={labelledby}
      aria-describedby={describedby}
      on:keydown={handleKeyDown}
    >
      <slot {...slotProps} />
    </Render>
  </LabelProvider>
</DescriptionProvider>
