<script  context="module">const LABEL_CONTEXT_NAME = "headlessui-label-context";
export function useLabelContext() {
    return getContext(LABEL_CONTEXT_NAME);
}
</script>

<script >import { getContext, setContext } from "svelte";
import { writable } from "svelte/store";
export let name;
export let slotProps = {};
let labelIds = [];
let contextStore = writable({
    name,
    slotProps,
    props: $$restProps,
    register,
});
setContext(LABEL_CONTEXT_NAME, contextStore);
$: contextStore.set({
    name,
    slotProps,
    props: $$restProps,
    register,
    labelIds: labelIds.length > 0 ? labelIds.join(" ") : undefined,
});
function register(value) {
    labelIds = [...labelIds, value];
    return () => {
        labelIds = labelIds.filter((labelId) => labelId !== value);
    };
}
</script>

<slot labelledby={$contextStore.labelIds} />
