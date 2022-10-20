<script  context="module">import { getContext, setContext, createEventDispatcher, tick, onDestroy, onMount, } from "svelte";
export var DialogStates;
(function (DialogStates) {
    DialogStates[DialogStates["Open"] = 0] = "Open";
    DialogStates[DialogStates["Closed"] = 1] = "Closed";
})(DialogStates || (DialogStates = {}));
const DIALOG_CONTEXT_NAME = "headlessui-dialog-context";
export function useDialogContext(component) {
    let context = getContext(DIALOG_CONTEXT_NAME);
    if (context === undefined) {
        throw new Error(`<${component} /> is missing a parent <Dialog /> component.`);
    }
    return context;
}
</script>

<script >import { State, useOpenClosed } from "../../internal/open-closed";
import { writable } from "svelte/store";
import { match } from "../../utils/match";
import { useId } from "../../hooks/use-id";
import { useInertOthers } from "../../hooks/use-inert-others";
import { contains } from "../../internal/dom-containers";
import { Keys } from "../../utils/keyboard";
import FocusTrap from "../focus-trap/FocusTrap.svelte";
import StackContextProvider, { StackMessage, } from "../../internal/StackContextProvider.svelte";
import DescriptionProvider from "../description/DescriptionProvider.svelte";
import ForcePortalRootContext from "../../internal/ForcePortalRootContext.svelte";
import Portal from "../portal/Portal.svelte";
import PortalGroup from "../portal/PortalGroup.svelte";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
import Render from "../../utils/Render.svelte";
import { Features } from "../../types";
export let as = "div";
export let use = [];
export let open = undefined;
export let initialFocus = null;
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component(), [
    "close",
]);
const dispatch = createEventDispatcher();
/***** Component *****/
let containers = new Set();
let openClosedState = useOpenClosed();
$: {
    open =
        open === undefined && openClosedState !== undefined
            ? match($openClosedState, {
                [State.Open]: true,
                [State.Closed]: false,
            })
            : open;
    // Validations
    let hasOpen = open !== undefined || openClosedState !== undefined;
    if (!hasOpen) {
        throw new Error(`You forgot to provide an \`open\` prop to the \`Dialog\` component.`);
    }
    if (typeof open !== "boolean") {
        throw new Error(`You provided an \`open\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${open}`);
    }
}
$: dialogState = open ? DialogStates.Open : DialogStates.Closed;
$: visible =
    openClosedState !== undefined
        ? $openClosedState === State.Open
        : dialogState === DialogStates.Open;
let internalDialogRef = null;
$: enabled = dialogState === DialogStates.Open;
const id = `headlessui-dialog-${useId()}`;
$: _cleanup = (() => {
    if (_cleanup) {
        _cleanup();
    }
    return useInertOthers(internalDialogRef, enabled);
})();
onDestroy(() => {
    if (_cleanup) {
        _cleanup();
    }
});
let titleId;
let api = writable({
    titleId,
    dialogState,
    setTitleId(id) {
        if (titleId === id)
            return;
        titleId = id;
    },
    close() {
        dispatch("close", false);
    },
});
setContext(DIALOG_CONTEXT_NAME, api);
$: api.update((obj) => {
    return {
        ...obj,
        titleId,
        dialogState,
    };
});
// Handle outside click
async function handleWindowMousedown(event) {
    let target = event.target;
    if (dialogState !== DialogStates.Open)
        return;
    if (containers.size !== 1)
        return;
    if (contains(containers, target))
        return;
    $api.close();
    await tick();
    target?.focus();
}
// Handle `Escape` to close
function handleWindowKeydown(event) {
    if (event.key !== Keys.Escape)
        return;
    if (dialogState !== DialogStates.Open)
        return;
    if (containers.size > 1)
        return; // 1 is myself, otherwise other elements in the Stack
    event.preventDefault();
    event.stopPropagation();
    $api.close();
}
let mounted = false;
onMount(() => (mounted = true));
$: _cleanupScrollLock = (() => {
    if (_cleanupScrollLock) {
        _cleanupScrollLock();
    }
    if (dialogState !== DialogStates.Open)
        return;
    if (!mounted)
        return;
    let overflow = document.documentElement.style.overflow;
    let paddingRight = document.documentElement.style.paddingRight;
    let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
        document.documentElement.style.overflow = overflow;
        document.documentElement.style.paddingRight = paddingRight;
    };
})();
onDestroy(() => {
    if (_cleanupScrollLock) {
        _cleanupScrollLock();
    }
});
$: _cleanupClose = (() => {
    if (_cleanupClose) {
        _cleanupClose();
    }
    if (dialogState !== DialogStates.Open)
        return;
    let container = internalDialogRef;
    if (!container)
        return;
    let observer = new IntersectionObserver((entries) => {
        for (let entry of entries) {
            if (entry.boundingClientRect.x === 0 &&
                entry.boundingClientRect.y === 0 &&
                entry.boundingClientRect.width === 0 &&
                entry.boundingClientRect.height === 0) {
                $api.close();
            }
        }
    });
    observer.observe(container);
    return () => observer.disconnect();
})();
onDestroy(() => {
    if (_cleanupClose) {
        _cleanupClose();
    }
});
function handleClick(e) {
    let event = e;
    event.stopPropagation();
}
$: propsWeControl = {
    id,
    role: "dialog",
    "aria-modal": dialogState === DialogStates.Open ? true : undefined,
    "aria-labelledby": titleId,
};
$: slotProps = { open };
</script>

<svelte:window
  on:mousedown={handleWindowMousedown}
  on:keydown={handleWindowKeydown}
/>
<FocusTrap {containers} {enabled} options={{ initialFocus }} />
<StackContextProvider
  element={internalDialogRef}
  onUpdate={(message, element) => {
    return match(message, {
      [StackMessage.Add]() {
        containers = new Set([...containers, element]);
      },
      [StackMessage.Remove]() {
        containers.delete(element);
        containers = new Set([...containers]);
      },
    });
  }}
>
  <ForcePortalRootContext force={true}>
    <Portal>
      <PortalGroup target={internalDialogRef}>
        <ForcePortalRootContext force={false}>
          <DescriptionProvider
            name={"DialogDescription"}
            {slotProps}
            let:describedby
          >
            <Render
              {...{ ...$$restProps, ...propsWeControl }}
              {as}
              {slotProps}
              use={[...use, forwardEvents]}
              name={"Dialog"}
              bind:el={internalDialogRef}
              aria-describedby={describedby}
              on:click={handleClick}
              {visible}
              features={Features.RenderStrategy | Features.Static}
            >
              <slot {...slotProps} />
            </Render>
          </DescriptionProvider>
        </ForcePortalRootContext>
      </PortalGroup>
    </Portal>
  </ForcePortalRootContext>
</StackContextProvider>
