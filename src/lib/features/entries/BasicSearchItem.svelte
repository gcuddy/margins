<script lang="ts">
	import ImageLoader from "$lib/components/ui/images/ImageLoader.svelte";


    export let href = '';
    export let image = "";
    export let title = "";
    export let year = "";

   export let active = false;
</script>

<li>
	<a {href} class="flex items-center gap-4" class:active>
		<ImageLoader src={image} class="h-12 w-10 rounded shadow-lg sm:h-16 sm:w-14" alt="" />
		<div>
			<span>{title}</span>
			<span>{year}</span>
		</div>
	</a>
</li>

<style lang="postcss">
    .active {
        @apply bg-elevation-hover;
    }
</style>
