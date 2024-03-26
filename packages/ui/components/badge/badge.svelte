<script lang="ts">
	import { cn } from '@margins/lib';
	import { badgeVariants, type Variant } from './index.js';
	import type { ComponentType } from 'svelte';

	import Dot from 'lucide-svelte/icons/dot';
	let className: string | undefined | null = undefined;
	export let href: string | undefined = undefined;
	export let variant: Variant = 'default';
	export let withDot = false;
	export let startIcon: ComponentType | undefined = undefined;
	export let iconClass: string | undefined = undefined;
	export { className as class };
</script>

<svelte:element
	this={href ? 'a' : 'span'}
	{href}
	class={cn(badgeVariants({ variant, className }))}
	{...$$restProps}
>
	{#if withDot}
		<Dot
			data-testid="badge-dot"
			class={cn('h-3 w-3 stroke-[3px]', iconClass)}
		/>
	{/if}
	{#if startIcon}
		<svelte:component
			this={startIcon}
			data-testid="badge-icon"
			class={cn('h-3 w-3 stroke-[3px]', iconClass)}
		/>
	{/if}
	<slot />
</svelte:element>
