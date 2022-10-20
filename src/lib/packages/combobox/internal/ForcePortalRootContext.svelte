<script  context="module">import { getContext, setContext } from "svelte";
import { writable } from "svelte/store";
const FORCE_PORTAL_ROOT_CONTEXT_NAME = "headlessui-force-portal-root-context";
export function usePortalRoot() {
    return getContext(FORCE_PORTAL_ROOT_CONTEXT_NAME);
}
</script>

<script >export let force;
setContext(FORCE_PORTAL_ROOT_CONTEXT_NAME, writable(force));
</script>

<slot />
