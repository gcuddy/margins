<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLAttributes } from "svelte/elements";
	import AspectRatio from "./ui/AspectRatio.svelte";
	import smoothload from "$lib/actions/smoothload";

	export let aspectRatio = 3 / 4;
	let className = "";
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
		};
	}

	export let item: $$Props["item"];
</script>

<a href="/tests/{item.type}/{item.id}" class={cn("space-y-3", className)}>
	<!--  -->
	<AspectRatio ratio={aspectRatio} class="overflow-hidden rounded-md">
		<!-- Image -->
		<img
			use:smoothload
			src={item.image}
			alt={item.title}
			class="rounded-md object-cover transition-all hover:scale-105"
		/>
	</AspectRatio>
	<div class="space-y-1 text-sm">
		<h3 class="font-medium leading-none">{item.title}</h3>
		<p class="text-xs text-slate-500 dark:text-slate-400">
			{#if item.author}{item.author}{/if}
			{#if item.date}({item.date}){/if}
		</p>
	</div>
</a>
