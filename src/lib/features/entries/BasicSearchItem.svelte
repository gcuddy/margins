<script lang="ts">
	import ImageLoader from "$lib/components/ui/images/ImageLoader.svelte";

	export let href: string | undefined | null = "";
	export let image: string | undefined | null = "";
	export let title: string | undefined | null = "";
	export let year: string | undefined | null = "";

	export let active = false;
</script>

<li>
	<a {href} class="flex items-center gap-4" class:active>
		<ImageLoader
			src={image || ""}
			class="h-12 w-10 rounded object-cover shadow-lg sm:h-16 sm:w-14"
			alt=""
		/>
		<div>
			<span>{title}</span>
			<span>{year}</span>
		</div>
	</a>
</li>

<style>
	.active {
		background-color: var(--bg-elevation-hover);
	}
</style>
