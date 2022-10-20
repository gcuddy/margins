<script >import { onMount } from "svelte";
export let name;
export let fn;
onMount(() => {
    fn(`Mounting - ${name}`);
    return () => fn(`Unmounting - ${name}`);
});
</script>

<slot />
