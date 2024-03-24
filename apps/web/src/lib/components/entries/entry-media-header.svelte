<script lang="ts">
	import Clamp from '$components/Clamp.svelte';
	import { filterLibrary } from '$lib/schemas/library';
	import type { Type } from '$lib/types';
	import { defaultStringifySearch } from '$lib/utils/search-params';

    import { page } from '$app/stores';

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
		class="flex flex-col items-center gap-6 supports-cq:@lg:flex-row supports-ncq:md:flex-row"
	>
		<slot name="artwork">
			<div
				class="aspect-auto w-44 rounded-md shadow-lg @lg:self-start supports-ncq:md:self-start"
			>
				{#if image}
					<img
						src={image}
						style:view-transition-name={viewTransitionName}
						width={256}
						height={imageHeight}
						alt=""
						class="h-full w-full rounded-[inherit]"
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
				<h1 class="text-3xl font-bold tracking-tight @lg:text-4xl">
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
            <!-- only display actions if there is a user -->
			{#if $page.data.user_data}
				<div
					class="mt-4 flex flex-wrap items-center justify-center gap-4 supports-cq:@lg:order-4 supports-cq:@lg:mt-8 supports-cq:@lg:justify-start supports-cq:@lg:gap-2.5 supports-ncq:md:order-4 supports-ncq:md:mt-8 supports-ncq:md:justify-start supports-ncq:md:gap-2.5"
				>
					<!-- TODO: make into form -->
					<slot name="actions" />
				</div>
			{/if}
			{#if description}
				<div
					class="mt-4 max-w-md text-sm text-muted-foreground supports-cq:@lg:order-3 supports-ncq:md:order-3"
				>
					<Clamp clamp={3} class="relative">
						{@html description}
					</Clamp>
				</div>
			{/if}
		</div>
	</div>
</div>
