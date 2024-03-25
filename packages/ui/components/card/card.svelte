<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '@margins/lib';
	import CardHeader from './card-header.svelte';
	import CardTitle from './card-title.svelte';
	import CardDescription from './card-description.svelte';

	type $$Props = HTMLAttributes<HTMLDivElement> & {
		title?: string;
		description?: string;
	};

	let className: $$Props['class'] = undefined;
	export { className as class };
	export let title: $$Props['title'] = undefined;
	export let description: $$Props['description'] = undefined;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class={cn('bg-card text-card-foreground rounded-xl border shadow', className)}
	{...$$restProps}
	on:click
	on:focusin
	on:focusout
	on:mouseenter
	on:mouseleave
>
	{#if title || description}
		<CardHeader>
			{#if title}
				<CardTitle>
					{title}
				</CardTitle>
			{/if}
			{#if description}
				<CardDescription>
					{description}
				</CardDescription>
			{/if}
		</CardHeader>
	{/if}
	<slot />
</div>
