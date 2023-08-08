<script lang="ts">
	import { cn } from '$lib/utils/tailwind';
	let className = '';
	export { className as class };

	export let title = '';
</script>

<div
	class={cn(
		'flex max-w-full shrink-0 items-center px-6 border-b sticky top-0 bg-background gap-x-4 z-10 h-[--nav-height]',
		className
	)}
>
	{#if $$slots.start}
		<div class="flex items-center gap-3 flex-1 min-w-0">
			<slot name="start" />
		</div>
	{/if}
	{#if title || $$slots.title}
		<slot name="title">
			<h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h1>
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
	<slot />
</div>
