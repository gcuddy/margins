<!-- This is used for podcasts, music, etc -->
<script lang="ts">
	import Muted from "$lib/components/atoms/Muted.svelte";
	import GenericDialog from "$lib/components/GenericDialog.svelte";
	import ImageSkeleton from "$lib/components/layout/Skeletons/ImageSkeleton.svelte";
	let show_description_modal = false;
	export let img = "";
	export let title = "";
	export let description = "";
	export let author = "";
	export let url: string | undefined = undefined;
	export let loading = false;
	export let error = false;
	export let success = false;
</script>

<div class="">
	<div class="container mx-auto flex flex-col space-y-8 p-6 dark:divide-gray-700">
		<div class="relative flex flex-col justify-center space-y-8 sm:flex-row sm:space-y-0 sm:space-x-12">
			<div class="h-60 w-60 place-self-center overflow-hidden rounded-xl shadow-lg sm:place-self-start">
				{#if img}
					<img src={img} class="" alt="" />
				{:else if loading}
					<ImageSkeleton class="animate-pulse" />
				{/if}
			</div>
			{#if loading}
				<!-- <p>Loading...</p> -->
				<slot name="loading">
					<p>Loading...</p>
				</slot>
			{:else if error}
				<slot name="error">
					<p class="text-red-500">Error</p>
				</slot>
			{:else if success}
				<div class="space-y-4 sm:space-y-8 flex flex-col justify-between">
					<div class="text-center sm:text-left flex flex-col">
						<h1 class="text-2xl font-bold">{title}</h1>
						<svelte:element this={url ? "a" : "span"} class="text-xl" href={url}
							><Muted>{author}</Muted></svelte:element
						>
						<slot name="meta" />
						<!-- TODO: categories here -->
					</div>
					{#if description}
						<div class="relative overflow-hidden text-sm line-clamp-4">
							<div class="prose text-sm  leading-normal gradient-mask-br-50 dark:prose-invert">
								{@html description}
							</div>
							<button
								on:click={() => (show_description_modal = true)}
								class="absolute bottom-0 right-0 cursor-default bg-base pl-1 pt-1 font-medium text-primary-600 dark:bg-gray-900 dark:to-gray-900"
							>
								Read more
							</button>
							<GenericDialog bind:isOpen={show_description_modal}>
								<svelte:fragment slot="title">About</svelte:fragment>
								<span class="font-bold" slot="description">{title}</span>
								<div class="prose text-sm   leading-normal dark:prose-invert">
									{@html description}
								</div>
							</GenericDialog>
						</div>
					{/if}

					<slot name="actions" />
				</div>
			{/if}
		</div>
       <slot name="content" />
	</div>
</div>
