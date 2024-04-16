<script lang="ts">
	import { cn } from '@margins/lib';
	import type { ComponentType } from 'svelte';
	export let icon: ComponentType;
	let className: string | null | undefined = undefined;
	export { className as class };
</script>

<svelte:component
	this={icon}
	class={cn(
		'group-data-[highlighted]:text-foreground text-muted-foreground mr-2 h-4 w-4',
		className,
	)}
/>
