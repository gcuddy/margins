<script  context="module">export var ListboxStates;
(function (ListboxStates) {
    ListboxStates[ListboxStates["Open"] = 0] = "Open";
    ListboxStates[ListboxStates["Closed"] = 1] = "Closed";
})(ListboxStates || (ListboxStates = {}));
const LISTBOX_CONTEXT_NAME = "headlessui-listbox-context";
export function useListboxContext(component) {
    let context = getContext(LISTBOX_CONTEXT_NAME);
    if (context === undefined) {
        throw new Error(`<${component} /> is missing a parent <Listbox /> component.`);
    }
    return context;
}
</script>

<script >import { Focus, calculateActiveIndex, } from "../../utils/calculate-active-index";
import { createEventDispatcher, getContext, setContext } from "svelte";
import { writable } from "svelte/store";
import { match } from "../../utils/match";
import { State, useOpenClosedProvider } from "../../internal/open-closed";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
import Render from "../../utils/Render.svelte";
export let as = "div";
export let use = [];
export let disabled = false;
export let horizontal = false;
export let value;
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component(), [
    "change",
]);
const dispatch = createEventDispatcher();
/***** Component *****/
$: orientation = (horizontal ? "horizontal" : "vertical");
let listboxState = ListboxStates.Closed;
let labelRef = writable(null);
let buttonRef = writable(null);
let optionsRef = writable(null);
let options = [];
let searchQuery = "";
let activeOptionIndex = null;
let api = writable({
    listboxState,
    value,
    labelRef,
    buttonRef,
    optionsRef,
    options,
    searchQuery,
    activeOptionIndex,
    disabled,
    orientation,
    closeListbox() {
        if (disabled)
            return;
        if (listboxState === ListboxStates.Closed)
            return;
        listboxState = ListboxStates.Closed;
        activeOptionIndex = null;
    },
    openListbox() {
        if (disabled)
            return;
        if (listboxState === ListboxStates.Open)
            return;
        listboxState = ListboxStates.Open;
    },
    goToOption(focus, id) {
        if (disabled)
            return;
        if (listboxState === ListboxStates.Closed)
            return;
        let nextActiveOptionIndex = calculateActiveIndex(focus === Focus.Specific
            ? { focus: Focus.Specific, id: id }
            : { focus: focus }, {
            resolveItems: () => options,
            resolveActiveIndex: () => activeOptionIndex,
            resolveId: (option) => option.id,
            resolveDisabled: (option) => option.dataRef.disabled,
        });
        if (searchQuery === "" && activeOptionIndex === nextActiveOptionIndex)
            return;
        activeOptionIndex = nextActiveOptionIndex;
        searchQuery = "";
    },
    search(value) {
        if (disabled)
            return;
        if (listboxState === ListboxStates.Closed)
            return;
        searchQuery += value.toLowerCase();
        let reorderedOptions = activeOptionIndex !== null
            ? options
                .slice(activeOptionIndex + 1)
                .concat(options.slice(0, activeOptionIndex + 1))
            : options;
        let matchingOption = reorderedOptions.find((option) => !option.dataRef.disabled &&
            option.dataRef.textValue.startsWith(searchQuery));
        let matchIdx = matchingOption ? options.indexOf(matchingOption) : -1;
        if (matchIdx === -1 || matchIdx === activeOptionIndex)
            return;
        activeOptionIndex = matchIdx;
    },
    clearSearch() {
        if (disabled)
            return;
        if (listboxState === ListboxStates.Closed)
            return;
        if (searchQuery === "")
            return;
        searchQuery = "";
    },
    registerOption(id, dataRef) {
        if (!$optionsRef) {
            // We haven't mounted yet so just append
            options = [...options, { id, dataRef }];
            return;
        }
        let currentActiveOption = activeOptionIndex !== null ? options[activeOptionIndex] : null;
        let orderMap = Array.from($optionsRef.querySelectorAll('[id^="headlessui-listbox-option-"]')).reduce((lookup, element, index) => Object.assign(lookup, { [element.id]: index }), {});
        let nextOptions = [...options, { id, dataRef }];
        nextOptions.sort((a, z) => orderMap[a.id] - orderMap[z.id]);
        options = nextOptions;
        // Maintain the correct item active
        activeOptionIndex = (() => {
            if (currentActiveOption === null)
                return null;
            return options.indexOf(currentActiveOption);
        })();
    },
    unregisterOption(id) {
        let nextOptions = options.slice();
        let currentActiveOption = activeOptionIndex !== null ? nextOptions[activeOptionIndex] : null;
        let idx = nextOptions.findIndex((a) => a.id === id);
        if (idx !== -1)
            nextOptions.splice(idx, 1);
        options = nextOptions;
        activeOptionIndex = (() => {
            if (idx === activeOptionIndex)
                return null;
            if (currentActiveOption === null)
                return null;
            // If we removed the option before the actual active index, then it would be out of sync. To
            // fix this, we will find the correct (new) index position.
            return nextOptions.indexOf(currentActiveOption);
        })();
    },
    select(value) {
        if (disabled)
            return;
        dispatch("change", value);
    },
});
setContext(LISTBOX_CONTEXT_NAME, api);
let openClosedState = writable(State.Closed);
useOpenClosedProvider(openClosedState);
$: openClosedState.set(match(listboxState, {
    [ListboxStates.Open]: State.Open,
    [ListboxStates.Closed]: State.Closed,
}));
$: api.update((obj) => {
    return {
        ...obj,
        listboxState,
        value,
        options,
        searchQuery,
        activeOptionIndex,
        disabled,
        orientation,
    };
});
function handleMousedown(event) {
    let target = event.target;
    let active = document.activeElement;
    if (listboxState !== ListboxStates.Open)
        return;
    if ($buttonRef?.contains(target))
        return;
    if (!$optionsRef?.contains(target))
        $api.closeListbox();
    if (active !== document.body && active?.contains(target))
        return; // Keep focus on newly clicked/focused element
    if (!event.defaultPrevented) {
        $buttonRef?.focus({ preventScroll: true });
    }
}
$: slotProps = { open: listboxState === ListboxStates.Open };
</script>

<svelte:window on:mousedown={handleMousedown} />
<Render
  {...$$restProps}
  {as}
  {slotProps}
  use={[...use, forwardEvents]}
  name={"Listbox"}
>
  <slot {...slotProps} />
</Render>
