<script lang="ts">
	import { Button } from '../button/index.js';
	import { autosize, cn } from '@margins/lib';
	import { fly } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	let className: string | null | undefined = undefined;
	export { className as class };
	export let value = '';
	export let placeholder = '';
	export let onSave: (value: string) => void = () => {};

	const ANIMATION_DURATION = 75;

	const height = tweened(48, {
		duration: ANIMATION_DURATION,
	});

	let focused = false;

	let borderBoxSize: ResizeObserverEntry['borderBoxSize'] = [];

	// TODO: when borderboxsize changes, update height but duration 0

	$: if (!focused) {
		height.set(48);
		initialAnimationDone = false;
	}

	let initialAnimationDone = false;

	$: if (focused && initialAnimationDone)
		height.set(6 + 28 + 24 + (borderBoxSize[0]?.blockSize ?? 24), {
			duration: 0,
		});
</script>

<div
	data-focused={focused}
	style:height="{$height}px"
	on:focusin={() => {
		console.log(borderBoxSize[0]);
		height.set(6 + 28 + 24 + (borderBoxSize[0]?.blockSize ?? 24));
		setTimeout(() => {
			initialAnimationDone = true;
		}, ANIMATION_DURATION);
		focused = true;
	}}
	on:focusout={() => {
		if (value.trim() === '') {
			focused = false;
		}
	}}
	class={cn(
		'bg-background-elevation2 ring-glass/5 group m-0 rounded-lg px-4 py-3 ring-1 ring-inset transition focus-within:shadow',
		className,
	)}
>
	<textarea
		bind:borderBoxSize
		rows={1}
		use:autosize
		{placeholder}
		{...$$restProps}
		bind:value
		class={cn(
			'peer resize-none bg-transparent focus-visible:outline-none focus-visible:ring-0',
		)}
	/>
	{#if focused}
		<div
			in:fly={{
				delay: ANIMATION_DURATION,
			}}
			class="flex h-7 justify-end opacity-0 transition group-focus-within:opacity-100"
		>
			<Button
				on:click={() => onSave(value)}
				size="sm"
				class="h-auto px-2 py-1.5 blur-sm transition group-focus-within:blur-0 dark:brightness-90 "
				>Save</Button
			>
		</div>
	{/if}
</div>
