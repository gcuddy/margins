<script  context="module">import { getContext, setContext } from "svelte";
import { writable } from "svelte/store";
const PORTAL_GROUP_CONTEXT_NAME = "headlessui-portal-group-context";
export function usePortalGroupContext() {
    return getContext(PORTAL_GROUP_CONTEXT_NAME);
}
</script>

<script >export let target;
let targetStore = writable(target);
setContext(PORTAL_GROUP_CONTEXT_NAME, targetStore);
$: targetStore.set(target);
</script>

<slot />
