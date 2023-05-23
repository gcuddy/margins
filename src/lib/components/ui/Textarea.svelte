<script lang="ts">
	import { cn } from '$lib/utils/tailwind';
	import autosize from '$lib/actions/autosize';
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { Writable, writable } from 'svelte/store';
	import { tick } from 'svelte';
	let className = '';
	export let value: string | null | undefined = '';

	export { className as class };
	interface $$Props extends HTMLTextareaAttributes {
		class?: string;
		el?: HTMLTextAreaElement;
		onInput?: (value: string | null | undefined) => void;
		value?: string | null;
	}
	export let el: HTMLTextAreaElement | undefined = undefined;
	export let onInput: $$Props['onInput'] = undefined;

	$: console.log({ value });

	export const focus = () => {
		console.log('received focus request');
		console.log({ el });
		tick().then(() => {
			el?.focus();
		});
	};
</script>

<textarea
	bind:value
	bind:this={el}
	use:autosize
	class={cn(
		'flex h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	on:blur
	on:input={() => onInput?.(value)}
	on:input
	{...$$restProps}
/>
