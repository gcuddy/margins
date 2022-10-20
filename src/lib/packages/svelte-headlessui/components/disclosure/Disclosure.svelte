<script  context="module">import { writable } from "svelte/store";
import { getContext, setContext } from "svelte";
export var DisclosureStates;
(function (DisclosureStates) {
    DisclosureStates[DisclosureStates["Open"] = 0] = "Open";
    DisclosureStates[DisclosureStates["Closed"] = 1] = "Closed";
})(DisclosureStates || (DisclosureStates = {}));
let DISCLOSURE_CONTEXT_NAME = "headlessui-disclosure-context";
export function useDisclosureContext(component) {
    let context = getContext(DISCLOSURE_CONTEXT_NAME);
    if (context === undefined) {
        throw new Error(`<${component} /> is missing a parent <Disclosure /> component.`);
    }
    return context;
}
</script>

<script >import { useId } from "../../hooks/use-id";
import { match } from "../../utils/match";
import { State, useOpenClosedProvider } from "../../internal/open-closed";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
import Render from "../../utils/Render.svelte";
export let as = "div";
export let use = [];
export let defaultOpen = false;
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component());
/***** Component *****/
let buttonId = `headlessui-disclosure-button-${useId()}`;
let panelId = `headlessui-disclosure-panel-${useId()}`;
let disclosureState = defaultOpen
    ? DisclosureStates.Open
    : DisclosureStates.Closed;
let panelStore = writable(null);
let buttonStore = writable(null);
let api = writable({
    buttonId,
    panelId,
    disclosureState,
    panelStore,
    buttonStore,
    toggleDisclosure() {
        disclosureState = match(disclosureState, {
            [DisclosureStates.Open]: DisclosureStates.Closed,
            [DisclosureStates.Closed]: DisclosureStates.Open,
        });
    },
    closeDisclosure() {
        if (disclosureState === DisclosureStates.Closed)
            return;
        disclosureState = DisclosureStates.Closed;
    },
    close(focusableElement) {
        $api.closeDisclosure();
        let restoreElement = (() => {
            if (!focusableElement)
                return $buttonStore;
            if (focusableElement instanceof HTMLElement)
                return focusableElement;
            return $buttonStore;
        })();
        restoreElement?.focus();
    },
});
setContext(DISCLOSURE_CONTEXT_NAME, api);
$: api.update((obj) => {
    return {
        ...obj,
        disclosureState,
    };
});
function computeOpenClosedState(disclosureState) {
    return match(disclosureState, {
        [DisclosureStates.Open]: State.Open,
        [DisclosureStates.Closed]: State.Closed,
    });
}
let openClosedState = writable(computeOpenClosedState(disclosureState));
useOpenClosedProvider(openClosedState);
$: $openClosedState = computeOpenClosedState(disclosureState);
$: slotProps = {
    open: disclosureState === DisclosureStates.Open,
    close: $api.close,
};
</script>

<Render
  {...$$restProps}
  {as}
  {slotProps}
  use={[...use, forwardEvents]}
  name={"Disclosure"}
>
  <slot {...slotProps} />
</Render>
