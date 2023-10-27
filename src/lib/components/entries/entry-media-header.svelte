<script lang="ts">
	import Clamp from '$components/Clamp.svelte';
	import { filterLibrary } from '$lib/schemas/library';
	import type { Type } from '$lib/types';
	import { defaultStringifySearch } from '$lib/utils/search-params';

	export let title: string;
	export let author: string | undefined = undefined;
	export let description: string | undefined = undefined;
	export let type: Type;
	export let image: string | undefined = undefined;
	export let imageHeight: number | undefined = undefined;
	export let imageWidth: number | undefined = undefined;
	export let viewTransitionName: string | undefined = undefined;
</script>

<div class="@container">
	<div
		class="flex gap-6 flex-col supports-ncq:md:flex-row supports-cq:@lg:flex-row items-center"
	>
		<slot name="artwork">
			<div class="aspect-auto rounded-md shadow-lg w-44 @lg:self-start supports-ncq:md:self-start">
				{#if image}
					<img
						src={image}
						style:view-transition-name={viewTransitionName}
						width={256}
						height={imageHeight}
						alt=""
						class="rounded-[inherit] w-full h-full"
					/>
				{/if}
			</div>
		</slot>
		<!-- <img
        style:view-transition-name="podcast-artwork-{data.podcast?.id}"
        src={data.podcast?.artwork}
        alt=""
        class="aspect-auto rounded-md shadow-lg w-64"
        use:smoothload
    /> -->
		<div
			class="flex flex-col gap-2 text-center supports-cq:@lg:text-left supports-ncq:md:text-left"
		>
			<!-- headings -->
			<div class="flex flex-col gap-1">
				<a
					class="text-sm text-muted-foreground"
					href="/library/all{defaultStringifySearch(
						filterLibrary({
							type: 'movie',
						}),
					)}"
				>
					<span>{type}</span>
				</a>
				<h1 class="text-3xl @lg:text-4xl font-bold tracking-tight">
					<slot name="title">
						{title}
					</slot>
				</h1>
				<slot name="metaTop" />
				{#if author || $$slots.meta}
					<span class="text-base text-muted-foreground">
						<slot name="meta">
							{author}
						</slot>
					</span>
				{/if}
				<slot name="metaBottom" />
			</div>
			<div
				class="flex items-center flex-wrap gap-4 justify-center mt-4 supports-cq:@lg:justify-start supports-ncq:md:justify-start supports-cq:@lg:gap-2.5 supports-ncq:md:gap-2.5 supports-cq:@lg:mt-8 supports-ncq:md:mt-8 supports-cq:@lg:order-4 supports-ncq:md:order-4"
			>
				<!-- TODO: make into form -->
				<slot name="actions" />
			</div>
			{#if description}
				<div
					class="text-sm text-muted-foreground mt-4 supports-cq:@lg:order-3 supports-ncq:md:order-3 max-w-md"
				>
					<Clamp clamp={3} class="relative">
						{@html description}
					</Clamp>
				</div>
			{/if}
		</div>
	</div>
</div>
