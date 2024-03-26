<script lang="ts">
	import { cn } from '$lib/utils';
	import type { ComponentType } from 'svelte';

	export let icon: ComponentType | undefined | null;

    let className = ''
    export { className as class };
</script>

<svelte:component
	this={icon}
	class={cn("mr-2 group-data-[highlighted]:opacity-100 opacity-50 h-4 w-4", className)}
/>
