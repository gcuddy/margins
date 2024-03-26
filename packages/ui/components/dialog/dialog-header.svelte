<script lang="ts">
	import { cn } from '@margins/lib';
	import type { HTMLAttributes } from 'svelte/elements';
	import { DialogTitle } from './index.js';
	import DialogDescription from './dialog-description.svelte';

	type $$Props = HTMLAttributes<HTMLDivElement> & {
		description?: string;
		title: string;
	};

	let className: $$Props['class'] = undefined;
	export { className as class };
	export let title: $$Props['title'];
	export let description: $$Props['description'] = undefined;
</script>

<div
	class={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
	{...$$restProps}
>
	<DialogTitle>{title}</DialogTitle>
	{#if description}
		<DialogDescription>{description}</DialogDescription>
	{/if}
	<slot />
</div>
