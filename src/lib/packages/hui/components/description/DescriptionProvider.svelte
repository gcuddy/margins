<script  context="module">const DESCRIPTION_CONTEXT_NAME = "headlessui-description-context";
export function useDescriptionContext() {
    return getContext(DESCRIPTION_CONTEXT_NAME);
}
</script>

<script >import { getContext, setContext } from "svelte";
import { writable } from "svelte/store";
export let name;
export let slotProps = {};
let descriptionIds = [];
let contextStore = writable({
    name,
    slotProps,
    props: $$restProps,
    register,
});
setContext(DESCRIPTION_CONTEXT_NAME, contextStore);
$: contextStore.set({
    name,
    slotProps,
    props: $$restProps,
    register,
    descriptionIds: descriptionIds.length > 0 ? descriptionIds.join(" ") : undefined,
});
function register(value) {
    descriptionIds = [...descriptionIds, value];
    return () => {
        descriptionIds = descriptionIds.filter((descriptionId) => descriptionId !== value);
    };
}
</script>

<slot describedby={$contextStore.descriptionIds} />
