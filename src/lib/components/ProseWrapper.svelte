<script lang="ts">
	import { browser } from "$app/environment";
	import resize from "$lib/actions/resize";

	let className = "";
	export { className as class };
	export let breakpoints = true;
	export let el: HTMLElement | undefined = undefined;
	export let style: string | undefined = undefined;
	export let first_letter = false;
	export let font: "sans" | "serif" | "mono" = "serif";

	// read-only
	export let dimensions: DOMRect | undefined;
	$: dimensions = el?.getBoundingClientRect();
	$: console.log({ dimensions });
</script>

<svelte:window
	on:resize={(e) => {
		window.requestAnimationFrame(() => {
			dimensions = el?.getBoundingClientRect();
			console.log({ dimensions });
		});
	}}
/>
<!-- <wrapper
		class="prose prose-neutral prose-amber mx-auto block break-words transition prose-a:transition prose-figure:drop-shadow-sm prose-figcaption:mx-auto  prose-figcaption:max-w-sm prose-figcaption:text-center prose-img:mx-auto  prose-img:rounded dark:prose-invert dark:prose-a:saturate-50 dark:hover:prose-a:saturate-100 md:prose-lg lg:prose-xl"
		style="grid-column: {$layoutMode === 'read' ? 2 : 1};"
	>ob -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	bind:this={el}
	on:click
	class:first_letter
	class="prose  mx-auto block break-words text-[19px] {font === 'sans'
		? 'font-sans'
		: 'font-newsreader'} !prose-headings:font-semibold !prose-headings:prose-a:font-semibold transition prose-headings:font-sans prose-a:underline prose-a:transition  hover:prose-a:text-accent/90 prose-figure:text-gray-500 prose-figure:drop-shadow-sm  prose-figcaption:mt-0 prose-figcaption:font-sans prose-figcaption:text-sm prose-figcaption:text-gray-500 prose-code:font-normal prose-code:text-inherit prose-code:before:content-none prose-code:after:content-none  prose-img:mx-auto prose-img:rounded  dark:prose-figcaption:text-gray-400   dark:prose-img:ring-1 dark:prose-img:ring-white/5  {breakpoints
		? 'md:prose-xl 2xl:prose-2xl'
		: ''} {className}"
	{style}
>
	<slot />
</div>

<style lang="postcss">
	div.first_letter :global(> *:first-child::first-letter) {
		@apply float-left pr-2 pl-0.5 text-7xl not-italic text-primary-700;
	}
	div :global(iframe[src*="youtube"]:not(:where([class~="not-prose"] *))) {
		@apply rounded;
	}
</style>
