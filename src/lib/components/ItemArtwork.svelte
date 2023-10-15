<script lang="ts">
	import { cn } from '$lib/utils/tailwind';
	import type { HTMLAttributes } from 'svelte/elements';
	import AspectRatio from './ui/AspectRatio.svelte';
	import smoothload from '$lib/actions/smoothload';
	import { Blockquote } from './ui/typography';

	export let aspectRatio = 4 / 4;
	let className = '';
	export { className as class };

	interface $$Props extends HTMLAttributes<HTMLDivElement> {
		aspectRatio?: number;
		class?: string;
		item: {
			id: string | number;
			image?: string | null;
			title?: string | null;
			author?: string | null;
			date?: string | null;
			type: string;
            description?: string | null;
		};
		q?: string;
		showType?: boolean;
	}

	export let item: $$Props['item'];
	export let q = '';
	export let showType = false;
</script>

<a
	href="/{item.type === 'rss' ? 'article' : item.type}/{item.id}{item.type ===
	'article'
		? '#:~:text=' + q
		: ''}"
	class={cn('space-y-3 max-sm:mx-auto flex flex-col items-center', className)}
>
	<!--  -->
	{#if item.type === 'article' && item.description}
		<div class="p-6 border rounded-lg grow overflow-auto w-full">
            <Blockquote class="mt-0">
                {@html item.description}
            </Blockquote>
        </div>
	{:else}
		<AspectRatio
			ratio={aspectRatio}
			class="overflow-hidden rounded-md flex justify-center"
		>
			<!-- Image -->
			<img
				use:smoothload
				src={item.image}
				alt={item.title}
				class="h-full rounded-md object-cover transition-all"
			/>
		</AspectRatio>
	{/if}
	<div class="space-y-1 text-sm text-center">
		{#if showType}
			<span class="text-muted-foreground text-xs">{item.type}</span>
		{/if}
		<h3 class="font-medium leading-none">{@html item.title}</h3>
		<p class="text-xs text-slate-500 dark:text-slate-400">
			{#if item.author}{@html item.author}{/if}
			{#if item.date}({item.date}){/if}
		</p>
	</div>
</a>
