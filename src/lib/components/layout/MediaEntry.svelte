<script lang="ts">
	import classNames from "classnames";
	import Muted from "../atoms/Muted.svelte";
	import ImageLoader from "../ui/images/ImageLoader.svelte";
	import ImageSkeleton from "./Skeletons/ImageSkeleton.svelte";

	export let loading = false;
	export let image_dimensions = "max-h-60 max-w-60";
	export let image = "";
	export let title = "";
	export let author = "";
    export let publisher: string | undefined = undefined;
	export let description = "";
	export let year: string | number | undefined = undefined;
</script>

<div class="flex-flex-col relative w-full max-w-4xl space-y-6">
	<div class="relative flex justify-center space-y-8 sm:flex-row sm:space-y-0 sm:space-x-12">
		<div
			class="{image_dimensions} place-self-center shrink-0 overflow-hidden rounded-xl shadow-lg ring-1 ring-border/25 sm:place-self-start"
		>
			{#if loading || !image}
				<ImageSkeleton
					class={classNames({
						"animate-pulse": loading,
					})}
				/>
			{:else if image}
				<ImageLoader src={image} class="" alt="" />
			{/if}
		</div>
		<div class="grow flex flex-col space-y-4 sm:space-y-8">
			<div class="text-center sm:text-left flex flex-col">
				<div class="flex items-baseline gap-3">
					<h1 class="text-2xl font-bold">{title}</h1>
					{#if year}
						<span><Muted>{year}</Muted></span>
					{/if}
				</div>
				<span><Muted>{author}</Muted>
                {#if publisher}
                    <Muted> / {publisher}</Muted>
                {/if}
                </span>
                <slot name="top" />
				<!-- TODO: categories here -->
			</div>
			{#if description}
				<div class="relative overflow-hidden text-sm line-clamp-4">
					<div class="prose text-sm  leading-normal gradient-mask-br-50 dark:prose-invert">
						{@html description}
					</div>
				</div>
			{/if}
			<slot name="description" />

			<div class="!mt-auto py-2">
				<slot name="actions" />
			</div>
		</div>
	</div>
	<div>
		<slot />
	</div>
</div>
