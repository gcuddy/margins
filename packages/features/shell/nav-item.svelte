<script lang="ts">
	import { cn } from '@margins/lib';
	import type { ComponentType } from 'svelte';

	export let icon: ComponentType;
	export let href: string;
	export let isActive = false;
</script>

<a
	class={cn(
		'hover:bg-sandA-3 group my-px flex w-full items-center justify-start rounded-lg px-3 py-2 text-left text-sm font-medium transition active:scale-[.97]',
		isActive && 'bg-sandA-4 hover:bg-sandA-4 text-accent-foreground',
	)}
	{href}
>
	<svelte:component
		this={icon}
		class={cn(
			'text-muted-foreground/80 group-hover:text-accent-foreground mr-2.5 h-4 w-4',
			isActive && 'text-accent-foreground',
		)}
	/>
	<slot />
</a>
