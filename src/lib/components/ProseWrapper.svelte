<script lang="ts">
	let className = '';
	export { className as class };
	export let breakpoints = true;
	export let el: HTMLElement | undefined = undefined;
	export let style: string | undefined = undefined;
	export let first_letter = false;
	export let font: 'sans' | 'serif' | 'mono' = 'serif';
</script>

<!-- <wrapper
		class="prose prose-neutral prose-amber mx-auto block break-words transition prose-a:transition prose-figure:drop-shadow-sm prose-figcaption:mx-auto  prose-figcaption:max-w-sm prose-figcaption:text-center prose-img:mx-auto  prose-img:rounded dark:prose-invert dark:prose-a:saturate-50 dark:hover:prose-a:saturate-100 md:prose-lg lg:prose-xl"
		style="grid-column: {$layoutMode === 'read' ? 2 : 1};"
	>ob -->
<div
	bind:this={el}
	on:click
	class:first_letter
	class="prose prose-stone mx-auto block break-words text-[19px] {font === 'sans'
		? 'font-sans'
		: 'font-newsreader'} transition prose-headings:font-sans prose-headings:font-semibold  prose-a:underline prose-a:transition hover:prose-a:text-primary-700  prose-figure:text-gray-500 prose-figure:drop-shadow-sm prose-figcaption:mt-0 prose-figcaption:font-sans prose-figcaption:text-sm prose-figcaption:text-gray-500  prose-img:mx-auto prose-img:rounded prose-img:ring-1 dark:prose-invert dark:prose-figcaption:text-gray-400   dark:prose-img:ring-1 dark:prose-img:ring-white/5  {breakpoints
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
	div {
	}
</style>
