<script lang="ts">
	import { cn } from '$lib/utils';
	import type { ComponentType } from 'svelte';

	let classname = '';
	export { classname as class };
	export let icon: ComponentType;

</script>

<svelte:component
	this={icon}
	class={cn(
		'h-4 w-4 mr-2 shrink-0 opacity-75 transition-opacity group-hover:opacity-100 group-focus:opacity-100',
		classname
	)}
	{...$$restProps}
/>
