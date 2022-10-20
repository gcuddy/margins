<script  context="module">export {};
</script>

<script >import { onMount, setContext } from "svelte";
import { writable } from "svelte/store";
import { match } from "../../utils/match";
import { State, useOpenClosed } from "../../internal/open-closed";
import TransitionChild, {} from "./TransitionChild.svelte";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
import { hasChildren, NESTING_CONTEXT_NAME, TRANSITION_CONTEXT_NAME, TreeStates, useNesting, } from "./common.svelte";
const forwardEvents = forwardEventsBuilder(get_current_component(), [
    "beforeEnter",
    "beforeLeave",
    "afterEnter",
    "afterLeave",
]);
export let as = "div";
export let use = [];
export let show = undefined;
export let appear = false;
/***** Events *****/
/***** Component *****/
let openClosedState = useOpenClosed();
function computeShow(show, openClosedState) {
    if (show === undefined && openClosedState !== undefined) {
        return match(openClosedState, {
            [State.Open]: true,
            [State.Closed]: false,
        });
    }
    return show;
}
let shouldShow = computeShow(show, openClosedState !== undefined ? $openClosedState : undefined);
let initialShow = shouldShow;
$: {
    shouldShow = computeShow(show, openClosedState !== undefined ? $openClosedState : undefined);
    if (shouldShow !== true && shouldShow !== false) {
        throw new Error("A <Transition /> is used but it is missing a `show={true | false}` prop.");
    }
}
let state = shouldShow ? TreeStates.Visible : TreeStates.Hidden;
let nestingBag = writable(useNesting(() => {
    state = TreeStates.Hidden;
}));
let initial = true;
let transitionBag = writable();
$: transitionBag.set({
    show: !!shouldShow,
    appear: appear || !initial,
    initialShow: !!initialShow,
});
onMount(() => {
    initial = false;
});
$: if (!initial) {
    if (shouldShow) {
        state = TreeStates.Visible;
    }
    else if (!hasChildren($nestingBag)) {
        state = TreeStates.Hidden;
    }
}
setContext(NESTING_CONTEXT_NAME, nestingBag);
setContext(TRANSITION_CONTEXT_NAME, transitionBag);
</script>

{#if state === TreeStates.Visible || $$props.unmount === false}
  <TransitionChild
    {...$$restProps}
    {as}
    use={[...use, forwardEvents]}
    on:afterEnter
    on:afterLeave
    on:beforeEnter
    on:beforeLeave
  >
    <slot />
  </TransitionChild>
{/if}
