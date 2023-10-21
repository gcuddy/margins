<script lang="ts">
	import type { ComponentType } from "svelte";


	export let icon: ComponentType;

</script>

<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center opacity-50 group-focus:opacity-100 group-data-[state='open']:opacity-100">
	<svelte:component this={icon} class="w-4 h-4" />
</span>
