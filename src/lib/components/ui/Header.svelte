<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn } from '$lib/utils/tailwind';

	type $$Props = HTMLAttributes<HTMLDivElement> & {
		title?: string;
	};

	let className: $$Props['class'] = undefined;
	export { className as class };

	export let title = '';
</script>

<div
	class={cn(
		'flex max-w-full shrink-0 items-center justify-between px-6 border-b w-full sticky max-sm:flex-wrap top-0 bg-background gap-x-4 z-10 h-[--nav-height]',
		className,
	)}
	{...$$restProps}
>
	<slot />
	{#if $$slots.start}
		<div class="flex items-center gap-3 flex-1 min-w-0">
			<slot name="start" />
		</div>
	{/if}
	{#if title || $$slots.title}
		<slot name="title">
			<h1 class="font-bold text-base">
			<!-- <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight"> -->
				{title}
			</h1>
		</slot>
	{/if}

	{#if $$slots.end}
		<div class="flex w-auto justify-end items-center">
			<div class="flex items-center gap-2">
				<slot name="end" />
			</div>
		</div>
	{/if}

	<!--  -->
</div>
