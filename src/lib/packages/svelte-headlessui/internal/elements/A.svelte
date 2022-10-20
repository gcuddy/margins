<script >import { useActions } from "../../hooks/use-actions";
import { get_current_component } from "svelte/internal";
import { forwardEventsBuilder } from "../forwardEventsBuilder";
export let use = [];
export let el = null;
const forwardEvents = forwardEventsBuilder(get_current_component());
export let href = "javascript:void(0);";
</script>

<a
  bind:this={el}
  use:useActions={use}
  use:forwardEvents
  {href}
  {...$$restProps}
>
  <slot />
</a>
