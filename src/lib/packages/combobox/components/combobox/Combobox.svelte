<script  context="module">export var ComboboxStates;
(function (ComboboxStates) {
    ComboboxStates[ComboboxStates["Open"] = 0] = "Open";
    ComboboxStates[ComboboxStates["Closed"] = 1] = "Closed";
})(ComboboxStates || (ComboboxStates = {}));
export var ValueMode;
(function (ValueMode) {
    ValueMode[ValueMode["Single"] = 0] = "Single";
    ValueMode[ValueMode["Multi"] = 1] = "Multi";
})(ValueMode || (ValueMode = {}));
export var ActivationTrigger;
(function (ActivationTrigger) {
    ActivationTrigger[ActivationTrigger["Pointer"] = 0] = "Pointer";
    ActivationTrigger[ActivationTrigger["Other"] = 1] = "Other";
})(ActivationTrigger || (ActivationTrigger = {}));
const COMBOBOX_CONTEXT_NAME = "headlessui-combobox-context";
export function useComboboxContext(component) {
    let context = getContext(COMBOBOX_CONTEXT_NAME);
    if (context === undefined) {
        throw new Error(`<${component} /> is missing a parent <Combobox /> component.`);
    }
    return context;
}
export function defaultComparator(a, z) {
    return a === z;
}
</script>

<script >import { get, writable } from "svelte/store";
import { useControllable } from "../../hooks/use-controllable";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import Hidden, { Features as HiddenFeatures } from "../../internal/Hidden.svelte";
import { State, useOpenClosedProvider } from "../../internal/open-closed";
import { calculateActiveIndex, Focus } from "../../utils/calculate-active-index";
import { sortByDomNode } from "../../utils/focus-management";
import { objectToFormEntries } from "../../utils/form";
import { match } from "../../utils/match";
import Render from "../../utils/Render.svelte";
import { getContext } from "svelte";
import { createEventDispatcher, get_current_component, setContext } from "svelte/internal";
export let as = "div";
export let use = [];
export let by = defaultComparator;
export let value;
export let defaultValue = null;
export let name = null;
export let nullable = false;
export let multiple = false;
export let disabled = false;
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component(), [
    "change",
]);
const dispatch = createEventDispatcher();
/***** Component *****/
let comboboxState = ComboboxStates.Closed;
let labelRef = writable(null);
let inputRef = writable(null);
let buttonRef = writable(null);
let optionsRef = writable(null);
let optionsPropsRef = writable({
    static: false,
    hold: false,
});
let options = [];
let activeOptionIndex = null;
let activationTrigger = ActivationTrigger.Other;
let mode = multiple
    ? ValueMode.Multi
    : ValueMode.Single;
let defaultToFirstOption = false;
function adjustOrderedState(adjustment = (i) => i) {
    let currentActiveOption = activeOptionIndex !== null ? options[activeOptionIndex] : null;
    let sortedOptions = sortByDomNode(adjustment(options.slice()), (option) => {
        return get(option.dataRef.domRef);
    });
    // If we inserted an option before the current active option then the active option index
    // would be wrong. To fix this, we will re-lookup the correct index.
    let adjustedActiveOptionIndex = currentActiveOption
        ? sortedOptions.indexOf(currentActiveOption)
        : null;
    // Reset to `null` in case the currentActiveOption was removed.
    if (adjustedActiveOptionIndex === -1) {
        adjustedActiveOptionIndex = null;
    }
    return {
        options: sortedOptions,
        activeOptionIndex: adjustedActiveOptionIndex,
    };
}
// Reactive activeOptionIndex
$: {
    if (defaultToFirstOption &&
        activeOptionIndex === null &&
        options.length > 0) {
        let localActiveOptionIndex = options.findIndex((option) => !option.dataRef.disabled);
        if (localActiveOptionIndex !== -1) {
            activeOptionIndex = localActiveOptionIndex;
        }
    }
    activeOptionIndex = activeOptionIndex;
}
let [controlledValue, theirOnChange] = useControllable(value, (value) => {
    dispatch("change", value);
}, defaultValue);
$: value = $controlledValue;
let api = writable({
    comboboxState,
    value,
    mode,
    compare(a, z) {
        if (typeof by === "string") {
            let property = by;
            return a?.[property] === z?.[property];
        }
        return by(a, z);
    },
    nullable,
    inputRef,
    labelRef,
    buttonRef,
    optionsRef,
    disabled: disabled,
    options,
    change(value) {
        //dispatch("change", value);
        theirOnChange(value);
    },
    activeOptionIndex,
    activationTrigger,
    optionsPropsRef,
    closeCombobox() {
        defaultToFirstOption = false;
        if (disabled)
            return;
        if (comboboxState === ComboboxStates.Closed)
            return;
        comboboxState = ComboboxStates.Closed;
        activeOptionIndex = null;
    },
    openCombobox() {
        defaultToFirstOption = true;
        if (disabled)
            return;
        if (comboboxState === ComboboxStates.Open)
            return;
        // Check if we have a selected value that we can make active.
        let optionIdx = options.findIndex((option) => {
            let optionValue = option.dataRef.value;
            let selected = match(mode, {
                [ValueMode.Single]: () => $api.compare($api.value, optionValue),
                [ValueMode.Multi]: () => $api.value.some((value) => $api.compare(value, optionValue)),
            });
            return selected;
        });
        if (optionIdx !== -1) {
            activeOptionIndex = optionIdx;
        }
        comboboxState = ComboboxStates.Open;
    },
    goToOption(focus, id, trigger) {
        defaultToFirstOption = false;
        if (disabled)
            return;
        if (optionsRef &&
            !$optionsPropsRef.static &&
            comboboxState === ComboboxStates.Closed) {
            return;
        }
        let adjustedState = adjustOrderedState();
        // It's possible that the activeOptionIndex is set to `null` internally, but
        // this means that we will fallback to the first non-disabled option by default.
        // We have to take this into account.
        if (adjustedState.activeOptionIndex === null) {
            let localActiveOptionIndex = adjustedState.options.findIndex((option) => !option.dataRef.disabled);
            if (localActiveOptionIndex !== -1) {
                adjustedState.activeOptionIndex = localActiveOptionIndex;
            }
        }
        let nextActiveOptionIndex = calculateActiveIndex(focus === Focus.Specific
            ? { focus: Focus.Specific, id: id }
            : { focus: focus }, {
            resolveItems: () => adjustedState.options,
            resolveActiveIndex: () => adjustedState.activeOptionIndex,
            resolveId: (option) => option.id,
            resolveDisabled: (option) => option.dataRef.disabled,
        });
        activeOptionIndex = nextActiveOptionIndex;
        activationTrigger = trigger ?? ActivationTrigger.Other;
        options = adjustedState.options;
    },
    selectOption(id) {
        let option = options.find((item) => item.id === id);
        if (!option)
            return;
        let { dataRef } = option;
        theirOnChange(match(mode, {
            [ValueMode.Single]: () => {
                return dataRef.value;
            },
            [ValueMode.Multi]: () => {
                let copy = $api.value.slice();
                let raw = dataRef.value;
                let idx = copy.findIndex((value) => $api.compare(raw, value));
                if (idx === -1) {
                    copy.push(raw);
                }
                else {
                    copy.splice(idx, 1);
                }
                return copy;
            },
        }));
    },
    selectActiveOption() {
        if ($api.activeOptionIndex === null)
            return;
        let { dataRef, id } = options[$api.activeOptionIndex];
        theirOnChange(match(mode, {
            [ValueMode.Single]: () => dataRef.value,
            [ValueMode.Multi]: () => {
                let copy = $api.value.slice();
                let raw = dataRef.value;
                let idx = copy.findIndex((value) => $api.compare(raw, value));
                if (idx === -1) {
                    copy.push(raw);
                }
                else {
                    copy.splice(idx, 1);
                }
                return copy;
            },
        }));
        // It could happen that the `activeOptionIndex` stored in state is actually null,
        // but we are getting the fallback active option back instead.
        $api.goToOption(Focus.Specific, id);
    },
    registerOption(id, dataRef) {
        let option = { id, dataRef };
        let adjustedState = adjustOrderedState((options) => [...options, option]);
        // Check if we have a selected value that we can make active.
        if (activeOptionIndex === null) {
            let optionValue = dataRef.value;
            let selected = match(mode, {
                [ValueMode.Single]: () => $api.compare($api.value, optionValue),
                [ValueMode.Multi]: () => $api.value.some((value) => $api.compare(value, optionValue)),
            });
            if (selected) {
                adjustedState.activeOptionIndex =
                    adjustedState.options.indexOf(option);
            }
        }
        options = adjustedState.options;
        activeOptionIndex = adjustedState.activeOptionIndex;
        activationTrigger = ActivationTrigger.Other;
    },
    unregisterOption(id) {
        let adjustedState = adjustOrderedState((options) => {
            let idx = options.findIndex((a) => a.id === id);
            if (idx !== -1)
                options.splice(idx, 1);
            return options;
        });
        options = adjustedState.options;
        activeOptionIndex = adjustedState.activeOptionIndex;
        activationTrigger = ActivationTrigger.Other;
    },
});
setContext(COMBOBOX_CONTEXT_NAME, api);
// Handle outside click
// useOutsideClick(
//     [inputRef, buttonRef, optionsRef],
//     () => api.closeCombobox(),
//     computed(() => comboboxState.value === ComboboxStates.Open)
//   )
function handleMousedown(event) {
    let target = event.target;
    let active = document.activeElement;
    if (comboboxState !== ComboboxStates.Open)
        return;
    if ($buttonRef?.contains(target))
        return;
    if ($inputRef?.contains(target))
        return;
    if (!$optionsRef?.contains(target))
        $api.closeCombobox();
    if (active !== document.body && active?.contains(target))
        return; // Keep focus on newly clicked/focused element
    if (!event.defaultPrevented) {
        $inputRef?.focus({ preventScroll: true });
    }
}
function computeOpenClosedState(comboboxState) {
    return match(comboboxState, {
        [ComboboxStates.Open]: State.Open,
        [ComboboxStates.Closed]: State.Closed,
    });
}
let openClosedState = writable(computeOpenClosedState(comboboxState));
useOpenClosedProvider(openClosedState);
$: $openClosedState = computeOpenClosedState(comboboxState);
$: activeOption =
    $api.activeOptionIndex === null
        ? null
        : options[$api.activeOptionIndex]?.dataRef;
$: api.update((obj) => {
    return {
        ...obj,
        comboboxState,
        value,
        options,
        activeOptionIndex,
        disabled,
    };
});
$: slotProps = {
    open: comboboxState === ComboboxStates.Open,
    disabled,
    activeIndex: $api.activeOptionIndex,
    activeOption: activeOption,
    value,
};
</script>

<svelte:window on:mousedown={handleMousedown} />

{#if name != null && value != null}
  {@const options = objectToFormEntries({ [name]: value })}
  {#each options as [optionName, optionValue], index (index)}        
    <Hidden
      features={HiddenFeatures.Hidden}
      as="input"
      type="hidden"
      hidden
      readonly
      name={optionName}
      value={optionValue}
    />
  {/each}
{/if}  
<Render
  {...$$restProps}
  {as}
  {slotProps}
  use={[...use, forwardEvents]}
  name={"Combobox"}
>
  <slot {...slotProps} />
</Render>
