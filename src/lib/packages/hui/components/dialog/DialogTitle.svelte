<script  context="module">"use strict";
</script>

<script >import { DialogStates, useDialogContext } from "./Dialog.svelte";
import { useId } from "../../hooks/use-id";
import { onMount } from "svelte";
import { forwardEventsBuilder } from "../../internal/forwardEventsBuilder";
import { get_current_component } from "svelte/internal";
import Render from "../../utils/Render.svelte";
export let as = "h2";
export let use = [];
/***** Events *****/
const forwardEvents = forwardEventsBuilder(get_current_component());
/***** Component *****/
let api = useDialogContext("DialogTitle");
let id = `headlessui-dialog-title-${useId()}`;
onMount(() => {
    $api.setTitleId(id);
    return () => $api.setTitleId(undefined);
});
$: propsWeControl = {
    id,
};
$: slotProps = { open: $api.dialogState === DialogStates.Open };
</script>

<Render
  {...{ ...$$restProps, ...propsWeControl }}
  {as}
  {slotProps}
  use={[...use, forwardEvents]}
  name={"DialogTitle"}
>
  <slot {...slotProps} />
</Render>
