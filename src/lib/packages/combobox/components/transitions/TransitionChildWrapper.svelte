<script >import { hasOpenClosed } from "../../internal/open-closed";
import TransitionChild from "./TransitionChild.svelte";
import TransitionRoot, {} from "./TransitionRoot.svelte";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
import { hasTransitionContext } from "./common.svelte";
const forwardEvents = forwardEventsBuilder(get_current_component(), [
    "beforeEnter",
    "beforeLeave",
    "afterEnter",
    "afterLeave",
]);
export let as = "div";
export let use = [];
/***** Events *****/
/***** Component *****/
let hasTransition = hasTransitionContext();
let hasOpen = hasOpenClosed();
</script>

{#if !hasTransition && hasOpen}
  <TransitionRoot
    {...$$props}
    {as}
    use={[...use, forwardEvents]}
    on:afterEnter
    on:afterLeave
    on:beforeEnter
    on:beforeLeave
  >
    <slot />
  </TransitionRoot>
{:else}
  <TransitionChild
    {...$$props}
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
