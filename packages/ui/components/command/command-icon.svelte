<script lang="ts">
	import type { ComponentType } from 'svelte';
	import { cn } from '@margins/lib';

	export let icon: ComponentType;
	let className: string | null | undefined = undefined;
	export { className as class };
</script>

<svelte:component
	this={icon}
	class={cn(
		'group-data-[selected=true]:text-accent-foreground text-muted-foreground/90 mr-2 h-4 w-4',
		className,
	)}
/>
